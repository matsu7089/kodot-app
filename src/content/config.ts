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
  schema: ({ image }) =>
    baseSchema.extend({
      godotVersion: z.string(),
      cover: image().optional(),
    }),
})

const notes = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    baseSchema.extend({
      cover: image().optional(),
    }),
})

const authors = defineCollection({
  type: 'data',
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
