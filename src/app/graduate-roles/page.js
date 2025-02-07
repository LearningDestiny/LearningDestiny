'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/landing-page';
import { FaLink } from 'react-icons/fa';
import axios from 'axios';

const GraduateRoles = () => {
  const [graduateRoles, setGraduateRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    resume: null,
    coverLetter: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showIconsForRole, setShowIconsForRole] = useState(null);

  useEffect(() => {
    fetchGraduateRoles();
  }, []);

  const fetchGraduateRoles = async () => {
    try {
      const response = await axios.get('/api/graduate-roles');
      setGraduateRoles(response.data);
    } catch (error) {
      console.error('Error fetching graduate roles:', error);
    }
  };

  const handleEnrollmentClick = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleShareClick = (roleId) => {
    setShowIconsForRole(showIconsForRole === roleId ? null : roleId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Enrollment successful for ${selectedRole.title}`);
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      education: '',
      resume: null,
      coverLetter: ''
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnGmail = (roleTitle) => {
    window.open(`mailto:?subject=${encodeURIComponent(roleTitle)}&body=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnLinkedIn = (roleTitle) => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(roleTitle)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-blue-100 text-gray-800">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Explore Opportunities</h2>
        <div className="max-w-4xl mx-auto">
          {graduateRoles.length > 0 ? (
            graduateRoles.map((role) => (
              <div key={role.id} className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h3 className="text-2xl font-semibold mb-2">{role.title}</h3>
                <p className="mb-2"><strong>Location:</strong> {role.location}</p>
                <p className="mb-4">{role.description}</p>
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => handleEnrollmentClick(role)}
                    className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition duration-300"
                  >
                    Enroll Now
                  </button>
                  <div className="relative inline-block">
                    <button
                      onClick={() => handleShareClick(role.id)}
                      className="py-2 px-4 bg-transparent text-gray-900 border border-gray-900 rounded-full hover:text-black transition-colors duration-300"
                      style={{ width: "60px" }}
                    >
                      <img src="/share1.png" alt="Share" className="h-6 w-6 mx-auto" />
                    </button>
                    {showIconsForRole === role.id && (
                      <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        <div className="py-2 px-4">
                          <button onClick={copyLink} className="flex items-center text-gray-900 hover:text-gray-600 mb-2">
                            <FaLink size={24} className="mr-2" />
                            Copy Link
                          </button>
                          <button onClick={shareOnWhatsApp} className="flex items-center text-gray-900 hover:text-gray-600 mb-2">
                            <img src="/whatsapp.png" alt="Share on WhatsApp" className="w-6 h-6 mr-2" />
                            WhatsApp
                          </button>
                          <button onClick={() => shareOnGmail(role.title)} className="flex items-center text-gray-900 hover:text-gray-600 mb-2">
                            <img src="/gmail.png" alt="Share on Gmail" className="w-6 h-6 mr-2" />
                            Gmail
                          </button>
                          <button onClick={() => shareOnLinkedIn(role.title)} className="flex items-center text-gray-900 hover:text-gray-600">
                            <img src="/linkedin.png" alt="Share on LinkedIn" className="w-6 h-6 mr-2" />
                            LinkedIn
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No graduate roles available.</p>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Enroll for {selectedRole?.title}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border border-gray-300 rounded" 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Your Email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border border-gray-300 rounded" 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Your Phone Number" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border border-gray-300 rounded" 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1" htmlFor="address">Address</label>
                <input 
                  type="text" 
                  name="address" 
                  placeholder="Your Address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border border-gray-300 rounded" 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1" htmlFor="education">Education Level</label>
                <input 
                  type="text" 
                  name="education" 
                  placeholder="Your Education Level" 
                  value={formData.education} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border border-gray-300 rounded" 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1" htmlFor="resume">Resume</label>
                <input 
                  type="file" 
                  name="resume" 
                  onChange={handleFileChange} 
                  className="w-full p-2 border border-gray-300 rounded" 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1" htmlFor="coverLetter">Cover Letter</label>
                <textarea 
                  name="coverLetter" 
                  placeholder="Your Cover Letter" 
                  value={formData.coverLetter} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border border-gray-300 rounded" 
                  required 
                />
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2025 Learning Destiny Pvt Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GraduateRoles;