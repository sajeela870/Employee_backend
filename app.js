const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// Middleware
app.use(express.static(path.join(__dirname + '/dist/FrontEnd')));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://sarithasasidharan0:5McpFhUIKSDMIEw9@cluster0.jgzclu4.mongodb.net/newEmployeeDb?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Define schema and model
const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);

// TODO: Get data from db using API '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TODO: Get single data from db using API '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TODO: Send data to db using API '/api/employeelist'
// Request body format: {name:'', location:'', position:'', salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.json(savedEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TODO: Delete employee data from db by using API '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(deletedEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TODO: Update employee data in db using API '/api/employeelist/:id'
// Request body format: {name:'', location:'', position:'', salary:''}
app.put('/api/employeelist/:id', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(updatedEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Don't delete this code. It connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/FrontEnd/index.html'));
});

// Check for available port
const PORT = process.env.PORT || 3700;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
