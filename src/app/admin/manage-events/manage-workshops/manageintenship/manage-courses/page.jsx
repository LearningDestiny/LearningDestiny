'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa'
import axios from 'axios'

export default function ManageCourses() {
  const [courses, setCourses] = useState([])
  const [editingCourse, setEditingCourse] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses')
      setCourses(response.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const handleEditCourse = (course) => {
    setEditingCourse({ ...course })
  }

  const handleUpdateCourse = async () => {
    if (!editingCourse) return

    try {
      if (editingCourse.id) {
        await axios.put(`/api/courses?id=${editingCourse.id}`, editingCourse)
      } else {
        await axios.post('/api/courses', editingCourse)
      }
      setEditingCourse(null)
      fetchCourses()
    } catch (error) {
      console.error('Error saving course:', error)
    }
  }

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`/api/courses?id=${id}`)
      fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditingCourse(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditingCourse(prev => prev ? { ...prev, imageUrl: reader.result } : null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHighlightChange = (index, value) => {
    setEditingCourse(prev => {
      if (!prev) return null
      const newHighlights = [...prev.highlights]
      newHighlights[index] = value
      return { ...prev, highlights: newHighlights }
    })
  }

  const handleAddHighlight = () => {
    setEditingCourse(prev => {
      if (!prev) return null
      return { ...prev, highlights: [...prev.highlights, ''] }
    })
  }

  const handleAddCourse = () => {
    setEditingCourse({
      id: 0,
      title: '',
      instructor: '',
      price: '',
      imageUrl: '',
      description: '',
      lastUpdated: new Date().toISOString(),
      duration: '',
      highlights: ['']
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Courses</h1>
      <button
        onClick={handleAddCourse}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
      >
        <FaPlus className="inline mr-2" /> Add New Course
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
            <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover rounded-md mb-4" />
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-2">{course.instructor}</p>
            <p className="text-gray-800 mb-2">{course.price}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEditCourse(course)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                <FaEdit className="inline mr-2" /> Edit
              </button>
              <button
                onClick={() => router.push(`/courses/${course.id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                <FaEye className="inline mr-2" /> View Details
              </button>
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editingCourse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-semibold mb-4">
              {editingCourse.id ? 'Edit Course' : 'Add New Course'}
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateCourse(); }}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editingCourse.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instructor">
                  Instructor
                </label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={editingCourse.instructor}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={editingCourse.price}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={editingCourse.duration}
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
                  value={editingCourse.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  accept="image/*"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Highlights
                </label>
                {editingCourse.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleHighlightChange(index, e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  <FaPlus className="inline mr-2" /> Add Highlight
                </button>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {editingCourse.id ? 'Update Course' : 'Add Course'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
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
  )
}