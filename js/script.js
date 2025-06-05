// server.js

const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const PORT = 9000; // Define the PORT variable

// middleware to parse form data
app.use(bodyparser.urlencoded({ extended: true }));

// serve the file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/booking.html');
});

// Handle form submission
app.post('/submit', (req, res) => {
    const data = req.body;

    // Handle checkboxes: Convert hobbies and qualification to arrays
    const normalizeArray = (field) => {
        if (!data[field]) return [];
        return Array.isArray(data[field]) ? data[field] : [data[field]];
    };

    const formData = {
        firstName: data.firstname,
       
        email: data.email,
        date: data.date,
         service: data.service
       
    };

    console.log("Received Form Data:");
    console.log(formData);

    res.send(`
        <h2>✅ Form Submitted Successfully</h2>
        <pre>${JSON.stringify(formData, null, 2)}</pre>
        <a href="/">Go Back</a>
    `);
});

// Start server
app.listen(9000, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
