import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Target,
  BookOpen,
  MessageSquare,
  Star,
  BarChart3
} from 'lucide-react';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';

const EmployeeLifecycle = () => {
  const [activeTab, setActiveTab] = useState('onboarding');
  const [lifecycleData, setLifecycleData] = useState({});

  useEffect(() => {
    // Simulate fetching employee lifecycle data
    setLifecycleData({
      onboarding: [
        {
          id: 1,
          name: 'John Doe',
          position: 'Software Engineer',
          startDate: '2024-01-15',
          progress: 75,
          status: 'in_progress',
          tasks: ['Complete IT setup', 'Meet team members', 'Review company policies']
        },
        {
          id: 2,
          name: 'Jane Smith',
          position: 'Marketing Specialist',
          startDate: '2024-01-20',
          progress: 30,
          status: 'pending',
          tasks: ['Complete paperwork', 'Schedule orientation', 'Assign mentor']
        }
      ],
      performance: [
        {
          id: 1,
          name: 'Alice Johnson',
          department: 'Engineering',
          lastReview: '2023-12-15',
          nextReview: '2024-03-15',
          score: 4.2,
          status: 'excellent',
          goals: 8,
          completedGoals: 6
        },
        {
          id: 2,
          name: 'Bob Wilson',
          department: 'Sales',
          lastReview: '2023-11-20',
          nextReview: '2024-02-20',
          score: 3.8,
          status: 'good',
          goals: 5,
          completedGoals: 4
        }
      ],
      development: [
        {
          id: 1,
          name: 'Carol Davis',
          currentRole: 'Junior Developer',
          targetRole: 'Senior Developer',
          progress: 65,
          skills: ['React', 'Node.js', 'AWS'],
          trainingCompleted: 4,
          trainingTotal: 6
        },
        {
          id: 2,
          name: 'David Brown',
          currentRole: 'Marketing Assistant',
          targetRole: 'Marketing Manager',
          progress: 40,
          skills: ['Digital Marketing', 'Analytics', 'Leadership'],
          trainingCompleted: 2,
          trainingTotal: 5
        }
      ]
    });
  }, []);

  const OnboardingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">New Employee Onboarding</h3>
        {hasPermission(PERMISSIONS.EMPLOYEE_CREATE) && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Employee
          </button>
        )}
      </div>
      
      <div className="grid gap-4">
        {lifecycleData.onboarding?.map((employee) => (
          <div key={employee.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{employee.name}</h4>
                <p className="text-sm text-gray-600">{employee.position}</p>
                <p className="text-xs text-gray-500">Start Date: {employee.startDate}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                employee.status === 'completed' ? 'bg-green-100 text-green-800' :
                employee.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {employee.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Onboarding Progress</span>
                <span>{employee.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${employee.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Pending Tasks:</h5>
              <ul className="space-y-1">
                {employee.tasks.map((task, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <Clock className="h-3 w-3 mr-2 text-yellow-500" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PerformanceTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Performance Management</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Generate Report
        </button>
      </div>
      
      <div className="grid gap-4">
        {lifecycleData.performance?.map((employee) => (
          <div key={employee.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{employee.name}</h4>
                <p className="text-sm text-gray-600">{employee.department}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-lg font-semibold">{employee.score}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  employee.status === 'excellent' ? 'bg-green-100 text-green-800' :
                  employee.status === 'good' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {employee.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Last Review</p>
                <p className="font-medium">{employee.lastReview}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Review</p>
                <p className="font-medium">{employee.nextReview}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm">Goals: {employee.completedGoals}/{employee.goals}</span>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
                <button className="text-green-600 hover:text-green-800 text-sm">Schedule Review</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DevelopmentTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Career Development</h3>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
          <BookOpen className="h-4 w-4 mr-2" />
          Create Development Plan
        </button>
      </div>
      
      <div className="grid gap-4">
        {lifecycleData.development?.map((employee) => (
          <div key={employee.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{employee.name}</h4>
                <p className="text-sm text-gray-600">{employee.currentRole} → {employee.targetRole}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-purple-600">{employee.progress}%</div>
                <div className="text-xs text-gray-500">Progress</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Development Progress</span>
                <span>{employee.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${employee.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Key Skills:</h5>
                <div className="flex flex-wrap gap-1">
                  {employee.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Training Progress:</h5>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">{employee.trainingCompleted}/{employee.trainingTotal} completed</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm">View Plan</button>
              <button className="text-green-600 hover:text-green-800 text-sm">Assign Training</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'onboarding', label: 'Onboarding', icon: UserPlus },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'development', label: 'Development', icon: Award }
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
        {activeTab === 'onboarding' && <OnboardingTab />}
        {activeTab === 'performance' && <PerformanceTab />}
        {activeTab === 'development' && <DevelopmentTab />}
      </div>
    </div>
  );
};

export default EmployeeLifecycle;