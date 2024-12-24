const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mappings', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const mappingSchema = new mongoose.Schema({
    inputName: String,
    mappedName: String,
});

const Mapping = mongoose.model('Mapping', mappingSchema);

// Routes
app.get('/mappings', async (req, res) => {
    const mappings = await Mapping.find();
    res.json(mappings);
});

app.post('/mappings', async (req, res) => {
    const mappings = req.body;
    await Mapping.deleteMany({}); // Clear previous mappings
    await Mapping.insertMany(Object.entries(mappings).map(([inputName, mappedName]) => ({ inputName, mappedName })));
    res.status(201).json({ message: 'Mappings saved!' });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
