import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import SectionTitle from '../shared/SectionTitle';
import ScholarshipCard from '../scholarship/ScholarshipCard';

const TopScholarships = () => {
  const axiosPublic = useAxiosPublic();

  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ['topScholarships'],
    queryFn: async () => {
      const res = await axiosPublic.get('/scholarships/top');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <section className="section-padding bg-base-200">
        <div className="container-custom">
          <SectionTitle
            title="Top Scholarships"
            subtitle="Discover the most affordable scholarship opportunities"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-custom h-[400px] skeleton-loading" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-base-200">
      <div className="container-custom">
        <SectionTitle
          title="Top Scholarships"
          subtitle="Discover the most affordable scholarship opportunities from top universities worldwide"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scholarships.map((scholarship, index) => (
            <motion.div
              key={scholarship._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ScholarshipCard scholarship={scholarship} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/scholarships"
            className="btn-primary inline-flex items-center gap-2 group"
          >
            View All Scholarships
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TopScholarships;
