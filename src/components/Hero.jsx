import { motion } from 'framer-motion';
import { CalendarIcon, Download } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

const fallbackSkills = [
  { id: 'fallback1', name: 'React', image: 'https://w7.pngwing.com/pngs/831/155/png-transparent-game-react-native-javascript-android-physics-symmetry-web-application-vuejs-thumbnail.png' },
  { id: 'fallback2', name: 'Node.js', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE4qaVzeEg9j60I9z2eR77MY6ilKM9l1J82A&s' },
  { id: 'fallback3', name: 'MongoDB', image: 'https://www.liblogo.com/img-logo/mo429m311-mongodb-logo-mongodb-logo-.png' },
];
export default function  Hero() {
  const [skills, setSkills] = useState([]);
  const [heroData, setHeroData] = useState({
    name: 'Mukesh Kumar Singh',
    title: 'Full Stack Developer',
    description:
      'Passionate Full Stack Developer with expertise in React, Node.js, and cloud technologies. Committed to creating efficient, scalable, and user-friendly web applications.',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  const fetchSkills = useCallback(async () => {
    try {
      const skillsSnapshot = await getDocs(collection(db, 'skills'));
      const fetchedSkills = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSkills(fetchedSkills.length > 0 ? fetchedSkills : fallbackSkills);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const heroDoc = await getDoc(doc(db, 'personalInfo', 'main'));
        if (heroDoc.exists()) {
          setHeroData(heroDoc.data());
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'personalInfo', 'main'), heroData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving hero data:', error);
    }
  };

  const handleDownloadCV = () => {
    const cvUrl = heroData ? heroData?.cvLink : '/mukesh-kumar-singh-cv.pdf';
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'Mukesh-Kumar-Singh-CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  


  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 relative overflow-hidden z-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <div className="relative z-10 text-center px-4 max-w-4xl w-full" id='ignore-bubble'>

          <motion.div variants={containerVariants} className="space-y-6">
            {user && (
              <motion.button
                onClick={() => setIsEditing(!isEditing)}
                className="mb-4 px-4 py-2 bg-[#00E5FF] text-black rounded-full hover:bg-[#00E5FF]/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </motion.button>
            )}
            {isEditing ? (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  value={heroData.name}
                  onChange={(e) =>
                    setHeroData({ ...heroData, name: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-[#00E5FF]/30 focus:border-[#00E5FF] outline-none"
                  placeholder="Your Name"
                />
                <input
                  type="text"
                  value={heroData.title}
                  onChange={(e) =>
                    setHeroData({ ...heroData, title: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-[#00E5FF]/30 focus:border-[#00E5FF] outline-none"
                  placeholder="Your Title"
                />
                <textarea
                  value={heroData.description}
                  onChange={(e) =>
                    setHeroData({ ...heroData, description: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-[#00E5FF]/30 focus:border-[#00E5FF] outline-none"
                  rows="4"
                  placeholder="Your Description"
                />
                <Button onClick={handleSave}>Save Changes</Button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  variants={itemVariants}
                  className="text-lg md:text-base text-[#00E5FF] tracking-wider mb-4"
                >
                  {heroData?.title || 'FULL STACK DEVELOPER'}
                </motion.div>
                <motion.h1
                  className="text-4xl md:text-7xl font-bold text-white mb-6"
                  variants={itemVariants}
                >
                  {heroData?.name || 'Mukesh Kumar Singh'}
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8"
                  variants={itemVariants}
                >
                  {heroData.description ||
                    'Passionate Full Stack Developer with expertise in React, Node.js, and cloud technologies. Committed to creating efficient, scalable, and user-friendly web applications.'}
                </motion.p>
                <motion.div
                  className="flex flex-wrap justify-center gap-4"
                  variants={itemVariants}
                >
                  <a
                    href="/#contact"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#00E5FF] transition-colors duration-300 block flex items-center"
                  >
                    <Button variant="outline">
                      <CalendarIcon className="h-5 w-5" />
                      Shedule A meeting
                    </Button>
                  </a>
                  <Button onClick={handleDownloadCV} variant="outline">
                    <Download className="h-5 w-5" />
                    Download CV
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>

      </div>

      {/* Animated Skill Bubbles */}
      {skills && skills.map((skill, index) => (
  <motion.div
    key={skill.id}
    initial={{ boxShadow: '0 0 25px 5px rgba(0, 229, 255, 0.5)' }}
    className="absolute w-16 h-16 rounded-full bg-white shadow-lg overflow-hidden z-9"
    style={{
      top: `${10 + Math.random() * 60}vh`,
      left: `${10 + Math.random() * 60}vw`,
      opacity: 0.6, // Increased opacity for better visibility
    }}
    animate={{
      x: [
        0,
        Math.random() * window.innerWidth * 0.3 - (window.innerWidth * 0.15),
        0
      ],
      y: [
        0,
        Math.random() * window.innerHeight * 0.3 - (window.innerHeight * 0.15),
        0
      ],
      rotateX: [0, Math.random() * 360, 0], // 3D rotation on X-axis
      rotateY: [0, Math.random() * 360, 0], // 3D rotation on Y-axis
      rotateZ: [0, Math.random() * 360, 0], // 3D rotation on Z-axis
    }}
    transition={{
      duration: 6 + index * 0.5,
      repeat: Infinity,
      repeatType: 'mirror',
      delay: index * 0.4,
      ease: 'easeInOut',
    }}
  >
    <div
      className="w-full h-full flex justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full overflow-hidden"
      style={{
        transform: 'perspective(400px) rotateX(30deg) rotateY(30deg)', // Add 3D effect
      }}
    >
      <img
        src={skill.image || '/fallback-image.png'}
        alt={skill.name || 'Skill'}
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  </motion.div>
))}




    </motion.div>
  );
}
