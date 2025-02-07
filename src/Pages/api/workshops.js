import fs from 'fs/promises'
import path from 'path'

const dataDirectory = path.join(process.cwd(), 'src', 'data')
const workshopsFilePath = path.join(dataDirectory, 'workshops.json')

async function ensureDirectoryExists(directory) {
  try {
    await fs.access(directory)
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(directory, { recursive: true })
    } else {
      throw error
    }
  }
}

async function readWorkshopsFile() {
  try {
    await ensureDirectoryExists(dataDirectory)
    const data = await fs.readFile(workshopsFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create it with initial data
      const initialData = [
        {
          "id": 1,
          "title": "Full-Stack Web Development Workshop",
          "instructor": "Jane Doe",
          "rating": 4.8,
          "ratingCount": 120,
          "price": "2,999 Rs",
          "imageUrl": "https://manilaworkshops.com/wp-content/uploads/2023/04/Manila-Worskhops-2-1024x512.png",
          "lastUpdated": "September 2024",
          "duration": "40 hours",
          "lectureCount": 15,
          "description": "Learn the basics of full-stack web development with hands-on sessions.",
          "highlights": [
            "HTML, CSS, JavaScript Basics",
            "Introduction to Front-end Frameworks",
            "Backend Development with Node.js",
            "Working with Databases",
            "Deploying a Full-Stack Application"
          ],
          "roadmap": [
            {
              "month": "Month 1",
              "weeks": [
                {
                  "week": "Week 1: Introduction to Web Development",
                  "topics": [
                    "Overview of Web Development",
                    "HTML & CSS Basics",
                    "JavaScript Introduction"
                  ]
                },
                {
                  "week": "Week 2: Frontend Development",
                  "topics": [
                    "Working with CSS Frameworks",
                    "JavaScript ES6 Features",
                    "Building Dynamic Web Pages"
                  ]
                },
                {
                  "week": "Week 3: Backend Development",
                  "topics": [
                    "Introduction to Node.js",
                    "Building REST APIs",
                    "Connecting to a Database"
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": 2,
          "title": "Data Analysis Workshop with Python",
          "instructor": "John Smith",
          "rating": 4.7,
          "ratingCount": 180,
          "price": "3,499 Rs",
          "imageUrl": "https://framerusercontent.com/images/OPXPK3EVvWKTxyehPUHeWjtfkA.png",
          "lastUpdated": "October 2024",
          "duration": "30 hours",
          "lectureCount": 10,
          "description": "Learn data analysis using Python libraries like Pandas and NumPy.",
          "highlights": [
            "Data Cleaning with Pandas",
            "Data Visualization with Matplotlib",
            "Data Aggregation and Analysis",
            "Working with Jupyter Notebooks"
          ],
          "roadmap": [
            {
              "month": "Month 1",
              "weeks": [
                {
                  "week": "Week 1: Introduction to Data Analysis",
                  "topics": [
                    "Understanding Data Analysis",
                    "Setting up the Python Environment",
                    "Introduction to Pandas"
                  ]
                },
                {
                  "week": "Week 2: Data Visualization",
                  "topics": [
                    "Using Matplotlib for Visualizing Data",
                    "Creating Plots and Graphs",
                    "Data Presentation Techniques"
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": 3,
          "title": "Digital Marketing Bootcamp",
          "instructor": "Marcus Elias",
          "rating": 5.0,
          "ratingCount": 200,
          "price": "1,299 Rs",
          "imageUrl": "https://academy.skillgenic.in/wp-content/uploads/2020/07/1340caf6112d8998a65f47bbc026.png",
          "lastUpdated": "January 2025",
          "duration": "15 hours",
          "lectureCount": 15,
          "description": "Gain essential digital marketing skills in SEO, social media, content marketing, and analytics",
          "highlights": [
            "Learn social media strategies",
            "Analyze data-driven campaigns",
            "Optimize online business presence",
            "Master SEO and content marketing"
          ],
          "roadmap": [
            {
              "month": "Month 1",
              "weeks": [
                {
                  "week": "Week 1: Introduction to Digital Marketing",
                  "topics": [
                    "Overview of Digital Marketing",
                    "Setting Up a Digital Marketing Strategy",
                    "Introduction to SEO and SEM"
                  ]
                },
                {
                  "week": "Week 2: Social Media Marketing",
                  "topics": [
                    "Understanding Social Media Platforms",
                    "Creating Effective Social Media Campaigns",
                    "Analyzing Social Media Metrics"
                  ]
                }
              ]
            }
          ]
        }  
      ]
      await fs.writeFile(workshopsFilePath, JSON.stringify(initialData, null, 2))
      return initialData
    }
    console.error('Error reading workshops file:', error)
    throw error
  }
}

async function writeWorkshopsFile(workshops) {
  try {
    await ensureDirectoryExists(dataDirectory)
    await fs.writeFile(workshopsFilePath, JSON.stringify(workshops, null, 2))
  } catch (error) {
    console.error('Error writing workshops file:', error)
    throw new Error('Error writing workshops data')
  }
}

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        const workshops = await readWorkshopsFile()
        res.status(200).json(workshops)
        break

      case 'POST':
        console.log('Received POST request')
        console.log('Request body:', req.body)
        
        let newWorkshops = req.body
        if (!Array.isArray(newWorkshops)) {
          newWorkshops = [newWorkshops]
        }
        
        console.log('Processed new workshops:', newWorkshops)
        
        const existingWorkshops = await readWorkshopsFile()
        const updatedWorkshops = [...existingWorkshops, ...newWorkshops]
        
        console.log('Updated workshops array:', updatedWorkshops)
        
        await writeWorkshopsFile(updatedWorkshops)
        res.status(201).json(newWorkshops)
        break

      case 'PUT':
        const updatedWorkshop = req.body
        const workshopsToUpdate = await readWorkshopsFile()
        const updateIndex = workshopsToUpdate.findIndex((w) => w.id === parseInt(req.query.id))

        if (updateIndex !== -1) {
          workshopsToUpdate[updateIndex] = updatedWorkshop
          await writeWorkshopsFile(workshopsToUpdate)
          res.status(200).json(updatedWorkshop)
        } else {
          res.status(404).json({ message: 'Workshop not found' })
        }
        break

      case 'DELETE':
        const { id } = req.query

        if (!id) {
          res.status(400).json({ message: 'Invalid workshop ID' })
          break
        }

        const workshopsToFilter = await readWorkshopsFile()
        const filteredWorkshops = workshopsToFilter.filter((w) => w.id !== parseInt(id))

        if (workshopsToFilter.length !== filteredWorkshops.length) {
          await writeWorkshopsFile(filteredWorkshops)
          res.status(200).json({ message: 'Workshop deleted successfully' })
        } else {
          res.status(404).json({ message: 'Workshop not found' })
        }
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
        break
    }
  } catch (error) {
    console.error('Error in API handler:', error)
    res.status(500).json({ message: 'Internal server error', error: error.toString() })
  }
}