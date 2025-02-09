'use client'
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaLink, FaWhatsapp, FaInstagram, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import { internships } from '../../src/Data';
import Link from 'next/link'
import { Header } from '../../components/landing-page';
import { FaPlayCircle, FaInfoCircle } from 'react-icons/fa'

const InternshipDetails = ({ id }) => {
  const [internship, setInternship] = useState(null);
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    const fetchInternship = () => {
      const internshipId = Number(id);
      const foundInternship = internships.find(i => i.id === internshipId);
      if (foundInternship) {
        setInternship(foundInternship);
      } else {
        console.error(`Internship with id ${internshipId} not found`);
      }
    };

    fetchInternship();
  }, [id]);


  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnGmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(internship.title)}&body=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(internship.title)}`, '_blank');
  };

  if (!internship) {
    return <div className="text-center text-white text-2xl mt-10">Loading internship details...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-100 text-black">
      <Header />
      <div className="container mx-auto py-12 px-6 flex-grow">
        {/* Internship Header */}
        <div className="flex flex-col items-start justify-center md:justify-start text-center md:text-left border-b border-gray-700 pb-8">
          <div className="w-full md:w-1/3 mb-8 md:mb-0 flex justify-center">
            <img
              src={internship.imageUrl}
              alt={internship.title}
              className="rounded-lg shadow-lg object-cover"
              style={{ maxWidth: '100%', maxHeight: '350px' }}
            />
          </div>
          <div className="md:ml-8 flex-1">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-black">{internship.title}</h2>
            <p className="mb-4 text-base md:text-lg text-black-300">{internship.description}</p>
            <p className="text-lg text-black-300"><strong>Company:</strong> {internship.company}</p>
            <div className="flex items-center mb-2 text-black-300">
              <FaMapMarkerAlt className="mr-2" />
              <p>{internship.location}</p>
            </div>
            <div className="flex items-center mb-2 text-black-300">
              <FaCalendarAlt className="mr-2" />
              <p>{internship.duration}</p>
            </div>
            <div className="flex items-center mb-2 text-black-300">
              <FaMoneyBillWave className="mr-2" />
              <p>{internship.stipend}</p>
            </div>
            <p className="text-sm text-black-400 mt-2">Last updated: {internship.lastUpdated}</p>
            <div className="flex items-center space-x-4">
            <Link href={`/InternshipApplication`} passHref>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm flex items-center">
                <FaInfoCircle className="mr-2" /> Apply Now
              </button>
            </Link>
            <div className="relative inline-block">
              <button
                onClick={() => setShowIcons(!showIcons)}
                className="py-2 px-4 bg-transparent text-white border border-white rounded-full hover:text-black transition-colors duration-300"
                style={{ width: "60px", border: "2px solid black" }}
              >
                <img src="/share2.png" alt="Share" className="h-6 w-6 mx-auto" />
              </button>
              </div>
              {showIcons && (
                <div className="mt-2 flex space-x-4">
                  <button onClick={copyLink} className="text-black hover:text-gray-400">
                    <FaLink size={24} />
                  </button>
                  <button onClick={shareOnWhatsApp} className="hover:text-gray-400">
                    <img src="/whatsapp.png" alt="Share on WhatsApp" className="w-6 h-6" />
                  </button>
                  <button onClick={shareOnGmail} className="hover:text-gray-400">
                    <img src="/gmail.png" alt="Share on Gmail" className="w-6 h-6" />
                  </button>
                  <button onClick={shareOnLinkedIn} className="hover:text-gray-400">
                    <img src="/linkedin.png" alt="Share on LinkedIn" className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-indigo-300">Requirements</h3>
          <ul className="list-disc list-inside text-lg ml-8 text-black-300 border-l-4 border-dotted border-indigo-500 pl-4">
            {internship.requirements.map((requirement, index) => (
              <li key={index} className="mb-2">{requirement}</li>
            ))}
          </ul>
        </div>

        {/* Responsibilities */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-indigo-300">Responsibilities</h3>
          <ul className="list-disc list-inside text-lg ml-8 text-black-300 border-l-4 border-dotted border-indigo-500 pl-4">
            {internship.responsibilities.map((responsibility, index) => (
              <li key={index} className="mb-2">{responsibility}</li>
            ))}
          </ul>
        </div>

        {/* Highlights */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-indigo-300">Internship Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {internship.highlights.map((highlight, index) => (
              <div key={index} className="p-6 bg-gray-800 rounded-lg shadow-lg border border-indigo-600">
                <h4 className="text-xl font-bold mb-2 text-white">{highlight}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InternshipDetails