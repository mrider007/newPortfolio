
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

const Header = () => {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({ name: "Mukesh Kumar Singh" });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const fetchPersonalInfo = async () => {
      try {
        const personalInfoDoc = await getDoc(doc(db, "personalInfo", "main"));
        if (personalInfoDoc.exists()) {
          setPersonalInfo(personalInfoDoc.data());
        }
      } catch (error) {
        console.error("Error fetching personal info:", error);
      }
    };

    window.addEventListener("scroll", handleScroll);
    fetchPersonalInfo();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  const headerVariants = {
    hidden: { y: -100 },
    visible: { y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0, transition: { type: "tween", duration: 0.3 } },
  };

  const iconVariants = {
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#020817] shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#00E5FF]">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {personalInfo.name}
          </motion.span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          {navItems.map((item, index) => (
            <motion.li
              key={item.name}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <a
                href={item.href}
                className="text-white hover:text-[#00E5FF] transition-colors duration-300"
              >
                {item.name}
              </a>
            </motion.li>
          ))}
          {user ? (
            <>
              <motion.li variants={navItemVariants}>
                <Link
                  href="/admin"
                  className="text-white hover:text-[#00E5FF] transition-colors duration-300"
                >
                  Admin
                </Link>
              </motion.li>
              <motion.li variants={navItemVariants}>
                <button
                  onClick={signOut}
                  className="text-white hover:text-[#00E5FF] transition-colors duration-300"
                >
                  Sign Out
                </button>
              </motion.li>
            </>
          ) : (
            <motion.li variants={navItemVariants}>
              <Link
                href="/admin"
                className="text-white hover:text-[#00E5FF] transition-colors duration-300"
              >
                Sign In
              </Link>
            </motion.li>
          )}
          <motion.li variants={navItemVariants}>
            <a
              href="https://github.com/mrider007"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#00E5FF] transition-colors duration-300"
            >
              <motion.div variants={iconVariants} whileHover="hover" whileTap="tap">
                <Github size={24} />
              </motion.div>
            </a>
          </motion.li>
          <motion.li variants={navItemVariants}>
            <a
              href="https://www.linkedin.com/in/mukesh-singh-49054023a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#00E5FF] transition-colors duration-300"
            >
              <motion.div variants={iconVariants} whileHover="hover" whileTap="tap">
                <Linkedin size={24} />
              </motion.div>
            </a>
          </motion.li>
        </ul>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="fixed inset-y-0 right-0 w-64 bg-[#020817] shadow-lg md:hidden"
          >
            <motion.button
              className="absolute top-4 right-4 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <X size={24} />
            </motion.button>
            <ul className="flex flex-col space-y-4 p-6 pt-20">
              {navItems.map((item) => (
                <motion.li
                  key={item.name}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={item.href}
                    className="text-white hover:text-[#00E5FF] transition-colors duration-300 block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </motion.li>
              ))}
              {user ? (
                <>
                  <motion.li whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/admin"
                      className="text-white hover:text-[#00E5FF] transition-colors duration-300 block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-white hover:text-[#00E5FF] transition-colors duration-300 block"
                    >
                      Sign Out
                    </button>
                  </motion.li>
                </>
              ) : null}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
