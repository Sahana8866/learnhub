// ============================================
// LEARNHUB - FINAL WORKING VERSION
// ============================================

// Update these lines at the top of server.js:
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rsahana8310_db_user:zHjcM3OH7wmEgdZx@cluster0.unmwb5r.mongodb.net/learnhub?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'learnhub_secret_key_2024_secure_123';
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting LearnHub Server...');

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// ============ MIDDLEWARE SETUP ============

app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// ============ DATABASE CONNECTION ============

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB Atlas connected successfully!');
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
});

// ============ DATABASE SCHEMAS ============

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    maxMarks: { type: Number, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

const submissionSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submission: { type: String, default: '' },
    pdfFile: { type: String },
    grade: { type: Number },
    submittedAt: { type: Date, default: Date.now },
    gradedAt: { type: Date }
});

const Submission = mongoose.model('Submission', submissionSchema);

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', messageSchema);

// ============ AUTHENTICATION MIDDLEWARE ============

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied' });
    }
    
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token error:', err.message);
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// ============ API ROUTES ============

// 1. REGISTER
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        
        await user.save();
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.role, 
                name: user.name 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            userId: user._id,
            name: user.name,
            role: user.role,
            email: user.email
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 3. CREATE ASSIGNMENT
app.post('/api/create-assignment', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ error: 'Only teachers can create assignments' });
        }
        
        const { title, description, dueDate, maxMarks } = req.body;
        
        const assignment = new Assignment({
            title,
            description,
            dueDate,
            maxMarks,
            teacherId: req.user.userId
        });
        
        await assignment.save();
        
        res.json({ 
            message: 'Assignment created successfully', 
            assignment: {
                id: assignment._id,
                title: assignment.title,
                description: assignment.description,
                dueDate: assignment.dueDate,
                maxMarks: assignment.maxMarks
            }
        });
    } catch (error) {
        console.error('Create assignment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 4. GET ASSIGNMENTS
app.get('/api/assignments', authenticateToken, async (req, res) => {
    try {
        const assignments = await Assignment.find().populate('teacherId', 'name');
        const submissions = await Submission.find({ studentId: req.user.userId });
        
        const assignmentsWithStatus = assignments.map(assignment => {
            const submission = submissions.find(sub => 
                sub.assignmentId.toString() === assignment._id.toString()
            );
            
            return {
                _id: assignment._id,
                title: assignment.title,
                description: assignment.description,
                dueDate: assignment.dueDate,
                maxMarks: assignment.maxMarks,
                teacher: assignment.teacherId?.name || 'Unknown Teacher',
                status: submission ? (submission.grade ? 'graded' : 'submitted') : 'pending',
                grade: submission?.grade,
                submissionId: submission?._id
            };
        });
        
        res.json(assignmentsWithStatus);
    } catch (error) {
        console.error('Get assignments error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 5. SUBMIT ASSIGNMENT (WITH FILE UPLOAD)
app.post('/api/submit-assignment', authenticateToken, upload.single('pdfFile'), async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ error: 'Only students can submit assignments' });
        }
        
        const assignmentId = req.body.assignmentId;
        const submission = req.body.submission;
        const pdfFile = req.file ? req.file.filename : null;
        
        console.log('📤 Submission:', { assignmentId, hasText: !!submission, hasFile: !!pdfFile });
        
        if (!assignmentId || (!submission && !pdfFile)) {
            return res.status(400).json({ error: 'Assignment ID and either submission text or PDF file is required' });
        }
        
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        
        const existingSubmission = await Submission.findOne({
            assignmentId,
            studentId: req.user.userId
        });
        
        if (existingSubmission) {
            existingSubmission.submission = submission || existingSubmission.submission;
            existingSubmission.pdfFile = pdfFile || existingSubmission.pdfFile;
            existingSubmission.submittedAt = new Date();
            await existingSubmission.save();
            
            return res.json({ message: 'Assignment updated successfully' });
        }
        
        const newSubmission = new Submission({
            assignmentId,
            studentId: req.user.userId,
            submission: submission || '',
            pdfFile: pdfFile || null
        });
        
        await newSubmission.save();
        
        res.json({ message: 'Assignment submitted successfully' });
    } catch (error) {
        console.error('Submit assignment error:', error);
        
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        
        res.status(500).json({ error: 'Server error' });
    }
});

// 6. GET TEACHER'S ASSIGNMENTS
app.get('/api/teacher/assignments', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const assignments = await Assignment.find({ teacherId: req.user.userId });
        
        const assignmentsWithCounts = await Promise.all(assignments.map(async (assignment) => {
            const submissionCount = await Submission.countDocuments({ 
                assignmentId: assignment._id 
            });
            
            const gradedCount = await Submission.countDocuments({ 
                assignmentId: assignment._id,
                grade: { $exists: true }
            });
            
            return {
                ...assignment.toObject(),
                submissions: submissionCount,
                graded: gradedCount,
                pending: submissionCount - gradedCount
            };
        }));
        
        res.json(assignmentsWithCounts);
    } catch (error) {
        console.error('Get teacher assignments error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 7. GET SUBMISSIONS
app.get('/api/teacher/submissions', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const submissions = await Submission.find()
            .populate('studentId', 'name email')
            .populate('assignmentId', 'title maxMarks')
            .sort({ submittedAt: -1 });
        
        const teacherAssignments = await Assignment.find({ teacherId: req.user.userId });
        const teacherAssignmentIds = teacherAssignments.map(a => a._id);
        
        const filteredSubmissions = submissions.filter(sub => 
            teacherAssignmentIds.some(id => id.toString() === sub.assignmentId._id.toString())
        );
        
        res.json(filteredSubmissions);
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 8. CREATE ANNOUNCEMENT
app.post('/api/create-announcement', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ error: 'Only teachers can create announcements' });
        }
        
        const { title, message } = req.body;
        
        const announcement = new Announcement({
            title,
            message,
            teacherId: req.user.userId
        });
        
        await announcement.save();
        
        res.json({ 
            message: 'Announcement created successfully', 
            announcement: {
                id: announcement._id,
                title: announcement.title,
                message: announcement.message,
                createdAt: announcement.createdAt
            }
        });
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 9. GET ANNOUNCEMENTS
app.get('/api/announcements', authenticateToken, async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .populate('teacherId', 'name')
            .sort({ createdAt: -1 })
            .limit(20);
        
        res.json(announcements);
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 10. GET TEACHERS
app.get('/api/teachers', authenticateToken, async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('name email');
        res.json(teachers);
    } catch (error) {
        console.error('Get teachers error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 11. GET STUDENTS
app.get('/api/students', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const students = await User.find({ role: 'student' }).select('name email');
        res.json(students);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 12. SEND MESSAGE
app.post('/api/send-message', authenticateToken, async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        
        const newMessage = new Message({
            senderId: req.user.userId,
            receiverId,
            message
        });
        
        await newMessage.save();
        
        res.json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 13. GET MESSAGES
app.get('/api/messages/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        
        const messages = await Message.find({
            $or: [
                { senderId: req.user.userId, receiverId: userId },
                { senderId: userId, receiverId: req.user.userId }
            ]
        })
        .sort({ createdAt: 1 })
        .populate('senderId', 'name role');
        
        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 14. GRADE ASSIGNMENT
// 14. GRADE ASSIGNMENT - FIXED VERSION
app.post('/api/grade-submission', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const { submissionId, grade } = req.body;
        
        // Validate grade is a number
        const gradeNum = parseFloat(grade);
        if (isNaN(gradeNum)) {
            return res.status(400).json({ error: 'Grade must be a number' });
        }
        
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }
        
        const assignment = await Assignment.findById(submission.assignmentId);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        
        if (assignment.teacherId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Not authorized to grade this submission' });
        }
        
        // ✅ FIX: Validate grade is not more than maxMarks
        if (gradeNum > assignment.maxMarks) {
            return res.status(400).json({ 
                error: `Grade cannot exceed maximum marks (${assignment.maxMarks})` 
            });
        }
        
        // ✅ FIX: Validate grade is not negative
        if (gradeNum < 0) {
            return res.status(400).json({ 
                error: 'Grade cannot be negative' 
            });
        }
        
        submission.grade = gradeNum;
        submission.gradedAt = new Date();
        await submission.save();
        
        console.log(`✅ Grade ${gradeNum}/${assignment.maxMarks} assigned to submission ${submissionId}`);
        res.json({ 
            message: 'Grade submitted successfully',
            grade: gradeNum,
            maxMarks: assignment.maxMarks
        });
    } catch (error) {
        console.error('Grade submission error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 15. GET GRADES
app.get('/api/grades', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const submissions = await Submission.find({ studentId: req.user.userId })
            .populate('assignmentId', 'title maxMarks')
            .sort({ gradedAt: -1 });
        
        const grades = submissions
            .filter(sub => sub.grade !== undefined && sub.grade !== null)
            .map(sub => ({
                assignment: sub.assignmentId.title,
                maxMarks: sub.assignmentId.maxMarks,
                grade: sub.grade,
                percentage: Math.round((sub.grade / sub.assignmentId.maxMarks) * 100),
                gradedAt: sub.gradedAt
            }));
        
        res.json(grades);
    } catch (error) {
        console.error('Get grades error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 16. HEALTH CHECK
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'LearnHub API is running',
        timestamp: new Date().toISOString()
    });
});

// ============ START SERVER ============

// Change the app.listen line to:
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '='.repeat(50));
    console.log('🎓 LEARNHUB - Student-Teacher Portal');
    console.log('='.repeat(50));
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
    console.log('🌐 Application is ready!');
    console.log('='.repeat(50));
});