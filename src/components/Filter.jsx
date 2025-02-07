import React from "react"

const Filter = ({ selectedCategories, handleCategoryChange }) => {
  const categories = [
    "Web Development",
    "Programming",
    "Data Science",
    "Artificial Intelligence",
    "CSS and Design",
    "Python",
  ]

  return (
    <div className="p-4 rounded-lg">
      <h4 className="text-black font-bold mb-4 text-xl -ml-20">Categories</h4>
      {categories.map((category) => (
        <div key={category} className="flex items-center mb-5 -ml-20 mt-7">
          <input
            type="checkbox"
            id={category}
            checked={selectedCategories.includes(category)}
            onChange={() => handleCategoryChange(category)}
            className="mr-2"
          />
          <label htmlFor={category} className="text-black text-sm">
            {category}
          </label>
        </div>
      ))}
    </div>
  )
}

export default Filter

