'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const ManageCareers = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [graduateRoles, setGraduateRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const [jobPostingsResponse, graduateRolesResponse] = await Promise.all([
        axios.get('/api/careers'),
        axios.get('/api/graduate-roles')
      ]);
      setJobPostings(jobPostingsResponse.data || []);
      setGraduateRoles(graduateRolesResponse.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleEditRole = (role, type) => {
    setEditingRole({ ...role, type });
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    try {
      const endpoint = editingRole.type === 'graduate' ? '/api/graduate-roles' : '/api/careers';
      await axios.put(`${endpoint}?id=${editingRole.id}`, editingRole);
      setEditingRole(null);
      fetchRoles();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteRole = async (id, type) => {
    try {
      const endpoint = type === 'graduate' ? '/api/graduate-roles' : '/api/careers';
      await axios.delete(`${endpoint}?id=${id}`);
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setEditingRole((prev) => (prev ? { ...prev, [name]: files ? files[0] : value } : null));
  };

  const handleAddRole = (type) => {
    setEditingRole({
      id: 0,
      title: '',
      location: '',
      experience: type === 'graduate' ? 'Fresher' : '',
      date: '',
      description: '',
      requirements: [],
      type
    });
  };

  const handleRequirementsChange = (index, value) => {
    const newRequirements = [...editingRole.requirements];
    newRequirements[index] = value;
    setEditingRole((prev) => (prev ? { ...prev, requirements: newRequirements } : null));
  };

  const handleAddRequirement = () => {
    setEditingRole((prev) => (prev ? {
      ...prev,
      requirements: [...prev.requirements, '']
    } : null));
  };

  const handleRemoveRequirement = (index) => {
    const newRequirements = editingRole.requirements.filter((_, i) => i !== index);
    setEditingRole((prev) => (prev ? { ...prev, requirements: newRequirements } : null));
  };

  const renderRoleCards = (roles, type) => (
    <>
      <h2 className="text-2xl font-bold mb-4">{type === 'graduate' ? 'Graduate Roles' : 'Job Postings'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {roles?.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{role.title}</h2>
            <p className="text-gray-600 mb-2">{role.location}</p>
            <p className="text-gray-800 mb-2">{role.experience}</p>
            <p className="text-gray-800 mb-2">{role.date}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEditRole(role, type)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                <FaEdit className="inline mr-2" /> Edit
              </button>
              <button
                onClick={() => router.push(`/careers/${role.id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                <FaEye className="inline mr-2" /> View Details
              </button>
              <button
                onClick={() => handleDeleteRole(role.id, type)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Careers</h1>
      <div className="flex mb-6 space-x-4">
        <button
          onClick={() => handleAddRole('job')}
          className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          <FaPlus className="inline mr-2" /> Add New Job Posting
        </button>
        <button
          onClick={() => handleAddRole('graduate')}
          className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          <FaPlus className="inline mr-2" /> Add New Graduate Role
        </button>
      </div>

      {renderRoleCards(jobPostings, 'job')}
      {renderRoleCards(graduateRoles, 'graduate')}

      {editingRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-semibold mb-4">
              {editingRole.id ? 'Edit Role' : 'Add New Role'}
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateRole(); }}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editingRole.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={editingRole.location}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience">
                  Experience
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={editingRole.experience}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={editingRole.date}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editingRole.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Requirements
                </label>
                {editingRole.requirements.map((req, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleRequirementsChange(index, e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  Add Requirement
                </button>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {editingRole.id ? 'Update Role' : 'Add Role'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
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

export default ManageCareers;