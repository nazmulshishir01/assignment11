import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiGlobe, FiDollarSign } from 'react-icons/fi';

const Stats = () => {
  const stats = [
    { icon: FiUsers, value: '50K+', label: 'Active Students' },
    { icon: FiAward, value: '5,000+', label: 'Scholarships Awarded' },
    { icon: FiGlobe, value: '150+', label: 'Countries Reached' },
    { icon: FiDollarSign, value: '$2.5M+', label: 'Total Funding Secured' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-base-200 border-y border-base-300/50">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.7, ease: "easeOut" }}
                className="text-center"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 text-primary mb-6">
                  <Icon size={32} />
                </div>

                {/* Value - Simple DM Sans font (using <p> instead of <h3>) */}
                <motion.p
                  className="text-3xl md:text-4xl font-bold text-secondary tracking-tight"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 + 0.2 }}
                >
                  {stat.value}
                </motion.p>

                {/* Label - Same DM Sans font */}
                <p className="mt-3 text-base-content/70 font-medium text-sm md:text-base">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;