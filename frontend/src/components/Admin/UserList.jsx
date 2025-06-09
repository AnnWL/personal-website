const UserList = ({ users, promoteDemoteUser }) => (
  <ul>
    {users.map((u) => (
      <li key={u.id}>
        {u.username} ({u.role}){" "}
        {u.role === "registered" ? (
          <button onClick={() => promoteDemoteUser(u.id, "owner")}>
            Promote
          </button>
        ) : (
          <button onClick={() => promoteDemoteUser(u.id, "registered")}>
            Demote
          </button>
        )}
      </li>
    ))}
  </ul>
);

export default UserList;
