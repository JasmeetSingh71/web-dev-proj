const express = require('express');
const session = require('express-session');
const main = require("./database");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/users');
const Booking = require("./models/booking");

const app = express();
const PORT = 7001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Home Route
app.get('/', (req, res) => {
  res.redirect('/htmlfiles/proj.html');
});

// Serve Register/Login Pages
app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/htmlfiles/register.html'));
});

app.get('/login.html', (req, res) => {
  if (req.session.user) {
    return res.redirect('/htmlfiles/proj.html');
  }
  res.sendFile(path.join(__dirname, 'public/htmlfiles/login.html'));
});

// Register Route
app.post('/register', async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.send('Username already exists. Try logging in.');
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await User.create({ username: req.body.username, password: hashedPassword });
  res.redirect('/login.html');
});

// Login Route
app.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.send('User not found. Please register first.');
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) {
    return res.send('Incorrect password.');
  }

  // Save user ID and username in session
  req.session.user = {
    id: user._id,
    username: user.username
  };
  res.redirect('/htmlfiles/proj.html');
});

// Get Logged-in User
app.get('/session-user', (req, res) => {
  res.json({ username: req.session.user ? req.session.user.username : null });
});

// Booking Form Handler
app.post('/submit', async (req, res) => {
  if (!req.session.user) {
    return res.send("Please register or log in to book a service.");
  }

  const { firstname, email, date, service } = req.body;

  // Save the booking with reference to logged-in user's ID
  await Booking.create({
    user: req.session.user.id,
    name: firstname,
    email,
    date,
    service
  });

  res.send("Booking saved successfully!");
});

// Get bookings of logged-in user
app.get('/mybookings', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    // Find bookings only for the logged-in user
    const bookings = await Booking.find({ user: req.session.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// Connect to DB and Start Server
main()
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Listening at port http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log('MongoDB error:', err));
