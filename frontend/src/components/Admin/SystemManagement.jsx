import React, { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  Shield,
  Database,
  Activity,
  Server,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  Cpu,
  Wifi,
  Mail,
  Bell,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Edit,
  Plus,
  Search
} from 'lucide-react';

const SystemManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemData, setSystemData] = useState({});

  useEffect(() => {
    // Simulate fetching system data
    setSystemData({
      systemHealth: {
        status: 'healthy',
        uptime: '15 days, 8 hours',
        lastRestart: '2024-01-01 02:30:00',
        cpu: 45,
        memory: 68,
        disk: 72,
        network: 'stable'
      },
      users: [
        {
          id: 1,
          name: 'John Admin',
          email: 'admin@company.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2024-01-15 14:30:00',
          loginCount: 156
        },
        {
          id: 2,
          name: 'Jane HR',
          email: 'hr@company.com',
          role: 'hr',
          status: 'active',
          lastLogin: '2024-01-15 13:45:00',
          loginCount: 89
        },
        {
          id: 3,
          name: 'Bob Employee',
          email: 'employee@company.com',
          role: 'employee',
          status: 'inactive',
          lastLogin: '2024-01-10 09:15:00',
          loginCount: 234
        }
      ],
      security: {
        failedLogins: 12,
        suspiciousActivities: 3,
        activeTokens: 45,
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireNumbers: true,
          requireSymbols: true,
          expiryDays: 90
        },
        twoFactorEnabled: 78
      },
      backups: [
        {
          id: 1,
          type: 'Full Backup',
          date: '2024-01-15 02:00:00',
          size: '2.3 GB',
          status: 'completed'
        },
        {
          id: 2,
          type: 'Incremental',
          date: '2024-01-14 02:00:00',
          size: '156 MB',
          status: 'completed'
        },
        {
          id: 3,
          type: 'Full Backup',
          date: '2024-01-13 02:00:00',
          size: '2.1 GB',
          status: 'failed'
        }
      ],
      logs: [
        {
          timestamp: '2024-01-15 14:30:15',
          level: 'INFO',
          message: 'User admin@company.com logged in successfully',
          source: 'AUTH'
        },
        {
          timestamp: '2024-01-15 14:25:32',
          level: 'WARNING',
          message: 'Failed login attempt for user test@company.com',
          source: 'AUTH'
        },
        {
          timestamp: '2024-01-15 14:20:45',
          level: 'ERROR',
          message: 'Database connection timeout',
          source: 'DB'
        },
        {
          timestamp: '2024-01-15 14:15:12',
          level: 'INFO',
          message: 'Backup process completed successfully',
          source: 'BACKUP'
        }
      ],
      configuration: {
        general: {
          siteName: 'Employee Management System',
          timezone: 'UTC-5',
          dateFormat: 'MM/DD/YYYY',
          language: 'English'
        },
        email: {
          smtpServer: 'smtp.company.com',
          smtpPort: 587,
          encryption: 'TLS',
          fromAddress: 'noreply@company.com'
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          slackIntegration: true
        }
      }
    });
  }, []);

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* System Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className="text-2xl font-bold text-green-600">Healthy</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-lg font-bold text-gray-900">{systemData.systemHealth?.uptime}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {systemData.users?.filter(u => u.status === 'active').length}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Security Alerts</p>
              <p className="text-2xl font-bold text-red-600">{systemData.security?.suspiciousActivities}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">CPU Usage</span>
              <span className="text-sm text-gray-900">{systemData.systemHealth?.cpu}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${systemData.systemHealth?.cpu}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Memory Usage</span>
              <span className="text-sm text-gray-900">{systemData.systemHealth?.memory}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${systemData.systemHealth?.memory}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Disk Usage</span>
              <span className="text-sm text-gray-900">{systemData.systemHealth?.disk}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${systemData.systemHealth?.disk}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Logs</h3>
        <div className="space-y-3">
          {systemData.logs?.slice(0, 5).map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  log.level === 'ERROR' ? 'bg-red-500' :
                  log.level === 'WARNING' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.message}</p>
                  <p className="text-xs text-gray-500">{log.source} • {log.timestamp}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                log.level === 'ERROR' ? 'bg-red-100 text-red-800' :
                log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {log.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {systemData.users?.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'hr' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
      
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Logins</p>
              <p className="text-2xl font-bold text-red-600">{systemData.security?.failedLogins}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tokens</p>
              <p className="text-2xl font-bold text-green-600">{systemData.security?.activeTokens}</p>
            </div>
            <Key className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">2FA Enabled</p>
              <p className="text-2xl font-bold text-blue-600">{systemData.security?.twoFactorEnabled}%</p>
            </div>
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Password Policy */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Password Policy</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Minimum Length</span>
              <input
                type="number"
                value={systemData.security?.passwordPolicy?.minLength}
                className="w-20 px-3 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Require Uppercase</span>
              <input
                type="checkbox"
                checked={systemData.security?.passwordPolicy?.requireUppercase}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Require Numbers</span>
              <input
                type="checkbox"
                checked={systemData.security?.passwordPolicy?.requireNumbers}
                className="rounded"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Require Symbols</span>
              <input
                type="checkbox"
                checked={systemData.security?.passwordPolicy?.requireSymbols}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Expiry (days)</span>
              <input
                type="number"
                value={systemData.security?.passwordPolicy?.expiryDays}
                className="w-20 px-3 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Update Policy
          </button>
        </div>
      </div>
    </div>
  );

  const BackupTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Backup Management</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Create Backup
        </button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Backups</h4>
        <div className="space-y-3">
          {systemData.backups?.map((backup) => (
            <div key={backup.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{backup.type}</p>
                  <p className="text-xs text-gray-500">{backup.date} • {backup.size}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  backup.status === 'completed' ? 'bg-green-100 text-green-800' :
                  backup.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {backup.status}
                </span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'backup' && <BackupTab />}
      </div>
    </div>
  );
};

export default SystemManagement;