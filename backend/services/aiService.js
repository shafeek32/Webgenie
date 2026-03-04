const { Groq } = require('groq-sdk');

class AiService {
    constructor() {
        // Uses GROQ_API_KEY from process.env automatically
        this.groq = new Groq();
    }

    async generateContent(prompt) {
        try {
            if (!process.env.GROQ_API_KEY) {
                throw new Error('No Groq API Key found');
            }

            const response = await this.groq.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            });

            return { text: response.choices[0].message.content };
        } catch (error) {
            console.error('AI Service Error:', error);
            throw error;
        }
    }

    async generateCode(prompt) {
        try {
            const systemPrompt = "You are an expert react/html developer. Generate complete html code for the user request.";
            const response = await this.groq.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
            });
            return { code: response.choices[0].message.content };
        } catch (error) {
            console.error('AI Service Code Gen Error:', error);
            throw error;
        }
    }
}

module.exports = new AiService();
