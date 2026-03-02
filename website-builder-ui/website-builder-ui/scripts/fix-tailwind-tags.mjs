import fs from 'fs/promises';
import path from 'path';

const TEMPLATES_DIR = path.join(process.cwd(), 'templates');

async function fixTemplates() {
    const files = await fs.readdir(TEMPLATES_DIR);
    for (const file of files) {
        if (!file.endsWith('.html')) continue;
        const filePath = path.join(TEMPLATES_DIR, file);
        let content = await fs.readFile(filePath, 'utf-8');

        // Replace <link ... cdn.tailwindcss.com ...> with <script src="https://cdn.tailwindcss.com"></script>
        const newContent = content.replace(/<link[^>]*?cdn\.tailwindcss\.com[^>]*?>/gi, '<script src="https://cdn.tailwindcss.com"></script>');

        if (content !== newContent) {
            await fs.writeFile(filePath, newContent);
            console.log(`[FIXED] ${file}`);
        }
    }
}

fixTemplates();
