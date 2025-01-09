import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Image, Transformation } from 'cloudinary-react';
import toast from 'react-hot-toast';

const SkillItem = React.memo(({ skill, isEditing, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <Image 
        cloudName={import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME} 
        publicId={skill.image}
        className="w-16 h-16 object-contain mb-4"
      >
        <Transformation width="64" height="64" crop="fit" />
      </Image>
      <p className="mt-2 text-center text-white">{skill.name}</p>
      {isEditing && (
        <button variant="destructive" onClick={() => onDelete(skill.id)} className="mt-2">
          Delete
        </button>
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

  console.log(skills)
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
    fetchSkills();
  }, [fetchSkills]);

  const fallbackSkills = [
    { id: 'fallback1', name: 'React', image: 'https://w7.pngwing.com/pngs/831/155/png-transparent-game-react-native-javascript-android-physics-symmetry-web-application-vuejs-thumbnail.png' },
    { id: 'fallback2', name: 'Node.js', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE4qaVzeEg9j60I9z2eR77MY6ilKM9l1J82A&s' },
    { id: 'fallback3', name: 'MongoDB', image: 'https://www.liblogo.com/img-logo/mo429m311-mongodb-logo-mongodb-logo-.png' },
    // Add more fallback skills as needed
  ];

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (newSkill.name && newSkill.image) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', newSkill.image);
        formData.append('upload_preset', 'your_upload_preset');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();

        const docRef = await addDoc(collection(db, 'skills'), {
          name: newSkill.name,
          image: data.public_id,
        });

        setSkills([...skills, { id: docRef.id, name: newSkill.name, image: data.public_id }]);
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
      className="py-20 bg-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center text-blue-400"
        >
          Skills
        </motion.h2>
        {user && (
          <div className="mb-4 flex justify-center">
            <button onClick={() => setIsEditing(!isEditing)} disabled={loading}>
              {isEditing ? 'Done Editing' : 'Edit Skills'}
            </button>
          </div>
        )}
        {isEditing && (
          <form onSubmit={handleAddSkill} className="mb-4 flex justify-center items-center space-x-2">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="Skill name"
              className="bg-gray-800 text-white"
            />
            <input
              type="file"
              onChange={(e) => setNewSkill({ ...newSkill, image: e.target.files[0] })}
              className="bg-gray-800 text-white"
            />
            <button type="submit" disabled={loading}>Add Skill</button>
          </form>
        )}
        <AnimatePresence>
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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

