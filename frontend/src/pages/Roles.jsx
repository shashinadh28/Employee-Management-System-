import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Users } from 'lucide-react';
import axios from 'axios';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  // Mock data for demonstration
  const mockRoles = [
    {
      id: 1,
      name: 'Senior Developer',
      description: 'Senior software developer with full access to development resources',
      employeeCount: 8,
      permissions: ['read', 'write', 'delete'],
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      name: 'Marketing Manager',
      description: 'Manages marketing campaigns and team coordination',
      employeeCount: 3,
      permissions: ['read', 'write'],
      createdAt: '2023-02-20'
    },
    {
      id: 3,
      name: 'HR Specialist',
      description: 'Handles employee relations and HR processes',
      employeeCount: 2,
      permissions: ['read', 'write', 'hr_access'],
      createdAt: '2023-03-10'
    },
    {
      id: 4,
      name: 'Financial Analyst',
      description: 'Analyzes financial data and creates reports',
      employeeCount: 4,
      permissions: ['read', 'finance_access'],
      createdAt: '2023-04-05'
    }
  ];

  const availablePermissions = [
    { id: 'read', name: 'Read Access', description: 'View data and reports' },
    { id: 'write', name: 'Write Access', description: 'Create and edit records' },
    { id: 'delete', name: 'Delete Access', description: 'Remove records' },
    { id: 'hr_access', name: 'HR Access', description: 'Access HR-specific features' },
    { id: 'finance_access', name: 'Finance Access', description: 'Access financial data' },
    { id: 'admin', name: 'Admin Access', description: 'Full system administration' }
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      // For now, use mock data since backend has DB connection issues
      setRoles(mockRoles);
      setLoading(false);
      
      // Uncomment when backend is working:
      // const token = localStorage.getItem('token');
      // const response = await axios.get('http://localhost:3000/api/roles', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles(mockRoles); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        // Update existing role
        const updatedRoles = roles.map(role =>
          role.id === editingRole.id
            ? { ...role, ...formData }
            : role
        );
        setRoles(updatedRoles);
      } else {
        // Add new role
        const newRole = {
          id: Date.now(),
          ...formData,
          employeeCount: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setRoles([...roles, newRole]);
      }
      
      // Reset form and close modal
      setFormData({ name: '', description: '', permissions: [] });
      setShowAddModal(false);
      setEditingRole(null);
      
      // Uncomment when backend is working:
      // const token = localStorage.getItem('token');
      // if (editingRole) {
      //   await axios.put(`http://localhost:3000/api/roles/${editingRole.id}`, formData, {
      //     headers: { Authorization: `Bearer ${token}` }
      //   });
      // } else {
      //   await axios.post('http://localhost:3000/api/roles', formData, {
      //     headers: { Authorization: `Bearer ${token}` }
      //   });
      // }
      // fetchRoles();
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions || []
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        setRoles(roles.filter(role => role.id !== id));
        
        // Uncomment when backend is working:
        // const token = localStorage.getItem('token');
        // await axios.delete(`http://localhost:3000/api/roles/${id}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  const handlePermissionChange = (permissionId) => {
    const updatedPermissions = formData.permissions.includes(permissionId)
      ? formData.permissions.filter(p => p !== permissionId)
      : [...formData.permissions, permissionId];
    
    setFormData({ ...formData, permissions: updatedPermissions });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingRole(null);
    setFormData({ name: '', description: '', permissions: [] });
  };

  const getPermissionBadgeColor = (permission) => {
    const colors = {
      read: 'bg-blue-100 text-blue-800',
      write: 'bg-green-100 text-green-800',
      delete: 'bg-red-100 text-red-800',
      hr_access: 'bg-purple-100 text-purple-800',
      finance_access: 'bg-yellow-100 text-yellow-800',
      admin: 'bg-gray-100 text-gray-800'
    };
    return colors[permission] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Role</span>
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{role.employeeCount} employees</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(role)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600">{role.description}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions:</h4>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPermissionBadgeColor(permission)}`}
                  >
                    {permission.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-400">
                Created {new Date(role.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Enter role name"
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
                    placeholder="Enter role description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availablePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-start">
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onChange={() => handlePermissionChange(permission.id)}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <label htmlFor={permission.id} className="text-sm font-medium text-gray-700">
                            {permission.name}
                          </label>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
                    {editingRole ? 'Update' : 'Create'}
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

export default Roles;