# LearnHub – Student Teacher Portal

A comprehensive web platform for managing student–teacher interactions, assignments, grading, and communication.


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


## Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js, Express.js, MongoDB
* Authentication: JWT, Bcrypt
* Storage: MongoDB GridFS (for PDF files)
* Deployment: Render.com, MongoDB Atlas
  

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


## Deployment

* Deployed on Render.com
* Database hosted on MongoDB Atlas
* Frontend served statically from the backend server
* Application available at https://learnhub-pnm3.onrender.com



