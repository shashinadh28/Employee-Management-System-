import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { getUserRole } from '../utils/auth';

const RoleNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const userRole = getUserRole();

  useEffect(() => {
    // Simulate role-based notifications
    const generateNotifications = () => {
      const baseNotifications = [];
      
      if (userRole === 'admin') {
        baseNotifications.push(
          {
            id: 1,
            type: 'warning',
            title: 'System Backup Required',
            message: 'Weekly system backup is due in 2 hours',
            time: '10 minutes ago',
            priority: 'high'
          },
          {
            id: 2,
            type: 'info',
            title: 'New User Registration',
            message: '3 new employees registered today',
            time: '1 hour ago',
            priority: 'medium'
          },
          {
            id: 3,
            type: 'success',
            title: 'System Update Complete',
            message: 'Security patches installed successfully',
            time: '2 hours ago',
            priority: 'low'
          }
        );
      } else if (userRole === 'hr') {
        baseNotifications.push(
          {
            id: 1,
            type: 'warning',
            title: 'Pending Leave Approvals',
            message: '5 leave requests require your attention',
            time: '30 minutes ago',
            priority: 'high'
          },
          {
            id: 2,
            type: 'info',
            title: 'Performance Review Due',
            message: 'Q4 reviews for Engineering team due next week',
            time: '2 hours ago',
            priority: 'medium'
          },
          {
            id: 3,
            type: 'success',
            title: 'New Hire Onboarding',
            message: 'John Doe completed onboarding process',
            time: '1 day ago',
            priority: 'low'
          }
        );
      } else {
        baseNotifications.push(
          {
            id: 1,
            type: 'info',
            title: 'Leave Request Update',
            message: 'Your vacation request has been approved',
            time: '1 hour ago',
            priority: 'medium'
          },
          {
            id: 2,
            type: 'warning',
            title: 'Training Reminder',
            message: 'Complete mandatory security training by Friday',
            time: '3 hours ago',
            priority: 'high'
          },
          {
            id: 3,
            type: 'success',
            title: 'Goal Achievement',
            message: 'Congratulations! You completed your Q4 objectives',
            time: '1 day ago',
            priority: 'low'
          }
        );
      }
      
      setNotifications(baseNotifications);
    };

    generateNotifications();
  }, [userRole]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <span className="text-sm text-gray-500">{unreadCount} new</span>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 border-l-4 ${getPriorityColor(notification.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.time}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => setNotifications([])}
                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleNotifications;