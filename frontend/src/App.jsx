import React, { useState, useEffect } from 'react';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('Consultation'); // 'Consultation', 'Sales', 'Contact'
  const [activeSection, setActiveSection] = useState('about');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Toggle theme mode
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Subtle scroll reveal effect and active section tracking
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.grid > div');
    elements.forEach(el => {
      el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
      observer.observe(el);
    });

    // Track active navigation section on scroll
    const sectionObserverOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, sectionObserverOptions);

    const sections = ['about', 'technology', 'products'];
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });

    return () => {
      elements.forEach(el => observer.unobserve(el));
      sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) sectionObserver.unobserve(section);
      });
    };
  }, []);

  const toggleDarkMode = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleScrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openContactModal = (type) => {
    setModalType(type);
    setSubmitSuccess(false);
    setSubmitError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/v1/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong. Please try again.');
      }

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface selection:bg-primary selection:text-white transition-colors duration-300 min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--nav-border)] shadow-[var(--nav-shadow)] transition-all duration-300">
        <div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/logo.jpg" alt="MV Logo" className="h-10 w-auto rounded-lg object-contain bg-white p-0.5 border border-outline-variant/30" />
            <span className="text-headline-md font-bold text-on-surface dark:text-primary">MV Solutions</span>
          </div>
          <div className="hidden md:flex gap-md items-center">
            <button 
              className={`pb-1 font-label-md text-label-md transition-all ${
                activeSection === 'about' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-on-surface-variant hover:text-primary dark:text-slate-400 dark:hover:text-primary'
              }`}
              onClick={() => handleScrollTo('about')}
            >
              About Us
            </button>
            <button 
              className={`pb-1 font-label-md text-label-md transition-all ${
                activeSection === 'technology' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-on-surface-variant hover:text-primary dark:text-slate-400 dark:hover:text-primary'
              }`}
              onClick={() => handleScrollTo('technology')}
            >
              Technology
            </button>
            <button 
              className={`pb-1 font-label-md text-label-md transition-all ${
                activeSection === 'products' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-on-surface-variant hover:text-primary dark:text-slate-400 dark:hover:text-primary'
              }`}
              onClick={() => handleScrollTo('products')}
            >
              Products
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="material-symbols-outlined text-on-surface-variant hover:text-primary dark:text-primary dark:hover:text-secondary transition-all p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5" 
              onClick={toggleDarkMode}
            >
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </button>
            <button 
              className="btn-interact bg-primary hover:bg-primary/90 text-white dark:text-on-primary px-6 py-2 rounded-full font-label-md text-label-md transition-all active:scale-95 duration-150 shadow-md hover:shadow-lg dark:shadow-[0_0_15px_rgba(0,102,255,0.4)] dark:hover:shadow-[0_0_25px_rgba(0,102,255,0.6)]"
              onClick={() => openContactModal('Contact Us')}
            >
              Contact Us
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 dark:pt-40 pb-24 px-gutter overflow-hidden hero-gradient bg-white dark:bg-transparent">
        <div className="max-w-container-max mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--hero-badge-bg)] border border-[var(--hero-badge-border)] glass-card mb-8 animate-float">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            <span className="text-label-md font-label-md text-primary">Innovative Digital Solutions</span>
          </div>
          <h1 className="font-display-xl text-display-xl mb-6 tracking-tight text-on-surface dark:text-white">
            Transform Your <span className="text-secondary">Business</span><br/>
            <span className="text-primary">Digitally</span>
          </h1>
          <p className="max-w-2xl mx-auto text-body-lg text-on-surface-variant dark:text-slate-300 mb-10">
            MV Services and Solutions helps businesses provide IT solutions and convert their businesses digitally. We provide all types of innovative solutions: websites, Android and iOS Applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button 
              className="btn-interact bg-primary hover:bg-primary/90 text-white dark:text-on-primary px-8 py-4 rounded-xl font-label-md text-label-md flex items-center gap-2 transition-all active:scale-95 shadow-[0_10px_30px_rgba(37,99,235,0.15)] dark:glow-blue dark:shadow-[0_0_20px_rgba(0,102,255,0.5)] dark:hover:shadow-[0_0_40px_rgba(0,102,255,0.7)]"
              onClick={() => openContactModal('Get Started')}
            >
              Get Started <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button 
              className="btn-interact bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-xl font-label-md text-label-md flex items-center gap-2 transition-all active:scale-95 shadow-[0_10px_30px_rgba(182,23,34,0.15)] dark:glow-red dark:shadow-[0_0_20px_rgba(255,0,0,0.5)] dark:hover:shadow-[0_0_40px_rgba(255,0,0,0.7)]"
              onClick={() => handleScrollTo('products')}
            >
              View Our Work <span className="material-symbols-outlined">visibility</span>
            </button>
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-md text-on-surface-variant/60 dark:text-slate-400 font-label-md text-label-md">
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-primary">code</span> WordPress Development</div>
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-secondary">storage</span> MERN Stack</div>
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-primary">smartphone</span> Mobile Apps</div>
          </div>
        </div>
      </section>

      {/* About Us & Stats Section */}
      <section className="py-xl px-gutter bg-surface-container-high dark:bg-on-surface" id="about">
        <div className="max-w-container-max mx-auto text-center">
          <h2 className="font-headline-lg text-headline-lg mb-4 text-primary">About Us</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mb-8 rounded-full dark:shadow-[0_0_10px_rgba(255,0,0,0.5)]"></div>
          <p className="max-w-3xl mx-auto text-body-md text-on-surface-variant dark:text-slate-300 mb-12">
            MV Services and Solutions helps Businesses to provide IT solutions and convert their businesses digitally. We provide all types of innovative solutions: websites, Android and iOS Applications. We believe in making our customer's life easier by providing user friendly and secure applications.
          </p>
          <div className="bg-white dark:bg-transparent border border-outline-variant dark:border-white/10 p-6 rounded-2xl max-w-2xl mx-auto mb-16 italic text-on-surface dark:text-slate-200 shadow-sm glass-card dark:glow-blue">
            "You focus on your business while let us handle your IT and digital needs"
            <span className="block mt-2 text-primary dark:text-secondary font-bold not-italic">Our Motto</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            <div className="p-8 bg-white dark:bg-transparent rounded-2xl border border-outline-variant hover:border-[rgba(0,74,198,0.3)] dark:hover:border-[rgba(0,102,255,0.3)] transition-all glow-blue group dark:glass-card dark:glow-blue-hover">
              <span className="material-symbols-outlined text-4xl text-primary mb-2 group-hover:scale-110 transition-transform">rocket</span>
              <h3 className="text-display-xl font-display-xl text-on-surface dark:text-white">100+</h3>
              <p className="text-label-md text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Projects Delivered</p>
            </div>
            <div className="p-8 bg-white dark:bg-transparent rounded-2xl border border-outline-variant hover:border-[rgba(182,23,34,0.3)] dark:hover:border-[rgba(255,0,0,0.3)] transition-all glow-red group dark:glass-card dark:glow-red-hover">
              <span className="material-symbols-outlined text-4xl text-secondary mb-2 group-hover:scale-110 transition-transform">groups</span>
              <h3 className="text-display-xl font-display-xl text-on-surface dark:text-white">50+</h3>
              <p className="text-label-md text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Happy Clients</p>
            </div>
            <div className="p-8 bg-white dark:bg-transparent rounded-2xl border border-outline-variant hover:border-[rgba(0,74,198,0.3)] dark:hover:border-[rgba(0,102,255,0.3)] transition-all glow-blue group dark:glass-card dark:glow-blue-hover">
              <span className="material-symbols-outlined text-4xl text-primary mb-2 group-hover:scale-110 transition-transform">award_star</span>
              <h3 className="text-display-xl font-display-xl text-on-surface dark:text-white">5+</h3>
              <p className="text-label-md text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Years Experience</p>
            </div>
            <div className="p-8 bg-white dark:bg-transparent rounded-2xl border border-outline-variant hover:border-[rgba(182,23,34,0.3)] dark:hover:border-[rgba(255,0,0,0.3)] transition-all glow-red group dark:glass-card dark:glow-red-hover">
              <span className="material-symbols-outlined text-4xl text-secondary mb-2 group-hover:scale-110 transition-transform">trending_up</span>
              <h3 className="text-display-xl font-display-xl text-on-surface dark:text-white">98%</h3>
              <p className="text-label-md text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-xl px-gutter bg-white dark:bg-on-surface" id="technology">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-secondary mb-2">Technology Stack</h2>
            <p className="text-on-surface-variant dark:text-slate-400 font-body-md">Cutting-edge technologies for modern solutions</p>
          </div>
          <div className="grid md:grid-cols-2 gap-md">
            {/* WordPress Card */}
            <div className="group relative overflow-hidden bg-surface-container-low dark:bg-transparent border border-outline-variant dark:border-white/10 p-xl rounded-3xl hover:shadow-[0_10px_30px_rgba(37,99,235,0.06)] hover:border-primary/50 transition-all duration-500 dark:glass-card dark:glow-blue-hover">
              <div className="absolute top-0 right-0 p-8">
                <span className="material-symbols-outlined text-6xl text-primary/5 dark:text-primary/10 group-hover:text-primary/10 dark:group-hover:text-primary/20 transition-all duration-500">terminal</span>
              </div>
              <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20 dark:shadow-[0_0_20px_rgba(0,102,255,0.5)] group-hover:rotate-6 dark:group-hover:shadow-[0_0_35px_rgba(0,102,255,0.8)] transition-all">
                <span className="material-symbols-outlined text-white text-3xl">code</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface dark:text-white mb-6">WordPress Development</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-on-surface-variant dark:text-slate-300">
                  <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                  Fully responsive design (mobile, tablet, desktop)
                </li>
                <li className="flex items-center gap-3 text-on-surface-variant dark:text-slate-300">
                  <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                  Modern UI/UX aligned with your brand identity
                </li>
                <li className="flex items-center gap-3 text-on-surface-variant dark:text-slate-300">
                  <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                  Easy-to-manage CMS for content updates
                </li>
                <li className="flex items-center gap-3 text-on-surface-variant dark:text-slate-300">
                  <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                  SEO-friendly structure
                </li>
              </ul>
            </div>
            {/* MERN Card */}
            <div className="group relative overflow-hidden bg-surface-container-low dark:bg-transparent border border-outline-variant dark:border-white/10 p-xl rounded-3xl hover:shadow-[0_10px_30px_rgba(182,23,34,0.06)] hover:border-secondary/50 transition-all duration-500 dark:glass-card dark:glow-red-hover">
              <div className="absolute top-0 right-0 p-8">
                <span className="material-symbols-outlined text-6xl text-secondary/5 dark:text-secondary/10 group-hover:text-secondary/10 dark:group-hover:text-secondary/20 transition-all duration-500">dataset</span>
              </div>
              <div className="bg-secondary w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-secondary/20 dark:shadow-[0_0_20px_rgba(255,0,0,0.5)] group-hover:-rotate-6 dark:group-hover:shadow-[0_0_35px_rgba(255,0,0,0.8)] transition-all">
                <span className="material-symbols-outlined text-white text-3xl">layers</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface dark:text-white mb-6">MERN Stack Development</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-on-surface-variant dark:text-slate-300">
                  <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
                  MongoDB, Express.js, React.js, Node.js
                </li>
                <li className="flex items-center gap-3 text-on-surface-variant dark:text-slate-300">
                  <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
                  Fully custom-coded, scalable web application
                </li>
                <li className="flex items-center gap-3 text-on-surface-variant dark:text-slate-300">
                  <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
                  Responsive &amp; performance-optimized design
                </li>
                <li className="flex items-center gap-3 text-on-surface-variant dark:text-slate-300">
                  <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
                  Admin dashboard product management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* USPs Section */}
      <section className="py-xl px-gutter bg-surface-container-high dark:bg-white/[0.02]">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">USPs Of Our Solutions</h2>
            <p className="text-on-surface-variant dark:text-slate-400 font-body-md">Why choose our development approach</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {/* Cards */}
            <div className="bg-white dark:bg-transparent p-6 rounded-2xl border border-outline-variant dark:border-b-2 dark:border-primary hover:bg-white/5 transition-all group dark:glass-card dark:glow-blue-hover cursor-default border-b-4 border-b-primary hover:shadow-md">
              <span className="material-symbols-outlined text-primary text-3xl mb-4 group-hover:rotate-12 transition-transform">settings</span>
              <h4 className="font-bold text-on-surface dark:text-white mb-2">Fully Customizable</h4>
              <p className="text-label-md text-on-surface-variant dark:text-slate-400">Unlike WordPress theme/plugin dependent, MERN allows building every feature from scratch.</p>
            </div>
            <div className="bg-white dark:bg-transparent p-6 rounded-2xl border border-outline-variant dark:border-b-2 dark:border-secondary hover:bg-white/5 transition-all group dark:glass-card dark:glow-red-hover cursor-default border-b-4 border-b-secondary hover:shadow-md">
              <span className="material-symbols-outlined text-secondary text-3xl mb-4 group-hover:rotate-12 transition-transform">trending_up</span>
              <h4 className="font-bold text-on-surface dark:text-white mb-2">High Scalability</h4>
              <p className="text-label-md text-on-surface-variant dark:text-slate-400">Perfect for future growth—easy to integrate new modules like e-commerce, CRM, ERP, or APIs.</p>
            </div>
            <div className="bg-white dark:bg-transparent p-6 rounded-2xl border border-outline-variant dark:border-b-2 dark:border-primary hover:bg-white/5 transition-all group dark:glass-card dark:glow-blue-hover cursor-default border-b-4 border-b-primary hover:shadow-md">
              <span className="material-symbols-outlined text-primary text-3xl mb-4 group-hover:rotate-12 transition-transform">bolt</span>
              <h4 className="font-bold text-on-surface dark:text-white mb-2">Performance Optimized</h4>
              <p className="text-label-md text-on-surface-variant dark:text-slate-400">React ensures lightning-fast front-end rendering and smooth user experience.</p>
            </div>
            <div className="bg-white dark:bg-transparent p-6 rounded-2xl border border-outline-variant dark:border-b-2 dark:border-secondary hover:bg-white/5 transition-all group dark:glass-card dark:glow-red-hover cursor-default border-b-4 border-b-secondary hover:shadow-md">
              <span className="material-symbols-outlined text-secondary text-3xl mb-4 group-hover:rotate-12 transition-transform">security</span>
              <h4 className="font-bold text-on-surface dark:text-white mb-2">Better Security</h4>
              <p className="text-label-md text-on-surface-variant dark:text-slate-400">With Node.js &amp; Express, you get more control over data security compared to plugin systems.</p>
            </div>
            {/* Row 2 */}
            <div className="bg-white dark:bg-transparent p-6 rounded-2xl border border-outline-variant dark:border-b-2 dark:border-primary hover:bg-white/5 transition-all group dark:glass-card dark:glow-blue-hover cursor-default border-b-4 border-b-primary hover:shadow-md">
              <span className="material-symbols-outlined text-primary text-3xl mb-4 group-hover:rotate-12 transition-transform">layers</span>
              <h4 className="font-bold text-on-surface dark:text-white mb-2">Modern Tech Stack</h4>
              <p className="text-label-md text-on-surface-variant dark:text-slate-400">Used by global tech companies (Netflix, Uber, PayPal), ensuring future-ready development.</p>
            </div>
            <div className="bg-white dark:bg-transparent p-6 rounded-2xl border border-outline-variant dark:border-b-2 dark:border-secondary hover:bg-white/5 transition-all group dark:glass-card dark:glow-red-hover cursor-default border-b-4 border-b-secondary hover:shadow-md">
              <span className="material-symbols-outlined text-secondary text-3xl mb-4 group-hover:rotate-12 transition-transform">dashboard</span>
              <h4 className="font-bold text-on-surface dark:text-white mb-2">Advanced Admin Dashboard</h4>
              <p className="text-label-md text-on-surface-variant dark:text-slate-400">A tailored backend to manage products, content, or customer data seamlessly.</p>
            </div>
            <div className="bg-white dark:bg-transparent p-6 rounded-2xl border border-outline-variant dark:border-b-2 dark:border-primary hover:bg-white/5 transition-all group dark:glass-card dark:glow-blue-hover cursor-default border-b-4 border-b-primary hover:shadow-md">
              <span className="material-symbols-outlined text-primary text-3xl mb-4 group-hover:rotate-12 transition-transform">devices</span>
              <h4 className="font-bold text-on-surface dark:text-white mb-2">SEO &amp; Mobile Friendly</h4>
              <p className="text-label-md text-on-surface-variant dark:text-slate-400">React supports server-side rendering (SSR) for improved SEO and fast mobile responsiveness.</p>
            </div>
            <div className="bg-white dark:bg-transparent p-6 rounded-2xl border border-outline-variant dark:border-b-2 dark:border-secondary hover:bg-white/5 transition-all group dark:glass-card dark:glow-red-hover cursor-default border-b-4 border-b-secondary hover:shadow-md">
              <span className="material-symbols-outlined text-secondary text-3xl mb-4 group-hover:rotate-12 transition-transform">verified</span>
              <h4 className="font-bold text-on-surface dark:text-white mb-2">Long-Term Value</h4>
              <p className="text-label-md text-on-surface-variant dark:text-slate-400">Initial cost &amp; timeline are higher, but maintenance is easier and long-term ROI is better.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="py-xl px-gutter bg-white dark:bg-on-surface" id="products">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg mb-4 text-on-surface dark:text-white">Our <span className="text-secondary">Products</span></h2>
            <p className="max-w-2xl mx-auto text-on-surface-variant dark:text-slate-400">
              Attendance Tracking System — A smart workforce management solution designed for organizations to monitor employee attendance using real-time GPS location tracking.
            </p>
          </div>
          {/* Product Showcase Grid */}
          <div className="grid lg:grid-cols-12 gap-gutter items-start">
            <div className="lg:col-span-8 space-y-md">
              <div className="bg-surface-container-low dark:bg-transparent border border-outline-variant dark:border-white/10 p-md rounded-2xl dark:glass-card dark:glow-blue">
                <h4 className="text-primary font-bold mb-4">Solution Overview</h4>
                <p className="text-label-md text-on-surface-variant dark:text-slate-300">The system captures live Google location coordinates during Check-In and Check-Out and compares them with predefined office or project site coordinates configured by the administrator.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                  <div className="flex flex-col items-center p-4 rounded-xl bg-[var(--card-primary-bg)] border border-[var(--card-primary-border)] hover:border-[var(--card-primary-hover-border)] hover:bg-[var(--card-primary-hover-bg)] transition-colors">
                    <span className="material-symbols-outlined text-primary mb-2">smartphone</span>
                    <span className="text-[12px] text-center font-bold dark:text-slate-300">Android Application</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-[var(--card-secondary-bg)] border border-[var(--card-secondary-border)] hover:border-[var(--card-secondary-hover-border)] hover:bg-[var(--card-secondary-hover-bg)] transition-colors">
                    <span className="material-symbols-outlined text-secondary mb-2">phone_iphone</span>
                    <span className="text-[12px] text-center font-bold dark:text-slate-300">iOS Application</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-[var(--card-primary-bg)] border border-[var(--card-primary-border)] hover:border-[var(--card-primary-hover-border)] hover:bg-[var(--card-primary-hover-bg)] transition-colors">
                    <span className="material-symbols-outlined text-primary mb-2">laptop_mac</span>
                    <span className="text-[12px] text-center font-bold dark:text-slate-300">Admin Panel</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-[var(--card-secondary-bg)] border border-[var(--card-secondary-border)] hover:border-[var(--card-secondary-hover-border)] hover:bg-[var(--card-secondary-hover-bg)] transition-colors">
                    <span className="material-symbols-outlined text-secondary mb-2">database</span>
                    <span className="text-[12px] text-center font-bold dark:text-slate-300">Secure Database</span>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-gutter">
                <div className="bg-white dark:bg-transparent p-6 rounded-2xl border border-outline-variant dark:border-l-4 dark:border-primary hover:border-l-8 hover:shadow-md transition-all border-l-4 border-l-primary dark:glass-card">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary">my_location</span>
                    <h4 className="font-bold text-on-surface dark:text-white">Live GPS Attendance</h4>
                  </div>
                  <p className="text-label-md text-on-surface-variant dark:text-slate-400">Employees can mark Check-In and Check-Out with live GPS coordinates, timestamp, and device details captured automatically.</p>
                </div>
                <div className="bg-white dark:bg-transparent p-6 rounded-2xl border border-outline-variant dark:border-l-4 dark:border-secondary hover:border-l-8 hover:shadow-md transition-all border-l-4 border-l-secondary dark:glass-card">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-secondary">location_on</span>
                    <h4 className="font-bold text-on-surface dark:text-white">Geo-Location Validation</h4>
                  </div>
                  <p className="text-label-md text-on-surface-variant dark:text-slate-400">System compares live coordinates with saved office/project site locations and validates attendance within configured radius.</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-md">
              <div className="bg-surface-container-low dark:bg-transparent border border-outline-variant dark:border-white/10 p-6 rounded-2xl dark:glass-card dark:glow-red">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <h4 className="font-bold text-on-surface dark:text-white">Security Features</h4>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2 text-label-md text-on-surface-variant dark:text-slate-400"><span className="material-symbols-outlined text-primary text-xs">done</span> SSL Secure APIs</li>
                  <li className="flex items-center gap-2 text-label-md text-on-surface-variant dark:text-slate-400"><span className="material-symbols-outlined text-primary text-xs">done</span> Device Binding</li>
                  <li className="flex items-center gap-2 text-label-md text-on-surface-variant dark:text-slate-400"><span className="material-symbols-outlined text-primary text-xs">done</span> GPS Mock Detection</li>
                  <li className="flex items-center gap-2 text-label-md text-on-surface-variant dark:text-slate-400"><span className="material-symbols-outlined text-primary text-xs">done</span> Anti-Spoofing Detection</li>
                </ul>
              </div>
              <div className="bg-[rgba(0,74,198,0.05)] dark:bg-transparent border border-[rgba(0,74,198,0.2)] dark:border-t-2 dark:border-secondary p-6 rounded-2xl dark:glass-card dark:glow-red-hover">
                <h4 className="font-bold mb-4 text-primary dark:text-white">Technology Stack</h4>
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h5 className="text-[12px] font-bold text-on-surface dark:text-primary uppercase tracking-tighter mb-1 dark:mb-2">Mobile</h5>
                    <p className="text-label-md text-on-surface-variant dark:text-slate-400">Kotlin / Java • Swift / SwiftUI • Google Maps SDK</p>
                  </div>
                  <div>
                    <h5 className="text-[12px] font-bold text-on-surface dark:text-secondary uppercase tracking-tighter mb-1 dark:mb-2">Backend</h5>
                    <p className="text-label-md text-on-surface-variant dark:text-slate-400">Node.js / Laravel / .NET • RESTful APIs • MySQL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-xl px-gutter bg-surface-container-low dark:bg-on-surface" id="contact">
        <div className="max-w-container-max mx-auto rounded-3xl overflow-hidden relative p-xl text-center bg-gradient-to-r from-primary via-on-surface to-secondary text-white dark:bg-gradient-to-br dark:from-[rgba(0,102,255,0.2)] dark:via-[#0a0e17] dark:to-[rgba(255,0,0,0.2)] border dark:border-white/10 dark:glow-blue shadow-2xl">
          <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none"></div>
          <div className="relative z-10 animate-fade-in">
            <span className="inline-flex items-center gap-2 text-white dark:text-primary font-bold mb-4 bg-white/10 dark:bg-transparent px-4 py-1 rounded-full backdrop-blur-sm">
              <span className="material-symbols-outlined">auto_awesome</span>
              Let's Build Something Amazing Together
            </span>
            <h2 className="text-display-xl font-display-xl mb-6">Ready to Transform Your Business?</h2>
            <p className="max-w-2xl mx-auto text-white/80 dark:text-slate-400 mb-10 text-body-lg">
              Let us handle your IT and digital needs while you focus on growing your business. Our team of experts is ready to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-md sm:gap-6">
              <button 
                className="btn-interact bg-white text-on-surface hover:bg-slate-200 dark:bg-white dark:text-[#0a0e17] dark:hover:bg-slate-200 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                onClick={() => openContactModal('Consultation')}
              >
                <span className="material-symbols-outlined">support_agent</span> Get a Free Consultation
              </button>
              <button 
                className="btn-interact bg-secondary text-white border border-white/20 hover:bg-secondary/90 dark:hover:brightness-110 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg dark:shadow-[0_0_20px_rgba(255,0,0,0.4)] dark:hover:shadow-[0_0_35px_rgba(255,0,0,0.6)]"
                onClick={() => openContactModal('Sales')}
              >
                <span className="material-symbols-outlined">mail</span> Contact Sales
              </button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-md text-white/60 dark:text-slate-500 text-sm">
              <span>✓ 24/7 Support</span>
              <span>✓ 100% Satisfaction Guarantee</span>
              <span>✓ Free Consultation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-white/[0.03] pt-xl pb-gutter border-t border-outline-variant/30 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-xl text-left">
          <div className="col-span-1 md:col-span-1">
            <img src="/logo.jpg" alt="MV Logo" className="h-14 w-auto rounded-lg object-contain bg-white p-1 border border-outline-variant/30 mb-6" />
            <p className="text-on-surface-variant dark:text-slate-400 font-body-md mb-6">
              Providing innovative IT solutions and converting businesses digitally with cutting-edge technologies.
            </p>
            <div className="flex gap-4">
              <button 
                className="btn-interact w-10 h-10 rounded-full border border-outline-variant dark:border-[rgba(0,102,255,0.3)] dark:glass-card flex items-center justify-center hover:bg-primary hover:text-white dark:text-primary dark:hover:text-secondary hover:border-primary transition-all group"
                onClick={() => openContactModal('General')}
              >
                <span className="material-symbols-outlined text-on-surface-variant dark:text-primary group-hover:text-white">share</span>
              </button>
              <button 
                className="btn-interact w-10 h-10 rounded-full border border-outline-variant dark:border-[rgba(0,102,255,0.3)] dark:glass-card flex items-center justify-center hover:bg-primary hover:text-white dark:text-primary dark:hover:text-secondary hover:border-primary transition-all group"
                onClick={() => openContactModal('General')}
              >
                <span className="material-symbols-outlined text-on-surface-variant dark:text-primary group-hover:text-white">alternate_email</span>
              </button>
            </div>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface dark:text-white mb-6">Services</h4>
            <ul className="space-y-4 text-on-surface-variant dark:text-slate-400 font-body-md">
              <li><button className="hover:text-primary transition-colors cursor-pointer text-left" onClick={() => openContactModal('WordPress Services')}>WordPress Development</button></li>
              <li><button className="hover:text-primary transition-colors cursor-pointer text-left" onClick={() => openContactModal('MERN Stack Services')}>MERN Stack Development</button></li>
              <li><button className="hover:text-primary transition-colors cursor-pointer text-left" onClick={() => openContactModal('Mobile App Services')}>Mobile App Development</button></li>
              <li><button className="hover:text-primary transition-colors cursor-pointer text-left" onClick={() => openContactModal('Custom Solutions')}>Custom Solutions</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface dark:text-white mb-6">Products</h4>
            <ul className="space-y-4 text-on-surface-variant dark:text-slate-400 font-body-md">
              <li><button className="hover:text-primary transition-colors cursor-pointer text-left" onClick={() => handleScrollTo('products')}>Attendance Tracking System</button></li>
              <li><button className="hover:text-primary transition-colors cursor-pointer text-left" onClick={() => handleScrollTo('products')}>GPS-Based Solutions</button></li>
              <li><button className="hover:text-primary transition-colors cursor-pointer text-left" onClick={() => handleScrollTo('products')}>Admin Dashboards</button></li>
              <li><button className="hover:text-primary transition-colors cursor-pointer text-left" onClick={() => handleScrollTo('products')}>Enterprise Solutions</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface dark:text-white mb-6">Contact Us</h4>
            <ul className="space-y-4 text-on-surface-variant dark:text-slate-400 font-body-md">
              <li className="flex gap-3"><span className="material-symbols-outlined text-primary font-bold">mail</span> info@mvservices.com</li>
              <li className="flex gap-3">
                <a href="https://wa.me/918882693978" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex gap-3 items-center">
                  <span className="material-symbols-outlined text-primary font-bold">chat</span> WhatsApp: +91 88826 93978
                </a>
              </li>
              <li className="flex gap-3"><span className="material-symbols-outlined text-primary font-bold">location_on</span> Address - Greater Noida West, Noida</li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max mx-auto px-gutter mt-xl pt-gutter border-t border-[rgba(203,213,225,0.2)] dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-label-md text-on-surface-variant dark:text-slate-500">© 2024 MV Services &amp; Solution. All rights reserved.</p>
          <div className="flex gap-6 text-label-md text-on-surface-variant dark:text-slate-500">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Back to top Button */}
      <button 
        className="fixed bottom-gutter right-gutter w-12 h-12 bg-primary text-white dark:text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 shadow-primary/30 dark:shadow-[0_0_20px_rgba(0,102,255,0.5)] dark:glow-blue-hover group" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span className="material-symbols-outlined group-hover:animate-bounce">arrow_upward</span>
      </button>

      {/* Beautiful Glassmorphic Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl p-8 glass-card border border-white/20 shadow-2xl bg-white dark:bg-[#0d1321] text-on-surface dark:text-white transition-all duration-300">
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              onClick={() => setIsModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h3 className="text-headline-md font-bold mb-2">Thank You!</h3>
                <p className="text-on-surface-variant dark:text-slate-300 mb-6">
                  Your request for <strong>{modalType}</strong> has been successfully received. We will get back to you shortly.
                </p>
                <button 
                  className="bg-primary text-white dark:text-on-primary px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-headline-md font-bold mb-2">{modalType}</h3>
                <p className="text-on-surface-variant dark:text-slate-300 mb-6">
                  Please fill out the form below. Our team will contact you to proceed.
                </p>

                {submitError && (
                  <div className="p-4 mb-4 rounded-xl bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="name">Full Name *</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="phone">Phone Number *</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="message">Message / Business Details *</label>
                    <textarea 
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell us about your digital needs or ideas..."
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface dark:text-white resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full btn-interact bg-primary text-white dark:text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    {!isSubmitting && <span className="material-symbols-outlined text-sm">send</span>}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
