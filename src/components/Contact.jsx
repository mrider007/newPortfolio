import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import emailjs from 'emailjs-com';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRef } from 'react';

const Contact = () => {
  const { user } = useAuth();
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Mukesh Singh',
    email: 'mukesh.singh.sout@gmail.com',
    phone: '+91 9472160290',
    location: 'Newtown, Kolkata 700160',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date()); // Default to current date and time
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchPersonalInfo();
    }
  }, [user]);

  const fetchPersonalInfo = async () => {
    setIsLoading(true);
    try {
      const personalInfoDoc = await getDoc(doc(db, 'personalInfo', 'main'));
      if (personalInfoDoc.exists()) {
        setPersonalInfo(personalInfoDoc.data());
      } else {
        toast.error('No personal information found');
      }
    } catch (error) {
      console.error('Error fetching personal info:', error);
      toast.error('Failed to fetch contact information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMeetingScheduled = () => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const userId = import.meta.env.VITE_EMAILJS_USER_ID;

    if (!serviceId || !templateId || !userId) {
      console.error('Missing EmailJS environment variables');
      toast.error('Server configuration error. Please try again later.');
      return;
    }

    if (!userName || !userEmail) {
      toast.error('Please provide your name and email.');
      return;
    }

    const meetingDetails = {
      from_name: userName,
      from_email: userEmail,
      to_name: personalInfo.name,
      to_email: personalInfo.email,
      message: `Meeting scheduled on ${meetingDate.toLocaleString()} at ${personalInfo.location}.`,
      meeting_url: meetingUrl || 'No meeting URL provided',
    };

    emailjs
      .send(serviceId, templateId, meetingDetails, userId)
      .then(() => {
        toast.success('Meeting scheduled and email sent successfully!');
        setUserEmail('')
        setUserName('')
        setMeetingDate(new Date())
        setMeetingUrl('')
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        toast.error('Failed to send meeting email');
      });
  };

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="py-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-white"
    >
      <div className="container mx-auto px-6">
         <motion.h2
                  className="text-4xl font-bold mb-12 text-center text-[#00E5FF]"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Contact Me
                </motion.h2>
        {isLoading ? (
          <p className="text-center text-blue-300">Loading contact information...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-blue-300">Get in Touch</h3>
              <p className="text-lg">
                Feel free to reach out for any opportunities or collaborations.
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong>{' '}
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-blue-500 hover:underline"
                  >
                    {personalInfo.email}
                  </a>
                </p>
                <p>
                  <strong>Phone:</strong>{' '}
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="text-blue-500 hover:underline"
                  >
                    {personalInfo.phone}
                  </a>
                </p>
                <p>
                  <strong>Location:</strong>{' '}
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
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3
                id="schedule-meeting-heading"
                className="text-2xl font-semibold text-blue-300 mb-4"
              >
                Schedule a Meeting
              </h3>

              <div className="mb-4">
                <label
                  htmlFor="userName"
                  className="text-blue-300 font-semibold"
                >
                  Your Name:
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
                  placeholder="Enter your name"
                  ref={nameInputRef}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="userEmail"
                  className="text-blue-300 font-semibold"
                >
                  Your Email:
                </label>
                <input
                  type="email"
                  id="userEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
                  placeholder="Enter your email"
                  ref={emailInputRef}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="meetingUrl"
                  className="text-blue-300 font-semibold"
                >
                  Meeting URL (Google Meet, Skype, Teams, etc.):
                </label>
                <input
                  type="url"
                  id="meetingUrl"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
                  placeholder="Enter meeting link (optional)"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="meetingDate"
                  className="text-blue-300 font-semibold m-2"
                >
                  Select Meeting Date:
                </label>
                <DatePicker
                  selected={meetingDate}
                  onChange={(date) => setMeetingDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
                  calendarClassName="custom-datepicker" // Custom class for datepicker
                />
              </div>

              <button
                onClick={handleMeetingScheduled}
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded mt-4"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Contact;
