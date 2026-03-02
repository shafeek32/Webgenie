export interface WebsiteElement {
  id: string
  type: string
  content: Record<string, unknown>
  styles: {
    backgroundColor?: string
    textAlign?: string
    padding?: string
    [key: string]: string | undefined
  }
}

export type GenerationState = "idle" | "generating" | "complete"
