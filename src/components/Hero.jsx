import { motion } from 'framer-motion';
import { CalendarIcon, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@radix-ui/react-dialog';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Button = ({ onClick, children, variant = 'primary' }) => (
  <motion.button
    onClick={onClick}
    className={`px-8 py-6 rounded-full font-medium flex items-center gap-2 ${
      variant === 'primary'
        ? 'bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90'
        : 'border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/10 border'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);

export default function Hero() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [heroData, setHeroData] = useState({
    name: 'Mukesh Kumar Singh',
    title: 'Full Stack Developer',
    description:
      'Passionate Full Stack Developer with expertise in React, Node.js, and cloud technologies. Committed to creating efficient, scalable, and user-friendly web applications.',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

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

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'personalInfo', 'main'), heroData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving hero data:', error);
    }
  };

  const handleDownloadCV = () => {
    const cvUrl = '/mukesh-kumar-singh-cv.pdf';
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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 relative overflow-hidden"
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
      <div className="relative z-10 text-center px-4 max-w-4xl w-full">
        {loading ? (
          <motion.p
            className="text-white text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading...
          </motion.p>
        ) : (
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
                  className="text-sm md:text-base text-[#00E5FF] tracking-wider mb-4"
                >
                  {heroData.title || 'FULL STACK DEVELOPER'}
                </motion.div>
                <motion.h1
                  className="text-4xl md:text-7xl font-bold text-white mb-6"
                  variants={itemVariants}
                >
                  {heroData.name || 'Mukesh Kumar Singh'}
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
                  {/* <Button onClick={() => setShowCalendar(true)}>
                    <CalendarIcon className="h-5 w-5" />
                    Book a Call
                  </Button> */}
                  <Button onClick={handleDownloadCV} variant="outline">
                    <Download className="h-5 w-5" />
                    Download CV
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </div>

      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="fixed inset-0 flex items-center justify-center">
          <motion.div
            className="bg-[#1a1f2e] text-white p-6 rounded-lg shadow-lg max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-[#00E5FF] mb-4">
              Schedule a Call
            </h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="w-full rounded-lg overflow-hidden"
            />
            {selectedDate && (
              <p className="mt-4 text-[#00E5FF]">
                Selected Date: {selectedDate.toLocaleDateString()}
              </p>
            )}
            <Button onClick={() => setShowCalendar(false)} className="mt-6 w-full justify-center">
              Confirm Booking
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>

      <motion.div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#00E5FF]/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-500/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 1,
        }}
      />
    </motion.div>
  );
}
