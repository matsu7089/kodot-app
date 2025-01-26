import { execSync } from 'child_process'
import { defineConfig } from 'astro/config'
import solidJs from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import compress from 'astro-compress'
import remarkBreaks from 'remark-breaks'
import remarkEmoji from 'remark-emoji'
import remarkLinkCard from 'remark-link-card'
import remarkCodeTitles from 'remark-flexible-code-titles'
import remarkContainers from 'remark-flexible-containers'
import remarkMermaid from '@southball/remark-mermaid'
import { remarkRelativeMarkdownCard } from './src/plugins/remarkRelativeMarkdownCard'
import { remarkRemoteImageLazy } from './src/plugins/remarkRemoteImageLazy'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerMetaHighlight,
} from '@shikijs/transformers'
import { visit } from 'unist-util-visit'
import { imageUploadMiddleware } from './src/plugins/imageUploadMiddleware'

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
          rlcStartString +
            ' rel="nofollow noopener noreferrer" target="_blank"',
        )
      }
    })
  }
}

const site =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4321'
    : 'https://kodot-app.pages.dev'

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind(), compress()],
  markdown: {
    remarkRehype: {
      footnoteLabelTagName: 'span',
      footnoteLabel: '脚注',
    },
    remarkPlugins: [
      remarkEmoji,
      [remarkLinkCard, { shortenUrl: true }],
      rlcExternalLinks,
      [remarkMermaid, { themes: ['dark'] }],
      remarkCodeTitles,
      [
        remarkContainers,
        {
          containerTagName: (type, _title) =>
            type === 'details' ? 'details' : 'div',
          titleTagName: (type, _title) =>
            type === 'details' ? 'summary' : 'span',
        },
      ],
      remarkBreaks,
      [remarkRelativeMarkdownCard, { site }],
      remarkRemoteImageLazy,
      remarkModifiedTime,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          content: {
            type: 'text',
            value: '',
          },
          properties: {
            className: ['header-anchor'],
          },
        },
      ],
      [
        rehypeExternalLinks,
        { rel: 'nofollow noopener noreferrer', target: '_blank' },
      ],
    ],
    shikiConfig: {
      theme: 'github-dark-dimmed',
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerMetaHighlight(),
      ],
    },
  },
  site,
  prefetch: {
    prefetchAll: true,
  },
  experimental: {
    svg: {
      mode: 'sprite',
    },
  },
  vite: {
    plugins: [imageUploadMiddleware()],
  },
})
