import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadToCloudinary } from '../utils/cloudinary';
import Skills from './Skills';

const Admin = () => {
  const [personalInfo, setPersonalInfo] = useState({ name: '', title: '', email: '', phone: '', location: '' });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({ company: '', position: '', period: '', responsibilities: '' });
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '' });
  const [skillImage, setSkillImage] = useState(null);
  const [projectImage, setProjectImage] = useState(null);
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

  const validateInputs = (email, password) => {
    if (!email || !password) {
      toast.error('Both email and password are required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!validateInputs(email, password)) return;

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
    await setDoc(doc(db, 'personalInfo', 'main'), personalInfo);
    alert('Personal information updated successfully!');
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (newSkill.trim() && skillImage) {
      // const imageUrl = await uploadToCloudinary(skillImage);
      await addDoc(collection(db, 'skills'), {
        name: newSkill.trim(),
        image: imageUrl // Save the Cloudinary URL in Firebase
      });
      setNewSkill('');
      setSkillImage(null); // Reset the image input
      fetchSkills();
    }
  };


  const handleDeleteSkill = async (id) => {
    await deleteDoc(doc(db, 'skills', id));
    fetchSkills();
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'experiences'), {
      ...newExperience,
      responsibilities: newExperience.responsibilities.split('\n').filter(r => r.trim())
    });
    setNewExperience({ company: '', position: '', period: '', responsibilities: '' });
    fetchExperiences();
  };

  const handleDeleteExperience = async (id) => {
    await deleteDoc(doc(db, 'experiences', id));
    fetchExperiences();
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (newProject.title.trim() && projectImage) {
      // const imageUrl = await uploadToCloudinary(projectImage);
      const projectData = {
        ...newProject,
        technologies: newProject.technologies.split(',').map(tech => tech.trim()),
        image: imageUrl
      };
      await addDoc(collection(db, 'projects'), projectData);
      setNewProject({ title: '', description: '', technologies: '' });
      setProjectImage(null);
      fetchProjects();
    }
  };


  const handleProjectDelete = async (id) => {
    await deleteDoc(doc(db, 'projects', id));
    fetchProjects();
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
              <div className="md:col-span-2">
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
            <div className="flex">
              {/* <input
                type="file"
                onChange={(e) => setSkillImage(e.target.files[0])}
                className="mt-4 px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              /> */}
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a new skill"
                className="flex-grow px-4 py-2 text-gray-300 bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
              <motion.button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-r-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="mr-2" size={18} />
                Add Skill
              </motion.button>
            </div>
          </form>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <motion.div
                key={skill.id}
                className="bg-gray-700 rounded-full px-3 py-1 flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-gray-300">{skill.name}</span>
              {/* {
              skill&& skill?.image && <img src={skill.image} alt={skill.name} className="w-20 h-20 object-cover rounded-full" />
              }  */}
                <motion.button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="ml-2 text-red-500 hover:text-red-600"
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
              {/* <input
                type="file"
                onChange={(e) => setProjectImage(e.target.files[0])}
                className="mt-4 px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              /> */}
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
              {/* {
              project&& project?.image && <img src={project.image} alt={project.name} className="w-20 h-20 object-cover rounded-full" />
              }  */}
              <h3 className="text-xl font-semibold text-blue-300">{project.title}</h3>
              <p className="text-gray-300 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">{tech}</span>
                ))}
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

