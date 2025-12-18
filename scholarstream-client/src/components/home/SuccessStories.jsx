import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import SectionTitle from '../shared/SectionTitle';

const SuccessStories = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chowdhury',
      image: 'https://engineering.purdue.edu/ECE/News/2022/phd-student-sarah-nahar-chowdhury-awarded-2022-ja-woollam-company-scholarship/sarah-portrait.png',
      university: 'Harvard University',
      scholarship: 'Full Fund',
      quote: 'ScholarStream changed my life! I found a full scholarship to Harvard that I never knew existed. The application process was seamless.',
      rating: 5
    },
    {
      id: 2,
      name: 'Nabel Khan',
      image: 'https://www.birmingham.ac.uk/images/dubai/staff-profiles/nabeel-khan-cropped-230x230.jpg?quality=80&width=411',
      university: 'MIT',
      scholarship: 'Full Fund',
      quote: 'The platform made it incredibly easy to compare different scholarships. I saved countless hours in my search and found my perfect match.',
      rating: 5
    },
    {
      id: 3,
      name: 'Begum Rokeya',
      image: 'https://i.pravatar.cc/150?img=5',
      university: 'Oxford University',
      scholarship: 'Partial',
      quote: 'From a small town to Oxford! ScholarStream\'s resources and guidance were invaluable in my journey to study abroad.',
      rating: 5
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionTitle
          title="Success Stories"
          subtitle="Hear from students who found their dream scholarships through ScholarStream"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="card-custom p-8 relative"
            >
              {/* Quote Mark */}
              <div className="absolute top-6 right-6 text-6xl text-primary/10 font-display">
                "
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-600 mb-6 relative z-10">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                />
                <div>
                  <h4 className="font-semibold text-secondary">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">
                    {testimonial.scholarship} • {testimonial.university}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
