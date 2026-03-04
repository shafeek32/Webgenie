const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

router.post('/generate-content', async (req, res) => {
    try {
        const { prompt } = req.body;
        const result = await aiService.generateContent(prompt);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/generate-code', async (req, res) => {
    try {
        const { prompt } = req.body;
        const result = await aiService.generateCode(prompt);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
