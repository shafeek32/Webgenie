import { Groq } from 'groq-sdk';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables manually
const envPath = path.join(process.cwd(), '.env.local');
const envContent = await fs.readFile(envPath, 'utf-8');
const groqKeyMatch = envContent.match(/GROQ_API_KEY=(.*)/);
const apiKey = groqKeyMatch ? groqKeyMatch[1].trim() : null;

if (!apiKey) {
    console.error("GROQ_API_KEY not found in .env.local");
    process.exit(1);
}

const groq = new Groq({ apiKey });
const CATEGORIES_PATH = path.join(process.cwd(), 'lib', 'categories.json');
const TEMPLATES_DIR = path.join(process.cwd(), 'templates');

const TEMPLATE_PROMPT = `You are a World-Class Award-Winning Web Designer. Create a STUNNING, unique, and highly impressive base template for the category: "{{NAME}}".
DESCRIPTION: {{DESCRIPTION}}

CORE DIRECTIVES (The "Sports" Standard):
1. UNIQUE ARCHITECTURE: Do NOT use standard "Bootstrap" or "Header-Hero-Features" layouts. Experiment with:
   - SKEWED / ASYMMETRICAL: Use CSS clips/skews for an aggressive, fast look.
   - BENTO GRID: For data-heavy or gallery-focused sites.
   - GLASSMORPHISM: With deep blurs and vibrant background gradients.
   - DARK NEON: High-contrast dark backgrounds with vibrant accent colors (like the Sports template).
2. COLOR PALETTE: Select a "Vibe-First" palette. No generic blue/white. If it's for luxury, use Gold/Cream/Black. If for tech, use Electric Purple/Deep Space.
3. INTERACTIVE SIMULATION (MANDATORY): Embed a functional Vanilla JS "Simulation" or "Utility" widget:
   - For Sports: A "Performance Stats Analyzer" with animated bars.
   - For SaaS: A "ROI Calculator" or "Pricing Slider".
   - For Medical: A "Symptom Checker" or "Booking Grid".
   - For Portfolio: A "Skill Level" interactive radar or "Project Detail" expander.
4. TAILWIND & FONTS: Use Play CDN: <script src="https://cdn.tailwindcss.com"></script>. Use premium Google Fonts (e.g., Syncopate, Outfit, Playfair).
5. VISUALS: Use image placeholders from Unsplash that match the vibe. Ensure responsive design and premium typography.
6. NO BUILDER UI: Output ONLY the end-user website. No sidebars, no prompt bars, no "BuildAI" branding.

GOAL: The user should open this and say "This looks like a $10,000 custom website!". Output ONLY raw HTML.`;

async function generateTemplates() {
    const categoriesRaw = await fs.readFile(CATEGORIES_PATH, 'utf-8');
    const categories = JSON.parse(categoriesRaw);

    for (const cat of categories) {
        const filePath = path.join(TEMPLATES_DIR, `${cat.id}.html`);

        let retries = 3;
        while (retries > 0) {
            console.log(`[GEN] Generating HIGH-FIDELITY template for: ${cat.name}...`);
            try {
                const res = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: TEMPLATE_PROMPT.replace("{{NAME}}", cat.name).replace("{{DESCRIPTION}}", cat.description) }],
                    temperature: 0.7,
                    max_tokens: 3500,
                });

                let html = res.choices[0]?.message?.content || "";
                html = html.replace(/^```(?:html)?\s*|```$/g, "").trim();

                if (html.startsWith("<!DOCTYPE") || html.startsWith("<html")) {
                    await fs.writeFile(filePath, html);
                    console.log(`[SUCCESS] Saved ${cat.id}.html`);
                    break;
                } else {
                    console.error(`[FAIL] ${cat.id} - Invalid HTML structure produced.`);
                    break;
                }
            } catch (err) {
                if (err.status === 429) {
                    console.warn(`[RATE LIMIT] Hit for ${cat.id}. Waiting 60s...`);
                    await new Promise(r => setTimeout(r, 60000));
                    retries--;
                } else {
                    console.error(`[ERROR] Failed to generate ${cat.id}:`, err.message);
                    break;
                }
            }
        }

        // Standard delay between successful generations to avoid rapid quota consumption
        await new Promise(r => setTimeout(r, 10000));
    }
}

generateTemplates();
