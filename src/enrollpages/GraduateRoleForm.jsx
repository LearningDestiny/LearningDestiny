'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

// Popup Component
const Popup = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
      <p className="text-black mb-4">{message}</p>
      <Button onClick={onClose}>Close</Button>
    </div>
  </div>
);

const GraduateRoleForm = ({ role, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    resume: null,
    coverLetter: '',
    roleName: role.title, // Added role name field
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (Object.values(formData).some((value) => !value)) {
      setPopupMessage('Please fill out all the fields before enrolling.');
      setShowPopup(true);
      return;
    }

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    try {
      // Step 1: Submit data to Google Sheets first
      const googleSheetsResponse = await fetch('/api/googleSheetg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          education: formData.education,
          roleName: formData.roleName,
          coverLetter: formData.coverLetter,
        }),
      });

      if (!googleSheetsResponse.ok) {
        const errorData = await googleSheetsResponse.json();
        throw new Error(errorData.error || 'Failed to submit data to Google Sheets');
      }

      // Step 2: Upload to Google Drive
      const driveResponse = await fetch('/api/uploadTodriveg', {
        method: 'POST',
        body: formDataObj,
      });

      if (!driveResponse.ok) {
        const errorData = await driveResponse.json();
        throw new Error(errorData.error || 'Failed to upload resume to Drive');
      }

      const driveData = await driveResponse.json();
      console.log('File ID:', driveData.fileId);

      toast({
        title: "Success",
        description: "Application submitted successfully!",
      });

      // Reset form data after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        education: '',
        roleName: role.title, // Reset role name field
        resume: null,
        coverLetter: '',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 p-4 overflow-auto">
      <style jsx>{`
        .formContainer {
          width: 100%;
          max-width: 500px;
          margin: auto;
        }
      `}</style>
     <div className="bg-background text-foreground p-6 rounded-lg shadow-lg formContainer">
            <h2 className="text-2xl font-bold mb-4">Enroll for {role.title}</h2>
            <form onSubmit={handleFormSubmit}>
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <Label htmlFor={key} className="block text-lg font-medium mb-2">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                  {key === 'resume' ? (
                    <Input
                      type="file"
                      id={key}
                      name={key}
                      onChange={handleInputChange}
                      className="w-full"
                      required
                      accept=".pdf,.doc,.docx"
                    />
                  ) : (
                    <Input
                      type={key === 'phone' ? 'tel' : 'text'}
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="w-full"
                      required
                      disabled={key === 'roleName'} // Disable roleName input field
                    />
                  )}
                </div>
              ))}
              <Button type="submit">Submit</Button>
            </form>
            <Button onClick={onClose} variant="link" className="mt-4">
              Close
            </Button>
            </div>
      {popupMessage && <Popup message={popupMessage} onClose={() => setPopupMessage('')} />}
    </div>
  );
};

export default GraduateRoleForm;