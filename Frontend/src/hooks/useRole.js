import { useState } from "react";

function parseRole(stored) {
  if (!stored) return "";
  try {
    const decoded = JSON.parse(stored);
    return typeof decoded === "string" ? decoded : String(decoded);
  } catch {
    return stored.replace(/["']/g, "").trim();
  }
}

export default function useRole() {

  const [userRole] = useState(() => parseRole(localStorage.getItem("userRole")));

  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [userAttendance] =useState(()=>JSON.parse(localStorage.getItem("attendance")))
  return {
    userRole,
    user,
    userAttendance,
    isLogged: Boolean(user),
    hasRole: (...allowed) => allowed.includes(userRole),
  };
}