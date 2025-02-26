'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: "Is this app suitable for all stages of pregnancy?",
    answer: "Yes, MomCare is designed to support you from the moment you find out you're pregnant through postpartum. Our content and features adapt to your current stage of pregnancy, providing relevant information and tools exactly when you need them."
  },
  {
    id: 2,
    question: "How accurate is the pregnancy tracking information?",
    answer: "Our pregnancy content is developed and reviewed by a team of OB-GYNs, midwives, and maternal health specialists to ensure accuracy. We regularly update our information based on the latest research and medical guidelines."
  },
  {
    id: 3,
    question: "Can I use the app if I have a high-risk pregnancy?",
    answer: "Absolutely. While MomCare provides general pregnancy guidance, it can be a helpful companion for those with high-risk pregnancies. However, always follow your healthcare provider's specific advice, as they know your individual situation best."
  },
  {
    id: 4,
    question: "Is my personal health information secure?",
    answer: "We take data privacy very seriously. Your health information is encrypted and stored securely. We never share your personal data with third parties without your explicit consent. You can review our full privacy policy for more details."
  },
  {
    id: 5,
    question: "How do I connect with other moms in the community?",
    answer: "Our community feature allows you to join discussion groups based on your due date, location, or specific interests (like first-time moms, working moms, etc.). You can ask questions, share experiences, and build connections in a supportive environment."
  },
  {
    id: 6,
    question: "Is there a cost to use the app?",
    answer: "MomCare offers a free basic version with essential tracking and educational content. We also offer a premium subscription that unlocks additional features like personalized meal plans, expert Q&A access, and advanced health monitoring tools."
  },
];

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-[rgb(var(--color-primary))] tracking-wide uppercase">FAQ</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </p>
          <p className="mt-4 text-xl text-gray-500">
            Find answers to common questions about the MomCare pregnancy app.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                onClick={() => toggleFAQ(faq.id)}
                aria-expanded={openFAQ === faq.id}
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <span className="ml-6 flex-shrink-0 text-[rgb(var(--color-primary))]">
                  {openFAQ === faq.id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {openFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">Still have questions?</p>
          <a href="#contact" className="mt-4 btn-primary inline-block">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 