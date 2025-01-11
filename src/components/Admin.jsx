import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  setDoc
} from "firebase/firestore"
import { db } from "../firebase"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { uploadToCloudinary } from "../utils/cloudinary"
import ProjectsSection from "./sections/ProjectsSection"
import ExperiencesSection from "./sections/ExperiencesSection"
import SkillsSection from "./sections/SkillsSection."
import PersonalInfoSection from "./sections/PersonalInfoSection"


const Admin = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    cvLink: "",
    description: ""
  })
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState({ name: "", image: null })
  const [experiences, setExperiences] = useState([])
  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    period: "",
    responsibilities: ""
  })
  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
    responsibilities: "",
    image: null,
    demoUrl: ""
  })
  const [editingSkill, setEditingSkill] = useState(null)
  const [editingExperience, setEditingExperience] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const { user, signIn } = useAuth()
  const navigate = useNavigate()


  useEffect(() => {
    if (user) {
      fetchAllData()
    }
  }, [user])

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchPersonalInfo(),
        fetchSkills(),
        fetchExperiences(),
        fetchProjects()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  

  const fetchPersonalInfo = async () => {
    const personalInfoDoc = await getDoc(doc(db, "personalInfo", "main"))
    if (personalInfoDoc.exists()) {
      setPersonalInfo(personalInfoDoc.data())
    }
  }

  const fetchSkills = async () => {
    const skillsSnapshot = await getDocs(collection(db, "skills"))
    setSkills(
      skillsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    )
  }

  const fetchExperiences = async () => {
    const experiencesSnapshot = await getDocs(collection(db, "experiences"))
    setExperiences(
      experiencesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    )
  }

  const fetchProjects = async () => {
    const projectsSnapshot = await getDocs(collection(db, "projects"))
    setProjects(
      projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    )
  }

  const handleSignIn = async e => {
    e.preventDefault()
    const email = e.currentTarget.elements.namedItem("email").value
    const password = e.currentTarget.elements.namedItem("password").value

    try {
      await signIn(email, password)
      toast.success("Login successful")
      navigate("/admin")
    } catch (error) {
      console.error("Error signing in:", error)
      toast.error(error.message || "Failed to sign in")
    }
  }

  const handlePersonalInfoChange = e => {
    const { name, value } = e.target
    setPersonalInfo(prev => ({ ...prev, [name]: value }))
  }

  const handlePersonalInfoSubmit = async e => {
    e.preventDefault()
    try {
      await setDoc(doc(db, "personalInfo", "main"), personalInfo)
      toast.success("Personal information updated successfully!")
    } catch (error) {
      console.error("Error updating personal info:", error)
      toast.error("Failed to update personal information")
    }
  }

  const handleSkillChange = e => {
    const { name, value, files } = e.target
    setNewSkill(prev => ({
      ...prev,
      [name]: name === "image" ? files?.[0] || null : value
    }))
  }

  const handleAddSkill = async e => {
    e.preventDefault()
    if (newSkill.name.trim() && newSkill.image) {
      try {
        const imageUrl = await uploadToCloudinary(newSkill.image)
        await addDoc(collection(db, "skills"), {
          name: newSkill.name.trim(),
          image: imageUrl
        })
        setNewSkill({ name: "", image: null })
        fetchSkills()
        toast.success("Skill added successfully")
      } catch (error) {
        console.error("Error adding skill:", error)
        toast.error("Failed to add skill")
      }
    } else {
      toast.error("Please provide both skill name and image")
    }
  }

  const handleDeleteSkill = async id => {
    try {
      await deleteDoc(doc(db, "skills", id))
      fetchSkills()
      toast.success("Skill deleted successfully")
    } catch (error) {
      console.error("Error deleting skill:", error)
      toast.error("Failed to delete skill")
    }
  }

  const handleEditSkill = skill => {
    setEditingSkill(skill)
    setNewSkill({ name: skill.name, image: null })
  }

  const handleUpdateSkill = async e => {
    e.preventDefault()
    if (newSkill.name.trim() && editingSkill) {
      try {
        let imageUrl = editingSkill.image
        if (newSkill.image) {
          imageUrl = await uploadToCloudinary(newSkill.image)
        }
        await updateDoc(doc(db, "skills", editingSkill.id), {
          name: newSkill.name.trim(),
          image: imageUrl
        })
        setEditingSkill(null)
        setNewSkill({ name: "", image: null })
        fetchSkills()
        toast.success("Skill updated successfully")
      } catch (error) {
        console.error("Error updating skill:", error)
        toast.error("Failed to update skill")
      }
    } else {
      toast.error("Please provide a skill name")
    }
  }

  const handleExperienceChange = e => {
    const { name, value } = e.target
    setNewExperience(prev => ({ ...prev, [name]: value }))
  }

  const handleExperienceSubmit = async e => {
    e.preventDefault()
    try {
      if (editingExperience) {
        await updateDoc(doc(db, "experiences", editingExperience.id), {
          ...newExperience,
          responsibilities: newExperience.responsibilities
            .split("\n")
            .filter(r => r.trim())
        })
        setEditingExperience(null)
        toast.success("Experience updated successfully")
      } else {
        await addDoc(collection(db, "experiences"), {
          ...newExperience,
          responsibilities: newExperience.responsibilities
            .split("\n")
            .filter(r => r.trim())
        })
        toast.success("Experience added successfully")
      }
      setNewExperience({
        company: "",
        position: "",
        period: "",
        responsibilities: ""
      })
      fetchExperiences()
    } catch (error) {
      console.error("Error adding/updating experience:", error)
      toast.error("Failed to add/update experience")
    }
  }

  const handleDeleteExperience = async id => {
    try {
      await deleteDoc(doc(db, "experiences", id))
      fetchExperiences()
      toast.success("Experience deleted successfully")
    } catch (error) {
      console.error("Error deleting experience:", error)
      toast.error("Failed to delete experience")
    }
  }

  const handleEditExperience = experience => {
    setEditingExperience(experience)
    setNewExperience({
      company: experience.company,
      position: experience.position,
      period: experience.period,
      responsibilities: experience.responsibilities.join("\n")
    })
  }

  const handleProjectChange = e => {
    const { name, value, files } = e.target
    setNewProject(prev => ({
      ...prev,
      [name]: name === "image" ? files?.[0] || null : value
    }))
  }

  const handleProjectSubmit = async e => {
    e.preventDefault()
    try {
      let imageUrl = editingProject ? editingProject.image : null
      if (newProject.image) {
        imageUrl = await uploadToCloudinary(newProject.image)
      }
      const projectData = {
        ...newProject,
        technologies: newProject.technologies
          .split(",")
          .map(tech => tech.trim()),
        responsibilities: newProject.responsibilities
          .split("\n")
          .filter(r => r.trim()),
        image: imageUrl
      }
      if (editingProject) {
        await updateDoc(doc(db, "projects", editingProject.id), projectData)
        setEditingProject(null)
        toast.success("Project updated successfully")
      } else {
        await addDoc(collection(db, "projects"), projectData)
        toast.success("Project added successfully")
      }
      setNewProject({
        title: "",
        description: "",
        technologies: "",
        responsibilities: "",
        image: null,
        demoUrl: ""
      })
      fetchProjects()
    } catch (error) {
      console.error("Error adding/updating project:", error)
      toast.error("Failed to add/update project")
    }
  }

  const handleProjectDelete = async id => {
    try {
      await deleteDoc(doc(db, "projects", id))
      fetchProjects()
      toast.success("Project deleted successfully")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project")
    }
  }

  const handleEditProject = project => {
    setEditingProject(project)
    setNewProject({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(", "),
      responsibilities: project.responsibilities.join("\n"),
      image: null,
      demoUrl: project.demoUrl
    })
  }

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
          <h2 className="text-3xl font-bold mb-6 text-blue-400 text-center">
            Admin Sign In
          </h2>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-300 mb-2 text-sm font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-300 mb-2 text-sm font-medium"
            >
              Password
            </label>
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
    )
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

        <PersonalInfoSection
          personalInfo={personalInfo}
          handlePersonalInfoChange={handlePersonalInfoChange}
          handlePersonalInfoSubmit={handlePersonalInfoSubmit}
        />

        <SkillsSection
          skills={skills}
          newSkill={newSkill}
          editingSkill={editingSkill}
          handleSkillChange={handleSkillChange}
          handleAddSkill={handleAddSkill}
          handleUpdateSkill={handleUpdateSkill}
          handleEditSkill={handleEditSkill}
          handleDeleteSkill={handleDeleteSkill}
        />

        <ExperiencesSection
          experiences={experiences}
          newExperience={newExperience}
          editingExperience={editingExperience}
          handleExperienceChange={handleExperienceChange}
          handleExperienceSubmit={handleExperienceSubmit}
          handleEditExperience={handleEditExperience}
          handleDeleteExperience={handleDeleteExperience}
        />

        <ProjectsSection
          projects={projects}
          newProject={newProject}
          editingProject={editingProject}
          handleProjectChange={handleProjectChange}
          handleProjectSubmit={handleProjectSubmit}
          handleEditProject={handleEditProject}
          handleProjectDelete={handleProjectDelete}
        />
      </div>
    </motion.div>
  )
}

export default React.memo(Admin)
