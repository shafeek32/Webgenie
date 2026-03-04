const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
    backendConfig: { type: mongoose.Schema.Types.Mixed },
    createdBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
