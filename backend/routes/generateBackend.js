const express = require('express');
const router = express.Router();
const backendGeneratorService = require('../services/backendGeneratorService');
const Project = require('../models/Project');

// Endpoint to apply backend configuration
router.post('/apply-config', async (req, res) => {
    try {
        const { projectId, config } = req.body;

        // Save to project
        await Project.findByIdAndUpdate(projectId, { backendConfig: config });

        // Generate models in memory
        backendGeneratorService.generateModels(config);

        res.json({ success: true, message: 'Backend configuration applied.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mount the dynamic CRUD router under /api/builder/data
router.use('/data', backendGeneratorService.createDynamicRouter());

module.exports = router;
