import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    remarkRehype: {
      footnoteLabelTagName: 'span',
      footnoteLabel: '脚注',
    },
  },
})
