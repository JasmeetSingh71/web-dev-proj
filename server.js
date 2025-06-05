const express = require('express');

const session = require('express-session');
const main=require("./database")
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const User=require("./users");
const Booking=require("./booking");



const app = express();
const PORT = 7001;

//  Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

app.get('/', (req, res) => {
  res.redirect('/proj.html');
});

//  Serve Register/Login Pages
app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/login.html', (req, res) => {
  if (req.session.user) {
    return res.redirect('/proj.html');
  }
  res.sendFile(path.join(__dirname, 'login.html'));
});


//  Register Route
app.post('/register', async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.send('Username already exists. Try logging in.');
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await User.create({ username: req.body.username, password: hashedPassword });
  res.redirect('/login.html');
});

//  Login Route
app.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.send('User not found. Please register first.');
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) {
    return res.send(' Incorrect password.');
  }

  req.session.user = user.username;
  res.redirect('/proj.html');
});



//  API to Get Current Logged-in User
app.get('/session-user', (req, res) => {
  res.json({ username: req.session.user || null });
});

//  Booking Form Handler
app.post('/submit', async (req, res) => {
  if (!req.session.user) {
    return res.send(" Please register or log in to book a service.");
  }

  const { firstname, email, date, service } = req.body;

  await Booking.create({
    user: req.session.user,
    name: firstname,
    email,
    date,
    service
  });

  res.send(" Booking saved successfully!");
});

//  Start the Server


main()
  .then(()=>{
    console.log("connected to db")
  app.listen(PORT, ()=>{
    console.log(`Listening at port http://localhost:${PORT}`);
})
  })
.catch((err)=>console.log('MongoDB err:', err))
