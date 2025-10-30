import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Departments from './pages/Departments'
import Roles from './pages/Roles'
import Leaves from './pages/Leaves'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import { isAuthenticated } from './utils/auth'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} 
          />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<RoleRoute allowed={["admin","hr","employee"]}><Dashboard /></RoleRoute>} />
            <Route path="employees" element={<RoleRoute allowed={["admin","hr"]}><Employees /></RoleRoute>} />
            <Route path="departments" element={<RoleRoute allowed={["admin","hr"]}><Departments /></RoleRoute>} />
            <Route path="roles" element={<RoleRoute allowed={["admin"]}><Roles /></RoleRoute>} />
            <Route path="leaves" element={<RoleRoute allowed={["admin","hr","employee"]}><Leaves /></RoleRoute>} />
            <Route path="reports" element={<RoleRoute allowed={["admin","hr"]}><div>Reports Page</div></RoleRoute>} />
            <Route path="settings" element={<RoleRoute allowed={["admin","hr","employee"]}><div>Settings Page</div></RoleRoute>} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
