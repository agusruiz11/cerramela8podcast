
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoWhite from '../assets/images/logo/logo_white.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  }, []);

  const navItems = useMemo(() => [
    { label: 'NEWSLETTER', id: 'newsletter', highlight: false },
    { label: 'CONTACTO', id: 'contacto', highlight: false },
    { label: 'ESCUCHANOS', id: 'escuchanos', highlight: true }
  ], []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
      <div className="container mx-auto px-6 md:px-12 py-8 flex items-start justify-between">
        {/* Logo - Image Replacement */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-auto cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src={logoWhite}
            alt="Cerrame la 8 Podcast"
            className="h-6 md:h-12 object-contain select-none"
            draggable={false}
            loading="eager"
            fetchpriority="high"
          />
        </motion.div>

        {/* Desktop Navigation - Plain Text */}
        <nav className="hidden md:flex items-center gap-10 pointer-events-auto pt-1">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => scrollToSection(item.id)}
              className={`font-archivo text-sm font-extrabold tracking-widest transition-colors duration-300 ${
                item.highlight ? 'text-[#2A51F4]' : 'text-white hover:text-white/70'
              }`}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden pointer-events-auto">
          <button
            className="text-white hover:text-[#2A51F4] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0B1020] border-b border-white/10 pointer-events-auto absolute top-full left-0 right-0 shadow-xl"
          >
            <div className="flex flex-col p-6 gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-archivo font-bold text-lg uppercase text-left ${
                    item.highlight ? 'text-[#2A51F4]' : 'text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
