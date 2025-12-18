import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaEdit, FaTrash, FaTimes, FaSpinner, FaSearch } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageScholarships = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ['admin-scholarships'],
    queryFn: async () => {
      const res = await axiosSecure.get('/scholarships?limit=1000');
      return res.data.scholarships || res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/scholarships/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-scholarships']);
      toast.success('Scholarship deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete scholarship');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await axiosSecure.put(`/scholarships/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-scholarships']);
      setShowEditModal(false);
      toast.success('Scholarship updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update scholarship');
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Scholarship?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleEdit = (scholarship) => {
    setSelectedScholarship(scholarship);
    Object.keys(scholarship).forEach(key => {
      if (key === 'applicationDeadline') {
        setValue(key, scholarship[key]?.split('T')[0]);
      } else {
        setValue(key, scholarship[key]);
      }
    });
    setShowEditModal(true);
  };

  const onSubmit = (data) => {
    const updateData = {
      ...data,
      tuitionFees: data.tuitionFees ? parseInt(data.tuitionFees) : 0,
      applicationFees: parseInt(data.applicationFees),
      serviceCharge: parseInt(data.serviceCharge),
      universityWorldRank: parseInt(data.universityWorldRank)
    };
    
    updateMutation.mutate({
      id: selectedScholarship._id,
      data: updateData
    });
  };

  const filteredScholarships = scholarships.filter(s => 
    s.scholarshipName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.universityName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subjectCategories = ['Agriculture', 'Engineering', 'Doctor', 'Business', 'Arts', 'Science', 'Law', 'Computer Science'];
  const scholarshipCategories = ['Full fund', 'Partial', 'Self-fund'];
  const degrees = ['Diploma', 'Bachelor', 'Masters', 'PhD'];

  // Category badge color helper
  const getCategoryBadgeColor = (category) => {
    const colors = {
      'Full fund': 'bg-green-100 text-green-800',
      'Partial': 'bg-blue-100 text-blue-800',
      'Self-fund': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-3xl sm:text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Scholarships</h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">Edit or delete scholarships</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>
      
      {filteredScholarships.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg sm:rounded-xl shadow">
          <p className="text-gray-500 text-sm sm:text-base">No scholarships found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Scholarship</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">University</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Degree</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Fees</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Deadline</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredScholarships.map((scholarship) => (
                    <tr key={scholarship._id} className="hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-4 py-4">
                        <p className="font-medium text-gray-900 text-sm">{scholarship.scholarshipName}</p>
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        <p className="text-sm text-gray-900">{scholarship.universityName}</p>
                        <p className="text-xs text-gray-500">{scholarship.universityCountry}</p>
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        {/* Fixed: Added whitespace-nowrap to prevent line break */}
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getCategoryBadgeColor(scholarship.scholarshipCategory)}`}>
                          {scholarship.scholarshipCategory}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-sm text-gray-700">
                        {scholarship.degree}
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-sm text-gray-700">
                        ${scholarship.applicationFees + scholarship.serviceCharge}
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(scholarship)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(scholarship._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3 sm:space-y-4">
            {filteredScholarships.map((scholarship) => (
              <div key={scholarship._id} className="bg-white rounded-lg shadow p-4 sm:p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {scholarship.scholarshipName}
                    </h3>
                    <p className="text-sm text-gray-600">{scholarship.universityName}</p>
                    <p className="text-xs text-gray-500">{scholarship.universityCountry}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(scholarship)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(scholarship._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    {/* Fixed: Added whitespace-nowrap */}
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap mt-1 ${getCategoryBadgeColor(scholarship.scholarshipCategory)}`}>
                      {scholarship.scholarshipCategory}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Degree</p>
                    <p className="text-xs font-medium text-gray-900">{scholarship.degree}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fees</p>
                    <p className="text-xs font-medium text-gray-900">${scholarship.applicationFees + scholarship.serviceCharge}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="text-xs font-medium text-gray-900">
                      {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedScholarship && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-center z-10">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Edit Scholarship</h2>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <FaTimes size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Scholarship Name</label>
                  <input
                    type="text"
                    {...register('scholarshipName', { required: true })}
                    className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">University Name</label>
                  <input
                    type="text"
                    {...register('universityName', { required: true })}
                    className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Country</label>
                  <input
                    type="text"
                    {...register('universityCountry', { required: true })}
                    className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">City</label>
                  <input
                    type="text"
                    {...register('universityCity', { required: true })}
                    className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">World Rank</label>
                  <input
                    type="number"
                    {...register('universityWorldRank', { required: true })}
                    className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Subject Category</label>
                  <select {...register('subjectCategory')} className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg">
                    {subjectCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Scholarship Category</label>
                  <select {...register('scholarshipCategory')} className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg">
                    {scholarshipCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Degree</label>
                  <select {...register('degree')} className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg">
                    {degrees.map(deg => (
                      <option key={deg} value={deg}>{deg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Application Fees</label>
                  <input
                    type="number"
                    {...register('applicationFees', { required: true })}
                    className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Service Charge</label>
                  <input
                    type="number"
                    {...register('serviceCharge', { required: true })}
                    className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Deadline</label>
                  <input
                    type="date"
                    {...register('applicationDeadline', { required: true })}
                    className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">University Image URL</label>
                <input
                  type="url"
                  {...register('universityImage')}
                  className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Description</label>
                <textarea
                  {...register('scholarshipDescription')}
                  className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4 border-t">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 py-2 sm:py-3 px-4 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update Scholarship'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 sm:py-3 px-4 border border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageScholarships;