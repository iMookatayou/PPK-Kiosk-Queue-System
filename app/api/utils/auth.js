// utils/auth.js
import { users } from './mockUsers'

export function authenticate(username, password) {
  return users.find(user => user.username === username && user.password === password)
}
