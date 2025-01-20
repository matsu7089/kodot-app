import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const baseSchema = z.object({
  isDraft: z.boolean().default(false),
  title: z.string(),
  pubDate: z.date(),
  author: z.string(),
  tags: z.array(z.string()).default(['others']),
  disableGiscus: z.boolean().default(false),
})

const articles = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './content/articles' }),
  schema: ({ image }) =>
    baseSchema.extend({
      godotVersion: z.string(),
      cover: image().optional(),
    }),
})

const notes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './content/notes' }),
  schema: ({ image }) =>
    baseSchema.extend({
      cover: image().optional(),
    }),
})

const authors = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './content/authors' }),
  schema: z.object({
    displayName: z.string().optional(),
    github: z.string().optional(),
    twitter: z.string().optional(),
    website: z.string().optional(),
  }),
})

export const collections = {
  articles,
  notes,
  authors,
}
