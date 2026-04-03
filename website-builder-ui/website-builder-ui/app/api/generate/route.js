import { NextResponse } from "next/server"
import { Groq } from "groq-sdk"
import fs from "fs/promises"
import path from "path"

const CATEGORIES_PATH = path.join(process.cwd(), "lib", "categories.json")
const TEMPLATES_DIR = path.join(process.cwd(), "public", "templates")

// Persona for classification
const CLASSIFIER_PROMPT = `You are a Routing Expert. Given a user's website prompt, classify it into EXACTLY ONE category from the list provided below. Respond ONLY with the exact string of the category ID. DO NOT use numbers.
If the user's prompt is completely outside the scope of ANY of these categories (e.g. a weird concept, a hyper-specific unique app, or something that doesn't fit), output "unknown".

CATEGORIES:
{{CATEGORIES}}

Prompt: "{{PROMPT}}"`

// Persona for augmentation
const AUGMENTER_PROMPT = `You are an Expert Website Developer. Your sole job is to create a BEAUTIFUL, functional website for a client based on their request: "{{PROMPT}}".

YOUR SOURCE:
- Use the provided BASE TEMPLATE as your structural foundation.

YOUR CONSTRAINTS:
1. MODIFY the provided BASE TEMPLATE to fulfill the user's specific request. Replace entirely ONLY the specific parts asked to be updated. Do not append a whole new website to the existing one.
2. KEEP the premium layout, Tailwind system, and interactive features from the template.
3. CRITICAL: DO NOT change, add, or remove any <link rel="stylesheet"> or <script src="..."> tags. The CSS and JS filenames MUST remain exactly as they are in the BASE TEMPLATE.
4. OUTPUT A JSON OBJECT with EXACTLY the following format:
{
  "html": "<the modified complete HTML code>",
  "schema": "<the Prisma schema definition required for this app>",
  "api": "<a Next.js App Router API endpoint (route.ts) for CRUD options>"
}

CRITICAL - NO NESTED UI:
- DO NOT INCLUDE any user interface that looks like a "Website Builder", "AI Prompt Bar", "Sidebar", or "Editor".
- DO NOT include ANY "BuildAI" branding or links back to the builder.
- DO NOT hallucinate any "Generate", "Export", "Publish", or "Settings" buttons that belong to the builder app itself.
- If the user asks for a website, GIVE THEM THE WEBSITE, not the tool used to make it.

BASE TEMPLATE:
{{TEMPLATE}}

OUTPUT MUST BE VALID JSON ONLY. No markdown blocks, no explanations.`

// Persona for Zero-Shot (No Template)
const ZERO_SHOT_PROMPT = `You are an Expert Website Developer. Your sole job is to create a BEAUTIFUL, functional full-stack website layout from SCRATCH for a client based on their request: "{{PROMPT}}".

YOUR CONSTRAINTS:
1. Since there is no base template, YOU MUST WRITE THE ENTIRE HTML DOCUMENT from <html> to </html>.
2. Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>) in the <head>.
3. Include modern, beautiful typography (e.g., Google Fonts like Inter or Roboto).
4. Build a fully styled, cohesive UI with at least a Hero section, Features/Info section, and Footer. Ensure it matches the requested vibe.
5. OUTPUT A JSON OBJECT with EXACTLY the following format:
{
  "html": "<the complete HTML code starting from <!DOCTYPE html>>",
  "schema": "<the Prisma schema definition required for this app>",
  "api": "<a Next.js App Router API endpoint (route.ts) for CRUD options>"
}

CRITICAL - NO NESTED UI:
- DO NOT INCLUDE any user interface that looks like a "Website Builder", "AI Prompt Bar", "Sidebar", or "Editor".
- If the user asks for a website, GIVE THEM THE WEBSITE, not the tool used to make it.

OUTPUT MUST BE VALID JSON ONLY. No markdown blocks, no explanations.`

// Persona for updating existing structures
const UPDATER_PROMPT = `You are an Expert Website Developer. A user wants to update their existing website design based on this new prompt: "{{PROMPT}}".

CURRENT HTML:
{{CURRENT_HTML}}

YOUR CONSTRAINTS:
1. ONLY apply the changes requested by the user. Do not rewrite, restructure, or restyle unrelated sections of the HTML unless they are relevant to the prompt.
2. KEEP the core structure, Tailwind system, and previously generated designs strictly intact. Make surgical changes where requested.
3. If the user asks for new sections, place them logically without breaking existing sections.
4. OUTPUT A JSON OBJECT with EXACTLY the following format:
{
  "html": "<the modified complete HTML code>",
  "schema": "<the unmodified or updated Prisma schema definition>",
  "api": "<the unmodified or updated Next.js API endpoint>"
}
OUTPUT MUST BE VALID JSON ONLY. No markdown blocks, no explanations.`

export async function POST(req) {
  try {
    const body = await req.json()
    const userPrompt = typeof body?.prompt === "string" ? body.prompt.trim() : ""
    const currentHtml = typeof body?.currentHtml === "string" ? body.currentHtml : null
    const providedCategoryId = typeof body?.categoryId === "string" ? body.categoryId : null

    if (!userPrompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Server misconfiguration: missing Groq API key" }, { status: 500 })
    }

    const groq = new Groq({ apiKey })

    let templateHtml = currentHtml || ""
    let currentCategoryId = providedCategoryId || "saas-landing"

    if (!currentHtml) {
      // Phase 1: Classification
      console.log("[API] Classifying prompt...")
      const categoriesRaw = await fs.readFile(CATEGORIES_PATH, "utf-8")
      const categories = JSON.parse(categoriesRaw)
      const categoryListStr = categories.map(c => `- ${c.id}: ${c.description}`).join("\n")

      const classificationRes = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: CLASSIFIER_PROMPT.replace("{{CATEGORIES}}", categoryListStr).replace("{{PROMPT}}", userPrompt) }],
        temperature: 0,
        max_tokens: 100,
      })

      let rawContent = classificationRes.choices[0]?.message?.content.toLowerCase() || "unknown"
      
      // Extract valid category ID by checking against our known list
      let categoryId = "unknown"
      for (const cat of categories) {
        if (rawContent.includes(cat.id.toLowerCase())) {
          categoryId = cat.id.toLowerCase()
          break
        }
      }
      
      console.log("[API] Raw classification response:", rawContent.trim())
      console.log("[API] Parsed classified category:", categoryId)
      currentCategoryId = categoryId

      // Phase 2: Template Retrieval
      if (categoryId !== "unknown") {
        try {
          const templatePath = path.join(TEMPLATES_DIR, categoryId, `${categoryId}.html`)
          templateHtml = await fs.readFile(templatePath, "utf-8")
          console.log("\x1b[32m[API] Successfully loaded template:\x1b[0m", categoryId)
        } catch (err) {
          console.log("\x1b[31m[API] Template not found for category:\x1b[0m", categoryId, "falling back to zero-shot. Error:", err.message)
          currentCategoryId = "unknown"
        }
      }
    } else {
      console.log("[API] Using existing HTML as base structure for iterative update.")
    }

    // Phase 3: Augmentation
    console.log("[API] Augmenting template...")
    let promptContent = ""
    if (currentHtml) {
      promptContent = UPDATER_PROMPT.replace("{{PROMPT}}", userPrompt).replace("{{CURRENT_HTML}}", templateHtml)
    } else if (currentCategoryId === "unknown") {
      promptContent = ZERO_SHOT_PROMPT.replace("{{PROMPT}}", userPrompt)
    } else {
      promptContent = AUGMENTER_PROMPT.replace("{{PROMPT}}", userPrompt).replace("{{TEMPLATE}}", templateHtml)
    }

    const augmentMsg = [{ role: "user", content: promptContent }]

    let raw = null
    try {
      const augmentationRes = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: augmentMsg,
        temperature: 0.1,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      })
      raw = augmentationRes.choices?.[0]?.message?.content
    } catch (groqErr) {
      console.warn("[API] Groq json_object mode failed, retrying in plain-text mode:", groqErr?.message ?? groqErr)
      try {
        const fallbackRes = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: augmentMsg,
          temperature: 0.1,
          max_tokens: 4000,
        })
        raw = fallbackRes.choices?.[0]?.message?.content
      } catch (fallbackErr) {
        console.error("[API] Fallback call also failed:", fallbackErr)
      }
    }

    if (!raw) {
      return NextResponse.json({ error: "AI returned no content" }, { status: 502 })
    }

    let cleaned = String(raw)
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim()
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (jsonMatch) cleaned = jsonMatch[0]

    let parsedResult
    try {
      parsedResult = JSON.parse(cleaned)
    } catch (e) {
      console.log("[API] Failed to parse JSON, using template as fallback HTML")
      parsedResult = {
        html: /\<\s*html|\<!doctype/i.test(cleaned) ? cleaned : templateHtml,
        schema: "// Failed to generate schema",
        api: "// Failed to generate API"
      }
    }

    let finalHtml = parsedResult.html || templateHtml;

    // Force local CSS and JS to use the correct template filename, ONLY if we used a template
    if (currentCategoryId !== "unknown" && finalHtml) {
      finalHtml = finalHtml.replace(/href="(?!http|\/\/)[^"]+\.css"/gi, `href="${currentCategoryId}.css"`);
      finalHtml = finalHtml.replace(/src="(?!http|\/\/)[^"]+\.js"/gi, `src="${currentCategoryId}.js"`);

      // We add the base tag right after <head> to ensure all relative links resolve locally
      // Only add it if it's not already there (which happens on iterative updates)
      if (!finalHtml.includes(`base href="/templates/${currentCategoryId}/"`)) {
        finalHtml = finalHtml.replace(/<head>/i, `<head>\n    <base href="/templates/${currentCategoryId}/">`);
      }
    }

    return NextResponse.json({
      code: finalHtml,
      schema: parsedResult.schema || "// No schema needed",
      api: parsedResult.api || "// No API needed",
      categoryId: currentCategoryId
    })
  } catch (err) {
    console.error("[API] Server Error:", err)
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 })
  }
}

export { CLASSIFIER_PROMPT, AUGMENTER_PROMPT, UPDATER_PROMPT, ZERO_SHOT_PROMPT }
