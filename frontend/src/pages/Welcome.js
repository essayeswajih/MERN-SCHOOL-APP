import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';
import { motion } from 'framer-motion';

function Welcome() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});
  const sectionsRef = useRef({});

  // Navigation functions avec débogage
  const goToLogin = () => {
    console.log("Clic sur Se Connecter - Redirection vers /login");
    navigate('/login');
  };
  const goToSignup = () => {
    console.log("Clic sur S'Inscrire - Redirection vers /signup");
    navigate('/signup');
  };
  const handleLearnMore = () => {
    console.log("Clic sur Découvrir notre histoire - Redirection vers /about");
    navigate('/about');
  };

  // Animation sur scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.values(sectionsRef.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const registerSection = (id, ref) => {
    if (ref && !sectionsRef.current[id]) {
      sectionsRef.current[id] = ref;
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="welcome-wrapper">
      {/* Header avec le logo */}
      <header className="header">
        <div className="header-container">
          <a href="/" className="logo-link">
            <img src="/images/logo2.jpg" alt="Logo Leader-Learning" className="logo" />
          </a>
          <nav className="header-nav">
            <button onClick={goToLogin} className="btn btn-login">
              <span className="btn-content">
                <span className="btn-icon">🔑</span>
                <span>Se Connecter</span>
              </span>
            </button>
            <button onClick={goToSignup} className="btn btn-signup">
              <span className="btn-content">
                <span className="btn-icon">✨</span>
                <span>S'Inscrire</span>
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section with Parallax */}
      <section className="hero-section">
        <div className="hero-parallax">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="hero-title">Leader Learning</h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Préparez l'avenir avec l'éducation d'aujourd'hui
            </motion.p>
          </motion.div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffd700" fillOpacity="0.4" d="M0,192L80,176C160,160,320,128,480,133.3C640,139,800,181,960,186.7C1120,192,1280,160,1360,149.3L1440,139L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
        <div className="hero-overlay">
          <div className="animated-shape shape-1"></div>
          <div className="animated-shape shape-2"></div>
          <div className="animated-shape shape-3"></div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about-section" 
        className="about-section"
        ref={ref => registerSection('about-section', ref)}
      >
        <div className="section-container">
          <motion.h2 
            className="section-title"
            initial="hidden"
            animate={isVisible['about-section'] ? 'visible' : 'hidden'}
            variants={fadeInUp}
          >
            <span className="title-accent">Notre</span> Vision
          </motion.h2>
          <div className="about-grid">
            <motion.div 
              className="about-text"
              initial="hidden"
              animate={isVisible['about-section'] ? 'visible' : 'hidden'}
              variants={fadeInUp}
            >
              <p>
    Leader-Learning redéfinit l'éducation en ligne en Tunisie et au-delà. 
    Inspirée par une volonté d'innovation et d'excellence, 
    notre mission est de rendre l'apprentissage 
    <span className="text-highlight"> accessible </span>, 
    <span className="text-highlight"> engageant</span> et 
    <span className="text-highlight"> impactant</span> pour tous.
</p>

              <div className="about-features">
                <div className="feature">
                  <div className="feature-icon">🌟</div>
                  <div className="feature-text">Contenu premium et exclusif</div>
                </div>
                <div className="feature">
                  <div className="feature-icon">🔍</div>
                  <div className="feature-text">Approche pédagogique innovante</div>
                </div>
                <div className="feature">
                  <div className="feature-icon">🌐</div>
                  <div className="feature-text">Accessibilité sans frontières</div>
                </div>
              </div>
              <button onClick={handleLearnMore} className="learn-more">
                <span>Découvrir notre histoire</span>
                <svg className="learn-more-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </motion.div>
            <motion.div 
              className="about-image"
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible['about-section'] ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="image-container">
                <img src="/images/vision-illustration.jpg" alt="Notre Vision" />
                <div className="image-accent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="stats-section" 
        className="stats-section"
        ref={ref => registerSection('stats-section', ref)}
      >
        <div className="section-container">
          <motion.div 
            className="stats-grid"
            initial="hidden"
            animate={isVisible['stats-section'] ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.div className="stat-item" variants={fadeInUp}>
              <div className="stat-icon">👥</div>
              <h3 className="counter">10K+</h3>
              <p>Apprenants actifs</p>
            </motion.div>
            <motion.div className="stat-item" variants={fadeInUp}>
              <div className="stat-icon">📚</div>
              <h3 className="counter">50+</h3>
              <p>Cours disponibles</p>
            </motion.div>
            <motion.div className="stat-item" variants={fadeInUp}>
              <div className="stat-icon">💯</div>
              <h3 className="counter">95%</h3>
              <p>Satisfaction client</p>
            </motion.div>
            <motion.div className="stat-item" variants={fadeInUp}>
              <div className="stat-icon">🤝</div>
              <h3 className="counter">20+</h3>
              <p>Partenaires éducatifs</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Offerings Section */}
      <section 
        id="offerings-section" 
        className="offerings-section"
        ref={ref => registerSection('offerings-section', ref)}
      >
        <div className="section-container">
          <motion.h2 
            className="section-title"
            initial="hidden"
            animate={isVisible['offerings-section'] ? 'visible' : 'hidden'}
            variants={fadeInUp}
          >
            <span className="title-accent">Nos</span> Solutions
          </motion.h2>
          <motion.div 
            className="offerings-grid"
            initial="hidden"
            animate={isVisible['offerings-section'] ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.div className="offering-card" variants={fadeInUp}>
              <div className="card-icon-wrapper">
                <div className="card-icon">📚</div>
              </div>
              <h3>Cours Premium</h3>
              <p>Contenu exclusif développé par des experts reconnus dans leur domaine</p>
              <div className="card-hover-effect"></div>
            </motion.div>
            <motion.div className="offering-card" variants={fadeInUp}>
              <div className="card-icon-wrapper">
                <div className="card-icon">🕒</div>
              </div>
              <h3>Flexibilité Totale</h3>
              <p>Apprenez à votre rythme, n'importe où et n'importe quand</p>
              <div className="card-hover-effect"></div>
            </motion.div>
            <motion.div className="offering-card" variants={fadeInUp}>
              <div className="card-icon-wrapper">
                <div className="card-icon">🏆</div>
              </div>
              <h3>Certifications</h3>
              <p>Diplômes et attestations reconnus mondialement par l'industrie</p>
              <div className="card-hover-effect"></div>
            </motion.div>
            <motion.div className="offering-card" variants={fadeInUp}>
              <div className="card-icon-wrapper">
                <div className="card-icon">💻</div>
              </div>
              <h3>Outils Numériques</h3>
              <p>Technologie de pointe et plateforme d'apprentissage intuitive</p>
              <div className="card-hover-effect"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section 
        id="why-choose-section" 
        className="why-choose-section"
        ref={ref => registerSection('why-choose-section', ref)}
      >
        <div className="section-container">
          <motion.h2 
            className="section-title"
            initial="hidden"
            animate={isVisible['why-choose-section'] ? 'visible' : 'hidden'}
            variants={fadeInUp}
          >
            Pourquoi <span className="title-accent">Leader Learning</span> ?
          </motion.h2>
          <motion.div 
            className="why-choose-grid"
            initial="hidden"
            animate={isVisible['why-choose-section'] ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.div className="why-item" variants={fadeInUp}>
              <span className="why-icon">🌟</span>
              <h4>Excellence</h4>
              <p>Contenu de la plus haute qualité, créé par des professionnels du secteur</p>
            </motion.div>
            <motion.div className="why-item" variants={fadeInUp}>
              <span className="why-icon">⚡</span>
              <h4>Innovation</h4>
              <p>Technologie éducative avancée et méthodes pédagogiques modernes</p>
            </motion.div>
            <motion.div className="why-item" variants={fadeInUp}>
              <span className="why-icon">🤝</span>
              <h4>Communauté</h4>
              <p>Un réseau dynamique d'apprenants et d'experts pour un soutien constant</p>
            </motion.div>
            <motion.div className="why-item" variants={fadeInUp}>
              <span className="why-icon">🌍</span>
              <h4>Portée Mondiale</h4>
              <p>Accessible partout dans le monde, adaptée aux besoins locaux</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        id="benefits-section" 
        className="benefits-section"
        ref={ref => registerSection('benefits-section', ref)}
      >
        <div className="section-container">
          <motion.h2 
            className="section-title"
            initial="hidden"
            animate={isVisible['benefits-section'] ? 'visible' : 'hidden'}
            variants={fadeInUp}
          >
            À Qui <span className="title-accent">S'Adresse</span>-t-Elle ?
          </motion.h2>
          <motion.div 
            className="benefits-grid"
            initial="hidden"
            animate={isVisible['benefits-section'] ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.div className="benefit-item" variants={fadeInUp}>
              <div className="benefit-icon-wrapper">
                <span className="benefit-icon">🎓</span>
              </div>
              <h4>Étudiants</h4>
              <p>Pour une éducation transformative qui complète votre parcours académique</p>
              <div className="benefit-features">
                <span className="benefit-feature">Support 24/7</span>
                <span className="benefit-feature">Contenu adapté</span>
              </div>
            </motion.div>
            <motion.div className="benefit-item" variants={fadeInUp}>
              <div className="benefit-icon-wrapper">
                <span className="benefit-icon">💼</span>
              </div>
              <h4>Professionnels</h4>
              <p>Pour une montée en compétences efficace et adaptée au marché actuel</p>
              <div className="benefit-features">
                <span className="benefit-feature">Flexibilité</span>
                <span className="benefit-feature">Projets réels</span>
              </div>
            </motion.div>
            <motion.div className="benefit-item" variants={fadeInUp}>
              <div className="benefit-icon-wrapper">
                <span className="benefit-icon">🏫</span>
              </div>
              <h4>Institutions</h4>
              <p>Pour des collaborations éducatives innovantes et des programmes sur mesure</p>
              <div className="benefit-features">
                <span className="benefit-feature">Partenariats</span>
                <span className="benefit-feature">Solutions B2B</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials-section" 
        className="testimonials-section"
        ref={ref => registerSection('testimonials-section', ref)}
      >
        <div className="section-container">
          <motion.h2 
            className="section-title"
            initial="hidden"
            animate={isVisible['testimonials-section'] ? 'visible' : 'hidden'}
            variants={fadeInUp}
          >
            <span className="title-accent">Voix</span> de Nos Apprenants
          </motion.h2>
          <motion.div 
            className="testimonials-grid"
            initial="hidden"
            animate={isVisible['testimonials-section'] ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.div className="testimonial-card" variants={fadeInUp}>
              <div className="testimonial-quote">"</div>
              <p>Une expérience d'apprentissage exceptionnelle qui a changé ma vie professionnelle et m'a ouvert de nouvelles opportunités.</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="/images/avatar1.jpg" alt="Amina T., étudiante en ingénierie" className="avatar-img" />
                </div>
                <div className="author-info">
                  <h4>Amina T.</h4>
                  <span>Étudiante en ingénierie</span>
                </div>
              </div>
            </motion.div>
            <motion.div className="testimonial-card" variants={fadeInUp}>
              <div className="testimonial-quote">"</div>
              <p>Les certifications de Leader-Learning m'ont ouvert de nouvelles opportunités professionnelles et ont boosté ma carrière.</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="/images/avatar2.jpg" alt="Karim B., manager IT" className="avatar-img" />
                </div>
                <div className="author-info">
                  <h4>Karim B.</h4>
                  <span>Manager IT</span>
                </div>
              </div>
            </motion.div>
            <motion.div className="testimonial-card" variants={fadeInUp}>
              <div className="testimonial-quote">"</div>
              <p>Un partenaire fiable pour notre institution, offrant des solutions éducatives innovantes et un support de qualité.</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="/images/avatar3.jpeg" alt="Sana M., directrice académique" className="avatar-img" />
                </div>
                <div className="author-info">
                  <h4>Sana M.</h4>
                  <span>Directrice académique</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section 
        id="partners-section" 
        className="partners-section"
        ref={ref => registerSection('partners-section', ref)}
      >
        <div className="section-container">
          <motion.h2 
            className="section-title"
            initial="hidden"
            animate={isVisible['partners-section'] ? 'visible' : 'hidden'}
            variants={fadeInUp}
          >
            Nos <span className="title-accent">Partenaires</span> d'Excellence
          </motion.h2>
          <motion.div 
            className="partners-grid"
            initial="hidden"
            animate={isVisible['partners-section'] ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.div className="partner-logo-container" variants={fadeInUp}>
              <img src="/images/partner1.jpg" alt="Partenaire 1" className="partner-logo" />
            </motion.div>
            <motion.div className="partner-logo-container" variants={fadeInUp}>
              <img src="/images/partner3.png" alt="Partenaire 2" className="partner-logo" />
            </motion.div>
            <motion.div className="partner-logo-container" variants={fadeInUp}>
              <img src="/images/partner2.png" alt="Partenaire 3" className="partner-logo" />
            </motion.div>
            <motion.div className="partner-logo-container" variants={fadeInUp}>
              <img src="/images/partner4.png" alt="Partenaire 4" className="partner-logo" />
            </motion.div>
            <motion.div className="partner-logo-container" variants={fadeInUp}>
              <img src="/images/partner5.png" alt="Partenaire 5" className="partner-logo" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section 
        id="cta-section" 
        className="cta-section"
        ref={ref => registerSection('cta-section', ref)}
      >
        <motion.div 
          className="cta-content"
          initial="hidden"
          animate={isVisible['cta-section'] ? 'visible' : 'hidden'}
          variants={fadeInUp}
        >
          <h2 className="cta-title">Prêt à Transformer Votre Avenir ?</h2>
          <p className="cta-text">Rejoignez des milliers d'apprenants et commencez votre parcours vers l'excellence dès maintenant.</p>
          <motion.button 
            onClick={goToSignup} 
            className="btn btn-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="btn-content">
              <span className="btn-icon">🚀</span>
              <span>Commencer Aujourd'hui</span>
            </span>
          </motion.button>
          <div className="cta-features">
            <div className="cta-feature">
              <span className="feature-check">✓</span>
              <span>Accès immédiat</span>
            </div>
            <div className="cta-feature">
              <span className="feature-check">✓</span>
              <span>Essai gratuit</span>
            </div>
            <div className="cta-feature">
              <span className="feature-check">✓</span>
              <span>Support premium</span>
            </div>
          </div>
        </motion.div>
        <div className="cta-background"></div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>Leader Learning</h3>
            <p>L'éducation sans limites</p>
            <div className="footer-motto">
              <q>Apprendre aujourd'hui, diriger demain</q>
            </div>
          </div>
          <div className="footer-links">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/about/mission">Notre Mission</a></li>
              <li><a href="/about/values">Nos Valeurs</a></li>
              <li><a href="/about/team">Notre Équipe</a></li>
              <li><a href="/courses">Tous les Cours</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <p><span className="contact-icon">✉️</span> <a href="mailto:info@leaderlearning.tn">info@leaderlearning.tn</a></p>
            <p><span className="contact-icon">📞</span> +216 93 703 706</p>
            <p><span className="contact-icon">📍</span> Sfax, Tunisie</p>
            <div className="social-links">
              <a 
                href="https://facebook.com/leaderlearning" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon facebook" 
                aria-label="Suivez-nous sur Facebook"
              ></a>
              <a 
                href="https://twitter.com/leaderlearning" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon twitter" 
                aria-label="Suivez-nous sur Twitter"
              ></a>
              <a 
                href="https://instagram.com/leaderlearning" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon instagram" 
                aria-label="Suivez-nous sur Instagram"
              ></a>
              <a 
                href="https://linkedin.com/company/leaderlearning" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon linkedin" 
                aria-label="Suivez-nous sur LinkedIn"
              ></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Leader Learning. Tous droits réservés.</p>
          <div className="footer-links-bottom">
            <a href="/privacy">Confidentialité</a>
            <a href="/terms">Conditions d'utilisation</a>
            <a href="/cookies">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Welcome;