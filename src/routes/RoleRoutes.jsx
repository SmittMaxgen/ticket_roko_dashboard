// routes/RoleRoute.jsx
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSelectors";
import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, roles = [] }) {
  const user = useSelector(selectUser);

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
