import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AuthContext } from '../providers/AuthProvider';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaLock, FaSpinner, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

// Initialize Stripe - Replace with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || 'pk_test_your_key_here');

const CheckoutForm = ({ scholarship, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const totalAmount = (scholarship.applicationFees || 0) + (scholarship.serviceCharge || 0);

  // Create payment intent
  useEffect(() => {
    if (totalAmount > 0) {
      axiosSecure.post('/create-payment-intent', { amount: totalAmount })
        .then(res => {
          setClientSecret(res.data.clientSecret);
        })
        .catch(err => {
          console.error('Error creating payment intent:', err);
          toast.error('Failed to initialize payment');
        });
    }
  }, [totalAmount, axiosSecure]);

  const onSubmit = async (formData) => {
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const card = elements.getElement(CardElement);

    if (card === null) {
      setProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card,
        billing_details: {
          name: user.displayName,
          email: user.email
        }
      });

      if (methodError) {
        toast.error(methodError.message);
        setProcessing(false);
        return;
      }

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id
      });

      if (confirmError) {
        // Payment failed - save application with unpaid status
        const applicationData = {
          scholarshipId: scholarship._id,
          userId: user.uid,
          userName: user.displayName,
          userEmail: user.email,
          universityName: scholarship.universityName,
          universityCountry: scholarship.universityCountry,
          scholarshipName: scholarship.scholarshipName,
          scholarshipCategory: scholarship.scholarshipCategory,
          subjectCategory: scholarship.subjectCategory,
          degree: scholarship.degree,
          applicationFees: scholarship.applicationFees,
          serviceCharge: scholarship.serviceCharge,
          applicationStatus: 'pending',
          paymentStatus: 'unpaid',
          applicationDate: new Date().toISOString(),
          phone: formData.phone,
          address: formData.address,
          sscResult: formData.sscResult,
          hscResult: formData.hscResult,
          studyGap: formData.studyGap || ''
        };

        await axiosSecure.post('/applications', applicationData);

        navigate('/payment-failed', { 
          state: { 
            scholarshipName: scholarship.scholarshipName,
            error: confirmError.message 
          } 
        });
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Payment successful - save application with paid status
        const applicationData = {
          scholarshipId: scholarship._id,
          userId: user.uid,
          userName: user.displayName,
          userEmail: user.email,
          universityName: scholarship.universityName,
          universityCountry: scholarship.universityCountry,
          scholarshipName: scholarship.scholarshipName,
          scholarshipCategory: scholarship.scholarshipCategory,
          subjectCategory: scholarship.subjectCategory,
          degree: scholarship.degree,
          applicationFees: scholarship.applicationFees,
          serviceCharge: scholarship.serviceCharge,
          applicationStatus: 'pending',
          paymentStatus: 'paid',
          applicationDate: new Date().toISOString(),
          phone: formData.phone,
          address: formData.address,
          sscResult: formData.sscResult,
          hscResult: formData.hscResult,
          studyGap: formData.studyGap || ''
        };

        await axiosSecure.post('/applications', applicationData);

        // Save payment record
        await axiosSecure.post('/payments', {
          email: user.email,
          transactionId: paymentIntent.id,
          amount: totalAmount,
          scholarshipId: scholarship._id,
          scholarshipName: scholarship.scholarshipName,
          date: new Date().toISOString()
        });

        navigate('/payment-success', { 
          state: { 
            scholarshipName: scholarship.scholarshipName,
            universityName: scholarship.universityName,
            amount: totalAmount,
            transactionId: paymentIntent.id
          } 
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Info */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={user.displayName}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <input
              type="tel"
              {...register('phone', { required: 'Phone is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address *</label>
            <input
              type="text"
              {...register('address', { required: 'Address is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your address"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">SSC Result *</label>
            <input
              type="text"
              {...register('sscResult', { required: 'SSC result is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 5.00 or A+"
            />
            {errors.sscResult && <p className="text-red-500 text-sm mt-1">{errors.sscResult.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">HSC Result *</label>
            <input
              type="text"
              {...register('hscResult', { required: 'HSC result is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 5.00 or A+"
            />
            {errors.hscResult && <p className="text-red-500 text-sm mt-1">{errors.hscResult.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Study Gap (if any)</label>
            <input
              type="text"
              {...register('studyGap')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 1 year"
            />
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaLock className="text-green-500" />
          Payment Details
        </h3>
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <CardElement options={cardStyle} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Your payment is secured with SSL encryption
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-lg"
      >
        {processing ? (
          <>
            <FaSpinner className="animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <FaLock />
            Pay ${totalAmount}
          </>
        )}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // Fetch scholarship details
  const { data: scholarship, isLoading, error } = useQuery({
    queryKey: ['scholarship', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/scholarships/${id}`);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load scholarship details</p>
      </div>
    );
  }

  const totalAmount = (scholarship.applicationFees || 0) + (scholarship.serviceCharge || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
        >
          <FaArrowLeft />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
              <CheckoutForm scholarship={scholarship} user={user} />
            </Elements>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="flex gap-4 mb-4">
                <img
                  src={scholarship.universityImage}
                  alt={scholarship.universityName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium text-gray-900">{scholarship.scholarshipName}</p>
                  <p className="text-sm text-gray-500">{scholarship.universityName}</p>
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                    {scholarship.degree}
                  </span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Application Fee</span>
                  <span>${scholarship.applicationFees}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Charge</span>
                  <span>${scholarship.serviceCharge}</span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">${totalAmount}</span>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <FaCheckCircle />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
