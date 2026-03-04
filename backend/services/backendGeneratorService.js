const mongoose = require('mongoose');
const express = require('express');

class BackendGeneratorService {
    constructor() {
        this.dynamicModels = {};
    }

    // Generates Mongoose Models based on a JSON config
    generateModels(config) {
        if (!config || !config.collections) return;

        config.collections.forEach(collection => {
            const { name, fields } = collection;

            // If model already exists, we might need to overwrite or reuse it
            if (mongoose.models[name]) {
                delete mongoose.models[name];
            }

            const schemaDefinition = {};
            fields.forEach(field => {
                let type = String;
                if (field.type === 'number') type = Number;
                if (field.type === 'boolean') type = Boolean;
                if (field.type === 'date') type = Date;

                schemaDefinition[field.name] = { type };
            });

            const schema = new mongoose.Schema(schemaDefinition, { timestamps: true });
            const model = mongoose.model(name, schema);

            this.dynamicModels[name] = model;
        });
    }

    // Creates an Express Router with CRUD operations for all dynamic collections
    createDynamicRouter() {
        const router = express.Router();

        // Middleware to check if collection exists
        router.use('/:collection', (req, res, next) => {
            const modelName = req.params.collection;
            const model = this.dynamicModels[modelName] || mongoose.models[modelName];

            if (!model) {
                return res.status(404).json({ success: false, message: `Collection ${modelName} not found` });
            }

            req.dynamicModel = model;
            next();
        });

        // GET all
        router.get('/:collection', async (req, res) => {
            try {
                const items = await req.dynamicModel.find();
                res.json({ success: true, data: items });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // POST create
        router.post('/:collection', async (req, res) => {
            try {
                const newItem = new req.dynamicModel(req.body);
                await newItem.save();
                res.status(201).json({ success: true, data: newItem });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // PUT update
        router.put('/:collection/:id', async (req, res) => {
            try {
                const updatedItem = await req.dynamicModel.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    { new: true }
                );
                res.json({ success: true, data: updatedItem });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // DELETE 
        router.delete('/:collection/:id', async (req, res) => {
            try {
                await req.dynamicModel.findByIdAndDelete(req.params.id);
                res.json({ success: true, message: 'Deleted successfully' });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        return router;
    }
}

module.exports = new BackendGeneratorService();
