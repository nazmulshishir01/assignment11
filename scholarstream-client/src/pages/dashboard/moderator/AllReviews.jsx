import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaTrash, FaStar, FaSpinner, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AllReviews = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['all-reviews'],
    queryFn: async () => {
      const res = await axiosSecure.get('/reviews');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-reviews']);
      toast.success('Review deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete review');
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Review?',
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

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => 
    review.universityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.reviewComment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-3xl sm:text-4xl text-blue-600" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Reviews', value: reviews.length, color: 'bg-blue-50 text-blue-600' },
    { label: 'Average Rating', value: reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.ratingPoint, 0) / reviews.length).toFixed(1) : 0, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Positive (4-5⭐)', value: reviews.filter(r => r.ratingPoint >= 4).length, color: 'bg-green-50 text-green-600' },
    { label: 'Negative (<3⭐)', value: reviews.filter(r => r.ratingPoint < 3).length, color: 'bg-red-50 text-red-600' }
  ];

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">All Reviews</h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">Moderate scholarship reviews</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
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
      
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg sm:rounded-xl shadow">
          <p className="text-gray-500 text-sm sm:text-base">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-5 sm:p-6 space-y-3">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={review.userImage || 'https://via.placeholder.com/50'}
                    alt={review.userName}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {review.userName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {review.userEmail}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.ratingPoint)}
                      <span className="text-xs text-gray-500">
                        ({review.ratingPoint}/5)
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Actions - Desktop */}
                <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    {new Date(review.reviewDate).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Review"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
              
              {/* University and Date - Mobile */}
              <div className="sm:hidden text-xs text-gray-500">
                {new Date(review.reviewDate).toLocaleDateString()}
              </div>
              
              {/* Review Content */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                  {review.universityName}
                </p>
                <p className="text-sm sm:text-base text-gray-700">{review.reviewComment}</p>
              </div>

              {/* Delete Button - Mobile */}
              <div className="sm:hidden pt-2 border-t border-gray-200">
                <button
                  onClick={() => handleDelete(review._id)}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <FaTrash size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllReviews;