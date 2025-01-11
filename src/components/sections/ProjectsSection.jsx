import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Edit } from 'lucide-react';

const ProjectsSection = ({
  projects,
  newProject,
  editingProject,
  handleProjectChange,
  handleProjectSubmit,
  handleEditProject,
  handleProjectDelete,
}) => {
  return (
    <motion.div
      className="bg-gray-800 p-8 rounded-lg shadow-lg"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Projects</h2>
      <form onSubmit={handleProjectSubmit} className="mb-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="title" className="block text-gray-300 mb-2 text-sm font-medium">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newProject.title}
              onChange={handleProjectChange}
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="demoUrl" className="block text-gray-300 mb-2 text-sm font-medium">Demo Url</label>
            <input
              type="url"
              id="demoUrl"
              name="demoUrl"
              value={newProject.demoUrl}
              onChange={handleProjectChange}
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-300 mb-2 text-sm font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              value={newProject.description}
              onChange={handleProjectChange}
              required
              rows={3}
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            ></textarea>
          </div>
          <div>
            <label htmlFor="technologies" className="block text-gray-300 mb-2 text-sm font-medium">Technologies (comma-separated)</label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              value={newProject.technologies}
              onChange={handleProjectChange}
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="responsibilities" className="block text-gray-300 mb-2 text-sm font-medium">Responsibilities (one per line)</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={newProject.responsibilities}
              onChange={handleProjectChange}
              required
              rows={4}
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            ></textarea>
          </div>
          <div>
            <label htmlFor="projectImage" className="block text-gray-300 mb-2 text-sm font-medium">Project Image</label>
            <input
              type="file"
              id="projectImage"
              name="image"
              onChange={handleProjectChange}
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              accept="image/*"
            />
          </div>
        </div>
        <motion.button
          type="submit"
          className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {editingProject ? <Save className="mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
          {editingProject ? 'Update Project' : 'Add Project'}
        </motion.button>
      </form>
      {projects.map(project => (
        <motion.div
          key={project.id}
          className="mb-6 p-6 bg-gray-700 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {project.image && <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />}
          <h3 className="text-xl font-semibold text-blue-300">{project.title}</h3>
          <p className="text-gray-300 mb-2">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, i) => (
              <span key={i} className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">{tech}</span>
            ))}
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-blue-300 mb-2">Responsibilities:</h4>
            <ul className="list-disc list-inside text-gray-300">
              {project.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
          <div className="flex space-x-4">
            <motion.button
              onClick={() => handleEditProject(project)}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit className="mr-2" size={18} />
              Edit
            </motion.button>
            <motion.button
              onClick={() => handleProjectDelete(project.id)}
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

export default ProjectsSection;
