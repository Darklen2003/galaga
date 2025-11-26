const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const MONGO_URI = 'mongodb+srv://deks:11152006@cluster0.vyabn0i.mongodb.net/?appName=Cluster0'; 

app.use(express.json());
app.use(express.static(__dirname)); 

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

const ScoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
    date: { type: Date, default: Date.now }
});
const Score = mongoose.model('Score', ScoreSchema);

app.post('/api/score', async (req, res) => {
    try {
        console.log("Saving score:", req.body);
        const newScore = new Score(req.body);
        await newScore.save();
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const topScores = await Score.find().sort({ score: -1 }).limit(10);
        res.json(topScores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = 80;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));