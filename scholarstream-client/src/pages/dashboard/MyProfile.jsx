import { useContext, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import useRole from '../../hooks/useRole';
import { FaUser, FaEnvelope, FaUserTag, FaCamera, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [role] = useRole();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUserProfile(formData.displayName, formData.photoURL);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">Manage your account information</p>
      </div>
      
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="h-24 sm:h-32 md:h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        {/* Profile Content */}
        <div className="relative px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
          {/* Avatar */}
          <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6 md:left-8">
            <div className="relative">
              <img
                src={user?.photoURL || 'https://via.placeholder.com/150'}
                alt={user?.displayName}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <FaCamera size={16} />
                </label>
              )}
            </div>
          </div>
          
          {/* Edit Button */}
          <div className="flex justify-end pt-4 sm:pt-6">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FaTimes /> Cancel
              </button>
            )}
          </div>
          
          {/* Profile Info */}
          <div className="mt-12 sm:mt-16 md:mt-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <FaUser className="text-gray-400 text-lg sm:text-xl flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Name</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                      {user?.displayName || 'Not set'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4">
                  <FaEnvelope className="text-gray-400 text-lg sm:text-xl flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                      {user?.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4">
                  <FaUserTag className="text-gray-400 text-lg sm:text-xl flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Role</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium capitalize ${getRoleBadgeColor(role)}`}>
                      {role || 'Student'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-5 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">Member Since</p>
            </div>
            <div className="bg-green-50 rounded-lg sm:rounded-xl p-4 sm:p-5 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {user?.emailVerified ? 'Yes' : 'No'}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">Email Verified</p>
            </div>
            <div className="bg-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-5 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-purple-600 capitalize">
                {role || 'Student'}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">Account Type</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;