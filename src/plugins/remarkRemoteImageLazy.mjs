import { visit } from 'unist-util-visit'

/**
 * リモート画像にloading="lazy"を追加する
 */
export const remarkRemoteImageLazy = () => {
  return async (tree) => {
    visit(tree, 'image', (node) => {
      if (!/^https?:\/\//.test(node.url || '')) {
        return
      }

      node.data = {
        ...node.data,
        hProperties: {
          ...node.data?.hProperties,
          loading: 'lazy',
        },
      }
    })
  }
}
