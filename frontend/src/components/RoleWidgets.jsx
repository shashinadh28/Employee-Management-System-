import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Award, 
  Target, 
  BookOpen, 
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  UserCheck,
  Building2
} from 'lucide-react';
import { getUserRole, hasPermission, PERMISSIONS } from '../utils/permissions';

const RoleWidgets = () => {
  const [widgetData, setWidgetData] = useState({});
  const userRole = getUserRole();

  useEffect(() => {
    // Simulate fetching role-specific widget data
    const fetchWidgetData = () => {
      if (userRole === 'admin') {
        setWidgetData({
          systemMetrics: {
            uptime: '99.9%',
            activeUsers: 142,
            dataBackup: 'Today 3:00 AM',
            securityAlerts: 2
          },
          recentActivities: [
            { action: 'New user registered', user: 'John Doe', time: '5 min ago' },
            { action: 'System backup completed', user: 'System', time: '2 hours ago' },
            { action: 'Role updated', user: 'Jane Smith', time: '1 day ago' }
          ],
          quickStats: {
            totalUsers: 156,
            activeProjects: 23,
            systemHealth: 98,
            storageUsed: 67
          }
        });
      } else if (userRole === 'hr') {
        setWidgetData({
          hrMetrics: {
            pendingApprovals: 8,
            newHires: 3,
            upcomingReviews: 12,
            trainingCompleted: 85
          },
          recentActivities: [
            { action: 'Leave approved', user: 'Alice Johnson', time: '10 min ago' },
            { action: 'Performance review submitted', user: 'Bob Wilson', time: '1 hour ago' },
            { action: 'Training completed', user: 'Carol Davis', time: '3 hours ago' }
          ],
          departmentStats: [
            { name: 'Engineering', employees: 45, satisfaction: 92 },
            { name: 'Marketing', employees: 23, satisfaction: 88 },
            { name: 'Sales', employees: 31, satisfaction: 90 }
          ]
        });
      } else {
        setWidgetData({
          personalMetrics: {
            leaveBalance: 15,
            goalsCompleted: 8,
            trainingProgress: 75,
            performanceScore: 4.2
          },
          upcomingEvents: [
            { event: 'Team Meeting', date: 'Today 2:00 PM', type: 'meeting' },
            { event: 'Training: React Advanced', date: 'Tomorrow 10:00 AM', type: 'training' },
            { event: 'Performance Review', date: 'Friday 3:00 PM', type: 'review' }
          ],
          recentAchievements: [
            { title: 'Project Milestone', description: 'Completed Q4 objectives', date: '2 days ago' },
            { title: 'Skill Certification', description: 'AWS Cloud Practitioner', date: '1 week ago' }
          ]
        });
      }
    };

    fetchWidgetData();
  }, [userRole]);

  const AdminWidgets = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* System Health Widget */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 text-blue-600 mr-2" />
          System Health
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{widgetData.systemMetrics?.uptime}</div>
            <div className="text-sm text-gray-500">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{widgetData.systemMetrics?.activeUsers}</div>
            <div className="text-sm text-gray-500">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">{widgetData.systemMetrics?.dataBackup}</div>
            <div className="text-sm text-gray-500">Last Backup</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{widgetData.systemMetrics?.securityAlerts}</div>
            <div className="text-sm text-gray-500">Security Alerts</div>
          </div>
        </div>
      </div>

      {/* Recent System Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 text-purple-600 mr-2" />
          Recent Activities
        </h3>
        <div className="space-y-3">
          {widgetData.recentActivities?.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.user}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const HRWidgets = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* HR Metrics Widget */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 text-green-600 mr-2" />
          HR Metrics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{widgetData.hrMetrics?.pendingApprovals}</div>
            <div className="text-sm text-gray-600">Pending Approvals</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{widgetData.hrMetrics?.newHires}</div>
            <div className="text-sm text-gray-600">New Hires</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{widgetData.hrMetrics?.upcomingReviews}</div>
            <div className="text-sm text-gray-600">Upcoming Reviews</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{widgetData.hrMetrics?.trainingCompleted}%</div>
            <div className="text-sm text-gray-600">Training Completed</div>
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building2 className="h-5 w-5 text-indigo-600 mr-2" />
          Department Overview
        </h3>
        <div className="space-y-3">
          {widgetData.departmentStats?.map((dept, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                <p className="text-xs text-gray-500">{dept.employees} employees</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">{dept.satisfaction}%</div>
                <div className="text-xs text-gray-500">Satisfaction</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EmployeeWidgets = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Personal Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UserCheck className="h-5 w-5 text-blue-600 mr-2" />
          My Metrics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{widgetData.personalMetrics?.leaveBalance}</div>
            <div className="text-sm text-gray-600">Leave Days</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{widgetData.personalMetrics?.goalsCompleted}</div>
            <div className="text-sm text-gray-600">Goals Completed</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{widgetData.personalMetrics?.trainingProgress}%</div>
            <div className="text-sm text-gray-600">Training Progress</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{widgetData.personalMetrics?.performanceScore}</div>
            <div className="text-sm text-gray-600">Performance</div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 text-red-600 mr-2" />
          Upcoming Events
        </h3>
        <div className="space-y-3">
          {widgetData.upcomingEvents?.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                {event.type === 'meeting' && <Users className="h-4 w-4 text-blue-500 mr-2" />}
                {event.type === 'training' && <BookOpen className="h-4 w-4 text-green-500 mr-2" />}
                {event.type === 'review' && <Award className="h-4 w-4 text-purple-500 mr-2" />}
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.event}</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {userRole === 'admin' && 'System Overview'}
        {userRole === 'hr' && 'HR Dashboard'}
        {userRole === 'employee' && 'My Dashboard'}
      </h2>
      
      {userRole === 'admin' && <AdminWidgets />}
      {userRole === 'hr' && <HRWidgets />}
      {userRole === 'employee' && <EmployeeWidgets />}
    </div>
  );
};

export default RoleWidgets;