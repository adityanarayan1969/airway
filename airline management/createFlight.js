

/*import mongoose from 'mongoose';
import Flight from './models/Flight.js';

const url = 'mongodb://localhost:27017/flgp';

async function createNewFlight() {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to database');

    const flightData = {
      flightNumber: 'kA104',
      departureAirport: 'JFK',
      arrivalAirport: 'LAX',
      departureTime: '22:00',
      arrivalTime: '4:00',
      date: '2023-06-15',
      duration: '6h',
      price: 300
    };

    // Assume you have aD ( user Ireplace 'someUserId' with an actual user ID)
    
   
    const newFlight = await Flight.createFlight(flightData);
    console.log('Flight created successfully:', newFlight);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating flight:', error);
  }
}

createNewFlight();*/


/*import mongoose from 'mongoose';
import Flight from './models/Flight.js';

const url = 'mongodb://localhost:27017/flgp';

const popularCities = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Ahmedabad',
  'Pune',
  'Goa',
  'Jaipur'
];

function getRandomTime() {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

async function createNewFlights(date) {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to database');

    for (let i = 0; i < 10; i++) {
      const departureCity = popularCities[Math.floor(Math.random() * popularCities.length)];
      let arrivalCity;
      do {
        arrivalCity = popularCities[Math.floor(Math.random() * popularCities.length)];
      } while (arrivalCity === departureCity);

      const flightData = {
        flightNumber: `KA10${i}`,
        departureAirport: departureCity,
        arrivalAirport: arrivalCity,
        departureTime: getRandomTime(),
        arrivalTime: getRandomTime(),
        date: date,
        duration: `${Math.floor(Math.random() * 10) + 1}h`,
        price: (Math.floor(Math.random() * 1000) + 100)*10
      };

      const newFlight = await Flight.createFlight(flightData);
      console.log('Flight created successfully:', newFlight);
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating flights:', error);
  }
}

// Call the function with a specific date
createNewFlights('2024-06-15');

*/

import mongoose from 'mongoose';
import Flight from './models/Flight.js';

const url = 'mongodb://localhost:27017/flgp';

const popularCities = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Ahmedabad',
  'Pune',
  'Goa',
  'Jaipur'
];

function getRandomTime() {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return { hours, minutes };
}

function addDurationToTime({ hours, minutes }, durationHours, durationMinutes) {
  const newMinutes = minutes + durationMinutes;
  const newHours = hours + durationHours + Math.floor(newMinutes / 60);
  return { hours: newHours % 24, minutes: newMinutes % 60 };
}

function formatTime({ hours, minutes }) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

async function createNewFlights(date) {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to database');

    for (let i = 0; i < 50; i++) {
      const departureCity = popularCities[Math.floor(Math.random() * popularCities.length)];
      let arrivalCity;
      do {
        arrivalCity = popularCities[Math.floor(Math.random() * popularCities.length)];
      } while (arrivalCity === departureCity);

      const departureTime = getRandomTime();
      const durationHours = Math.floor(Math.random() * 10) + 1; // Duration between 1 and 10 hours
      const durationMinutes = Math.floor(Math.random() * 60); // Additional random minutes for duration

      const arrivalTime = addDurationToTime(departureTime, durationHours, durationMinutes);
      const duration = `${durationHours}h ${String(durationMinutes).padStart(2, '0')}m`;

      const flightData = {
        flightNumber: `JE10${i}`,
        departureAirport: departureCity,
        arrivalAirport: arrivalCity,
        departureTime: formatTime(departureTime),
        arrivalTime: formatTime(arrivalTime),
        date: date,
        duration: duration,
        price: (Math.floor(Math.random() * 1000) + 100) * 10
      };

      const newFlight = await Flight.createFlight(flightData);
      console.log('Flight created successfully:', newFlight);
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating flights:', error);
  }
}

// Call the function with a specific date
createNewFlights('2024-06-14');// HERE U CAN CHANGE THE DATE

