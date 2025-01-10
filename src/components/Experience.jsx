import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      const experiencesSnapshot = await getDocs(collection(db, 'experiences'));
      const fetchedExperiences = experiencesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExperiences(fetchedExperiences.length > 0 ? fetchedExperiences : fallbackExperiences);
    };

    fetchExperiences();
  }, []);

  // Fallback experiences from CV
  const fallbackExperiences = [
    {
      id: '1',
      company: 'HTSM Technologies Pvt Ltd',
      position: 'Full Stack Developer',
      period: 'September 2023 - April 2024',
      responsibilities: [
        'Developed and maintained web applications using React.js and Next.js',
        'Implemented backend services with Node.js and Express',
        'Utilized Firebase for authentication and real-time database services',
        'Deployed applications on AWS EC2 and managed RDP deployments'
      ]
    },
    {
      id: '2',
      company: 'FilmFinance',
      position: 'Associate Developer',
      period: 'May 2023 - July 2023',
      responsibilities: [
        'Created RESTful APIs with Express and Mongoose',
        'Developed and maintained state management using Redux',
        'Integrated third-party services with Axios and Socket.io',
        'Designed and implemented user interfaces with Material-UI and CSS'
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.section
      id="experience"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="py-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 min-h-screen flex items-center"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <motion.h2
                  className="text-4xl font-bold mb-12 text-center text-[#00E5FF]"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Exprience
                </motion.h2>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="relative bg-gray-800 rounded-xl p-6 shadow-xl overflow-hidden group"
            >
              {/* Neon glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-300 group-hover:text-blue-400 transition-colors">
                      {exp.company}
                    </h3>
                    <h4 className="text-xl text-purple-300 group-hover:text-purple-400 transition-colors">
                      {exp.position}
                    </h4>
                  </div>
                  <div className="flex items-center text-gray-400 mt-2 sm:mt-0">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{exp.period}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.responsibilities.map((resp, i) => (
                    <motion.li 
                      key={i}
                      className="flex items-start text-gray-300 group-hover:text-gray-200 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <ChevronRight className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0 mt-1" />
                      <span>{resp}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl animate-pulse" style={{ filter: 'blur(8px)' }} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Experience;