import path from 'path'
import fs from 'fs'
import readline from 'readline'
import { visit } from 'unist-util-visit'
import { is } from 'unist-util-is'
import { parse } from 'yaml'

/**
 * .mdファイルのfrontmatterを取得する
 * @param {string} filePath
 * @returns {Promise<Record<string, any>>}
 */
const getFrontmatter = async (filePath) => {
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  let yamlText = ''
  let inFrontmatter = false

  for await (const line of rl) {
    if (line.trim() === '---') {
      if (inFrontmatter) {
        break
      } else {
        inFrontmatter = true
        continue
      }
    }
    if (inFrontmatter) {
      yamlText += line + '\n'
    }
  }

  rl.close()
  return parse(yamlText)
}

/**
 * .mdファイルへの相対リンクをカード表示にするプラグイン
 * @param {object} options
 * @param {string} options.site サイトのbaseUrl
 */
export const remarkRelativeMarkdownCard = ({ site }) => {
  const cwd = process.cwd()

  return async (tree, file) => {
    const transformers = []

    visit(tree, 'paragraph', (node, index, parent) => {
      const firstChild = node.children[0]
      const linkUrl = firstChild?.url || ''

      if (
        !(
          is(firstChild, 'link') &&
          /\.md$/.test(linkUrl) &&
          !path.isAbsolute(linkUrl) &&
          node.children.length === 1
        )
      ) {
        return
      }

      const sourceFileDir = path.dirname(file.history[0])
      const targetFilePath = path.resolve(sourceFileDir, linkUrl)

      if (
        !(
          targetFilePath.startsWith(`${cwd}/content`) &&
          fs.existsSync(targetFilePath)
        )
      ) {
        return
      }

      transformers.push(async () => {
        const { title, cover } = await getFrontmatter(targetFilePath)

        // frontmatterのカバー画像を優先、指定なければog画像
        const coverImageUrl = cover
          ? path.relative(
              sourceFileDir,
              path.resolve(path.dirname(targetFilePath), cover),
            )
          : targetFilePath
              .replace(`${cwd}/content`, `${site}/og`)
              .replace(/(\/index)?\.md$/, '.png')

        const newNode = {
          type: 'link',
          url: linkUrl.replace(/(\/index)?\.md$/, ''),
          data: { hProperties: { class: 'rlc-container' } },
          children: [
            {
              type: 'html',
              value:
                '<div class="rlc-info">' +
                `<div class="rlc-title">${title}</div>` +
                '<div class="rlc-url-container"><img class="rlc-favicon" src="/favicon.svg" width="16" height="16"><span class="rlc-url">Kodot App</span></div>' +
                '</div>',
            },
            {
              type: 'element',
              data: { hProperties: { class: 'rlc-image-container' } },
              children: [
                {
                  type: 'image',
                  url: coverImageUrl,
                  data: { hProperties: { class: 'rlc-image' } },
                },
              ],
            },
          ],
        }

        parent.children[index] = newNode
      })
    })

    try {
      await Promise.all(transformers.map((t) => t()))
    } catch (err) {
      console.error(err)
    }

    return tree
  }
}
