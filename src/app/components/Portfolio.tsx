"use client";

import React, { useRef } from "react";
import { useState, useEffect } from "react";
import styles from "./Portfolio.module.css";
import SplashCursor from "./SplashCursor";
import LetterGlitch from "./LetterGlitch";
import emailjs from '@emailjs/browser';

const Portfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const skillCategories = [
    {
      title: "Programming Languages",
      skills: ["HTML", "CSS", "JavaScript", "PHP", "TypeScript", "C#", "Dart"],
    },
    {
      title: "Frameworks",
      skills: [
        "Bootstrap",
        "Tailwind",
        "Sass",
        "Next.js",
        "Laravel",
        "Flutter",
        "React",
      ],
    },
    {
      title: "Database",
      skills: ["MySQL", "Firebase", "SQL Server"],
    },
    {
      title: "CMS & E-Commerce",
      skills: ["WordPress", "Shopify"],
    },
    {
      title: "DevOps & Tools",
      skills: ["Git", "GitHub Actions", "Docker", "Vite", "Webpack", "Postman"],
    },
    {
      title: "Design & IDE",
      skills: ["Figma", "VSCode", "Visual Studio"],
    },
  ];

  const mainSkills = [
    { name: "HTML/CSS", level: 95 },
    { name: "JavaScript", level: 80 },
    { name: "WordPress", level: 80 },
    { name: "Shopify", level: 80 },
    { name: "Tailwind CSS", level: 95 },
    { name: "React", level: 80 },
    { name: "Next.js", level: 80 },
    { name: "PHP/Laravel", level: 75 },
  ];
  //color: magenta, cyan, yellow,
  const projects = [
    {
      title: "CLBC Website",
      description:
        "A modern, responsive church website designed to improve digital presence, provide ministry information, and enhance community engagement.",
      tech: [
        "Next.js",
        "Supabase",
        "CSS",
        "Responsive Web Design",
        "Vercel DEployment",
        "Git Version Control",
      ],
      link: "https://clbc.netlify.app/",
      image: "/images/projects/proj-clbc.png",
      color: "cyan",
    },
    {
      title: "HRIS Project",
      description:
        "Human Resource Information System with employee management, attendance tracking, and payroll features.",
      tech: ["Laravel", "React", "MySQL", "Tailwind", "Typescript"],
      link: "https://hris.hipe.asia/",
      image: "/images/projects/proj-hris.png",
      color: "magenta",
    },
  ];

  const certifications = [
    {
      title: "Foundations of User Experience (UX) Design",
      issuer: "Google",
      date: "May 2024",
    },
    {
      title: "Start the UX Design Process: Empathize, Define, and Ideate",
      issuer: "Google",
      date: "Jun 2024",
    },
  ];

  const services = [
    "Frontend development (HTML, CSS, JavaScript)",
    "Responsive design (mobile, tablet, desktop)",
    "UI/UX improvements and clean layouts",
    "Shopify theme customization and fixes",
    "WordPress theme customization and fixes",
    "Bug fixing and performance improvements",
    "Converting Figma/PSD designs to code",
  ];

  const whyWorkWithMe = [
    "Simple and clean code",
    "Good communication and quick replies",
    "On-time delivery",
    "Attention to details",
    "Professional and collaborative attitude",
    "Adaptable to project requirements",
    "Solution-oriented mindset",
    "Committed to quality results",
  ];

  const handleProjectLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);
}, []);

  const formRef = useRef<HTMLFormElement>(null);
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
const [toast, setToast] = useState<{
  message: string;
  type: "success" | "error";
  visible: boolean;
}>({
  message: "",
  type: "success",
  visible: false,
});
const showToast = (message: string, type: "success" | "error") => {
  setToast({ message, type, visible: true });

  setTimeout(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, 3500);
};


const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  emailjs.sendForm(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    formRef.current!,
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  )
  .then(() => {
    setSubmitStatus('success');
    setIsSubmitting(false);
    formRef.current?.reset();
    showToast("Message sent successfully!", "success");
  })
  .catch((error) => {
    console.error('EmailJS Error:', error);
    setSubmitStatus('error');
    setIsSubmitting(false);
    showToast("Failed to send message. Please try again.", "error");
  });
};

  return (
    <div
      className={`${styles.portfolio} ${isDarkMode ? styles.dark : styles.light}`}
    >
      <SplashCursor />

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${scrollProgress}%` }}
        />
        <div
          className={styles.progressGlow}
          style={{ left: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <div className={styles.logoContainer}>
              <span className={styles.logoText}>AK</span>
              <span className={styles.logoBracket}>&lt;/&gt;</span>
              <div className={styles.logoGlitch} data-text="AK">
                AK
              </div>
            </div>
          </div>

          <div
            className={`${styles.navLinks} ${isMenuOpen ? styles.navOpen : ""}`}
          >
            <button
              onClick={() => scrollToSection("hero")}
              className={styles.navLink}
            >
              <span className={styles.navLinkText}>Home</span>
              <span className={styles.navLinkGlitch}>Home</span>
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={styles.navLink}
            >
              <span className={styles.navLinkText}>About</span>
              <span className={styles.navLinkGlitch}>About</span>
            </button>
            <button
              onClick={() => scrollToSection("skills")}
              className={styles.navLink}
            >
              <span className={styles.navLinkText}>Skills</span>
              <span className={styles.navLinkGlitch}>Skills</span>
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className={styles.navLink}
            >
              <span className={styles.navLinkText}>Projects</span>
              <span className={styles.navLinkGlitch}>Projects</span>
            </button>
            <button
              onClick={() => scrollToSection("certifications")}
              className={styles.navLink}
            >
              <span className={styles.navLinkText}>Certifications</span>
              <span className={styles.navLinkGlitch}>Certifications</span>
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={styles.navLink}
            >
              <span className={styles.navLinkText}>Contact</span>
              <span className={styles.navLinkGlitch}>Contact</span>
            </button>
          </div>

          <div className={styles.navActions}>
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label="Toggle theme"
            >
              <div className={styles.themeToggleInner}>
                {isDarkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </div>
            </button>

            <button
              className={styles.menuToggle}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarOpen1 : ""}`}
              ></span>
              <span
                className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarOpen2 : ""}`}
              ></span>
              <span
                className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarOpen3 : ""}`}
              ></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroBackground}>
          <LetterGlitch
            glitchColors={
              isDarkMode
                ? ["#00f0ff", "#ff00ff", "#ffff00"]
                : ["#0088aa", "#aa0088", "#aaaa00"]
            }
            glitchSpeed={50}
            smooth={true}
            outerVignette={true}
            centerVignette={false}
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroTerminal}>
              <span className={styles.terminalPrompt}>$</span>
              <span className={styles.terminalCommand}>whoami</span>
            </div>
            <p className={styles.greeting}>
              <span className={styles.greetingBracket}>[</span>
              Hello, I&apos;m
              <span className={styles.greetingBracket}>]</span>
            </p>
            <h1 className={styles.heroName}>
              <span className={styles.heroNameMain}>Angel Kisha</span>
              <span className={styles.heroNameGlitch} aria-hidden="true">
                Angel Kisha
              </span>
              <span className={styles.heroNameGlitch2} aria-hidden="true">
                Angel Kisha
              </span>
            </h1>
            <h2 className={styles.heroTitle}>
              <span className={styles.heroTitleBracket}>&lt;</span>
              Software Engineer | Front-End Developer | UI/UX
              <span className={styles.heroTitleBracket}>/&gt;</span>
            </h2>
            <p className={styles.heroDescription}>
              I build clean, responsive, and user-friendly websites. I focus on
              turning designs into fast, modern, and easy-to-use interfaces.
            </p>
            <div className={styles.heroCta}>
              <button
                onClick={() => scrollToSection("projects")}
                className={styles.primaryBtn}
              >
                <span className={styles.btnText}>View My Work</span>
                <span className={styles.btnGlitch}>View My Work</span>
                <div className={styles.btnBorder}></div>
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={styles.secondaryBtn}
              >
                <span className={styles.btnText}>Get In Touch</span>
                <span className={styles.btnGlitch}>Get In Touch</span>
                <div className={styles.btnBorder}></div>
              </button>
            </div>
          </div>
        </div>
        <a href="#projects">
          <div className={styles.scrollIndicator}>
            <div className={styles.scrollMouse}>
              <div className={styles.scrollWheel}></div>
            </div>
            <span>Scroll Down</span>
          </div>
        </a>
        <div className={styles.heroCorners}>
          <div className={styles.cornerTL}></div>
          <div className={styles.cornerTR}></div>
          <div className={styles.cornerBL}></div>
          <div className={styles.cornerBR}></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.about}>
        <div className={styles.aboutBg}>
          <div className={styles.gridLines}></div>
        </div>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionTitleNumber}>01.</span>
            About Me
          </h2>
          <div className={styles.aboutContent}>
            <div className={styles.aboutImage}>
              <div className={styles.imageWrapper}>
                <div className={styles.imageFrame}>
                  <div className={styles.imagePlaceholder}>
                    <img
                      src="/images/me.png"
                      alt="me"
                      width="auto"
                      height="auto"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.imageScanline}></div>
                </div>
              </div>
              <div className={styles.imageDecor}></div>
              <div className={styles.imageCornerTL}></div>
              <div className={styles.imageCornerBR}></div>
            </div>
            <div className={styles.aboutText}>
              <div className={styles.aboutTerminal}>
                <div className={styles.terminalHeader}>
                  <span className={styles.terminalDot}></span>
                  <span className={styles.terminalDot}></span>
                  <span className={styles.terminalDot}></span>
                  <span className={styles.terminalTitle}>about.txt</span>
                </div>
                <div className={styles.terminalBody}>
                  <h3 className={styles.aboutSubtitle}>
                    <span className={styles.codeKeyword}>const</span> role ={" "}
                    <span className={styles.codeString}>
                      &quot;Software Engineer | Frontend Developer&quot;
                    </span>
                    ;
                  </h3>
                  <p className={styles.aboutDescription}>
                    <span className={styles.codeComment}>
                      {"// Building digital experiences that matter"}
                    </span>
                    <br />
                    I&apos;m a software engineer and frontend developer who
                    builds clean, responsive, and user-friendly websites. I care
                    about both how a website looks and how it works for real
                    users.
                  </p>
                  <div className={styles.servicesBlock}>
                    <span className={styles.codeComment}>
                      {"// What I can help you with:"}
                    </span>
                    <ul className={styles.servicesList}>
                      {services.map((service, index) => (
                        <li key={index} className={styles.serviceItem}>
                          <span className={styles.checkIcon}>&#10003;</span>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className={styles.aboutStats}>
                <div className={styles.statItem}>
                  <div className={styles.statInner}>
                    <span className={styles.statNumber}>1+</span>
                    <span className={styles.statLabel}>Years Experience</span>
                  </div>
                  <div className={styles.statGlow}></div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statInner}>
                    <span className={styles.statNumber}>15+</span>
                    <span className={styles.statLabel}>Projects Completed</span>
                  </div>
                  <div className={styles.statGlow}></div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statInner}>
                    <span className={styles.statNumber}>2</span>
                    <span className={styles.statLabel}>Certifications</span>
                  </div>
                  <div className={styles.statGlow}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Work With Me Section */}
          <div className={styles.whyWorkSection}>
            <h3 className={styles.whyWorkTitle}>
              <span className={styles.techTitleBracket}>{"{{"}</span>
              Why Work With Me
              <span className={styles.techTitleBracket}>{"}}"}</span>
            </h3>
            <div className={styles.whyWorkGrid}>
              {whyWorkWithMe.map((reason, index) => (
                <div key={index} className={styles.whyWorkItem}>
                  <span className={styles.whyWorkIcon}>&#10003;</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={styles.skills}>
        <div className={styles.skillsBg}>
          <div className={styles.hexGrid}></div>
        </div>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionTitleNumber}>02.</span>
            Skills & Technologies
          </h2>

          {/* Main Skills with Progress Bars */}
          <div className={styles.skillsGrid}>
            {mainSkills.map((skill, index) => (
              <div key={index} className={styles.skillItem}>
                <div className={styles.skillContent}>
                  <div className={styles.skillHeader}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span className={styles.skillPercent}>{skill.level}%</span>
                  </div>
                  <div className={styles.skillBar}>
                    <div
                      className={styles.skillProgress}
                      style={
                        {
                          "--skill-level": `${skill.level}%`,
                        } as React.CSSProperties
                      }
                    ></div>
                    <div
                      className={styles.skillGlow}
                      style={
                        {
                          "--skill-level": `${skill.level}%`,
                        } as React.CSSProperties
                      }
                    ></div>
                  </div>
                </div>
                <div className={styles.skillBorder}></div>
              </div>
            ))}
          </div>

          {/* Skill Categories */}
          <div className={styles.skillCategoriesContainer}>
            {skillCategories.map((category, catIndex) => (
              <div key={catIndex} className={styles.skillCategory}>
                <h4 className={styles.categoryTitle}>{category.title}</h4>
                <div className={styles.categorySkills}>
                  {category.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className={styles.techTag}>
                      <span className={styles.techTagText}>{skill}</span>
                      <span className={styles.techTagGlow}></span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={styles.projects}>
        <div className={styles.projectsBg}>
          <div className={styles.circuitLines}></div>
        </div>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionTitleNumber}>03.</span>
            Featured Projects
          </h2>
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <div
                key={index}
                className={`${styles.projectCard} ${styles[`projectCard${project.color}`]}`}
              >
                <div className={styles.projectCardInner}>
                  <div className={styles.projectImageContainer}>
                    <div className={styles.projectImagePlaceholder}>
                      <img src={project.image} alt="Preview Image" />
                    </div>
                    <div className={styles.projectImageOverlay}></div>
                  </div>
                  <div className={styles.projectHeader}>
                    <span className={styles.projectNumber}>0{index + 1}</span>
                    <div className={styles.projectLinks}>
                      <a
                        href={project.link}
                        className={styles.projectLink}
                        aria-label="View live project"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleProjectLinkClick(e, project.link)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ pointerEvents: 'none' }}
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className={styles.projectContent}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectDescription}>
                      {project.description}
                    </p>
                    <div className={styles.projectTech}>
                      {project.tech.map((tech, techIndex) => (
                        <span key={techIndex} className={styles.projectTag}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.projectGlow}></div>
                </div>
                <div className={styles.projectBorder}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className={styles.certifications}>
        <div className={styles.certificationsBg}>
          <div className={styles.dataStream}></div>
        </div>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionTitleNumber}>04.</span>
            Certifications
          </h2>
          <div className={styles.certificationsGrid}>
            {certifications.map((cert, index) => (
              <div key={index} className={styles.certCard}>
                <div className={styles.certCardInner}>
                  <div className={styles.certIcon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="7" />
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                    </svg>
                  </div>
                  <h3 className={styles.certTitle}>{cert.title}</h3>
                  <div className={styles.certMeta}>
                    <span className={styles.certIssuer}>{cert.issuer}</span>
                    <span className={styles.certDate}>{cert.date}</span>
                  </div>
                  <div className={styles.certGlow}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contact}>
        <div className={styles.contactBg}>
          <div className={styles.matrixRain}></div>
        </div>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionTitleNumber}>05.</span>
            Get In Touch
          </h2>
          <div className={styles.contactContent}>
            <div className={styles.contactInfo}>
              <div className={styles.contactTerminal}>
                <div className={styles.terminalHeader}>
                  <span className={styles.terminalDot}></span>
                  <span className={styles.terminalDot}></span>
                  <span className={styles.terminalDot}></span>
                  <span className={styles.terminalTitle}>contact.sh</span>
                </div>
                <div className={styles.terminalBody}>
                  <p className={styles.contactDescription}>
                    <span className={styles.terminalPrompt}>$</span> echo
                    &quot;Let&apos;s build something amazing together&quot;
                  </p>
                  <p className={styles.contactSubtext}>
                    I always try to understand your goals and build something
                    that helps your business grow. If you have a project or need
                    help with your website, feel free to message me. I&apos;m
                    happy to discuss your idea and get started.
                  </p>
                </div>
              </div>
              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <div className={styles.contactItemIcon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span>angelkishaarcenal10@gmail.com</span>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactItemIcon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <span>Available for Remote Work</span>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactItemIcon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <span>$10.00/hr on Upwork</span>
                </div>
              </div>
              <div className={styles.socialLinks}>
                <a
                  href="https://github.com/Gelaii123"
                  className={styles.socialLink}
                  aria-label="GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/angel-kisha-arcenal-b948152ba/"
                  className={styles.socialLink}
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a
                  href="https://www.upwork.com/freelancers/~017e57803a1de1ebf5?mp_source=share"
                  className={styles.socialLink}
                  aria-label="Upwork"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </a>
              </div>
            </div>
            <form 
            ref={formRef}
            className={styles.contactForm}
            onSubmit={handleSubmit}
            >
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Name</label>
                <input
                  type="text"
                  name="user_name"
                  placeholder="Your Name"
                  className={styles.formInput}
                  required
                />
                <div className={styles.inputGlow}></div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input
                  type="email"
                  name="user_email"
                  placeholder="Your Email"
                  className={styles.formInput}
                  required
                />
                <div className={styles.inputGlow}></div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Project Inquiry"
                  className={styles.formInput}
                />
                <div className={styles.inputGlow}></div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Message</label>
                <textarea
                  placeholder="Tell me about your project..."
                  name="message"
                  className={styles.formTextarea}
                  rows={5}
                  required
                ></textarea>
                <div className={styles.inputGlow}></div>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                <span className={styles.btnText}> {isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <div className={styles.btnGlowEffect}></div>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLeft}>
            <span className={styles.footerLogo}>
              <span className={styles.footerLogoBracket}>&lt;</span>
              Angel Kisha
              <span className={styles.footerLogoBracket}>/&gt;</span>
            </span>
            <p className={styles.footerText}>
              Building digital experiences that matter.
            </p>
          </div>
          <div className={styles.footerRight}>
            <p className={styles.copyright}>
              <span className={styles.copyrightSymbol}>&copy;</span> 2026 Angel
              Kisha. All rights reserved.
            </p>
          </div>
        </div>
        <div className={styles.footerGlow}></div>
      </footer>
      {toast.visible && (
  <div className={`${styles.toast} ${styles[toast.type]}`}>
    {toast.message}
  </div>
)}

    </div>
  );
};

export default Portfolio;
