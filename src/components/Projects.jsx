import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import ProjectCard from './ProjectCard';


const fallbackProjects = [
  {
    id: '1',
    title: 'shipwall.au',
    description: 'Developed a B2B e-commerce platform.',
    technologies: ['Redux', 'Material-UI', 'React', 'Next.js', 'AWS EC2'],
    image: "",
  },
  {
    id: '2',
    title: 'dzital.com',
    description: 'Created a multiple category platform similar to OLX.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    image: "",
  },
  {
    id: '3',
    title: 'tatakalcares.com',
    description: 'Developed a medical application.',
    technologies: ['React', 'Firebase', 'Material-UI'],
    image: "",
  },
  {
    id: '4',
    title: 'intacars365',
    description: 'Built a car dealership management system.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux'],
    image: "",
  },
  {
    id: '5',
    title: 'CRUD API Express Package',
    description: 'Developed a custom npm package crud-api-express to simplify the creation of RESTful APIs.',
    technologies: ['Node.js', 'Express', 'npm'],
    image: "",
  },
  {
    id: '6',
    title: 'Data-Paginate NPM Package',
    description: 'Created a pagination npm package data-paginate for React applications with a custom hook for pagination.',
    technologies: ['React', 'npm', 'JavaScript'],
    image: "",
  },
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '', image: null });
  const { user } = useAuth();
  const [flippedCard, setFlippedCard] = useState(null);
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
    if (newProject.title && newProject.description && newProject.technologies && newProject.image) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', newProject.image);
        formData.append('upload_preset', 'your_upload_preset');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );

        const data = await response.json();
        const docRef = await addDoc(collection(db, 'projects'), {
          title: newProject.title,
          description: newProject.description,
          technologies: newProject.technologies.split(',').map(tech => tech.trim()),
          image: data.public_id,
        });

        setProjects([...projects, {
          id: docRef.id,
          ...newProject,
          technologies: newProject.technologies.split(',').map(tech => tech.trim()),
          image: data.public_id,
        }]);
        setNewProject({ title: '', description: '', technologies: '', image: null });
        toast.success("Project added successfully");
      } catch (error) {
        console.error("Error adding project:", error);
        toast.error("Failed to add project");
      } finally {
        setLoading(false);
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
    }
  };

  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="py-20 bg-gradient-to-b from-gray-900 to-gray-800"
    >
      <div className="container mx-auto px-6">
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
              className="mb-4"
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
                  className="bg-gray-700 text-white"
                />
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Project description"
                  className="bg-gray-700 text-white"
                  rows="3"
                />
                <input
                  type="text"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  placeholder="Technologies (comma-separated)"
                  className="bg-gray-700 text-white"
                />
                <input
                  type="file"
                  onChange={(e) => setNewProject({ ...newProject, image: e.target.files[0] })}
                  className="bg-gray-700 text-white"
                />
                <button type="submit" className="bg-[#00E5FF] text-white py-2 px-4 rounded">
                  Add Project
                </button>
              </form>
            )}
          </motion.div>
        )}
       {loading ? (
  <p className="text-center text-gray-400">Loading...</p>
) : (
  <motion.div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
    <AnimatePresence>
      {projects.length > 0 ? (
        projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isEditing={isEditing}
            onDelete={handleDeleteProject}
            flipped={flippedCard === project.id}
            onFlip={() => setFlippedCard((prev) => (prev === project.id ? null : project.id))}
          />
        ))
      ) : (
        <p className="text-center text-gray-400">No projects available.</p>
      )}
    </AnimatePresence>
  </motion.div>
)}
      </div>
    </motion.section>
  );
};

export default Projects;
