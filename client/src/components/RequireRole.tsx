import { Navigate, Outlet } from "react-router-dom";

type Props = {
  roles: ("EMPLOYER" | "EMPLOYEE")[];
};

// Blocks users from accessing pages they don't have the role for 
// just by typing the URL e.g. /employeelist
export default function RequireRole({ roles }: Props) { 
  const user = localStorage.getItem("user");

  // 1. Not logged in at all
  if (!user) {
    return <Navigate to="/login" />;
  }
  // 2. Malformed data in localStorage
  let parsedUser: { role: "EMPLOYER" | "EMPLOYEE" };
  try {
    parsedUser = JSON.parse(user);
  } catch {
    localStorage.removeItem("user"); // clean up bad data
    return <Navigate to="/login" />;
  }
// 3. Wrong role for this route
  if (!roles.includes(parsedUser.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}