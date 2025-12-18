import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import SectionTitle from '../shared/SectionTitle';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I apply for a scholarship?',
      answer: 'To apply for a scholarship, first create an account and complete your profile. Then browse our scholarships, find one that matches your criteria, and click "Apply". You\'ll be guided through the payment of the application fee and submission process.'
    },
    {
      question: 'Are the scholarships verified?',
      answer: 'Yes, all scholarships listed on ScholarStream are verified and legitimate. We work directly with universities and organizations to ensure authenticity. Our team reviews each scholarship before it\'s published on our platform.'
    },
    {
      question: 'What types of scholarships are available?',
      answer: 'We offer three main types: Full Fund (covers all expenses including tuition, accommodation, and stipend), Partial (covers a portion of expenses), and Self-Fund programs (discounted tuition rates). You can filter scholarships by type to find what suits you best.'
    },
    {
      question: 'How long does the application process take?',
      answer: 'The initial application can be completed in minutes. After submission, moderators review applications within 3-5 business days. You\'ll receive email notifications about your application status and any required additional documents.'
    },
    {
      question: 'Can I apply for multiple scholarships?',
      answer: 'Absolutely! You can apply for as many scholarships as you qualify for. We recommend applying to multiple scholarships to increase your chances of success. Each application is reviewed independently.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit and debit cards through our secure Stripe payment gateway. Your payment information is encrypted and never stored on our servers.'
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-white to-base-200">
      <div className="container-custom">
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our scholarship platform"
        />

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className={`w-full p-6 rounded-xl text-left flex items-center justify-between transition-all duration-300 ${
                  activeIndex === index
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white hover:bg-slate-50 shadow-md'
                }`}
              >
                <span className="font-semibold pr-4">{faq.question}</span>
                {activeIndex === index ? (
                  <FiMinus className="flex-shrink-0" size={20} />
                ) : (
                  <FiPlus className="flex-shrink-0" size={20} />
                )}
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white px-6 py-4 rounded-b-xl border-x border-b border-slate-100">
                      <p className="text-slate-600">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
