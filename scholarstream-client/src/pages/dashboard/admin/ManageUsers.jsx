import { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../../providers/AuthProvider';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaTrash, FaSpinner, FaSearch, FaUserShield, FaUser, FaUserCog } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const { user: currentUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users', roleFilter],
    queryFn: async () => {
      const params = roleFilter !== 'all' ? `?role=${roleFilter}` : '';
      const res = await axiosSecure.get(`/users${params}`);
      return res.data;
    }
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return await axiosSecure.patch(`/users/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-users']);
      toast.success('Role updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update role');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-users']);
      toast.success('User deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete user');
    }
  });

  const handleRoleChange = (userId, newRole, userName) => {
    Swal.fire({
      title: 'Change User Role?',
      text: `Make ${userName} a ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    }).then((result) => {
      if (result.isConfirmed) {
        roleMutation.mutate({ id: userId, role: newRole });
      }
    });
  };

  const handleDelete = (id, email) => {
    if (email === currentUser?.email) {
      toast.error("You cannot delete yourself!");
      return;
    }
    
    Swal.fire({
      title: 'Delete User?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserShield className="text-red-500" />;
      case 'moderator':
        return <FaUserCog className="text-purple-500" />;
      default:
        return <FaUser className="text-blue-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-purple-100 text-purple-800',
      student: 'bg-blue-100 text-blue-800'
    };
    return badges[role] || badges.student;
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-3xl sm:text-4xl text-blue-600" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: users.length, color: 'bg-gray-50 text-gray-600' },
    { label: 'Students', value: users.filter(u => u.role === 'student').length, color: 'bg-blue-50 text-blue-600' },
    { label: 'Moderators', value: users.filter(u => u.role === 'moderator').length, color: 'bg-purple-50 text-purple-600' },
    { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'bg-red-50 text-red-600' }
  ];

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Users</h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">View and manage platform users</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-lg sm:rounded-xl p-4 sm:p-5`}>
            <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
            <p className="text-xs sm:text-sm mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="moderator">Moderators</option>
          <option value="admin">Admins</option>
        </select>
        
        <div className="relative flex-1 sm:flex-none">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg sm:rounded-xl shadow">
          <p className="text-gray-500 text-sm sm:text-base">No users found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">User</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Current Role</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Change Role</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((userData) => (
                    <tr key={userData._id} className="hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-4 py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img
                            src={userData.photoURL || 'https://via.placeholder.com/40'}
                            alt={userData.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1 sm:gap-2">
                              {getRoleIcon(userData.role)}
                              <p className="font-medium text-gray-900 text-sm truncate">{userData.name}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-sm text-gray-700 truncate">
                        {userData.email}
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getRoleBadge(userData.role)}`}>
                          {userData.role}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        {userData.email !== currentUser?.email ? (
                          <select
                            value={userData.role}
                            onChange={(e) => handleRoleChange(userData._id, e.target.value, userData.name)}
                            className="px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                            disabled={roleMutation.isPending}
                          >
                            <option value="student">Student</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className="text-xs text-gray-400">Current User</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        {userData.email !== currentUser?.email && (
                          <button
                            onClick={() => handleDelete(userData._id, userData.email)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete User"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3 sm:space-y-4">
            {filteredUsers.map((userData) => (
              <div key={userData._id} className="bg-white rounded-lg shadow p-4 sm:p-5 space-y-3">
                {/* User Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={userData.photoURL || 'https://via.placeholder.com/40'}
                      alt={userData.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        {getRoleIcon(userData.role)}
                        <p className="font-semibold text-gray-900 text-sm truncate">{userData.name}</p>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{userData.email}</p>
                    </div>
                  </div>
                  {userData.email !== currentUser?.email && (
                    <button
                      onClick={() => handleDelete(userData._id, userData.email)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>

                {/* Role Section */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Current Role</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize inline-block ${getRoleBadge(userData.role)}`}>
                    {userData.role}
                  </span>
                </div>

                {/* Change Role Section */}
                {userData.email !== currentUser?.email && (
                  <div className="pt-2 border-t border-gray-200">
                    <label className="text-xs text-gray-500 mb-2 block">Change Role</label>
                    <select
                      value={userData.role}
                      onChange={(e) => handleRoleChange(userData._id, e.target.value, userData.name)}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                      disabled={roleMutation.isPending}
                    >
                      <option value="student">Student</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;