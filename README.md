Got you Lemon — same content, just cleaned into **H1, H2, UL, LI** style for your GitHub README (no HTML, no code blocks).

---

# LearnHub – Student Teacher Portal

A comprehensive web platform for managing student–teacher interactions, assignments, grading, and communication.

---

## Features

## For Students

* View and submit assignments with PDF uploads
* Track grades and academic progress
* Receive teacher announcements
* Direct messaging with teachers
* Real-time assignment status updates

## For Teachers

* Create and manage assignments
* Track student progress with analytics
* Grade submissions and provide feedback
* Broadcast announcements
* Communicate with students
* Export progress reports as CSV

---

## Tech Stack

* Frontend: HTML5, CSS3, JavaScript
* Backend: Node.js, Express.js, MongoDB
* Authentication: JWT, Bcrypt
* Storage: MongoDB GridFS (for PDF files)
* Deployment: Render.com, MongoDB Atlas

---

## Project Structure

* learnhub
* frontend
* index.html – Home page
* login.html – Authentication
* dashboard.html – Student dashboard
* teacher-dashboard.html – Teacher dashboard
* style.css – Stylesheet
* script.js – Client logic
* backend
* server.js – Express server
* package.json – Dependencies
* render.yaml – Deployment config
* README.md – Documentation

---

## Setup Instructions

## Step 1 – Clone the repository

* git clone [https://github.com/Sahana8866/learnhub.git](https://github.com/Sahana8866/learnhub.git)
* cd learnhub

## Step 2 – Install dependencies

* npm install

## Step 3 – Configure environment variables

* Create a .env file inside the backend folder
* Add the following variables
* MONGODB_URI
* JWT_SECRET
* PORT

## Step 4 – Run the application

* npm start
* Application runs at [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

* POST /api/register – User registration
* POST /api/login – User authentication
* POST /api/create-assignment – Create assignment (teacher)
* GET /api/assignments – Get assignments
* POST /api/submit-assignment – Submit assignment (student)
* GET /api/teacher/assignments – Get teacher’s assignments
* POST /api/grade-submission – Grade submission (teacher)
* GET /api/student-progress – Student progress analytics

---

## Deployment

* Deployed on Render.com
* Database hosted on MongoDB Atlas
* Frontend served statically from the backend server

---

## Recent Updates

## Student Progress Tracker Feature

* Added progress tracking dashboard for teachers
* Visual progress bars showing submission rates
* Average grade calculations per student
* CSV export functionality for data analysis
* Class summary statistics

---

## License

* MIT License
* See LICENSE file for details

---

If you want, Sky can also make a **shorter README version** for recruiters or a **more professional academic one** for ESA 👀
