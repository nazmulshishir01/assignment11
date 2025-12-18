import { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../../providers/AuthProvider';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaEdit, FaTrash, FaStar, FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  
  const [selectedReview, setSelectedReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ rating: 5, comment: '' });

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['my-reviews', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/user/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-reviews']);
      toast.success('Review deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete review');
    }
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await axiosSecure.put(`/reviews/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-reviews']);
      setShowEditModal(false);
      toast.success('Review updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update review');
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

  const handleEditSubmit = () => {
    editMutation.mutate({
      id: selectedReview._id,
      data: {
        ratingPoint: editData.rating,
        reviewComment: editData.comment,
        reviewDate: new Date().toISOString()
      }
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-sm sm:text-base ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Reviews</h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">Manage your scholarship reviews</p>
      </div>
      
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg sm:rounded-xl shadow">
          <p className="text-gray-500 text-sm sm:text-base mb-2">You haven't written any reviews yet.</p>
          <p className="text-xs sm:text-sm text-gray-400">Complete a scholarship application to leave a review!</p>
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
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Rating</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Comment</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-4 py-4">
                        <p className="font-medium text-gray-900 text-sm">{review.universityName}</p>
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        {renderStars(review.ratingPoint)}
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        <p className="text-sm text-gray-700 max-w-xs truncate">{review.reviewComment}</p>
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-sm text-gray-500">
                        {new Date(review.reviewDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedReview(review);
                              setEditData({
                                rating: review.ratingPoint,
                                comment: review.reviewComment
                              });
                              setShowEditModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <FaTrash size={14} />
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
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow p-4 sm:p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {review.universityName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setEditData({
                          rating: review.ratingPoint,
                          comment: review.reviewComment
                        });
                        setShowEditModal(true);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Edit"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Rating</p>
                  {renderStars(review.ratingPoint)}
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Comment</p>
                  <p className="text-sm text-gray-700">{review.reviewComment}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-xl max-w-md w-full">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold">Edit Review</h2>
                <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition">
                  <FaTimes size={20} className="text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">Review for: {selectedReview.universityName}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditData({ ...editData, rating: star })}
                        className={`text-2xl sm:text-3xl transition ${star <= editData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Comment</label>
                  <textarea
                    value={editData.comment}
                    onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    rows={4}
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  onClick={handleEditSubmit}
                  disabled={editMutation.isPending || !editData.comment}
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

export default MyReviews;