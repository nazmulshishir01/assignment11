import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FiMapPin, FiCalendar, FiDollarSign, FiAward, FiGlobe, 
  FiBookOpen, FiStar, FiArrowLeft, FiHeart
} from 'react-icons/fi';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAxiosSecure from '../hooks/useAxiosSecure';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ScholarshipCard from '../components/scholarship/ScholarshipCard';
import toast from 'react-hot-toast';

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch scholarship details
  const { data: scholarship, isLoading } = useQuery({
    queryKey: ['scholarship', id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/scholarships/${id}`);
      return res.data;
    }
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/reviews/scholarship/${id}`);
      return res.data;
    }
  });

  // Fetch related scholarships
  const { data: relatedScholarships = [] } = useQuery({
    queryKey: ['relatedScholarships', scholarship?.scholarshipCategory, id],
    enabled: !!scholarship?.scholarshipCategory,
    queryFn: async () => {
      const res = await axiosPublic.get(`/scholarships/related/${scholarship.scholarshipCategory}/${id}`);
      return res.data;
    }
  });

  const handleApply = () => {
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login', { state: { from: `/scholarship/${id}` } });
      return;
    }
    navigate(`/checkout/${id}`);
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      await axiosSecure.post(`/wishlist/${user.email}`, { scholarshipId: id });
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'full fund':
        return 'bg-success text-white';
      case 'partial':
        return 'bg-warning text-black';
      case 'self-fund':
        return 'bg-info text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.ratingPoint, 0) / reviews.length).toFixed(1)
    : 0;

  if (isLoading) return <LoadingSpinner />;

  if (!scholarship) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Scholarship not found</h2>
          <Link to="/scholarships" className="btn-primary">
            Browse Scholarships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{scholarship.scholarshipName} - ScholarStream</title>
      </Helmet>

      <div className="pt-24 pb-16 bg-base-200 min-h-screen">
        <div className="container-custom">
          {/* Back Button */}
          <Link
            to="/scholarships"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-6 transition-colors"
          >
            <FiArrowLeft />
            Back to Scholarships
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="card-custom overflow-hidden">
                {/* Image */}
                <div className="relative h-64 md:h-80">
                  <img
                    src={scholarship.universityImage}
                    alt={scholarship.universityName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(scholarship.scholarshipCategory)}`}>
                      {scholarship.scholarshipCategory}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-3">
                      {scholarship.scholarshipName}
                    </h1>
                    <p className="text-white/80 mt-1">{scholarship.universityName}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <FiMapPin className="text-primary" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Location</p>
                        <p className="font-semibold">{scholarship.universityCity}, {scholarship.universityCountry}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                        <FiGlobe className="text-accent" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">World Rank</p>
                        <p className="font-semibold">#{scholarship.universityWorldRank}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                        <FiAward className="text-success" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Degree</p>
                        <p className="font-semibold">{scholarship.degree}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                        <FiBookOpen className="text-info" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Subject</p>
                        <p className="font-semibold">{scholarship.subjectCategory}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                        <FiCalendar className="text-warning" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Deadline</p>
                        <p className="font-semibold">
                          {scholarship.applicationDeadline 
                            ? format(new Date(scholarship.applicationDeadline), 'MMMM dd, yyyy')
                            : 'Open'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center">
                        <FiStar className="text-error" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Rating</p>
                        <p className="font-semibold">{averageRating} / 5 ({reviews.length} reviews)</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h2 className="heading-secondary mb-4">About This Scholarship</h2>
                    <p className="text-slate-600 leading-relaxed">
                      {scholarship.scholarshipDescription || 
                        `This ${scholarship.scholarshipCategory} scholarship at ${scholarship.universityName} offers 
                        an excellent opportunity for students pursuing ${scholarship.degree} in ${scholarship.subjectCategory}. 
                        Located in the beautiful city of ${scholarship.universityCity}, ${scholarship.universityCountry}, 
                        this university is ranked #${scholarship.universityWorldRank} globally.`}
                    </p>
                  </div>

                  {/* Stipend/Coverage */}
                  <div className="bg-base-200 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-lg mb-4">Coverage & Stipend</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>• Tuition Fee Coverage: {scholarship.tuitionFees ? `$${scholarship.tuitionFees}` : 'Full Coverage'}</li>
                      <li>• Application Fee: ${scholarship.applicationFees}</li>
                      <li>• Service Charge: ${scholarship.serviceCharge}</li>
                      <li>• Additional Benefits: Accommodation support, Health insurance</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="card-custom p-6 md:p-8 mt-8">
                <h2 className="heading-secondary mb-6">Student Reviews</h2>
                
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-slate-100 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.userImage || 'https://i.ibb.co/5GzXkwq/user.png'}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.userName}</h4>
                              <span className="text-sm text-slate-500">
                                {format(new Date(review.reviewDate), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <div className="flex gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={i < review.ratingPoint ? 'fill-accent text-accent' : 'text-slate-300'}
                                  size={16}
                                />
                              ))}
                            </div>
                            <p className="text-slate-600">{review.reviewComment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card-custom p-6 sticky top-24">
                {/* <div className="text-center mb-6">
                  <p className="text-sm text-slate-500 mb-2">Total Application Fee</p>
                  <p className="text-4xl font-display font-bold text-primary">
                    ${(scholarship.applicationFees || 0) + (scholarship.serviceCharge || 0)}
                  </p>
                </div> */}

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Application Fee</span>
                    <span className="font-medium">${scholarship.applicationFees || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service Charge</span>
                    <span className="font-medium">${scholarship.serviceCharge || 0}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-primary">
                      ${(scholarship.applicationFees || 0) + (scholarship.serviceCharge || 0)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  className="btn-primary w-full mb-3"
                >
                  Apply for Scholarship
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className="btn-outline w-full flex items-center justify-center gap-2"
                >
                  <FiHeart />
                  Add to Wishlist
                </button>

                <p className="text-xs text-slate-500 text-center mt-4">
                  Posted on: {scholarship.scholarshipPostDate 
                    ? format(new Date(scholarship.scholarshipPostDate), 'MMMM dd, yyyy')
                    : 'N/A'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Related Scholarships */}
          {relatedScholarships.length > 0 && (
            <div className="mt-16">
              <h2 className="heading-secondary mb-8">You May Also Like</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedScholarships.map((s) => (
                  <ScholarshipCard key={s._id} scholarship={s} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ScholarshipDetails;
