import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CourseDetails from './enrollpages/CourseDetails';
import ScrollToTop from './components/ScrollToTop';
import Events from './components/ui/Events';
import Policy from './components/ui/Policy'; // Privacy Policy
import Terms from './components/ui/Terms';
import Shipping from './components/ui/Shipping'; // Shipping Policy
import Inten from './src/components/ui/Inten'; // Internships
import EventDetail from './enrollpages/EventsDetails';
import WorkshopDetails from './enrollpages/WorkShopDetails';
import Work from './components/ui/Work'; // Workshops
import Login from './components/Login'; // Login page
import Signup from './components/Signup'; // Signup page
import InternshipApplication from './components/ui/InternshipApplication'; // Corrected single import

// Create a context for the theme
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <Router>
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        <div className={`App ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-black'}`}>
          <Navbar />
          <ScrollToTop />
          <Routes>
            {/* Define all necessary routes */}
            <Route path="/policy" element={<Policy />} /> {/* Privacy Policy */}
            <Route path="/terms" element={<Terms />} /> {/* Terms of Service */}
            <Route path="/shipping" element={<Shipping />} /> {/* Shipping Info */}
            <Route path="/events" element={<Events />} /> {/* All Events */}
            <Route path="/events/:eventId" element={<EventDetail />} /> 
            <Route path="/workshop/:workshopId" element={<WorkshopDetails />} /> {/* Event Detail with dynamic eventId */}
            <Route path="/work" element={<Work />} /> {/* Workshops */}
            <Route path="/inten" element={<Inten />} /> {/* Internships */}
            <Route path="/enroll/:courseId" element={<CourseDetails />} /> {/* Course Enrollment */}
            {/* Consider keeping only one of the following two routes */}
            <Route path="/cour/:courseId" element={<CourseDetails />} /> {/* Alternative route for Course Details */}
            <Route path="/login" element={<Login />} /> {/* Login Page */}
            <Route path="/signup" element={<Signup />} /> {/* Signup Page */}
            <Route path="/internship-application" element={<InternshipApplication />} /> {/* Internship Application */}
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </ThemeContext.Provider>
    </Router>
  );
};

export default App;
