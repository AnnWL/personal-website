import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.css";
import UserList from "./UserList";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.payload?.role !== "owner") return navigate("/");
    } catch (err) {
      console.error("Invalid token:", err);
      return navigate("/");
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/auth/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Fetch failed: ${res.status} ${errorText}`);
      }

      const users = await res.json();
      setUsers(users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const promoteDemoteUser = async (id, role) => {
    await fetch(`/api/auth/role/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ role }),
    });
    fetchData();
  };

  return (
    <div className={styles.adminPanel}>
      <h2>Admin Panel</h2>

      <section className={styles.section}>
        <h3>Book Review Management</h3>
        <button onClick={() => navigate("/book-editor")}>
          Go to Book Review Editor
        </button>
      </section>

      <section className={styles.section}>
        <h3>Promote/Demote Users</h3>
        <UserList users={users} promoteDemoteUser={promoteDemoteUser} />
      </section>
    </div>
  );
};

export default AdminPanel;
