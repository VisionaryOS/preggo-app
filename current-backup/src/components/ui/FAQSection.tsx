"use client";

import { motion } from "framer-motion";
import {
  Card,
  Title,
  Text,
  Accordion,
  AccordionHeader,
  AccordionBody,
  AccordionList,
} from "@tremor/react";

interface FAQ {
  question: string;
  answer: string;
  emoji: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I get started with the app?",
    answer:
      "Simply download the app, create an account, and enter your due date. We'll immediately personalize your experience based on your current pregnancy stage. You can explore week-by-week content, join community groups, and start tracking your health - all for free.",
    emoji: "🚀",
  },
  {
    question: "Is my health data kept private?",
    answer:
      "Absolutely. We take your privacy seriously and follow strict security protocols. Your personal health information is encrypted and never shared with third parties without your explicit permission. You control who sees your information, even within community features.",
    emoji: "🔒",
  },
  {
    question: "Can I connect with other moms due around the same time?",
    answer:
      "Yes! Our community feature automatically connects you with other moms who are at a similar stage in their pregnancy. You can join due date groups, special interest groups (like fitness during pregnancy or working moms), and exchange experiences safely.",
    emoji: "👩‍👩‍👧‍👧",
  },
  {
    question: "How accurate is the pregnancy information?",
    answer:
      "All our content is created and reviewed by a board of OB-GYNs, midwives, and maternal health specialists. We regularly update our information based on the latest medical research and guidelines from major health organizations.",
    emoji: "🔍",
  },
  {
    question: "Can I use the app if I have a high-risk pregnancy?",
    answer:
      "Yes, many moms with high-risk pregnancies use our app as a supplemental resource. The app includes specialized content for various pregnancy conditions. However, always follow your healthcare provider's specific advice for your situation.",
    emoji: "💓",
  },
  {
    question: "Is there a cost to use the app?",
    answer:
      "The basic version of the app is completely free and includes access to essential tracking tools, community features, and educational content. We offer a premium subscription that unlocks additional features like personalized meal plans, expert Q&A, and advanced health analytics.",
    emoji: "💰",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Text className="text-indigo-600 font-semibold tracking-wide uppercase">
            FAQ
          </Text>
          <Title className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Common Questions from Moms
          </Title>
          <Text className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Everything you need to know about our pregnancy companion app
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <AccordionList>
              {faqs.map((faq, index) => (
                <Accordion key={index}>
                  <AccordionHeader>
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{faq.emoji}</span>
                      <Text className="font-medium">{faq.question}</Text>
                    </div>
                  </AccordionHeader>
                  <AccordionBody>
                    <Text className="text-gray-600">{faq.answer}</Text>
                  </AccordionBody>
                </Accordion>
              ))}
            </AccordionList>
          </Card>
        </motion.div>

        {/* Additional help section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-indigo-50 border-0">
            <div className="p-6">
              <div className="text-4xl mb-4">❓</div>
              <Title className="text-indigo-800">Still have questions?</Title>
              <Text className="max-w-xl mx-auto mb-6">
                We&apos;re here to help! Our team of pregnancy experts and
                experienced moms are ready to answer any questions you might
                have.
              </Text>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#contact-support"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Contact Support 📧
                </a>
                <a
                  href="#join-community"
                  className="inline-flex items-center justify-center px-5 py-3 border border-indigo-200 text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                >
                  Join Our Community 👩‍👩‍👧‍👧
                </a>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
