require('dotenv').config(); // Add this at the top if not already present
const express = require('express');
const axios = require('axios'); // We need axios to make API calls

const app = express();
const port = 3001; // Using a different port to avoid conflict with the other service

// Middleware to parse JSON bodies
app.use(express.json());

// This is the main endpoint for receiving events
app.post('/api/events/publish', async (req, res) => {
  const { type, payload } = req.body;

  console.log(`Event received: type = ${type}`);

  // Check if the event type is "PRIZE"
  if (type === 'PRIZE') {
    console.log('PRIZE event detected! Triggering enrollment process...');
    try {
      const userId = payload.userId;
      console.log(`--> Making call to /api/enroll for userId: ${userId}`);

      // Use environment variable for the enroll service URL
      const enrollUrl = process.env.ENROLL_SERVICE_URL;
      if (!enrollUrl) {
        throw new Error('ENROLL_SERVICE_URL is not set');
      }

      await axios.post(enrollUrl, {
        userId: userId,
        eventType: 'PRIZE_WIN'
      });

      console.log('--> Enrollment call successful!');
    } catch (error) {
      console.error('--> Enrollment call failed:', error.message);
    }
  }

  // Respond to the original request
  res.status(200).json({ message: "Event processed successfully." });
});

// Start the server
app.listen(port, () => {
  console.log(`Events service is running on http://localhost:${port}`);
});
