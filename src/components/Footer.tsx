import React, { useState } from 'react';
import { Footprints, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onPageChange }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending email to owner
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save contact message to localStorage for admin panel
    try {
      const contactMessage = {
        id: Date.now().toString(),
        name: contactForm.name,
        email: contactForm.email,
        subject: contactForm.subject,
        message: contactForm.message,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      const existingContacts = JSON.parse(localStorage.getItem('solestyle_contacts') || '[]');
      existingContacts.unshift(contactMessage); // Add to beginning of array
      localStorage.setItem('solestyle_contacts', JSON.stringify(existingContacts));
      
      console.log('Contact form submitted:', contactMessage);
    } catch (error) {
      console.error('Error saving contact message:', error);
    }
    
    setSubmitted(true);
    setIsSubmitting(false);
    setContactForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <footer className="bg-[#2C2A29] dark:bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Footprints className="h-8 w-8 text-[#5D3A8D]" />
              <span className="text-2xl font-bold">SoleStyle</span>
            </div>
            <p className="text-[#F5F5F5]/80 mb-4">
              Your trusted destination for premium footwear. We combine style, comfort, 
              and quality to help you step forward with confidence.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-[#F5F5F5]/60 hover:text-[#5D3A8D] cursor-pointer" />
              <Twitter className="h-6 w-6 text-[#F5F5F5]/60 hover:text-[#5D3A8D] cursor-pointer" />
              <Instagram className="h-6 w-6 text-[#F5F5F5]/60 hover:text-[#5D3A8D] cursor-pointer" />
              <Youtube className="h-6 w-6 text-[#F5F5F5]/60 hover:text-[#5D3A8D] cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onPageChange('home')}
                  className="text-[#F5F5F5]/80 hover:text-white"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('about')}
                  className="text-[#F5F5F5]/80 hover:text-white"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('contact')}
                  className="text-[#F5F5F5]/80 hover:text-white"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('policies')}
                  className="text-[#F5F5F5]/80 hover:text-white"
                >
                  Policies
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop Categories</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-[#F5F5F5]/80 hover:text-white">
                  Luxurious Collection
                </button>
              </li>
              <li>
                <button className="text-[#F5F5F5]/80 hover:text-white">
                  Classy Styles
                </button>
              </li>
              <li>
                <button className="text-[#F5F5F5]/80 hover:text-white">
                  Funky Designs
                </button>
              </li>
              <li>
                <button className="text-[#F5F5F5]/80 hover:text-white">
                  Sale Items
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#A67C9D] mt-1" />
                <div>
                  <p className="text-[#F5F5F5]/80">123 Shoe Street</p>
                  <p className="text-[#F5F5F5]/80">Fashion District</p>
                  <p className="text-[#F5F5F5]/80">New York, NY 10001</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#A67C9D]" />
                <p className="text-[#F5F5F5]/80">1-800-SOLE-STYLE</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#A67C9D]" />
                <p className="text-[#F5F5F5]/80">support@solestyle.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="border-t border-[#F5F5F5]/20 mt-12 pt-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6 text-white">Get in Touch</h3>
            <p className="text-[#F5F5F5]/90 text-center mb-8">
              Have a question or feedback? Send us a message and we'll get back to you soon.
            </p>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="bg-[#A67C9D]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="text-[#A67C9D]" size={32} />
                </div>
                <h4 className="text-xl font-semibold text-[#A67C9D] mb-2">Message Sent!</h4>
                <p className="text-[#F5F5F5]/80">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg bg-[#F5F5F5]/10 text-white border border-[#F5F5F5]/20 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent placeholder-[#F5F5F5]/60"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg bg-[#F5F5F5]/10 text-white border border-[#F5F5F5]/20 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent placeholder-[#F5F5F5]/60"
                    required
                  />
                </div>
                <select
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#F5F5F5]/10 text-white border border-[#F5F5F5]/20 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                  required
                  style={{ color: 'white' }}
                >
                  <option value="General Inquiry" style={{ color: '#2C2A29', backgroundColor: '#F5F5F5' }}>General Inquiry</option>
                  <option value="Product Question" style={{ color: '#2C2A29', backgroundColor: '#F5F5F5' }}>Product Question</option>
                  <option value="Order Support" style={{ color: '#2C2A29', backgroundColor: '#F5F5F5' }}>Order Support</option>
                  <option value="Technical Issue" style={{ color: '#2C2A29', backgroundColor: '#F5F5F5' }}>Technical Issue</option>
                  <option value="Feedback" style={{ color: '#2C2A29', backgroundColor: '#F5F5F5' }}>Feedback</option>
                  <option value="Partnership" style={{ color: '#2C2A29', backgroundColor: '#F5F5F5' }}>Partnership</option>
                  <option value="Other" style={{ color: '#2C2A29', backgroundColor: '#F5F5F5' }}>Other</option>
                </select>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-[#F5F5F5]/10 text-white border border-[#F5F5F5]/20 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent resize-none placeholder-[#F5F5F5]/60"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#5D3A8D] hover:bg-[#A67C9D] text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F5F5F5]/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#F5F5F5]/60 text-sm">
            © 2024 SoleStyle. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button 
              onClick={() => onPageChange('privacy')}
              className="text-[#F5F5F5]/60 hover:text-white text-sm"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onPageChange('terms')}
              className="text-[#F5F5F5]/60 hover:text-white text-sm"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => onPageChange('cookies')}
              className="text-[#F5F5F5]/60 hover:text-white text-sm"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;