import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaEye, FaComment, FaTimes, FaSpinner, FaBan, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageApplications = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['all-applications'],
    queryFn: async () => {
      const res = await axiosSecure.get('/applications');
      return res.data;
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await axiosSecure.patch(`/applications/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-applications']);
      toast.success('Status updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update status');
    }
  });

  const feedbackMutation = useMutation({
    mutationFn: async ({ id, feedback }) => {
      return await axiosSecure.patch(`/applications/${id}/feedback`, { feedback });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-applications']);
      setShowFeedbackModal(false);
      setFeedback('');
      toast.success('Feedback added successfully!');
    },
    onError: () => {
      toast.error('Failed to add feedback');
    }
  });

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === 'rejected') {
      Swal.fire({
        title: 'Reject Application?',
        text: "This will reject the student's application.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, reject it!'
      }).then((result) => {
        if (result.isConfirmed) {
          statusMutation.mutate({ id, status: newStatus });
        }
      });
    } else {
      statusMutation.mutate({ id, status: newStatus });
    }
  };

  const handleFeedbackSubmit = () => {
    feedbackMutation.mutate({
      id: selectedApplication._id,
      feedback
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

  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.applicationStatus === statusFilter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-3xl sm:text-4xl text-blue-600" />
      </div>
    );
  }

  const stats = [
    { label: 'Total', value: applications.length, color: 'bg-gray-50 text-gray-600' },
    { label: 'Pending', value: applications.filter(a => a.applicationStatus === 'pending').length, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Processing', value: applications.filter(a => a.applicationStatus === 'processing').length, color: 'bg-blue-50 text-blue-600' },
    { label: 'Completed', value: applications.filter(a => a.applicationStatus === 'completed').length, color: 'bg-green-50 text-green-600' }
  ];

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Applications</h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">Review and manage scholarship applications</p>
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

      {/* Filter */}
      <div className="mb-4 sm:mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg sm:rounded-xl shadow">
          <p className="text-gray-500 text-sm sm:text-base">No applications found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Applicant</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">University</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Degree</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Payment</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Feedback</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-4 py-4">
                        <p className="font-medium text-gray-900 text-sm">{app.userName}</p>
                        <p className="text-xs text-gray-500 truncate">{app.userEmail}</p>
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-sm text-gray-900">
                        {app.universityName}
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-sm text-gray-700">
                        {app.degree}
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        <select
                          value={app.applicationStatus}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          disabled={app.applicationStatus === 'rejected' || app.applicationStatus === 'completed'}
                          className={`px-2 py-1 text-xs font-medium rounded-full capitalize border-0 ${getStatusBadge(app.applicationStatus)} ${app.applicationStatus === 'rejected' || app.applicationStatus === 'completed' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                        </select>
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
                          
                          <button
                            onClick={() => {
                              setSelectedApplication(app);
                              setFeedback(app.feedback || '');
                              setShowFeedbackModal(true);
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            title="Add Feedback"
                          >
                            <FaComment size={14} />
                          </button>
                          
                          {app.applicationStatus !== 'rejected' && app.applicationStatus !== 'completed' && (
                            <button
                              onClick={() => handleStatusChange(app._id, 'rejected')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Reject Application"
                            >
                              <FaBan size={14} />
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
            {filteredApplications.map((app) => (
              <div key={app._id} className="bg-white rounded-lg shadow p-4 sm:p-5 space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {app.userName}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">{app.userEmail}</p>
                    <p className="text-sm text-gray-700 mt-1">{app.universityName}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedApplication(app);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition flex-shrink-0"
                    title="View Details"
                  >
                    <FaEye size={14} />
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Degree</p>
                    <p className="text-xs font-medium text-gray-900">{app.degree}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize inline-block ${getStatusBadge(app.applicationStatus)}`}>
                      {app.applicationStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize inline-block ${getPaymentBadge(app.paymentStatus)}`}>
                      {app.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="pt-2 border-t border-gray-200">
                  <label className="text-xs text-gray-500 block mb-1">Update Status</label>
                  <select
                    value={app.applicationStatus}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    disabled={app.applicationStatus === 'rejected' || app.applicationStatus === 'completed'}
                    className={`w-full px-2 py-2 text-xs font-medium border rounded-lg ${getStatusBadge(app.applicationStatus)} ${app.applicationStatus === 'rejected' || app.applicationStatus === 'completed' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedApplication(app);
                      setFeedback(app.feedback || '');
                      setShowFeedbackModal(true);
                    }}
                    className="flex-1 px-2 py-2 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition flex items-center justify-center gap-1"
                  >
                    <FaComment size={12} /> Feedback
                  </button>
                  
                  {app.applicationStatus !== 'rejected' && app.applicationStatus !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange(app._id, 'rejected')}
                      className="flex-1 px-2 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <FaBan size={12} /> Reject
                    </button>
                  )}
                </div>

                {app.feedback && (
                  <div className="pt-2 border-t border-gray-200 bg-gray-50 p-2 rounded text-xs">
                    <p className="font-medium text-gray-700 mb-1">Feedback:</p>
                    <p className="text-gray-600 line-clamp-2">{app.feedback}</p>
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
              {/* Applicant Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3 text-sm">Applicant Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div><span className="font-medium">Name:</span> {selectedApplication.userName}</div>
                  <div><span className="font-medium">Email:</span> {selectedApplication.userEmail}</div>
                  <div><span className="font-medium">Phone:</span> {selectedApplication.phone || 'N/A'}</div>
                  <div><span className="font-medium">Address:</span> {selectedApplication.address || 'N/A'}</div>
                  <div><span className="font-medium">SSC Result:</span> {selectedApplication.sscResult || 'N/A'}</div>
                  <div><span className="font-medium">HSC Result:</span> {selectedApplication.hscResult || 'N/A'}</div>
                  <div className="sm:col-span-2"><span className="font-medium">Study Gap:</span> {selectedApplication.studyGap || 'None'}</div>
                </div>
              </div>
              
              {/* Scholarship Information */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-3 text-sm">Scholarship Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div><span className="font-medium">University:</span> {selectedApplication.universityName}</div>
                  <div><span className="font-medium">Country:</span> {selectedApplication.universityCountry}</div>
                  <div><span className="font-medium">Category:</span> {selectedApplication.scholarshipCategory}</div>
                  <div><span className="font-medium">Degree:</span> {selectedApplication.degree}</div>
                  <div><span className="font-medium">Subject:</span> {selectedApplication.subjectCategory}</div>
                  <div><span className="font-medium">App Fees:</span> ${selectedApplication.applicationFees}</div>
                  <div><span className="font-medium">Service Charge:</span> ${selectedApplication.serviceCharge}</div>
                  <div><span className="font-medium">Applied On:</span> {new Date(selectedApplication.applicationDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              {/* Status Information */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm">Status Information</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedApplication.applicationStatus)}`}>
                    Status: {selectedApplication.applicationStatus}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadge(selectedApplication.paymentStatus)}`}>
                    Payment: {selectedApplication.paymentStatus}
                  </span>
                </div>
              </div>
              
              {selectedApplication.feedback && (
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold mb-2 text-sm">Feedback</h3>
                  <p className="text-gray-700 text-sm">{selectedApplication.feedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-xl max-w-md w-full">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold">Add/Edit Feedback</h2>
                <button onClick={() => setShowFeedbackModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition">
                  <FaTimes size={20} className="text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">Feedback for: {selectedApplication.userName}</p>
              <div className="space-y-4">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  rows={4}
                  placeholder="Write your feedback here..."
                />
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={feedbackMutation.isPending || !feedback.trim()}
                  className="w-full py-2 sm:py-3 bg-purple-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {feedbackMutation.isPending ? 'Saving...' : 'Save Feedback'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;