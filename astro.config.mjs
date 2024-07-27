import { execSync } from 'child_process'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import compress from 'astro-compress'
import remarkBreaks from 'remark-breaks'
import remarkEmoji from 'remark-emoji'
import remarkLinkCard from 'remark-link-card'
import remarkCodeTitles from 'remark-flexible-code-titles'
import remarkContainers from 'remark-flexible-containers'
import remarkMermaid from '@southball/remark-mermaid'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeAstroRelativeMarkdownLinks from 'astro-rehype-relative-markdown-links'
import { visit } from 'unist-util-visit'

// ref: https://docs.astro.build/ja/recipes/modified-time/
const remarkModifiedTime = () => {
  return (_tree, file) => {
    const filepath = file.history[0]
    const result = execSync(`git log -1 --pretty="format:%cI" ${filepath}`)
    file.data.astro.frontmatter.lastModified = result.toString() || undefined
  }
}

/** remarkLinkCardのaタグにrelとtargetを設定するプラグイン */
const rlcExternalLinks = () => {
  const rlcStartString = '<a class="rlc-container"'

  return (tree) => {
    visit(tree, 'html', (node) => {
      if (node.value.startsWith(rlcStartString)) {
        node.value = node.value.replace(
          rlcStartString,
          rlcStartString + ' rel="nofollow noopener noreferrer" target="_blank"'
        )
      }
    })
  }
}

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), compress()],
  markdown: {
    remarkRehype: {
      footnoteLabelTagName: 'span',
      footnoteLabel: '脚注',
    },
    remarkPlugins: [
      remarkBreaks,
      remarkEmoji,
      [remarkLinkCard, { shortenUrl: true }],
      rlcExternalLinks,
      [remarkMermaid, { themes: ['dark'] }],
      remarkCodeTitles,
      remarkContainers,
      remarkModifiedTime,
    ],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { rel: 'nofollow noopener noreferrer', target: '_blank' },
      ],
      rehypeAstroRelativeMarkdownLinks,
    ],
  },
  site: 'https://kodot-app.pages.dev',
})
