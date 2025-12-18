import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUsers, FaGraduationCap, FaFileAlt, FaDollarSign, FaSpinner } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const axiosSecure = useAxiosSecure();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await axiosSecure.get('/analytics');
      return res.data;
    }
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-3xl sm:text-4xl text-blue-600" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: analytics?.totalUsers || 0,
      icon: FaUsers,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Scholarships',
      value: analytics?.totalScholarships || 0,
      icon: FaGraduationCap,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Applications',
      value: analytics?.totalApplications || 0,
      icon: FaFileAlt,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Fees Collected',
      value: `$${analytics?.totalFeesCollected || 0}`,
      icon: FaDollarSign,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    }
  ];

  const applicationsByUniversity = analytics?.applicationsByUniversity || [];
  const applicationsByCategory = analytics?.applicationsByCategory || [];

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">Platform statistics and insights</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.lightColor} rounded-lg sm:rounded-xl shadow p-4 sm:p-6`}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 sm:p-4 rounded-full flex-shrink-0`}>
                <stat.icon className="text-white text-lg sm:text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Bar Chart - Applications by University */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Applications by University</h2>
          {applicationsByUniversity.length > 0 ? (
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={applicationsByUniversity}
                  margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="_id" 
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="count" name="Applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 sm:h-80 text-gray-500 text-sm">
              No application data available
            </div>
          )}
        </div>

        {/* Pie Chart - Applications by Category */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Applications by Category</h2>
          {applicationsByCategory.length > 0 ? (
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <Pie
                    data={applicationsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="_id"
                  >
                    {applicationsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 sm:h-80 text-gray-500 text-sm">
              No category data available
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
        
        {/* Application Status */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Application Status</h3>
          <div className="space-y-2 sm:space-y-3">
            {[
              { label: 'Pending', key: 'pending', color: 'bg-yellow-100 text-yellow-800' },
              { label: 'Processing', key: 'processing', color: 'bg-blue-100 text-blue-800' },
              { label: 'Completed', key: 'completed', color: 'bg-green-100 text-green-800' },
              { label: 'Rejected', key: 'rejected', color: 'bg-red-100 text-red-800' }
            ].map(status => (
              <div key={status.key} className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">{status.label}</span>
                <span className={`px-2 sm:px-3 py-1 ${status.color} rounded-full text-xs sm:text-sm font-medium`}>
                  {analytics?.statusCounts?.[status.key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">User Distribution</h3>
          <div className="space-y-2 sm:space-y-3">
            {[
              { label: 'Students', key: 'student', color: 'bg-blue-100 text-blue-800' },
              { label: 'Moderators', key: 'moderator', color: 'bg-purple-100 text-purple-800' },
              { label: 'Admins', key: 'admin', color: 'bg-red-100 text-red-800' }
            ].map(role => (
              <div key={role.key} className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">{role.label}</span>
                <span className={`px-2 sm:px-3 py-1 ${role.color} rounded-full text-xs sm:text-sm font-medium`}>
                  {analytics?.userRoles?.[role.key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Payment Status</h3>
          <div className="space-y-2 sm:space-y-3">
            {[
              { label: 'Paid Applications', key: 'paid', color: 'bg-green-100 text-green-800' },
              { label: 'Unpaid Applications', key: 'unpaid', color: 'bg-red-100 text-red-800' }
            ].map(payment => (
              <div key={payment.key} className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">{payment.label}</span>
                <span className={`px-2 sm:px-3 py-1 ${payment.color} rounded-full text-xs sm:text-sm font-medium`}>
                  {analytics?.paymentStatus?.[payment.key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;