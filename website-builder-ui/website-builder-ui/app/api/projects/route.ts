import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, prompt, html, schema, api, categoryId } = body

    if (!name || !html) {
      return NextResponse.json({ error: "Name and HTML are required" }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        prompt: prompt || "",
        html,
        schema,
        api,
        categoryId,
      },
    })

    return NextResponse.json(project)
  } catch (error: any) {
    console.error("Failed to save project:", error)
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(projects)
  } catch (error: any) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
