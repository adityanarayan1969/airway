import express from 'express';
import Flight from '../models/Flight.js';
import connectToDatabase from '../db.js'; // Ensure you have a db.js for connecting to MongoDB

import { checkAuth } from './auth.js'; // Import the middleware

const router = express.Router();

router.post('/search', async (req, res) => {
  try {
    const { from, to, date } = req.body;
    const flights = await Flight.find({ departureAirport: from, arrivalAirport: to, date });
    res.render('index', { flightResults: flights });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/check-status', async (req, res) => {
    try {
      const { flightNumber, date } = req.body;
      const flight = await Flight.findOne({ flightNumber, date });
  
      if (!flight) {
        return res.status(404).json({ error: 'Flight not found' });
      }
  
      const currentTime = new Date();
      const currentYear = currentTime.getFullYear();
      const currentMonth = currentTime.getMonth();
      const currentDate = currentTime.getDate();
  
      const flightDate = new Date(date);
      const departureDateTime = new Date(flightDate);
      const [departureHours, departureMinutes] = flight.departureTime.split(':').map(Number);
      departureDateTime.setHours(departureHours, departureMinutes);
  
      const arrivalDateTime = new Date(flightDate);
      const [arrivalHours, arrivalMinutes] = flight.arrivalTime.split(':').map(Number);
      arrivalDateTime.setHours(arrivalHours, arrivalMinutes);
  
      // Check if arrival time is actually on the next day
      if (arrivalHours < departureHours) {
        arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
      }
  
      let flightStatus;
  
      if (currentTime < departureDateTime) {
        flightStatus = 'Not Departed Yet';
      } else if (currentTime >= departureDateTime && currentTime < arrivalDateTime) {
        flightStatus = 'In Air';
      } else {
        flightStatus = 'Landed';
      }
  
      console.log('Flight Status:', flightStatus);
      res.render('track', { flightStatus });
    } catch (error) {
      console.error('Error checking flight status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
 
  

  router.post('/book', checkAuth, async (req, res) => {
    try {
      const { firstName, lastName, gender, age, email, phone, flightNumber, departureTime, departureAirport, arrivalTime, arrivalAirport, date, duration, price } = req.body;
  
      const passengerDetails = { firstName, lastName, gender, age, email, phone };
      const flightData = { flightNumber, departureTime, departureAirport, arrivalTime, arrivalAirport, date, duration, price };
  
      // Get the user ID from the session
      const userId = req.session.user._id;
  
      // Find the flight by flightNumber and date
      const flight = await Flight.findOne({ flightNumber, date });
  
      if (!flight) {
        return res.status(404).json({ error: 'Flight not found' });
      }
  
      // Add the user ID to the bookedBy field
      flight.bookedBy.push(userId);
      await flight.save();
  
      res.render('confirmation', { passengerDetails, flightData });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  







/*


router.get('/enter-flight', (req, res) => {
    res.render('enterFlight');
  });
  
  router.post('/add-flight', async (req, res) => {
    try {
      const flightData = {
        flightNumber: req.body.flightNumber,
        departureAirport: req.body.departureAirport,
        arrivalAirport: req.body.arrivalAirport,
        departureTime: req.body.departureTime,
        arrivalTime: req.body.arrivalTime,
        date: req.body.date,
        duration: req.body.duration,
        price: req.body.price
      };
  
      const newFlight = await Flight.createFlight(flightData);
      console.log('Flight created successfully:', newFlight);
      res.send('Flight created successfully');
    } catch (error) {
      console.error('Error creating flight:', error);
      res.status(500).send('Internal Server Error');
    }
  });



*/

export default router;
