import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");

  const [editingId, setEditingId] = useState(null);

  // =========================
  // GET STUDENTS
  // =========================

  const getStudents = async (accessToken) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/students",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Failed to fetch students");
        return;
      }

      setStudents(data);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch students.");
    }
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setToken(data.access_token);

        localStorage.setItem(
          "token",
          data.access_token
        );

        getStudents(data.access_token);
      } else {
        alert(data.detail || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server.");
    }
  };

  // =========================
  // ADD / UPDATE STUDENT
  // =========================

  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("token");

    const studentData = {
      name: name,
      age: Number(age),
      city: city,
    };

    try {
      let response;

      if (editingId === null) {
        // ADD STUDENT
        response = await fetch(
          "http://127.0.0.1:8000/students",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(studentData),
          }
        );
      } else {
        // UPDATE STUDENT
        response = await fetch(
          `http://127.0.0.1:8000/students/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(studentData),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Operation failed");
        return;
      }

      if (editingId === null) {
        // Add new student to the list
        setStudents((currentStudents) => [
          ...currentStudents,
          data,
        ]);
      } else {
        // Update existing student in the list
        setStudents((currentStudents) =>
          currentStudents.map((student) =>
            student.id === editingId
              ? data
              : student
          )
        );
      }

      // Clear form
      setName("");
      setAge("");
      setCity("");
      setEditingId(null);

    } catch (error) {
      console.error(error);
      alert("Unable to complete the operation.");
    }
  };

  // =========================
  // START EDITING
  // =========================

  const startEdit = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setAge(student.age);
    setCity(student.city);
  };

  // =========================
  // DELETE STUDENT
  // =========================

  const deleteStudent = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    const accessToken = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/students/${studentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Failed to delete student");
        return;
      }

      setStudents((currentStudents) =>
        currentStudents.filter(
          (student) => student.id !== studentId
        )
      );

    } catch (error) {
      console.error(error);
      alert("Unable to delete student.");
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setAge("");
    setCity("");
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="app">
      <div className="login-card">

        <div className="logo">
          🎓
        </div>

        <h1>Student Management</h1>

        <p className="subtitle">
          Manage your students easily and securely
        </p>

        {!token ? (

          // =========================
          // LOGIN FORM
          // =========================

          <form onSubmit={handleLogin}>

            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
            >
              Login
            </button>

          </form>

        ) : (

          // =========================
          // STUDENT MANAGEMENT
          // =========================

          <div className="students-section">

            <div className="success-box">
              <div className="success-icon">
                ✓
              </div>

              <h2>Login Successful</h2>

              <p>
                Students loaded from the API
              </p>
            </div>

            <h2 className="students-title">
              Students
            </h2>

            {/* ADD / UPDATE FORM */}

            <form
              className="student-form"
              onSubmit={handleStudentSubmit}
            >

              <input
                type="text"
                placeholder="Student name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value)
                }
                required
              />

              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                required
              />

              <button
                type="submit"
                className="add-btn"
              >
                {editingId === null
                  ? "+ Add Student"
                  : "Update Student"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}

            </form>

            {/* STUDENT LIST */}

            {students.length === 0 ? (

              <p className="no-students">
                No students found.
              </p>

            ) : (

              <div className="student-list">

                {students.map((student) => (

                  <div
                    className="student-card"
                    key={student.id}
                  >

                    <div>
                      <h3>{student.name}</h3>

                      <p>
                        <strong>Age:</strong>{" "}
                        {student.age}
                      </p>

                      <p>
                        <strong>City:</strong>{" "}
                        {student.city}
                      </p>
                    </div>

                    <div className="student-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          startEdit(student)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteStudent(student.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>
        )}

        <div className="footer">
          Student Management API
        </div>

      </div>
    </div>
  );
}

export default App;