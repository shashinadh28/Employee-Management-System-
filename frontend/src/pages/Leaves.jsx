import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, CheckCircle, XCircle, Eye, Filter } from 'lucide-react';
import axios from 'axios';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Mock data for demonstration
  const mockLeaves = [
    {
      id: 1,
      employeeName: 'John Doe',
      type: 'Annual Leave',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      days: 6,
      status: 'Pending',
      reason: 'Family vacation',
      appliedDate: '2024-02-01',
      approvedBy: null
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      type: 'Sick Leave',
      startDate: '2024-02-10',
      endDate: '2024-02-12',
      days: 3,
      status: 'Approved',
      reason: 'Medical treatment',
      appliedDate: '2024-02-08',
      approvedBy: 'HR Manager'
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      type: 'Personal Leave',
      startDate: '2024-02-05',
      endDate: '2024-02-05',
      days: 1,
      status: 'Rejected',
      reason: 'Personal matters',
      appliedDate: '2024-02-03',
      approvedBy: 'HR Manager'
    }
  ];

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Personal Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Emergency Leave'
  ];

  const leaveBalance = {
    annual: { total: 25, used: 8, remaining: 17 },
    sick: { total: 10, used: 3, remaining: 7 },
    personal: { total: 5, used: 1, remaining: 4 }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      // For now, use mock data since backend has DB connection issues
      setLeaves(mockLeaves);
      setLoading(false);
      
      // Uncomment when backend is working:
      // const token = localStorage.getItem('token');
      // const response = await axios.get('http://localhost:3000/api/leaves', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setLeaves(mockLeaves); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      
      const newLeave = {
        id: Date.now(),
        employeeName: 'Current User', // This would come from auth context
        ...formData,
        days,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
        approvedBy: null
      };
      
      setLeaves([newLeave, ...leaves]);
      setFormData({ type: '', startDate: '', endDate: '', reason: '' });
      setShowRequestModal(false);
      
      // Uncomment when backend is working:
      // const token = localStorage.getItem('token');
      // await axios.post('http://localhost:3000/api/leaves', formData, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // fetchLeaves();
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
  };

  const handleApproveReject = async (id, status) => {
    try {
      const updatedLeaves = leaves.map(leave =>
        leave.id === id
          ? { ...leave, status, approvedBy: 'HR Manager' }
          : leave
      );
      setLeaves(updatedLeaves);
      
      // Uncomment when backend is working:
      // const token = localStorage.getItem('token');
      // await axios.put(`http://localhost:3000/api/leaves/${id}`, { status }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // fetchLeaves();
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    if (activeTab === 'all') return true;
    return leave.status.toLowerCase() === activeTab;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600">Manage leave requests and balances</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Request Leave</span>
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Annual Leave</h3>
              <p className="text-sm text-gray-500">
                {leaveBalance.annual.remaining} of {leaveBalance.annual.total} days remaining
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${(leaveBalance.annual.used / leaveBalance.annual.total) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Sick Leave</h3>
              <p className="text-sm text-gray-500">
                {leaveBalance.sick.remaining} of {leaveBalance.sick.total} days remaining
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{
                  width: `${(leaveBalance.sick.used / leaveBalance.sick.total) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Personal Leave</h3>
              <p className="text-sm text-gray-500">
                {leaveBalance.personal.remaining} of {leaveBalance.personal.total} days remaining
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${(leaveBalance.personal.used / leaveBalance.personal.total) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Leave Requests Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{leave.employeeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {leave.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">{leave.days} day(s)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(leave.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(leave.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedLeave(leave)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {leave.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApproveReject(leave.id, 'Approved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleApproveReject(leave.id, 'Rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Leave Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Request Leave</h3>
              
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Type
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select leave type</option>
                    {leaveTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Enter reason for leave"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Leave Details Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Leave Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Employee:</label>
                  <p className="text-sm text-gray-900">{selectedLeave.employeeName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Leave Type:</label>
                  <p className="text-sm text-gray-900">{selectedLeave.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Duration:</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()} ({selectedLeave.days} days)
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <div className="flex items-center mt-1">
                    {getStatusIcon(selectedLeave.status)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLeave.status)}`}>
                      {selectedLeave.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Reason:</label>
                  <p className="text-sm text-gray-900">{selectedLeave.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Applied Date:</label>
                  <p className="text-sm text-gray-900">{new Date(selectedLeave.appliedDate).toLocaleDateString()}</p>
                </div>
                {selectedLeave.approvedBy && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Approved By:</label>
                    <p className="text-sm text-gray-900">{selectedLeave.approvedBy}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;