'use client';

import React, { useState, useEffect } from 'react';
import { events } from '../../src/Data';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import PaymentHandlerButton from '../components/PaymentHandlerButton';
import { useToast } from '../hooks/use-toast';
import { FaLink } from 'react-icons/fa';

const EventDetails = ({ id }) => {
  const [event, setEvent] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false); // State to toggle form visibility
  const [showIcons, setShowIcons] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const eventId = Number(id);
    const foundEvent = events.find((e) => e.id === eventId);
    if (foundEvent) setEvent(foundEvent);
    else console.error(`Event with id ${eventId} not found`);
  }, [id]);

  const handleRegisterNow = () => {
    setFormVisible(true); // Show the form
  };

  const handleCloseForm = () => {
    setFormVisible(false); // Hide the form
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnGmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(course.title)}&body=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(course.title)}`, '_blank');
  };

  // EventForm Component
  const EventForm = ({ event }) => {
    const [formData, setFormData] = useState({
      name: '',
      contactNumber: '',
      stream: '',
      qualification: '',
    });
    const [showPayment, setShowPayment] = useState(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
      e.preventDefault();

      // Validate fields
      if (Object.values(formData).some((value) => !value)) {
        toast({
          title: 'Validation Error',
          description: 'Please fill out all the fields before enrolling.',
          variant: 'destructive',
        });
        return;
      }

      try {
        // Save data to Google Sheets (adjust API endpoint as needed)
        const res = await fetch('/api/googleSheetss', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const result = await res.json();

        if (result.success) {
          setShowPayment(true);
          toast({
            title: 'Data Saved',
            description: 'Your details have been saved. Please proceed with the payment.',
            variant: 'success',
          });
        } else {
          throw new Error('Failed to save data');
        }
      } catch (error) {
        console.error('Error submitting data:', error);
        toast({
          title: 'Error',
          description: 'Failed to save event data. Please try again.',
          variant: 'destructive',
        });
      }
    };

    const handlePaymentSuccess = () => {
      toast({
        title: 'Registration Complete',
        description: 'Payment successful! Thank you for registering.',
        variant: 'success',
      });
    };

    const priceFloat = parseFloat(event.price.replace(/[^0-9.-]+/g, '').replace(',', ''));

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md overflow-hidden">
          <h2 className="text-2xl font-bold mb-4">Register for {event.title}</h2>
          <form onSubmit={handleFormSubmit}>
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="mb-4">
                <Label htmlFor={key} className="block text-lg font-medium mb-2 text-gray-300">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <Input
                  type={key === 'contactNumber' ? 'tel' : 'text'}
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white border-gray-700 focus:border-indigo-500"
                  required
                />
              </div>
            ))}
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Submit
            </Button>
          </form>
          {showPayment && (
            <div className="mt-4">
              <PaymentHandlerButton
                finalAmt={priceFloat}
                fullName={formData.name}
                email=""
                contact={formData.contactNumber}
                stream={formData.stream}
                qualification={formData.qualification}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          )}
          <Button onClick={handleCloseForm} variant="ghost" className="mt-4 text-gray-300 hover:text-white">
            Close
          </Button>
        </div>
      </div>
    );
  };

  if (!event) {
    return <div className="text-center text-white text-2xl mt-10">Loading event details...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-100 text-black">
      <div className="container mx-auto py-12 px-6 flex-grow">
        {/* Event Header */}
        <div className="flex flex-col items-center md:items-start md:justify-start text-center md:text-left border-b border-gray-700 pb-8 space-y-8 md:space-y-0">
          <div className="md:w-1/3 w-full flex justify-center md:justify-start">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="rounded-lg shadow-lg object-cover"
              style={{ width: '100%', maxWidth: '450px' }}
            />
          </div>
          <div className="md:ml-8 w-full md:w-2/3 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-black">{event.title}</h2>
            <p className="mb-4 text-base md:text-lg text-black-300">{event.description}</p>
            <div className="flex items-center md:justify-start mb-2 text-black-300">
              <FaCalendarAlt className="mr-2 text-black" />
              <p>{event.date}</p>
            </div>
            <div className="flex md:justify-start mb-2 text-black-300">
              <FaMapMarkerAlt className="mr-2" />
              <p>{event.location}</p>
            </div>
            <div className="flex md:justify-start mb-2 text-black-300">
              <FaClock className="mr-2" />
              <p>{event.duration}</p>
            </div>
            <p className="text-lg text-black-300">
              <strong>Organizer:</strong> {event.organizer}
            </p>
            <div className="flex items-center space-x-4">
            <button
              className="mt-4 py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-300 shadow-lg transform hover:scale-105"
              onClick={handleRegisterNow}
            >
              Enroll Now
            </button>
            <div className="relative inline-block mt-2">
              <button
                onClick={() => setShowIcons(!showIcons)}
                className="py-2 px-4 bg-transparent text-white border border-white rounded-full hover:text-black transition-colors duration-300"
                style={{ width: '60px', border: "2px solid black" }}
              >
                <img src="/share2.png" alt="Share" className="h-6 w-6 mx-auto" />
              </button>
              </div>

              {showIcons && (
                <div className="mt-4 flex space-x-4">
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

        {/* Event Highlights */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-indigo-300">Event Highlights</h3>
          <ul className="list-disc list-inside text-lg ml-8 text-black-300 border-l-4 border-dotted border-indigo-500 pl-4">
            {event.highlights.map((highlight, index) => (
              <li key={index} className="mb-2">{highlight}</li>
            ))}
          </ul>
        </div>

        {/* Event Agenda */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-indigo-300">Event Agenda</h3>
          <div className="space-y-8">
            {event.agenda.map((session, index) => (
              <div key={index} className="p-6 bg-gray-800 rounded-lg shadow-lg border border-indigo-600">
                <h4 className="text-2xl font-bold mb-4 text-white">{session.time}</h4>
                <p className="text-xl font-semibold mb-3 text-white">{session.session}</p>
                <p className="text-lg text-gray-300"><em>Speaker: {session.speaker}</em></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: EventForm */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <EventForm event={event} onClose={handleCloseForm} />
        </div>
      )}
    </div>
  );
};

export default EventDetails;