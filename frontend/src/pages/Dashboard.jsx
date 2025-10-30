import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, Calendar, CheckCircle, TrendingUp, Clock, UserCheck, 
  Shield, Settings, BarChart3, AlertTriangle, UserPlus, FileText,
  Target, Award, Activity, Bell, Database, Zap, Globe, Lock,
  Plus, User, BookOpen, MessageSquare
} from 'lucide-react';
import api from '../utils/api';
import { getUserRole } from '../utils/auth';
import RoleWidgets from '../components/RoleWidgets';
import SelfService from '../components/Employee/SelfService';
import Analytics from '../components/HR/Analytics';
import SystemManagement from '../components/Admin/SystemManagement';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    activeUsers: 0,
    systemHealth: 100,
    recentLogins: 0,
    criticalAlerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch various statistics
      const [employeesRes, departmentsRes, leavesRes] = await Promise.all([
          api.get('/employees'),
          api.get('/departments'),
          api.get('/leaves')
        ]);

      const leaves = leavesRes.data.leaves || [];
      const employees = employeesRes.data.employees || [];
      const pendingLeaves = leaves.filter(leave => leave.status === 'pending').length;
      const approvedLeaves = leaves.filter(leave => leave.status === 'approved').length;

      setStats({
        totalEmployees: employeesRes.data.total || employees.length || 0,
        totalDepartments: departmentsRes.data.total || departmentsRes.data.departments?.length || 0,
        pendingLeaves,
        approvedLeaves,
        activeUsers: Math.floor((employees.length || 0) * 0.85), // Simulate active users
        systemHealth: 98,
        recentLogins: Math.floor((employees.length || 0) * 0.3),
        criticalAlerts: pendingLeaves > 5 ? 1 : 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Role-specific stat cards configuration
  const getStatCards = () => {
    const baseCards = [
      {
        title: 'Total Employees',
        value: stats.totalEmployees,
        icon: Users,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        roles: ['admin', 'hr', 'employee']
      },
      {
        title: 'Departments',
        value: stats.totalDepartments,
        icon: Building2,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        roles: ['admin', 'hr']
      }
    ];

    // Admin-specific cards
    if (userRole === 'admin') {
      return [
        ...baseCards,
        {
          title: 'Active Users',
          value: stats.activeUsers,
          icon: Activity,
          color: 'bg-indigo-500',
          bgColor: 'bg-indigo-50',
          textColor: 'text-indigo-600',
          roles: ['admin']
        },
        {
          title: 'System Health',
          value: `${stats.systemHealth}%`,
          icon: Database,
          color: 'bg-emerald-500',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-600',
          roles: ['admin']
        },
        {
          title: 'Recent Logins',
          value: stats.recentLogins,
          icon: Globe,
          color: 'bg-cyan-500',
          bgColor: 'bg-cyan-50',
          textColor: 'text-cyan-600',
          roles: ['admin']
        },
        {
          title: 'Critical Alerts',
          value: stats.criticalAlerts,
          icon: AlertTriangle,
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          textColor: 'text-red-600',
          roles: ['admin']
        }
      ];
    }

    // HR-specific cards
    if (userRole === 'hr') {
      return [
        ...baseCards,
        {
          title: 'Pending Leaves',
          value: stats.pendingLeaves,
          icon: Clock,
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600',
          roles: ['hr']
        },
        {
          title: 'Approved Leaves',
          value: stats.approvedLeaves,
          icon: CheckCircle,
          color: 'bg-purple-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600',
          roles: ['hr']
        }
      ];
    }

    // Employee-specific cards
    return [
      {
        title: 'My Department',
        value: 'Engineering', // This would come from user data
        icon: Building2,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        roles: ['employee']
      },
      {
        title: 'Leave Balance',
        value: '15 days', // This would come from user data
        icon: Calendar,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        roles: ['employee']
      },
      {
        title: 'Pending Requests',
        value: '2',
        icon: Clock,
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-600',
        roles: ['employee']
      },
      {
        title: 'Profile Status',
        value: 'Complete',
        icon: UserCheck,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        roles: ['employee']
      }
    ];
  };

  const statCards = getStatCards().filter(card => card.roles.includes(userRole));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's an overview of your HR system.
        </p>
      </div>

      {/* Role-specific widgets */}
      <RoleWidgets />

      {/* Role-specific main content */}
      {userRole === 'admin' && (
        <div className="mb-8">
          <SystemManagement />
        </div>
      )}
      
      {userRole === 'hr' && (
        <div className="mb-8">
          <Analytics />
        </div>
      )}
      
      {userRole === 'employee' && (
        <div className="mb-8">
          <SelfService />
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">New employee onboarded</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">Leave request pending approval</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">Department updated</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userRole === 'admin' && (
              <>
                <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <UserPlus className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-900">Add Employee</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Building2 className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-900">New Department</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <Shield className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-900">Manage Roles</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <Settings className="h-8 w-8 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-indigo-900">System Config</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <Database className="h-8 w-8 text-red-600 mb-2" />
                  <span className="text-sm font-medium text-red-900">Backup System</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                  <BarChart3 className="h-8 w-8 text-yellow-600 mb-2" />
                  <span className="text-sm font-medium text-yellow-900">Analytics</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors">
                  <Bell className="h-8 w-8 text-cyan-600 mb-2" />
                  <span className="text-sm font-medium text-cyan-900">Notifications</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                  <Activity className="h-8 w-8 text-emerald-600 mb-2" />
                  <span className="text-sm font-medium text-emerald-900">System Health</span>
                </button>
              </>
            )}
            
            {userRole === 'hr' && (
              <>
                <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <UserPlus className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-900">Add Employee</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                  <Clock className="h-8 w-8 text-yellow-600 mb-2" />
                  <span className="text-sm font-medium text-yellow-900">Leave Requests</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Award className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-900">Performance</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <Target className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-900">Recruitment</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <BookOpen className="h-8 w-8 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-indigo-900">Training</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <BarChart3 className="h-8 w-8 text-red-600 mb-2" />
                  <span className="text-sm font-medium text-red-900">HR Reports</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors">
                  <Building2 className="h-8 w-8 text-cyan-600 mb-2" />
                  <span className="text-sm font-medium text-cyan-900">Departments</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                  <MessageSquare className="h-8 w-8 text-emerald-600 mb-2" />
                  <span className="text-sm font-medium text-emerald-900">Feedback</span>
                </button>
              </>
            )}
            
            {userRole === 'employee' && (
              <>
                <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-900">Request Leave</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <User className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-900">Update Profile</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <Clock className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-900">Time Tracking</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                  <FileText className="h-8 w-8 text-yellow-600 mb-2" />
                  <span className="text-sm font-medium text-yellow-900">My Documents</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <Award className="h-8 w-8 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-indigo-900">Goals</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <BookOpen className="h-8 w-8 text-red-600 mb-2" />
                  <span className="text-sm font-medium text-red-900">Learning</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors">
                  <TrendingUp className="h-8 w-8 text-cyan-600 mb-2" />
                  <span className="text-sm font-medium text-cyan-900">Performance</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                  <MessageSquare className="h-8 w-8 text-emerald-600 mb-2" />
                  <span className="text-sm font-medium text-emerald-900">Feedback</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Database Connected</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">API Services Running</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;