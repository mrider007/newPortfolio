import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Edit } from 'lucide-react';

const ExperiencesSection = ({
  experiences,
  newExperience,
  editingExperience,
  handleExperienceChange,
  handleExperienceSubmit,
  handleEditExperience,
  handleDeleteExperience,
}) => {
  return (
    <motion.div
      className="bg-gray-800 p-8 rounded-lg shadow-lg mb-12"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Experiences</h2>
      <form onSubmit={handleExperienceSubmit} className="mb-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="company" className="block text-gray-300 mb-2 text-sm font-medium">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={newExperience.company}
              onChange={handleExperienceChange}
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="position" className="block text-gray-300 mb-2 text-sm font-medium">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={newExperience.position}
              onChange={handleExperienceChange}
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="period" className="block text-gray-300 mb-2 text-sm font-medium">Period</label>
            <input
              type="text"
              id="period"
              name="period"
              value={newExperience.period}
              onChange={handleExperienceChange}
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="responsibilities" className="block text-gray-300 mb-2 text-sm font-medium">Responsibilities (one per line)</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={newExperience.responsibilities}
              onChange={handleExperienceChange}
              required
              rows={4}
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            ></textarea>
          </div>
        </div>
        <motion.button
          type="submit"
          className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {editingExperience ? <Save className="mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
          {editingExperience ? 'Update Experience' : 'Add Experience'}
        </motion.button>
      </form>
      {experiences.map(exp => (
        <motion.div
          key={exp.id}
          className="mb-6 p-6 bg-gray-700 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-blue-300">{exp.company}</h3>
          <p className="text-gray-300">{exp.position}</p>
          <p className="text-gray-400">{exp.period}</p>
          <ul className="list-disc list-inside text-gray-300 mt-2">
            {exp.responsibilities.map((resp, index) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
          <div className="mt-4 flex space-x-4">
            <motion.button
              onClick={() => handleEditExperience(exp)}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit className="mr-2" size={18} />
              Edit
            </motion.button>
            <motion.button
              onClick={() => handleDeleteExperience(exp.id)}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="mr-2" size={18} />
              Delete
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ExperiencesSection;
