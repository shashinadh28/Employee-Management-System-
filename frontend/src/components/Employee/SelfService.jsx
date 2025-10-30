import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Clock,
  Award,
  Target,
  BookOpen,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Star,
  Download,
  Upload,
  Edit,
  Eye,
  MessageSquare
} from 'lucide-react';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';

const SelfService = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [employeeData, setEmployeeData] = useState({});

  useEffect(() => {
    // Simulate fetching employee self-service data
    setEmployeeData({
      profile: {
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        position: 'Senior Software Engineer',
        manager: 'Jane Smith',
        startDate: '2022-03-15',
        employeeId: 'EMP001',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345'
      },
      goals: [
        {
          id: 1,
          title: 'Complete React Advanced Training',
          description: 'Master advanced React concepts and patterns',
          progress: 75,
          dueDate: '2024-02-28',
          status: 'in_progress',
          category: 'Learning'
        },
        {
          id: 2,
          title: 'Lead Team Project',
          description: 'Successfully deliver the Q1 product feature',
          progress: 90,
          dueDate: '2024-03-31',
          status: 'in_progress',
          category: 'Leadership'
        },
        {
          id: 3,
          title: 'Improve Code Quality Metrics',
          description: 'Achieve 95% test coverage on assigned modules',
          progress: 100,
          dueDate: '2024-01-31',
          status: 'completed',
          category: 'Technical'
        }
      ],
      timeTracking: {
        todayHours: 7.5,
        weekHours: 37.5,
        monthHours: 168,
        overtimeHours: 8,
        recentEntries: [
          { date: '2024-01-15', hours: 8, project: 'Product Feature A' },
          { date: '2024-01-14', hours: 7.5, project: 'Bug Fixes' },
          { date: '2024-01-13', hours: 8, project: 'Code Review' }
        ]
      },
      documents: [
        { id: 1, name: 'Employment Contract', type: 'PDF', size: '2.3 MB', date: '2022-03-15' },
        { id: 2, name: 'Performance Review Q4', type: 'PDF', size: '1.1 MB', date: '2023-12-15' },
        { id: 3, name: 'Training Certificate - AWS', type: 'PDF', size: '0.8 MB', date: '2023-11-20' },
        { id: 4, name: 'Tax Documents 2023', type: 'PDF', size: '1.5 MB', date: '2024-01-10' }
      ],
      performance: {
        currentScore: 4.2,
        lastReview: '2023-12-15',
        nextReview: '2024-03-15',
        strengths: ['Technical Skills', 'Problem Solving', 'Team Collaboration'],
        improvements: ['Public Speaking', 'Project Management'],
        feedback: [
          {
            from: 'Jane Smith (Manager)',
            date: '2023-12-15',
            comment: 'Excellent technical contributions and great team player.',
            rating: 4.5
          },
          {
            from: 'Bob Wilson (Peer)',
            date: '2023-12-10',
            comment: 'Very helpful during code reviews and always willing to share knowledge.',
            rating: 4.0
          }
        ]
      }
    });
  }, []);

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <div className="ml-6">
            <h4 className="text-xl font-semibold text-gray-900">{employeeData.profile?.name}</h4>
            <p className="text-gray-600">{employeeData.profile?.position}</p>
            <p className="text-sm text-gray-500">ID: {employeeData.profile?.employeeId}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h5>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Email:</span>
                <p className="text-sm font-medium">{employeeData.profile?.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Phone:</span>
                <p className="text-sm font-medium">{employeeData.profile?.phone}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Address:</span>
                <p className="text-sm font-medium">{employeeData.profile?.address}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-3">Work Information</h5>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Department:</span>
                <p className="text-sm font-medium">{employeeData.profile?.department}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Manager:</span>
                <p className="text-sm font-medium">{employeeData.profile?.manager}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Start Date:</span>
                <p className="text-sm font-medium">{employeeData.profile?.startDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const GoalsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">My Goals</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
          <Target className="h-4 w-4 mr-2" />
          Add Goal
        </button>
      </div>
      
      <div className="grid gap-4">
        {employeeData.goals?.map((goal) => (
          <div key={goal.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{goal.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                <div className="flex items-center mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    goal.category === 'Learning' ? 'bg-blue-100 text-blue-800' :
                    goal.category === 'Leadership' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {goal.category}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">Due: {goal.dueDate}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {goal.status === 'in_progress' ? 'In Progress' : goal.status.toUpperCase()}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    goal.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm">Update Progress</button>
              <button className="text-gray-600 hover:text-gray-800 text-sm">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TimeTrackingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Time Tracking</h3>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Log Time
        </button>
      </div>
      
      {/* Time Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{employeeData.timeTracking?.todayHours}h</div>
          <div className="text-sm text-gray-600">Today</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{employeeData.timeTracking?.weekHours}h</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{employeeData.timeTracking?.monthHours}h</div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{employeeData.timeTracking?.overtimeHours}h</div>
          <div className="text-sm text-gray-600">Overtime</div>
        </div>
      </div>
      
      {/* Recent Time Entries */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Entries</h4>
        <div className="space-y-3">
          {employeeData.timeTracking?.recentEntries?.map((entry, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{entry.project}</p>
                <p className="text-xs text-gray-500">{entry.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{entry.hours}h</p>
                <button className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DocumentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">My Documents</h3>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6">
          <div className="space-y-4">
            {employeeData.documents?.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.type} • {doc.size} • {doc.date}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'time', label: 'Time Tracking', icon: Clock },
    { id: 'documents', label: 'Documents', icon: FileText }
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
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'goals' && <GoalsTab />}
        {activeTab === 'time' && <TimeTrackingTab />}
        {activeTab === 'documents' && <DocumentsTab />}
      </div>
    </div>
  );
};

export default SelfService;