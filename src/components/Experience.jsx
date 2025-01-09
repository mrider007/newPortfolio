import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

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

  return (
    <motion.section
      id="experience"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="py-20 bg-gray-900"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-400">Experience</h2>
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="mb-8 bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-blue-300">{exp.company}</h3>
            <h4 className="text-xl text-gray-300 mb-2">{exp.position}</h4>
            <p className="text-gray-400 mb-4">{exp.period}</p>
            <ul className="list-disc list-inside text-gray-300">
              {exp.responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Experience;

