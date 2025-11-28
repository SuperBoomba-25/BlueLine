import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://blueline-yyzo.onrender.com";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // ⚠️ תיקון 1: שימוש בגרש אחורי (`) עבור ה-Headers, והוספת API_URL

      const { data } = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (id) => {
    try {
      const token = localStorage.getItem("token"); // ⚠️ תיקון 2: שימוש בגרש אחורי (`) עבור ה-URL וה-Headers, והוספת API_URL

      await axios.put(
        `${API_URL}/api/users/${id}/ban`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchUsers();
    } catch (err) {
      console.error("Error toggling ban:", err);
    }
  };

  const makeAdmin = async (id) => {
    try {
      const token = localStorage.getItem("token"); // ⚠️ תיקון 3: שימוש בגרש אחורי (`) עבור ה-URL וה-Headers, והוספת API_URL

      await axios.put(
        `${API_URL}/api/users/${id}/make-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchUsers();
    } catch (err) {
      console.error("Error making admin:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ padding: "20px" }}>
            <h1>Admin Panel</h1>     {" "}
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", textAlign: "left" }}
      >
               {" "}
        <thead>
                   {" "}
          <tr>
                        <th>Name</th>            <th>Email</th>           {" "}
            <th>Role</th>            <th>Banned</th>            <th>Actions</th>
                     {" "}
          </tr>
                 {" "}
        </thead>
               {" "}
        <tbody>
                   {" "}
          {users.length === 0 && (
            <tr>
                            <td colSpan="5">No users found.</td>           {" "}
            </tr>
          )}
                   {" "}
          {users.map((user) => (
            <tr key={user._id}>
                            <td>{user.name}</td>             {" "}
              <td>{user.email}</td>              <td>{user.role}</td>           
                <td>{user.isBanned ? "Yes" : "No"}</td>             {" "}
              <td>
                               {" "}
                <button onClick={() => toggleBan(user._id)}>
                                    {user.isBanned ? "Unban" : "Ban"}           
                     {" "}
                </button>
                               {" "}
                {user.role !== "admin" && (
                  <button onClick={() => makeAdmin(user._id)}>
                                        Make Admin                  {" "}
                  </button>
                )}
                             {" "}
              </td>
                         {" "}
            </tr>
          ))}
                 {" "}
        </tbody>
             {" "}
      </table>
         {" "}
    </div>
  );
};

export default AdminPanel;
