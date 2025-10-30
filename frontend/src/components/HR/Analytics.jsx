import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  UserX,
  Clock,
  DollarSign,
  Award,
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Briefcase,
  GraduationCap,
  Heart,
  Zap
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    // Simulate fetching analytics data
    setAnalyticsData({
      overview: {
        totalEmployees: 245,
        activeEmployees: 238,
        newHires: 12,
        turnoverRate: 8.5,
        avgTenure: 3.2,
        satisfactionScore: 4.2
      },
      trends: {
        employeeGrowth: [
          { month: 'Jan', count: 220 },
          { month: 'Feb', count: 225 },
          { month: 'Mar', count: 230 },
          { month: 'Apr', count: 235 },
          { month: 'May', count: 240 },
          { month: 'Jun', count: 245 }
        ],
        turnoverTrend: [
          { month: 'Jan', rate: 7.2 },
          { month: 'Feb', rate: 6.8 },
          { month: 'Mar', rate: 8.1 },
          { month: 'Apr', rate: 7.5 },
          { month: 'May', rate: 8.9 },
          { month: 'Jun', rate: 8.5 }
        ]
      },
      departments: [
        { name: 'Engineering', employees: 85, satisfaction: 4.3, turnover: 6.2 },
        { name: 'Sales', employees: 45, satisfaction: 4.1, turnover: 12.1 },
        { name: 'Marketing', employees: 32, satisfaction: 4.4, turnover: 7.8 },
        { name: 'HR', employees: 18, satisfaction: 4.5, turnover: 4.2 },
        { name: 'Finance', employees: 25, satisfaction: 4.0, turnover: 8.9 },
        { name: 'Operations', employees: 40, satisfaction: 3.9, turnover: 10.5 }
      ],
      performance: {
        topPerformers: [
          { name: 'Alice Johnson', department: 'Engineering', score: 4.8 },
          { name: 'Bob Smith', department: 'Sales', score: 4.7 },
          { name: 'Carol Davis', department: 'Marketing', score: 4.6 },
          { name: 'David Wilson', department: 'Engineering', score: 4.5 },
          { name: 'Eva Brown', department: 'HR', score: 4.4 }
        ],
        performanceDistribution: {
          excellent: 15,
          good: 45,
          satisfactory: 30,
          needsImprovement: 10
        }
      },
      recruitment: {
        openPositions: 18,
        applicationsReceived: 156,
        interviewsScheduled: 42,
        offersExtended: 8,
        timeToHire: 28,
        costPerHire: 3500
      },
      engagement: {
        overallScore: 4.2,
        responseRate: 87,
        categories: [
          { name: 'Work-Life Balance', score: 4.1 },
          { name: 'Career Development', score: 3.9 },
          { name: 'Management', score: 4.3 },
          { name: 'Compensation', score: 3.8 },
          { name: 'Company Culture', score: 4.4 },
          { name: 'Recognition', score: 4.0 }
        ]
      },
      alerts: [
        {
          type: 'warning',
          message: 'Sales department turnover rate above threshold (12.1%)',
          priority: 'high'
        },
        {
          type: 'info',
          message: '5 employees approaching performance review dates',
          priority: 'medium'
        },
        {
          type: 'success',
          message: 'Engineering satisfaction score increased by 0.2 points',
          priority: 'low'
        }
      ]
    });
  }, [timeRange]);

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-1 ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change > 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const DepartmentCard = ({ department }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-medium text-gray-900">{department.name}</h4>
        <span className="text-sm text-gray-500">{department.employees} employees</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Satisfaction</span>
            <span>{department.satisfaction}/5.0</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${(department.satisfaction / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Turnover Rate</span>
            <span className={department.turnover > 10 ? 'text-red-600' : 'text-green-600'}>
              {department.turnover}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                department.turnover > 10 ? 'bg-red-600' : 'bg-green-600'
              }`}
              style={{ width: `${Math.min(department.turnover, 20) / 20 * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">HR Analytics</h2>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Alerts */}
      {analyticsData.alerts && analyticsData.alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Attention Required</h3>
          <div className="space-y-2">
            {analyticsData.alerts.map((alert, index) => (
              <div key={index} className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-700">{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Employees"
          value={analyticsData.overview?.totalEmployees}
          change={4.2}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Active Employees"
          value={analyticsData.overview?.activeEmployees}
          change={2.1}
          icon={UserCheck}
          color="green"
        />
        <MetricCard
          title="New Hires"
          value={analyticsData.overview?.newHires}
          change={15.3}
          icon={Briefcase}
          color="purple"
        />
        <MetricCard
          title="Turnover Rate"
          value={`${analyticsData.overview?.turnoverRate}%`}
          change={-1.2}
          icon={UserX}
          color="red"
        />
        <MetricCard
          title="Avg Tenure"
          value={`${analyticsData.overview?.avgTenure}y`}
          change={3.5}
          icon={Clock}
          color="indigo"
        />
        <MetricCard
          title="Satisfaction"
          value={`${analyticsData.overview?.satisfactionScore}/5`}
          change={2.8}
          icon={Heart}
          color="pink"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Growth Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Employee Growth</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.trends?.employeeGrowth?.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-blue-600 rounded-t w-full"
                  style={{ height: `${(data.count / 250) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                <span className="text-xs font-medium">{data.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Distribution</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {Object.entries(analyticsData.performance?.performanceDistribution || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded mr-3 ${
                    key === 'excellent' ? 'bg-green-500' :
                    key === 'good' ? 'bg-blue-500' :
                    key === 'satisfactory' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                </div>
                <span className="text-sm font-medium">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.departments?.map((dept, index) => (
            <DepartmentCard key={index} department={dept} />
          ))}
        </div>
      </div>

      {/* Recruitment Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Pipeline</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">Open Positions</span>
              <span className="text-lg font-bold text-blue-600">{analyticsData.recruitment?.openPositions}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Applications Received</span>
              <span className="text-lg font-bold text-green-600">{analyticsData.recruitment?.applicationsReceived}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium">Interviews Scheduled</span>
              <span className="text-lg font-bold text-purple-600">{analyticsData.recruitment?.interviewsScheduled}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium">Offers Extended</span>
              <span className="text-lg font-bold text-orange-600">{analyticsData.recruitment?.offersExtended}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {analyticsData.performance?.topPerformers?.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                  <p className="text-xs text-gray-500">{performer.department}</p>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{performer.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Engagement */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Engagement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.engagement?.categories?.map((category, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                <span className="text-sm text-gray-600">{category.score}/5.0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(category.score / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;