import { execSync } from 'child_process'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import remarkCodeTitles from 'remark-flexible-code-titles'

// ref: https://docs.astro.build/ja/recipes/modified-time/
const remarkModifiedTime = () => {
  return (_tree, file) => {
    const filepath = file.history[0]
    const result = execSync(`git log -1 --pretty="format:%cI" ${filepath}`)
    file.data.astro.frontmatter.lastModified = result.toString()
  }
}

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    remarkRehype: {
      footnoteLabelTagName: 'span',
      footnoteLabel: '脚注',
    },
    remarkPlugins: [remarkCodeTitles, remarkModifiedTime],
  },
})
