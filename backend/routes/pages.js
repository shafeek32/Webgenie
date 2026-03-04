const express = require('express');
const router = express.Router();
const Page = require('../models/Page');

// Save or Update a Page Layout
router.post('/save', async (req, res) => {
    try {
        const { projectId, pageName, components } = req.body;

        // Find if the page exists
        let page = await Page.findOne({ projectId, pageName });

        if (page) {
            page.components = components;
            await page.save();
        } else {
            page = new Page({ projectId, pageName, components });
            await page.save();
        }

        res.status(200).json({ success: true, page });
    } catch (error) {
        console.error('Error saving page:', error);
        res.status(500).json({ success: false, error: 'Failed to save page layout.' });
    }
});

// Get a Page Layout
router.get('/:projectId/:pageName', async (req, res) => {
    try {
        const { projectId, pageName } = req.params;
        const page = await Page.findOne({ projectId, pageName });
        if (!page) {
            return res.status(404).json({ success: false, message: 'Page not found' });
        }
        res.status(200).json({ success: true, page });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to retrieve page layout.' });
    }
});

module.exports = router;
