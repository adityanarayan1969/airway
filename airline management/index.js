import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import authRouter from './routers/auth.js';
import flightsRouter from './routers/flights.js';
import connectToDatabase from './db.js';
import Flight from './models/Flight.js';
import { checkAuth } from './routers/auth.js'; // Import the middleware

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({
  secret: 'key-bro',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.get('/', (req, res) => {
  res.render('home');
});

app.use('/', authRouter);
app.use('/', flightsRouter);

app.get('/book', checkAuth, (req, res) => {
  const flightData = JSON.parse(decodeURIComponent(req.query.flightData));
  res.render('booking', { flightData });
});
/*
app.post('/book', checkAuth, (req, res) => {
  try {
    const { firstName, lastName, gender, age, email, phone, flightNumber, departureTime, departureAirport, arrivalTime, arrivalAirport, date, price } = req.body;

    const passengerDetails = { firstName, lastName, gender, age, email, phone };
    const flightData = { flightNumber, departureTime, departureAirport, arrivalTime, arrivalAirport, date, price };

    res.render('confirmation', { passengerDetails, flightData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});*/

/*app.post('/book', checkAuth, async (req, res) => {
  try {
    const { firstName, lastName, gender, age, email, phone, flightNumber, departureTime, departureAirport, arrivalTime, arrivalAirport, date, price } = req.body;

    const passengerDetails = { firstName, lastName, gender, age, email, phone };
    const flightData = { flightNumber, departureTime, departureAirport, arrivalTime, arrivalAirport, date, price };

    // Get the user ID from the session
    const userId = req.session.user._id;

    // Save the flight data to the database with the user ID
    

    res.render('confirmation', { passengerDetails, flightData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});*/






app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

app.get('/track', (req, res) => {
  res.render('track');
});

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error starting server:', error);
  });
