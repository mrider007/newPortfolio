import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadToCloudinary } from '../utils/cloudinary';

const Admin = () => {
  const [personalInfo, setPersonalInfo] = useState({ name: '', title: '', email: '', phone: '', location: '', cvLink: '' });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', image: null });
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({ company: '', position: '', period: '', responsibilities: '' });
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '', responsibilities: '', image: null,demoUrl: '' });
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    await fetchPersonalInfo();
    await fetchSkills();
    await fetchExperiences();
    await fetchProjects();
  };

  const fetchPersonalInfo = async () => {
    const personalInfoDoc = await getDoc(doc(db, 'personalInfo', 'main'));
    if (personalInfoDoc.exists()) {
      setPersonalInfo(personalInfoDoc.data());
    }
  };

  const fetchSkills = async () => {
    const skillsSnapshot = await getDocs(collection(db, 'skills'));
    setSkills(skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchExperiences = async () => {
    const experiencesSnapshot = await getDocs(collection(db, 'experiences'));
    setExperiences(experiencesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchProjects = async () => {
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    setProjects(projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signIn(email, password);
      toast.success('Login successful');
      navigate('/admin');
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Failed to sign in');
    }
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'personalInfo', 'main'), personalInfo);
      toast.success('Personal information updated successfully!');
    } catch (error) {
      console.error('Error updating personal info:', error);
      toast.error('Failed to update personal information');
    }
  };

  const handleSkillChange = (e) => {
    const { name, value, files } = e.target;
    setNewSkill(prev => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value
    }));
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (newSkill.name.trim() && newSkill.image) {
      try {
        const imageUrl = await uploadToCloudinary(newSkill.image);
        await addDoc(collection(db, 'skills'), {
          name: newSkill.name.trim(),
          image: imageUrl
        });
        setNewSkill({ name: '', image: null });
        fetchSkills();
        toast.success('Skill added successfully');
      } catch (error) {
        console.error('Error adding skill:', error);
        toast.error('Failed to add skill');
      }
    } else {
      toast.error('Please provide both skill name and image');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteDoc(doc(db, 'skills', id));
      fetchSkills();
      toast.success('Skill deleted successfully');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    }
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'experiences'), {
        ...newExperience,
        responsibilities: newExperience.responsibilities.split('\n').filter(r => r.trim())
      });
      setNewExperience({ company: '', position: '', period: '', responsibilities: '' });
      fetchExperiences();
      toast.success('Experience added successfully');
    } catch (error) {
      console.error('Error adding experience:', error);
      toast.error('Failed to add experience');
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await deleteDoc(doc(db, 'experiences', id));
      fetchExperiences();
      toast.success('Experience deleted successfully');
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  const handleProjectChange = (e) => {
    const { name, value, files } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value
    }));
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (newProject.title.trim() && newProject.image) {
      try {
        const imageUrl = await uploadToCloudinary(newProject.image);
        const projectData = {
          ...newProject,
          technologies: newProject.technologies.split(',').map(tech => tech.trim()),
          responsibilities: newProject.responsibilities.split('\n').filter(r => r.trim()),
          image: imageUrl
        };
        await addDoc(collection(db, 'projects'), projectData);
        setNewProject({ title: '', description: '', technologies: '', responsibilities: '', image: null, demoUrl:'' });
        fetchProjects();
        toast.success('Project added successfully');
      } catch (error) {
        console.error('Error adding project:', error);
        toast.error('Failed to add project');
      }
    } else {
      toast.error('Please provide project title and image');
    }
  };

  const handleProjectDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      fetchProjects();
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800"
      >
        <motion.form
          onSubmit={handleSignIn}
          className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-400 text-center">Admin Sign In</h2>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </motion.form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-4xl font-bold text-center text-blue-400 mb-12"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          Admin Dashboard
        </motion.h1>

        {/* Personal Information */}
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

        {/* Skills */}
        <motion.div
          className="bg-gray-800 p-8 rounded-lg shadow-lg mb-12"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-400">Skills</h2>
          <form onSubmit={handleAddSkill} className="mb-6">
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
                <Plus className="mr-2" size={18} />
                Add Skill
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
                <motion.button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="text-red-500 hover:text-red-600"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <Trash2 size={16} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experiences */}
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
                  rows="4"
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
              <Plus className="mr-2" size={18} />
              Add Experience
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
              <motion.button
                onClick={() => handleDeleteExperience(exp.id)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="mr-2" size={18} />
                Delete
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects */}
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
                  rows="3"
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
                  rows="4"
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
              <Plus className="mr-2" size={18} />
              Add Project
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
              <motion.button
                onClick={() => handleProjectDelete(project.id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="mr-2" size={18} />
                Delete
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Admin;

