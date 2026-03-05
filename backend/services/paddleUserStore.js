const users = new Map();

export function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

export function getUserData(userId) {
  return users.get(userId);
}

export function saveUserData(userId, userData) {
  users.set(userId, userData);
}
