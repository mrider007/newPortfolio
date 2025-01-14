import React, { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { getDoc, doc } from "firebase/firestore"
import { db } from "../firebase"
import toast from "react-hot-toast"
import emailjs from "emailjs-com"
import DatePicker from "react-datepicker"
import myUI from "."

const Contact = () => {
  const { user } = useAuth()
  const [personalInfo, setPersonalInfo] = useState({
    name: "Mukesh Singh",
    email: "mukesh.singh.sout@gmail.com",
    phone: "+91 9472160290",
    location: "Newtown, Kolkata 700160"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [meetingUrl, setMeetingUrl] = useState("")
  const [meetingDate, setMeetingDate] = useState(new Date())
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false) // Added new state for loading
  const nameInputRef = useRef(null)
  const emailInputRef = useRef(null)
  const controls = useAnimation()

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  }

  const inputVariants = {
    focus: { scale: 1.05, boxShadow: "0 0 0 2px rgba(0, 229, 255, 0.5)" }
  }

  useEffect(() => {
    if (user) {
      fetchPersonalInfo()
    }
    controls.start({ opacity: 1, y: 0 })
  }, [user, controls])

  const fetchPersonalInfo = async () => {
    setIsLoading(true)
    try {
      const personalInfoDoc = await getDoc(doc(db, "personalInfo", "main"))
      if (personalInfoDoc.exists()) {
        setPersonalInfo(personalInfoDoc.data())
      } else {
        toast.error("No personal information found")
      }
    } catch (error) {
      console.error("Error fetching personal info:", error)
      toast.error("Failed to fetch contact information")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMeetingScheduled = async () => {
    setIsSubmitting(true) // Added to set loading state to true
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const userId = import.meta.env.VITE_EMAILJS_USER_ID

    if (!serviceId || !templateId || !userId) {
      console.error("Missing EmailJS environment variables")
      toast.error("Server configuration error. Please try again later.")
      setIsSubmitting(false) // Added to set loading state to false
      return
    }

    if (!userName || !userEmail) {
      toast.error("Please provide your name and email.")
      setIsSubmitting(false) // Added to set loading state to false
      return
    }

    const meetingDetails = {
      from_name: userName,
      from_email: userEmail,
      to_name: personalInfo.name,
      to_email: personalInfo.email,
      message: `Meeting scheduled on ${meetingDate.toLocaleString()} at ${
        personalInfo.location
      }.`,
      meeting_url: meetingUrl || "No meeting URL provided"
    }

    try {
      await emailjs.send(serviceId, templateId, meetingDetails, userId)
      toast.success("Meeting scheduled and email sent successfully!")
      setUserEmail("")
      setUserName("")
      setMeetingDate(new Date())
      setMeetingUrl("")
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error("Failed to send meeting email")
    } finally {
      setIsSubmitting(false) // Added to set loading state to false
    }
  }

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="py-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-white min-h-screen flex items-center"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-center text-[#00E5FF]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Contact Me
        </motion.h2>
        {isLoading ? (
          <p className="text-center text-blue-300">
            Loading contact information...
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              className="space-y-6"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl sm:text-3xl font-semibold text-blue-300">
                Get in Touch
              </h3>
              <p className="text-lg sm:text-xl">
                Feel free to reach out for any opportunities or collaborations.
              </p>
              <div className="space-y-4">
                <motion.p
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center"
                >
                  <span className="material-icons mr-2">email</span>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-blue-500 hover:underline"
                  >
                    {personalInfo.email}
                  </a>
                </motion.p>
                <motion.p
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center"
                >
                  <span className="material-icons mr-2">phone</span>
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="text-blue-500 hover:underline"
                  >
                    {personalInfo.phone}
                  </a>
                </motion.p>
                <motion.p
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center"
                >
                  <span className="material-icons mr-2">location_on</span>
                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(
                      personalInfo.location
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {personalInfo.location}
                  </a>
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              initial={{
                boxShadow: "0 0 25px 5px rgba(0, 229, 255, 0.5)",
                y: 100,
                opacity: 0
              }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <h3
                id="schedule-meeting-heading"
                className="text-2xl sm:text-3xl font-semibold text-blue-300 mb-6"
              >
                Schedule a Meeting
              </h3>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={formVariants}
                custom={0}
                className="mb-6"
              >
                <label
                  htmlFor="userName"
                  className="text-blue-300 font-semibold block mb-2"
                >
                  Your Name:
                </label>
                <motion.input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  placeholder="Enter your name"
                  ref={nameInputRef}
                  whileFocus="focus"
                  variants={inputVariants}
                />
              </motion.div>

              <motion.div variants={formVariants} custom={1} className="mb-6">
                <label
                  htmlFor="userEmail"
                  className="text-blue-300 font-semibold block mb-2"
                >
                  Your Email:
                </label>
                <motion.input
                  type="email"
                  id="userEmail"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  placeholder="Enter your email"
                  ref={emailInputRef}
                  whileFocus="focus"
                  variants={inputVariants}
                />
              </motion.div>

              <motion.div variants={formVariants} custom={2} className="mb-6">
                <label
                  htmlFor="meetingUrl"
                  className="text-blue-300 font-semibold block mb-2"
                >
                  Meeting URL (Google Meet, Skype, Teams, etc.):
                </label>
                <motion.input
                  type="url"
                  id="meetingUrl"
                  value={meetingUrl}
                  onChange={e => setMeetingUrl(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  placeholder="Enter meeting link (optional)"
                  whileFocus="focus"
                  variants={inputVariants}
                />
              </motion.div>

              <motion.div variants={formVariants} custom={3} className="mb-6">
                <label
                  htmlFor="meetingDate"
                  className="text-blue-300 font-semibold block mb-2"
                >
                  Select Meeting Date:
                </label>
                <DatePicker
                  selected={meetingDate}
                  onChange={date => setMeetingDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  calendarClassName="bg-gray-800 border border-gray-700 text-white"
                />
              </motion.div>
              <motion.div
                variants={formVariants}
                custom={4}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <myUI.Button
                  onClick={handleMeetingScheduled}
                  className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 text-sm font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <motion.div
                      className="inline-block"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      ⏳
                    </motion.div>
                  ) : (
                    "Schedule Meeting"
                  )}
                </myUI.Button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.section>
  )
}

export default React.memo(Contact);
