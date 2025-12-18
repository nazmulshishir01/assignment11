import { useLocation, Link, Navigate } from 'react-router-dom';
import { FaCheckCircle, FaReceipt, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

const PaymentSuccess = () => {
  const location = useLocation();
  const { scholarshipName, universityName, amount, transactionId } = location.state || {};

  useEffect(() => {
    // Trigger confetti on page load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  // Redirect if no state
  if (!location.state) {
    return <Navigate to="/dashboard/my-applications" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaCheckCircle className="text-green-500 text-4xl" />
          </motion.div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your scholarship application has been submitted successfully.
          </p>

          {/* Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <FaReceipt className="text-blue-500" />
              <span className="font-medium">Payment Details</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Scholarship</span>
                <span className="font-medium text-gray-800">{scholarshipName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">University</span>
                <span className="font-medium text-gray-800">{universityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-bold text-green-600">${amount}</span>
              </div>
              <hr />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-gray-700 text-xs">{transactionId?.slice(0, 20)}...</span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-medium text-blue-800 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your application is now under review</li>
              <li>• You'll receive updates via email</li>
              <li>• Track your application status in dashboard</li>
            </ul>
          </div>

          {/* Action Button */}
          <Link
            to="/dashboard/my-applications"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Go to My Applications
            <FaArrowRight />
          </Link>

          {/* Secondary Action */}
          <Link
            to="/scholarships"
            className="inline-block mt-4 text-blue-600 hover:underline text-sm"
          >
            Browse More Scholarships
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
