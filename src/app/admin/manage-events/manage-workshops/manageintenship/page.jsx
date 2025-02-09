'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';

export default function ManageInternships() {
  const [internships, setInternships] = useState([]);
  const [editingInternship, setEditingInternship] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await fetch('/api/internships');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setInternships(data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

  const handleEditInternship = (internship) => {
    setEditingInternship({ ...internship, highlights: internship.highlights || [] });
  };

  const handleUpdateInternship = async (e) => {
    e.preventDefault();
    try {
      if (!editingInternship) return;

      const url = editingInternship.id
        ? `/api/internships?id=${editingInternship.id}`
        : '/api/internships';
      const method = editingInternship.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingInternship),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setEditingInternship(null);
      fetchInternships();
    } catch (error) {
      console.error('Error saving internship:', error);
    }
  };

  const handleDeleteInternship = async (id) => {
    try {
      const response = await fetch(`/api/internships?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchInternships();
    } catch (error) {
      console.error('Error deleting internship:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingInternship((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingInternship((prev) => prev ? { ...prev, imageUrl: reader.result } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHighlightChange = (index, value) => {
    setEditingInternship((prev) => {
      if (!prev) return null;
      const newHighlights = [...prev.highlights];
      newHighlights[index] = value;
      return { ...prev, highlights: newHighlights };
    });
  };

  const handleAddHighlight = () => {
    setEditingInternship((prev) => {
      if (!prev) return null;
      return { ...prev, highlights: [...(prev.highlights || []), ''] };
    });
  };

  const handleAddInternship = () => {
    setEditingInternship({
      id: '',
      title: '',
      company: '',
      stipend: '',
      duration: '',
      description: '',
      summaryDescription: '',
      imageUrl: '',
      highlights: [''],
      location: '',
      organizer: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Header />
      <h1 className="text-3xl font-bold mb-8">Manage Internships</h1>
      <button
        onClick={handleAddInternship}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 cursor-pointer"
      >
        <FaPlus className="inline mr-2" /> Add New Internship
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => (
          <div key={internship.id} className="bg-white rounded-lg shadow-md p-6">
            <img
              src={internship.imageUrl}
              alt={internship.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{internship.title}</h2>
            <p className="text-gray-600 mb-2">{internship.company}</p>
            <p className="text-gray-800 mb-2">{internship.stipend}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEditInternship(internship)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 cursor-pointer"
              >
                <FaEdit className="inline mr-2" /> Edit
              </button>
              <button
                onClick={() => router.push(`/internship/${internship.id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 cursor-pointer"
              >
                <FaEye className="inline mr-2" /> View Details
              </button>
              <button
                onClick={() => handleDeleteInternship(internship.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 cursor-pointer"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingInternship && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-semibold mb-4">
              {editingInternship.id ? 'Edit Internship' : 'Add New Internship'}
            </h3>
            <form onSubmit={handleUpdateInternship}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingInternship.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={editingInternship.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Stipend
                </label>
                <input
                  type="text"
                  name="stipend"
                  value={editingInternship.stipend}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={editingInternship.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editingInternship.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Summary Description
                </label>
                <textarea
                  name="summaryDescription"
                  value={editingInternship.summaryDescription}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  rows={2}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={editingInternship.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={editingInternship.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Organizer
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={editingInternship.organizer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Highlights
                </label>
                {editingInternship.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) =>
                        handleHighlightChange(index, e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingInternship((prev) => ({
                          ...prev,
                          highlights: prev.highlights.filter(
                            (_, i) => i !== index
                          ),
                        }))
                      }
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                >
                  <FaPlus className="inline mr-2" /> Add Highlight
                </button>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {editingInternship.id ? 'Update Internship' : 'Add Internship'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingInternship(null)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
