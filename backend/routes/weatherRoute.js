const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = '8b25d314ab16e3cb265ad01923220cf6'; // Replace with your key

router.get('/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

module.exports = router;
