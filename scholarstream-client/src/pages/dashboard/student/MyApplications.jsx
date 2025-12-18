import { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../../providers/AuthProvider';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaEye, FaEdit, FaCreditCard, FaTrash, FaStar, FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [editData, setEditData] = useState({});

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['my-applications', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/applications/user/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/applications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-applications']);
      toast.success('Application deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete application');
    }
  });

  const reviewMutation = useMutation({
    mutationFn: async (data) => {
      return await axiosSecure.post('/reviews', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-applications']);
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
      toast.success('Review added successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add review');
    }
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await axiosSecure.patch(`/applications/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-applications']);
      setShowEditModal(false);
      toast.success('Application updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update application');
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleAddReview = () => {
    const data = {
      scholarshipId: selectedApplication.scholarshipId,
      universityName: selectedApplication.universityName,
      userName: user.displayName,
      userEmail: user.email,
      userImage: user.photoURL,
      ratingPoint: reviewData.rating,
      reviewComment: reviewData.comment,
      reviewDate: new Date().toISOString()
    };
    reviewMutation.mutate(data);
  };

  const handleEditSubmit = () => {
    editMutation.mutate({
      id: selectedApplication._id,
      data: editData
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.pending;
  };

  const getPaymentBadge = (status) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Applications</h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">Track your scholarship applications</p>
      </div>
      
      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg sm:rounded-xl shadow">
          <p className="text-gray-500 text-sm sm:text-base mb-4">You haven't applied to any scholarships yet.</p>
          <Link to="/scholarships" className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
            Browse Scholarships →
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">University</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Degree</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Fees</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Payment</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Feedback</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-4 py-4">
                        <p className="font-medium text-gray-900 text-sm">{app.universityName}</p>
                        <p className="text-xs text-gray-500">{app.universityCountry}</p>
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-sm text-gray-700">
                        {app.scholarshipCategory}
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-sm text-gray-700">
                        {app.degree}
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-sm text-gray-700">
                        ${app.applicationFees + app.serviceCharge}
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(app.applicationStatus)}`}>
                          {app.applicationStatus}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPaymentBadge(app.paymentStatus)}`}>
                          {app.paymentStatus}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {app.feedback || '-'}
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedApplication(app);
                              setShowDetailsModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <FaEye size={14} />
                          </button>
                          
                          {app.applicationStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setEditData({
                                    phone: app.phone || '',
                                    address: app.address || '',
                                    studyGap: app.studyGap || ''
                                  });
                                  setShowEditModal(true);
                                }}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Edit"
                              >
                                <FaEdit size={14} />
                              </button>
                              
                              {app.paymentStatus === 'unpaid' && (
                                <Link
                                  to={`/checkout/${app.scholarshipId}`}
                                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                  title="Pay Now"
                                >
                                  <FaCreditCard size={14} />
                                </Link>
                              )}
                              
                              <button
                                onClick={() => handleDelete(app._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete"
                              >
                                <FaTrash size={14} />
                              </button>
                            </>
                          )}
                          
                          {app.applicationStatus === 'completed' && (
                            <button
                              onClick={() => {
                                setSelectedApplication(app);
                                setShowReviewModal(true);
                              }}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                              title="Add Review"
                            >
                              <FaStar size={14} />
                            </button>
                          )}
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
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-lg shadow p-4 sm:p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {app.universityName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">{app.universityCountry}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedApplication(app);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="View Details"
                    >
                      <FaEye size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-xs font-medium text-gray-900">{app.scholarshipCategory}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Degree</p>
                    <p className="text-xs font-medium text-gray-900">{app.degree}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fees</p>
                    <p className="text-xs font-medium text-gray-900">${app.applicationFees + app.serviceCharge}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Applied On</p>
                    <p className="text-xs font-medium text-gray-900">
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize flex-1 text-center ${getStatusBadge(app.applicationStatus)}`}>
                    {app.applicationStatus}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize flex-1 text-center ${getPaymentBadge(app.paymentStatus)}`}>
                    {app.paymentStatus}
                  </span>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  {app.applicationStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedApplication(app);
                          setEditData({
                            phone: app.phone || '',
                            address: app.address || '',
                            studyGap: app.studyGap || ''
                          });
                          setShowEditModal(true);
                        }}
                        className="flex-1 px-2 py-2 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition"
                      >
                        <FaEdit className="inline mr-1" /> Edit
                      </button>
                      
                      {app.paymentStatus === 'unpaid' && (
                        <Link
                          to={`/checkout/${app.scholarshipId}`}
                          className="flex-1 px-2 py-2 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-center"
                        >
                          <FaCreditCard className="inline mr-1" /> Pay
                        </Link>
                      )}
                      
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="flex-1 px-2 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                      >
                        <FaTrash className="inline mr-1" /> Delete
                      </button>
                    </>
                  )}
                  
                  {app.applicationStatus === 'completed' && (
                    <button
                      onClick={() => {
                        setSelectedApplication(app);
                        setShowReviewModal(true);
                      }}
                      className="w-full px-2 py-2 text-xs font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition"
                    >
                      <FaStar className="inline mr-1" /> Add Review
                    </button>
                  )}
                </div>

                {app.feedback && (
                  <div className="pt-2 border-t border-gray-200 bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-500">Feedback:</p>
                    <p className="text-xs text-gray-700 line-clamp-2">{app.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold">Application Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition">
                <FaTimes size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div><span className="font-medium">University:</span> {selectedApplication.universityName}</div>
                <div><span className="font-medium">Country:</span> {selectedApplication.universityCountry}</div>
                <div><span className="font-medium">Category:</span> {selectedApplication.scholarshipCategory}</div>
                <div><span className="font-medium">Degree:</span> {selectedApplication.degree}</div>
                <div><span className="font-medium">Subject:</span> {selectedApplication.subjectCategory}</div>
                <div><span className="font-medium">Application Fees:</span> ${selectedApplication.applicationFees}</div>
                <div><span className="font-medium">Service Charge:</span> ${selectedApplication.serviceCharge}</div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full capitalize ${getStatusBadge(selectedApplication.applicationStatus)}`}>
                    {selectedApplication.applicationStatus}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Payment:</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full capitalize ${getPaymentBadge(selectedApplication.paymentStatus)}`}>
                    {selectedApplication.paymentStatus}
                  </span>
                </div>
                <div><span className="font-medium">Applied On:</span> {new Date(selectedApplication.applicationDate).toLocaleDateString()}</div>
              </div>
              
              {selectedApplication.feedback && (
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="font-medium text-sm mb-2">Moderator Feedback:</p>
                  <p className="text-gray-700 text-sm">{selectedApplication.feedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-xl max-w-md w-full">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold">Add Review</h2>
                <button onClick={() => setShowReviewModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition">
                  <FaTimes size={20} className="text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">Review for: {selectedApplication.universityName}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        className={`text-2xl sm:text-3xl transition ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Comment</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    rows={4}
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  onClick={handleAddReview}
                  disabled={reviewMutation.isPending || !reviewData.comment}
                  className="w-full py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-xl max-w-md w-full">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold">Edit Application</h2>
                <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition">
                  <FaTimes size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Address</label>
                  <textarea
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Study Gap (if any)</label>
                  <input
                    type="text"
                    value={editData.studyGap}
                    onChange={(e) => setEditData({ ...editData, studyGap: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <button
                  onClick={handleEditSubmit}
                  disabled={editMutation.isPending}
                  className="w-full py-2 sm:py-3 bg-green-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {editMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;