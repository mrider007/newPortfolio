import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Image, Transformation } from 'cloudinary-react';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';
import { uploadToCloudinary } from '../utils/cloudinary';

const SkillItem = React.memo(({ skill, isEditing, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="relative group bg-gray-800 rounded-xl p-6 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      <div className="relative z-10">
        <Image 
          cloudName={import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME} 
          publicId={skill.image}
          className="w-20 h-20 object-contain mb-4 transition-transform duration-300 group-hover:scale-110"
        >
          <Transformation width="80" height="80" crop="fit" />
        </Image>
        <p className="mt-2 text-center text-white font-semibold group-hover:text-blue-300 transition-colors duration-300">{skill.name}</p>
      </div>
      
      {isEditing && (
        <motion.button
          onClick={() => onDelete(skill.id)}
          className="absolute top-2 right-2 text-red-500 hover:text-red-400 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} />
        </motion.button>
      )}
    </motion.div>
  );
});

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', image: null });
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    try {
      const skillsSnapshot = await getDocs(collection(db, 'skills'));
      const fetchedSkills = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSkills(fetchedSkills.length > 0 ? fetchedSkills : fallbackSkills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const fallbackSkills = [
    { id: 'fallback1', name: 'React', image: 'https://w7.pngwing.com/pngs/831/155/png-transparent-game-react-native-javascript-android-physics-symmetry-web-application-vuejs-thumbnail.png' },
    { id: 'fallback2', name: 'Node.js', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE4qaVzeEg9j60I9z2eR77MY6ilKM9l1J82A&s' },
    { id: 'fallback3', name: 'MongoDB', image: 'https://www.liblogo.com/img-logo/mo429m311-mongodb-logo-mongodb-logo-.png' },
  ];

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (newSkill.name && newSkill.image) {
      try {
        setLoading(true);
      const imageUrl = await uploadToCloudinary(newSkill.image);

        const docRef = await addDoc(collection(db, 'skills'), {
          name: newSkill.name,
          image: imageUrl,
        });

        setSkills([...skills, { id: docRef.id, name: newSkill.name, image: imageUrl }]);
        setNewSkill({ name: '', image: null });
        toast.success("Skill added successfully");
      } catch (error) {
        console.error("Error adding skill:", error);
        toast.error("Failed to add skill");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'skills', id));
      setSkills(skills.filter(skill => skill.id !== id));
      toast.success("Skill deleted successfully");
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      id="skills"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="py-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 min-h-screen flex items-center"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <motion.h2
                  className="text-4xl font-bold mb-12 text-center text-[#00E5FF]"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Skills
                </motion.h2>
        
        {user && (
          <motion.div 
            className="mb-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
              className={`px-6 py-2 rounded-full font-semibold text-white ${isEditing ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} transition-colors duration-300`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isEditing ? 'Done Editing' : 'Edit Skills'}
            </motion.button>
          </motion.div>
        )}
        
        {isEditing && (
          <motion.form 
            onSubmit={handleAddSkill} 
            className="mb-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="Skill name"
              className="px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="file"
              onChange={(e) => setNewSkill({ ...newSkill, image: e.target.files[0] })}
              className="px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <motion.button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} className="mr-2" />
              Add Skill
            </motion.button>
          </motion.form>
        )}
        
        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {skills.map((skill) => (
              <SkillItem
                key={skill.id}
                skill={skill}
                isEditing={isEditing}
                onDelete={handleDeleteSkill}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default React.memo(Skills);