import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { revealBlur, staggerContainer } from '../utils/animations';
import {
  contactMethods as CONTACT_METHODS,
  socials as SOCIAL_LINKS,
  email as CONTACT_EMAIL,
} from '../data/profile';
import '../styles/Contact.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: FormData = { name: '', email: '', subject: '', message: '' };

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${formData.message}\n\n— ${formData.name} (${formData.email})`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setFormData(EMPTY_FORM);
  };

  return (
    <div className="contact-page">
      <SectionHeading index="04" label="contact" />

      <motion.div
        className="contact-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <motion.div className="contact-info" variants={revealBlur}>
          <p className="contact-description">
            Have a project in mind? Let's work together to bring your ideas to
            life. Whether it's a simple website or the next unicorn SaaS, I'm
            here to help.
          </p>

          <div className="contact-methods">
            {CONTACT_METHODS.map((method) => (
              <div key={method.label} className="contact-method">
                <span className="contact-icon">
                  <i className={method.icon} aria-hidden="true"></i>
                </span>
                <div className="contact-details">
                  <span className="contact-label">{method.label}</span>
                  <p>{method.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="social-links">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                data-cursor="hover"
              >
                <i className={link.icon} aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div className="terminal-window contact-window" variants={revealBlur}>
          <div className="terminal-window__bar">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
            <span className="terminal-window__title">~/send-message</span>
          </div>
          <form onSubmit={handleSubmit} className="terminal-window__body contact-form">
            <div className="form-field">
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                placeholder=" "
                required
              />
              <label htmlFor="contact-name">
                <span className="prompt-symbol">$</span> name:
              </label>
            </div>
            <div className="form-field">
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder=" "
                required
              />
              <label htmlFor="contact-email">
                <span className="prompt-symbol">$</span> email:
              </label>
            </div>
            <div className="form-field">
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="contact-subject">
                <span className="prompt-symbol">$</span> subject:
              </label>
            </div>
            <div className="form-field">
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder=" "
                required
              />
              <label htmlFor="contact-message">
                <span className="prompt-symbol">$</span> message:
              </label>
              <motion.div
                className="typing-indicator"
                animate={{ opacity: formData.message ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            </div>
            <button
              type="submit"
              className="terminal-button terminal-button--primary"
              data-cursor="hover"
            >
              [ send_message ]
            </button>
            {sent && (
              <p className="form-success" role="status">
                <span className="prompt-symbol">&gt;</span> message queued — opening
                your mail client…
              </p>
            )}
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
