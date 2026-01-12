<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LearnHub - Student Teacher Portal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f7fa;
            color: #333;
            line-height: 1.6;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #3498db;
        }
        
        h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        
        .tagline {
            color: #3498db;
            font-size: 1.2em;
            font-weight: 500;
        }
        
        .badges {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        
        .badge {
            background: #3498db;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
        }
        
        .badge.node { background: #339933; }
        .badge.mongo { background: #47A248; }
        .badge.render { background: #46E3B7; color: #333; }
        
        h2 {
            color: #2c3e50;
            margin: 30px 0 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        
        h3 {
            color: #3498db;
            margin: 25px 0 15px;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .feature-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }
        
        .feature-card h4 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        ul {
            padding-left: 20px;
            margin: 15px 0;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin: 20px 0;
        }
        
        .tech-item {
            background: #e3f2fd;
            padding: 8px 15px;
            border-radius: 5px;
            font-weight: 500;
        }
        
        .setup-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #ddd;
        }
        
        pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
        }
        
        code {
            background: #f1f1f1;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        
        .endpoint-list {
            margin: 20px 0;
        }
        
        .endpoint {
            background: #f8f9fa;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 3px solid #3498db;
        }
        
        .method {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 3px;
            font-weight: bold;
            font-size: 12px;
            margin-right: 10px;
        }
        
        .method.get { background: #61affe; color: white; }
        .method.post { background: #49cc90; color: white; }
        
        .update-card {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2ecc71;
        }
        
        footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
        }
        
        .buttons {
            display: flex;
            gap: 15px;
            margin: 20px 0;
            justify-content: center;
        }
        
        .btn {
            padding: 10px 25px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 500;
            transition: background 0.3s;
        }
        
        .btn:hover {
            background: #2980b9;
        }
        
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .container {
                padding: 20px;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
            
            h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>LearnHub - Student Teacher Portal</h1>
            <p class="tagline">A comprehensive web platform for managing student-teacher interactions</p>
            
            <div class="badges">
                <span class="badge">Node.js</span>
                <span class="badge mongo">MongoDB</span>
                <span class="badge render">Render.com</span>
                <span class="badge">JWT Auth</span>
            </div>
        </header>

        <section>
            <h2>Overview</h2>
            <p>LearnHub is a full-stack web application that facilitates seamless interaction between students and teachers. It provides a complete solution for assignment management, grading, announcements, and communication.</p>
            
            <div class="buttons">
                <a href="https://github.com/Sahana8866/learnhub" class="btn">View on GitHub</a>
                <a href="https://your-render-url.onrender.com" class="btn">Live Demo</a>
            </div>
        </section>

        <section>
            <h2>Features</h2>
            
            <h3>For Students</h3>
            <div class="features-grid">
                <div class="feature-card">
                    <h4>Assignment Management</h4>
                    <p>View, submit, and track assignments with PDF upload capability</p>
                </div>
                <div class="feature-card">
                    <h4>Grade Tracking</h4>
                    <p>Monitor grades and academic progress with detailed reports</p>
                </div>
                <div class="feature-card">
                    <h4>Communication</h4>
                    <p>Direct messaging with teachers and announcement viewing</p>
                </div>
            </div>

            <h3>For Teachers</h3>
            <div class="features-grid">
                <div class="feature-card">
                    <h4>Assignment Creation</h4>
                    <p>Create assignments with deadlines, descriptions, and maximum marks</p>
                </div>
                <div class="feature-card">
                    <h4>Student Progress Tracker</h4>
                    <p>Monitor submission rates and performance with visual analytics</p>
                </div>
                <div class="feature-card">
                    <h4>Grading System</h4>
                    <p>Efficiently grade submissions and provide feedback</p>
                </div>
                <div class="feature-card">
                    <h4>Data Export</h4>
                    <p>Export student progress reports as CSV files</p>
                </div>
            </div>
        </section>

        <section>
            <h2>Technology Stack</h2>
            <div class="tech-stack">
                <div class="tech-item">HTML5</div>
                <div class="tech-item">CSS3</div>
                <div class="tech-item">JavaScript</div>
                <div class="tech-item">Node.js</div>
                <div class="tech-item">Express.js</div>
                <div class="tech-item">MongoDB</div>
                <div class="tech-item">MongoDB Atlas</div>
                <div class="tech-item">GridFS</div>
                <div class="tech-item">JWT</div>
                <div class="tech-item">Render.com</div>
            </div>
        </section>


        <section>
            <h2>Setup Instructions</h2>
            <div class="setup-box">
                <h3>1. Clone the repository</h3>
                <pre><code>git clone https://github.com/Sahana8866/learnhub.git
cd learnhub</code></pre>
                
                <h3>2. Install dependencies</h3>
                <pre><code>npm install</code></pre>
                
                <h3>3. Configure environment variables</h3>
                <p>Create <code>.env</code> file in backend folder:</p>
                <pre><code>MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000</code></pre>
                
                <h3>4. Run the application</h3>
                <pre><code>npm start</code></pre>
                <p>Application will be available at <code>http://localhost:3000</code></p>
            </div>
        </section>

        <section>
            <h2>Key API Endpoints</h2>
            <div class="endpoint-list">
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/api/register</strong> - User registration
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/api/login</strong> - User authentication
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/api/create-assignment</strong> - Create assignment (teacher only)
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/api/assignments</strong> - Get all assignments
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/api/submit-assignment</strong> - Submit assignment (student only)
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/api/student-progress</strong> - Student progress analytics (teacher only)
                </div>
            </div>
        </section>

        <section>
            <h2>Recent Updates</h2>
            <div class="update-card">
                <h3>Student Progress Tracker Feature</h3>
                <ul>
                    <li>Added comprehensive progress tracking dashboard for teachers</li>
                    <li>Visual progress bars showing student submission rates</li>
                    <li>Average grade calculations per student with color coding</li>
                    <li>CSV export functionality for data analysis</li>
                    <li>Class summary statistics and overall progress metrics</li>
                </ul>
            </div>
        </section>

        <footer>
            <p>Developed by Sahana8866 | MIT License</p>
            <p>Contact: rsahana8310@gmail.com</p>
        </footer>
    </div>
</body>
</html>
