import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiAward } from 'react-icons/fi';
import { format } from 'date-fns';

const ScholarshipCard = ({ scholarship }) => {
  const {
    _id,
    scholarshipName,
    universityName,
    universityImage,
    universityCountry,
    universityCity,
    scholarshipCategory,
    degree,
    applicationFees,
    applicationDeadline
  } = scholarship;

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'full fund':
        return 'bg-success/10 text-success';
      case 'partial':
        return 'bg-warning/10 text-warning';
      case 'self-fund':
        return 'bg-info/10 text-info';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="card-custom group h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={universityImage}
          alt={universityName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getCategoryColor(scholarshipCategory)}`}>
            {scholarshipCategory}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="font-display text-xl font-semibold text-secondary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {scholarshipName}
          </h3>
          <p className="text-slate-600 font-medium mb-4">{universityName}</p>

          <div className="space-y-2 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-primary" />
              <span>{universityCity}, {universityCountry}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiAward className="text-primary" />
              <span>{degree}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-primary" />
              <span>Deadline: {applicationDeadline ? format(new Date(applicationDeadline), 'MMM dd, yyyy') : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-secondary">
              {applicationFees > 0 ? `$${applicationFees}` : 'Free'}
            </span>
            <span className="text-sm text-slate-500">Application Fee</span>
          </div>
          <Link
            to={`/scholarship/${_id}`}
            className="text-primary font-medium hover:text-primary-dark transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCard;