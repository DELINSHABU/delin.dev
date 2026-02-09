import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import TypewriterText from '../components/TypewriterText';
import xLogo from '../Newtwitterlogo/logo.svg';
import '../styles/Contact.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const { theme } = useTheme();
  const [startContactTyping, setStartContactTyping] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      // Google Apps Script Web App URL
      const scriptURL = 'https://script.google.com/macros/s/AKfycbwsfdPvYypG2bt8sRFe6QU0E1qF2DyI5OcnBsQCJvMcuRpQ02WCQVwttOqWyxPO4QWf/exec';
      
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
      form.append('subject', formData.subject);
      form.append('message', formData.message);

      await fetch(scriptURL, {
        method: 'POST',
        body: form
      });
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className={`page ${theme}`}>
      <main className="contact-page">
        <div className="contact-container">
          <section className="contact-info">
            <motion.h1
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1, 
                  transition: { 
                    duration: 0.5,
                    onComplete: () => setStartContactTyping(true)
                  } 
                }
              }}
            >
              <TypewriterText 
                text="Get in Touch" 
                speed={150}
                startDelay={300}
                cursorChar="_"
                showCursor={true}
                trigger={startContactTyping}
              />
            </motion.h1>
            <p className="contact-description">
              Have a project in mind? Let's work together to bring your ideas to life.
            </p>
            <div className="contact-methods">
              <a href="mailto:delinshabu.b@gmail.com" className="contact-method contact-link">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <h3>Email</h3>
                  <p>delinshabu.b@gmail.com</p>
                </div>
              </a>
              <a href="tel:+971545926143" className="contact-method contact-link">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-details">
                  <h3>Phone (UAE)</h3>
                  <p>+971 54 592 6143</p>
                </div>
              </a>
              <a href="tel:+919633766791" className="contact-method contact-link">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-details">
                  <h3>Phone (India)</h3>
                  <p>+91 9633766791</p>
                </div>
              </a>
              <a href="https://wa.me/919633766791" target="_blank" rel="noopener noreferrer" className="contact-method contact-link">
                <div className="contact-icon">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="contact-details">
                  <h3>WhatsApp</h3>
                  <p>+91 9633766791</p>
                </div>
              </a>
              <div className="contact-method">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-details">
                  <h3>Location</h3>
                  <p>Abu Dhabi, UAE</p>
                </div>
              </div>
            </div>
            <div className="social-links">
              <a href="https://github.com/DELINSHABU" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/delindev/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://x.com/Delin_dev" className="x-logo" target="_blank" rel="noopener noreferrer">
                <img src={xLogo} alt="X" className="x-icon" />
              </a>
            </div>
          </section>

          <section className="contact-form-section">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows={5}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-button" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Failed to Send' : 'Send Message'}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Contact;
