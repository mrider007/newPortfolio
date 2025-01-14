import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const ProjectCard = ({ project, isEditing, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showResponsibilities, setShowResponsibilities] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);

  // Truncate text logic
  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return `${text.substring(0, limit)}...`;
  };

  const descriptionLimit = 100; 
  const titleLimit = 20;

  return (
    <motion.div
      className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.05,
        y: -10,
        boxShadow: '0 0 25px 5px rgba(0, 229, 255, 0.5)',
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
    >
      {/* Image */}
      <motion.div className="w-full h-40 sm:h-56 md:h-64 bg-gray-700 relative">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="object-contain w-full h-full transition-all duration-300"
          />
        ) : (
          <div className="flex justify-center items-center h-full bg-gray-600 text-white font-bold text-xl">
            No Image
          </div>
        )}
      </motion.div>

      {/* Content Section */}
      <div className="p-6 relative bg-gray-800">
        {/* Title with Show More/Show Less */}
        <p className="text-2xl font-semibold text-white mb-2">
          {showFullTitle ? project.title : truncateText(project.title, titleLimit)}
        <>
        {project.title.length > titleLimit && (
            <span
              onClick={() => setShowFullTitle(!showFullTitle)}
              className="ml-2 text-sm text-[#00E5FF] hover:text-[#00B8D9] transition-colors duration-300 cursor-pointer"
            >
              {showFullTitle ? 'Show Less' : 'Show More'}
            </span>
          )}
        </>
        </p>

        {/* Description with Show More/Show Less */}
        <p className="text-gray-300 text-sm mb-4">
          {showFullDescription
            ? project.description
            : truncateText(project.description, descriptionLimit)}
          {project.description.length > descriptionLimit && (
            <span
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="ml-2 text-[#00E5FF] hover:text-[#00B8D9] transition-colors duration-300 cursor-pointer"
            >
              {showFullDescription ? 'Show Less' : 'Show More'}
            </span>
          )}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <motion.span
              key={index}
              className="bg-[#00E5F3] text-gray-800 px-2 py-1 rounded-md text-xs font-semibold cursor-pointer hover:bg-blue-500 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* Responsibilities */}
        {project.responsibilities && project.responsibilities.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowResponsibilities(!showResponsibilities)}
              className="flex items-center text-[#00E5FF] hover:text-[#00B8D9] transition-colors duration-300"
            >
              {showResponsibilities ? <ChevronUp className="mr-1" /> : <ChevronDown className="mr-1" />}
              {showResponsibilities ? 'Hide' : 'Show'} Responsibilities
            </button>
            {showResponsibilities && (
              <ul className="mt-2 list-disc list-inside text-gray-300 text-sm">
                {project.responsibilities.map((resp, index) => (
                  <li key={index} className="mb-1">
                    <span className="text-[#00E5FF]">•</span> {resp}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4">
          <button
            className={`flex items-center ${
              project.demoUrl ? 'text-[#00E5FF]' : 'text-red-400'
            } hover:text-[#00B8D9] transition-colors duration-300`}
            onClick={
              project.demoUrl
                ? () => window.open(project.demoUrl || `/${project.id}`, '_blank')
                : null
            }
          >
            {project.demoUrl ? (
              <>
                <ExternalLink className="mr-2" />
                Visit
              </>
            ) : (
              'No Visit'
            )}
          </button>

          {isEditing && (
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => onDelete(project.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
