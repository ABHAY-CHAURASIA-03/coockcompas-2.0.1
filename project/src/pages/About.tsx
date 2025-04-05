import { motion } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';

export default function About() {
  const team = [
    {
      name: 'Aditya Raj',
      role: 'Frontend Developer',
      linkedin: 'https://www.linkedin.com/in/adityaraj038',
      email: 'adityarajsinha064@gmail.com'
    },
    {
      name: 'Abhay Chaurasia',
      role: 'UI/UX Designer (Team Lead)',
      linkedin: 'https://www.linkedin.com/in/abhay-chaurasia-1408842b0',
      email: 'chaurasiaabhay1612@gmail.com'
    },
    {
      name: 'Aditya Anand',
      role: 'Backend Developer',
      linkedin: 'https://www.linkedin.com/in/aditya4257',
      email: 'addynagar4257@gmail.com'
    },
    {
      name: 'Ayush Kumar',
      role: 'Full Stack Developer',
      linkedin: 'https://www.linkedin.com/in/ayush-kumar-74821824a',
      email: 'aayushkumar3087@gmail.com'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-16"
        >
          Meet Our Team
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-transform"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">{member.name[0]}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-orange-500 mb-4">{member.role}</p>
              <div className="flex justify-center space-x-4">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Need Help?</h2>
          <p className="text-gray-400 mb-6">
            Have questions or need assistance? We're here to help!
          </p>
          <a
            href="mailto:aayyushkumar3084@gmail.com"
            className="bg-orange-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
          >
            <Mail className="w-6 h-6" />
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
}