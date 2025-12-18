import { useLocation, Link, Navigate } from 'react-router-dom';
import { FaTimesCircle, FaExclamationTriangle, FaArrowRight, FaRedo } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PaymentFailed = () => {
  const location = useLocation();
  const { scholarshipName, error } = location.state || {};

  // Redirect if no state
  if (!location.state) {
    return <Navigate to="/dashboard/my-applications" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Failed Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaTimesCircle className="text-red-500 text-4xl" />
          </motion.div>

          {/* Failed Message */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't process your payment. Don't worry, you can try again.
          </p>

          {/* Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <FaExclamationTriangle className="text-amber-500" />
              <span className="font-medium">Error Details</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Scholarship</span>
                <span className="font-medium text-gray-800">{scholarshipName}</span>
              </div>
              <hr />
              <div>
                <span className="text-gray-500 text-sm">Error Message:</span>
                <p className="text-red-600 text-sm mt-1">{error || 'Payment was declined. Please try again.'}</p>
              </div>
            </div>
          </div>

          {/* What to do */}
          <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-medium text-amber-800 mb-2">What You Can Do:</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Check your card details and try again</li>
              <li>• Make sure you have sufficient funds</li>
              <li>• Contact your bank if the issue persists</li>
              <li>• Your application is saved - pay later from dashboard</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/dashboard/my-applications"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
              <FaArrowRight />
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <FaRedo />
              Try Again
            </button>
          </div>

          {/* Help Link */}
          <p className="mt-6 text-sm text-gray-500">
            Need help?{' '}
            <a href="mailto:support@scholarstream.com" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;
