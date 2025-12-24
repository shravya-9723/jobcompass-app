// src/auth.js

export function isLoggedIn() {
  return !!localStorage.getItem("user");
}

export function loginUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem("user");
}
