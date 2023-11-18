import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import remarkCodeTitles from 'remark-flexible-code-titles'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    remarkRehype: {
      footnoteLabelTagName: 'span',
      footnoteLabel: '脚注',
    },
    remarkPlugins: [remarkCodeTitles],
  },
})
