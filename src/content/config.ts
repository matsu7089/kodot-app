import { defineCollection, z } from 'astro:content'

const baseSchema = z.object({
  isDraft: z.boolean().default(false),
  title: z.string(),
  pubDate: z.date(),
  author: z.string(),
  tags: z.array(z.string()).default(['others']),
})

const articles = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    godotVersion: z.string(),
  }),
})

const notes = defineCollection({
  type: 'content',
  schema: baseSchema,
})

const authors = defineCollection({
  type: 'data',
  schema: z.object({
    displayName: z.string().optional(),
    avatar: z.string().optional(),
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
