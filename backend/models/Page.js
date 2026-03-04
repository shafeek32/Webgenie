const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed },
    styles: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const PageSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    pageName: { type: String, required: true },
    components: [ComponentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Page', PageSchema);
