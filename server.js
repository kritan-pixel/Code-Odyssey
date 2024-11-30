const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
// const userModel = require('./models/user.js')
const app = express();
// const dbConnection = require('./db')
const port = 5500;
// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
// Connect to MongoDB
mongoose.connect('mongodb+srv://goodweb:zabpsc123@cluster0.us4wp.mongodb.net/node').then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
// Define Registration Schema
const registrationSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  fatherName: String,
  motherName: String,
  phone: String,
  email: String,
  birthCertificate: String,
  citizenshipParents: String,
  status: { type: String, default: 'pending' }
});
const Registration = mongoose.model('Registration', registrationSchema);
// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));
// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Handle registration submission
app.post('/upload', upload.fields([
  { name: 'birth_certificate', maxCount: 1 },
  { name: 'citizenship_parents', maxCount: 1 }
]), async (req, res) => {
  try {
    const registration = new Registration({
      name: req.body.name,
      dob: req.body.dob,
      fatherName: req.body.father_name,
      motherName: req.body.mother_name,
      phone: req.body.phone,
      email: req.body.email,
      birthCertificate: req.files.birth_certificate[0].filename,
      citizenshipParents: req.files.citizenship_parents[0].filename
    });
    await registration.save();
    res.status(200).json({ message: 'Registration submitted successfully' });
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ error: 'Error processing registration' });
  }
});
// Get registration status
app.get('/status/:email', async (req, res) => {
  try {
    const registration = await Registration.findOne({ email: req.params.email });
    if (registration) {
      res.json({ status: registration.status });
    } else {
      res.status(404).json({ error: 'Registration not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching status' });
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});