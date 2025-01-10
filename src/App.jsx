import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Admin from './components/Admin';
import { AuthProvider } from './contexts/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-900 text-white min-h-screen">
          <Header />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Skills />
                  <Experience />
                  <Projects />
                  <Contact />
                </>
              } />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </AnimatePresence>
        </div>
        <Toaster position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;

