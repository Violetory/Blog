import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem('user')
    try {
      return user ? JSON.parse(user) : null
    } catch (err) {
      return null
    }
  })

  const login = async inputs => {
    const res = await axios.post('/auth/login', inputs)
    setCurrentUser(res.data)
  }

  const logout = async inputs => {
    // debugger
    await axios.post('/auth/logout')
    setCurrentUser(null)
  }

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser))
  }, [currentUser])

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
