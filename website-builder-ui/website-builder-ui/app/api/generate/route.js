import { NextResponse } from "next/server"
import { Groq } from "groq-sdk"
import fs from "fs/promises"
import path from "path"

const CATEGORIES_PATH = path.join(process.cwd(), "lib", "categories.json")
const TEMPLATES_DIR = path.join(process.cwd(), "public", "templates")

// Persona for classification
const CLASSIFIER_PROMPT = `You are a Routing Expert. Given a user's website prompt, classify it into EXACTLY ONE category from the list provided below. Respond ONLY with the category ID.

CATEGORIES:
{{CATEGORIES}}

Prompt: "{{PROMPT}}"`

// Persona for augmentation
const AUGMENTER_PROMPT = `You are an Expert Website Developer. Your sole job is to create a BEAUTIFUL, functional website for a client based on their request: "{{PROMPT}}".

YOUR SOURCE:
- Use the provided BASE TEMPLATE as your structural foundation.

YOUR CONSTRAINTS:
1. MODIFY content (text, headlines, colors) to fit the user's specific request.
2. KEEP the premium layout, Tailwind system, and interactive features from the template.
3. OUTPUT ONLY THE END-USER FACING WEBSITE CODE.

CRITICAL - NO NESTED UI:
- DO NOT INCLUDE any user interface that looks like a "Website Builder", "AI Prompt Bar", "Sidebar", or "Editor".
- DO NOT include ANY "BuildAI" branding or links back to the builder.
- DO NOT hallucinate any "Generate", "Export", "Publish", or "Settings" buttons that belong to the builder app itself.
- If the user asks for a website, GIVE THEM THE WEBSITE, not the tool used to make it.

BASE TEMPLATE:
{{TEMPLATE}}

OUTPUT: Raw HTML document only. No markdown, no explanations.`

export async function POST(req) {
  try {
    const body = await req.json()
    const userPrompt = typeof body?.prompt === "string" ? body.prompt.trim() : ""

    if (!userPrompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.XAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Server misconfiguration: missing Groq API key" }, { status: 500 })
    }

    const groq = new Groq({ apiKey })

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

    const categoryId = classificationRes.choices[0]?.message?.content.trim().toLowerCase()
    console.log("[API] Classified as:", categoryId)

    // Phase 2: Template Retrieval
    let templateHtml = ""
    let currentCategoryId = categoryId
    try {
      const templatePath = path.join(TEMPLATES_DIR, categoryId, `${categoryId}.html`)
      templateHtml = await fs.readFile(templatePath, "utf-8")
    } catch (err) {
      console.log("[API] Template not found, falling back to default saas-landing")
      currentCategoryId = "saas-landing"
      templateHtml = await fs.readFile(path.join(TEMPLATES_DIR, "saas-landing", "saas-landing.html"), "utf-8")
    }

    // Fix relative paths for the iframe preview
    // We prefix them with /templates/[id]/ so they point to the correct static asset
    templateHtml = templateHtml
      .replace(/(href|src)=["'](?!http|https|\/)([^"']+)["']/g, (match, attr, path) => {
        return `${attr}="/templates/${currentCategoryId}/${path}"`
      })

    // Phase 3: Augmentation
    console.log("[API] Augmenting template...")
    const augmentationRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: AUGMENTER_PROMPT.replace("{{PROMPT}}", userPrompt).replace("{{TEMPLATE}}", templateHtml) }],
      temperature: 0.1,
      max_tokens: 4000,
    })

    const raw = augmentationRes.choices?.[0]?.message?.content

    if (!raw) {
      return NextResponse.json({ error: "AI returned no content" }, { status: 502 })
    }

    // Post-processing
    const cleaned = String(raw).replace(/^```(?:html)?\s*|```$/g, "").trim()
    const finalHtml = /<\s*html|<!doctype/i.test(cleaned) ? cleaned : templateHtml // Safety fallback

    return NextResponse.json({ code: finalHtml })
  } catch (err) {
    console.error("[API] Server Error:", err)
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 })
  }
}

export { CLASSIFIER_PROMPT, AUGMENTER_PROMPT }
