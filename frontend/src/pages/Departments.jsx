import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Building } from 'lucide-react';
import axios from 'axios';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: ''
  });

  // Mock data for demonstration
  const mockDepartments = [
    {
      id: 1,
      name: 'Engineering',
      description: 'Software development and technical operations',
      employeeCount: 15,
      manager: 'John Doe',
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      name: 'Marketing',
      description: 'Brand promotion and customer acquisition',
      employeeCount: 8,
      manager: 'Jane Smith',
      createdAt: '2023-02-20'
    },
    {
      id: 3,
      name: 'Human Resources',
      description: 'Employee relations and organizational development',
      employeeCount: 5,
      manager: 'Mike Johnson',
      createdAt: '2023-03-10'
    },
    {
      id: 4,
      name: 'Finance',
      description: 'Financial planning and accounting operations',
      employeeCount: 6,
      manager: 'Sarah Wilson',
      createdAt: '2023-04-05'
    }
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      // For now, use mock data since backend has DB connection issues
      setDepartments(mockDepartments);
      setLoading(false);
      
      // Uncomment when backend is working:
      // const token = localStorage.getItem('token');
      // const response = await axios.get('http://localhost:3000/api/departments', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments(mockDepartments); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        // Update existing department
        const updatedDepartments = departments.map(dept =>
          dept.id === editingDepartment.id
            ? { ...dept, ...formData }
            : dept
        );
        setDepartments(updatedDepartments);
      } else {
        // Add new department
        const newDepartment = {
          id: Date.now(),
          ...formData,
          employeeCount: 0,
          manager: 'Unassigned',
          createdAt: new Date().toISOString().split('T')[0]
        };
        setDepartments([...departments, newDepartment]);
      }
      
      // Reset form and close modal
      setFormData({ name: '', description: '', managerId: '' });
      setShowAddModal(false);
      setEditingDepartment(null);
      
      // Uncomment when backend is working:
      // const token = localStorage.getItem('token');
      // if (editingDepartment) {
      //   await axios.put(`http://localhost:3000/api/departments/${editingDepartment.id}`, formData, {
      //     headers: { Authorization: `Bearer ${token}` }
      //   });
      // } else {
      //   await axios.post('http://localhost:3000/api/departments', formData, {
      //     headers: { Authorization: `Bearer ${token}` }
      //   });
      // }
      // fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      managerId: department.managerId || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        setDepartments(departments.filter(dept => dept.id !== id));
        
        // Uncomment when backend is working:
        // const token = localStorage.getItem('token');
        // await axios.delete(`http://localhost:3000/api/departments/${id}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingDepartment(null);
    setFormData({ name: '', description: '', managerId: '' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600">Manage organizational departments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <div key={department.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{department.name}</h3>
                  <p className="text-sm text-gray-500">Manager: {department.manager}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(department)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(department.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600">{department.description}</p>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                <span>{department.employeeCount} employees</span>
              </div>
              <span className="text-xs text-gray-400">
                Created {new Date(department.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingDepartment ? 'Edit Department' : 'Add New Department'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Enter department name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Enter department description"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingDepartment ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;