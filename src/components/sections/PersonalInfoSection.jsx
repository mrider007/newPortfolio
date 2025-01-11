import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

const PersonalInfoSection = ({
  personalInfo,
  handlePersonalInfoChange,
  handlePersonalInfoSubmit,
}) => {
  return (
    <motion.div
      className="bg-gray-800 p-8 rounded-lg shadow-lg mb-12"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Personal Information</h2>
      <form onSubmit={handlePersonalInfoSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-gray-300 mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={personalInfo.name}
              onChange={handlePersonalInfoChange}
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-gray-300 mb-2 text-sm font-medium">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={personalInfo.title}
              onChange={handlePersonalInfoChange}
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={personalInfo.email}
              onChange={handlePersonalInfoChange}
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-300 mb-2 text-sm font-medium">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={personalInfo.phone}
              onChange={handlePersonalInfoChange}
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-300 mb-2 text-sm font-medium">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={personalInfo.location}
              onChange={handlePersonalInfoChange}
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-300 mb-2 text-sm font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              value={personalInfo.description}
              onChange={handlePersonalInfoChange}
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-[#00E5FF]/30 focus:border-[#00E5FF] outline-none"
              rows={4}
              placeholder="Your Description"
            />
          </div>
          <div>
            <label htmlFor="cvLink" className="block text-gray-300 mb-2 text-sm font-medium">CV Google Drive Link</label>
            <input
              type="url"
              id="cvLink"
              name="cvLink"
              value={personalInfo.cvLink}
              onChange={handlePersonalInfoChange}
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
        </div>
        <motion.button
          type="submit"
          className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Save className="mr-2" size={18} />
          Update Personal Information
        </motion.button>
      </form>
    </motion.div>
  );
};

export default PersonalInfoSection;
