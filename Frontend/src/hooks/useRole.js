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

// Kharab ya "undefined" value ho to crash nahi, bas null
function safeParse(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function useRole() {
  const [userRole] = useState(() => parseRole(localStorage.getItem("userRole")));
  const [user] = useState(() => safeParse("user"));

  return {
    userRole,
    user,
    isLogged: Boolean(user),
    hasRole: (...allowed) => allowed.includes(userRole),
  };
}