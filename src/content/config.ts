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

export const collections = {
  articles,
  notes,
}
