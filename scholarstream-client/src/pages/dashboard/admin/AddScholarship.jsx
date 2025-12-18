import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { AuthContext } from '../../../providers/AuthProvider';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddScholarship = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      return await axiosSecure.post('/scholarships', data);
    },
    onSuccess: () => {
      toast.success('Scholarship added successfully!');
      reset();
      navigate('/dashboard/manage-scholarships');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add scholarship');
    }
  });

  const onSubmit = (data) => {
    const scholarshipData = {
      ...data,
      tuitionFees: data.tuitionFees ? parseInt(data.tuitionFees) : 0,
      applicationFees: parseInt(data.applicationFees),
      serviceCharge: parseInt(data.serviceCharge),
      universityWorldRank: parseInt(data.universityWorldRank),
      postedUserEmail: user.email,
      scholarshipPostDate: new Date().toISOString()
    };
    
    mutation.mutate(scholarshipData);
  };

  const subjectCategories = ['Agriculture', 'Engineering', 'Doctor', 'Business', 'Arts', 'Science', 'Law', 'Computer Science'];
  const scholarshipCategories = ['Full fund', 'Partial', 'Self-fund'];
  const degrees = ['Diploma', 'Bachelor', 'Masters', 'PhD'];

  const InputField = ({ label, register: reg, errors: err, name, type = 'text', required = false, placeholder }) => (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        {...reg(name, { required: required ? `${label} is required` : false })}
        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        placeholder={placeholder}
      />
      {err?.[name] && <p className="text-red-500 text-xs sm:text-sm mt-1">{err[name].message}</p>}
    </div>
  );

  const SelectField = ({ label, register: reg, errors: err, name, options, required = false }) => (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...reg(name, { required: required ? `${label} is required` : false })}
        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {err?.[name] && <p className="text-red-500 text-xs sm:text-sm mt-1">{err[name].message}</p>}
    </div>
  );

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Add New Scholarship</h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">Create a new scholarship opportunity</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          
          {/* Scholarship Name */}
          <InputField
            label="Scholarship Name"
            register={register}
            errors={errors}
            name="scholarshipName"
            required
            placeholder="e.g., Merit Scholarship 2024"
          />

          {/* University Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="University Name"
              register={register}
              errors={errors}
              name="universityName"
              required
              placeholder="e.g., Harvard University"
            />
            
            <InputField
              label="University Image URL"
              register={register}
              errors={errors}
              name="universityImage"
              type="url"
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Location Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              label="Country"
              register={register}
              errors={errors}
              name="universityCountry"
              required
              placeholder="e.g., United States"
            />
            
            <InputField
              label="City"
              register={register}
              errors={errors}
              name="universityCity"
              required
              placeholder="e.g., Cambridge"
            />
            
            <InputField
              label="World Rank"
              register={register}
              errors={errors}
              name="universityWorldRank"
              type="number"
              required
              placeholder="e.g., 1"
            />
          </div>

          {/* Categories Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectField
              label="Subject Category"
              register={register}
              errors={errors}
              name="subjectCategory"
              options={subjectCategories}
              required
            />
            
            <SelectField
              label="Scholarship Category"
              register={register}
              errors={errors}
              name="scholarshipCategory"
              options={scholarshipCategories}
              required
            />
            
            <SelectField
              label="Degree"
              register={register}
              errors={errors}
              name="degree"
              options={degrees}
              required
            />
          </div>

          {/* Fees Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              label="Tuition Fees (Optional)"
              register={register}
              errors={errors}
              name="tuitionFees"
              type="number"
              placeholder="e.g., 50000"
            />
            
            <InputField
              label="Application Fees"
              register={register}
              errors={errors}
              name="applicationFees"
              type="number"
              required
              placeholder="e.g., 50"
            />
            
            <InputField
              label="Service Charge"
              register={register}
              errors={errors}
              name="serviceCharge"
              type="number"
              required
              placeholder="e.g., 10"
            />
          </div>

          {/* Deadline */}
          <InputField
            label="Application Deadline"
            register={register}
            errors={errors}
            name="applicationDeadline"
            type="date"
            required
          />

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Scholarship Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('scholarshipDescription', { required: 'Description is required' })}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              rows={3}
              placeholder="Describe the scholarship, eligibility criteria, benefits..."
            />
            {errors.scholarshipDescription && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.scholarshipDescription.message}</p>
            )}
          </div>

          {/* Stipend Details */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Stipend/Coverage Details
            </label>
            <textarea
              {...register('stipendDetails')}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              rows={3}
              placeholder="e.g., Full tuition, Monthly stipend of $1500, Health insurance..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-2 sm:py-3 px-4 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Adding Scholarship...' : 'Add Scholarship'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/manage-scholarships')}
              className="flex-1 py-2 sm:py-3 px-4 border border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScholarship;