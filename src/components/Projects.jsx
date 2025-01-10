import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import ProjectCard from './ProjectCard';
import { uploadToCloudinary } from '../utils/cloudinary';

const fallbackProjects = [
  {
    id: '1',
    title: 'shipwall.au',
    description: 'Developed a B2B e-commerce platform.',
    technologies: ['Redux', 'Material-UI', 'React', 'Next.js', 'AWS EC2'],
    image: "",
    responsibilities: [
      "Led frontend development",
      "Implemented responsive design",
      "Integrated payment gateway"
    ]
  },
  // ... (other fallback projects)
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    image: null,
    responsibilities: '',
    demoUrl: ''
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const fetchedProjects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (fetchedProjects.length > 0) {
        setProjects(fetchedProjects);
      } else {
        setProjects(fallbackProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (newProject.title && newProject.description && newProject.technologies) {
      try {
        setLoading(true);
        const imageUrl = await uploadToCloudinary(newProject.image);
        const projectData = {
          title: newProject.title,
          description: newProject.description,
          technologies: newProject.technologies.split(',').map(tech => tech.trim()),
          image: imageUrl,
          responsibilities: newProject.responsibilities.split('\n').filter(r => r.trim()),
          demoUrl: newProject.demoUrl
        };

        const docRef = await addDoc(collection(db, 'projects'), projectData);

        setProjects([...projects, { id: docRef.id, ...projectData }]);
        setNewProject({ title: '', description: '', technologies: '', image: null, responsibilities: '', demoUrl: '' });
        toast.success("Project added successfully");
      } catch (error) {
        console.error("Error adding project:", error);
        toast.error("Failed to add project");
      } finally {
        setLoading(false);
        await fetchProjects()

      }
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'projects', id));
      setProjects(projects.filter(project => project.id !== id));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setLoading(false);
      await fetchProjects()
    }
  };

  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="py-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-bold mb-12 text-center text-[#00E5FF]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          My Projects
        </motion.h2>
        {user && (
          <motion.div className="mb-8">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mb-4 bg-[#00E5FF] text-gray-800 py-2 px-4 rounded-md hover:bg-[#00B8D9] transition-colors duration-300"
              disabled={loading}
            >
              {isEditing ? 'Done' : 'Edit Projects'}
            </button>
            {isEditing && (
              <form onSubmit={handleAddProject} className="space-y-4">
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="Project title"
                  className="w-full p-2 bg-gray-700 text-white rounded-md"
                />
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Project description"
                  className="w-full p-2 bg-gray-700 text-white rounded-md"
                  rows="3"
                />
                <input
                  type="text"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  placeholder="Technologies (comma-separated)"
                  className="w-full p-2 bg-gray-700 text-white rounded-md"
                />
                <textarea
                  value={newProject.responsibilities}
                  onChange={(e) => setNewProject({ ...newProject, responsibilities: e.target.value })}
                  placeholder="Responsibilities (one per line)"
                  className="w-full p-2 bg-gray-700 text-white rounded-md"
                  rows="3"
                />
                <input
                  type="url"
                  value={newProject.demoUrl}
                  onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                  placeholder="Demo URL"
                  className="w-full p-2 bg-gray-700 text-white rounded-md"
                />
                <input
                  type="file"
                  onChange={(e) => setNewProject({ ...newProject, image: e.target.files[0] })}
                  className="w-full p-2 bg-gray-700 text-white rounded-md"
                />
                <button type="submit" className="bg-[#00E5FF] text-gray-800 py-2 px-4 rounded-md hover:bg-[#00B8D9] transition-colors duration-300">
                  Add Project
                </button>
              </form>
            )}
          </motion.div>
        )}
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <motion.div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isEditing={isEditing}
                    onDelete={handleDeleteProject}
                  />
                ))
              ) : (
                <p className="text-center text-gray-400 col-span-full">No projects available.</p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default Projects;

