import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Edit } from 'lucide-react';

const SkillsSection = ({
  skills,
  newSkill,
  editingSkill,
  handleSkillChange,
  handleAddSkill,
  handleUpdateSkill,
  handleEditSkill,
  handleDeleteSkill,
}) => {
  return (
    <motion.div
      className="bg-gray-800 p-8 rounded-lg shadow-lg mb-12"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Skills</h2>
      <form onSubmit={editingSkill ? handleUpdateSkill : handleAddSkill} className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="name"
            value={newSkill.name}
            onChange={handleSkillChange}
            placeholder="Add a new skill"
            className="flex-grow px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
          <input
            type="file"
            name="image"
            onChange={handleSkillChange}
            className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            accept="image/*"
          />
          <motion.button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {editingSkill ? <Save className="mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
            {editingSkill ? 'Update Skill' : 'Add Skill'}
          </motion.button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(skill => (
          <motion.div
            key={skill.id}
            className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center">
              {skill.image && <img src={skill.image} alt={skill.name} className="w-10 h-10 object-cover rounded-full mr-3" />}
              <span className="text-gray-300">{skill.name}</span>
            </div>
            <div className="flex items-center">
              <motion.button
                onClick={() => handleEditSkill(skill)}
                className="text-blue-500 hover:text-blue-600 mr-2"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              >
                <Edit size={16} />
              </motion.button>
              <motion.button
                onClick={() => handleDeleteSkill(skill.id)}
                className="text-red-500 hover:text-red-600"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SkillsSection;
