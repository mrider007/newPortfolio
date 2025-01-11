import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import "react-datepicker/dist/react-datepicker.css";
import { Loader } from 'lucide-react';

// Lazy-loaded components
const Hero = React.lazy(() => import('./components/Hero'));
const Projects = React.lazy(() => import('./components/Projects'));
const Skills = React.lazy(() => import('./components/Skills'));
const Experience = React.lazy(() => import('./components/Experience'));
const Contact = React.lazy(() => import('./components/Contact'));
const Admin = React.lazy(() => import('./components/Admin'));

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-900 text-white min-h-screen">
          <Header />
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <Hero />
                      <Skills />
                      <Experience />
                      <Projects />
                      <Contact />
                    </motion.div>
                  </Suspense>
                }
              />
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      <Admin />
                    </motion.div>
                  </Suspense>
                }
              />
            </Routes>
          </AnimatePresence>
        </div>
        <Toaster position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

// Fallback UI while components load
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        initial={{ scale: 0.5, opacity: 0.8 }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.8, 1, 0.8],
          boxShadow: [
            '0 0 10px rgba(0, 255, 255, 0.6)',
            '0 0 20px rgba(0, 255, 255, 0.8)',
            '0 0 10px rgba(0, 255, 255, 0.6)',
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="p-6 rounded-full"
        style={{
          background:
            'linear-gradient(135deg, rgba(0, 229, 255, 0.5), rgba(0, 229, 255, 0.8))',
        }}
      >
        <Loader size={50} className="text-cyan-500 animate-spin" />
      </motion.div>
      <motion.div
        initial={{ y: 10, opacity: 0.6 }}
        animate={{ y: [-10, 10], opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="mt-4 text-cyan-400 text-lg font-semibold neon-text"
      >
        Loading, please wait...
      </motion.div>
    </div>
  );
}

export default App;
