export interface WebsiteElement {
  id: string
  type: string
  content: any
  styles: {
    backgroundColor?: string
    textAlign?: string
    padding?: string
    [key: string]: string | undefined
  }
}

export type GenerationState = "idle" | "generating" | "complete"
