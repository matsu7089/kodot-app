import type { GetStaticPaths, Page, PaginateFunction } from 'astro'
import {
  getCollection,
  type CollectionKey,
  type CollectionEntry,
} from 'astro:content'
import { pageSize } from '@/siteConfig'

/** 公開されている記事リストを取得 */
export const getPubCollection = async (key: CollectionKey, tag?: string) =>
  await getCollection(key, ({ data: { isDraft, tags } }) =>
    (import.meta.env.PROD ? !isDraft : true) && tag ? tags.includes(tag) : true
  )

/** 公開日の降順で並び替え */
export const orderByPubDateDesc = (
  a: CollectionEntry<CollectionKey>,
  b: CollectionEntry<CollectionKey>
) => b.data.pubDate.getTime() - a.data.pubDate.getTime()

/** 最新の記事を指定した数取得 */
export const getRecentEntries = async (
  limit: number,
  ...args: Parameters<typeof getPubCollection>
) => (await getPubCollection(...args)).sort(orderByPubDateDesc).slice(0, limit)

/** 1ページ目のPageを取得 */
export const getFirstPage = async (
  pathname: string,
  ...args: Parameters<typeof getPubCollection>
) => {
  const entries = (await getPubCollection(...args)).sort(orderByPubDateDesc)

  const data = entries.slice(0, pageSize)
  const lastPage = Math.ceil(entries.length / pageSize)
  const next = lastPage >= 2 ? pathname + '/page/2' : undefined

  return {
    data,
    start: 0,
    end: data.length - 1,
    total: entries.length,
    currentPage: 1,
    size: pageSize,
    lastPage,
    url: {
      current: pathname,
      prev: undefined,
      next,
    },
  } satisfies Page
}

/** ページングの1ページ目を無くすカスタム関数 */
const customPaginate = <T extends ReturnType<PaginateFunction>>(
  paginate: T
): T => {
  return paginate
    .filter((v) => v.props.page.currentPage !== 1)
    .map((v) => {
      const { page } = v.props

      if (page.currentPage === 2) {
        page.url = {
          ...page.url,
          prev: page.url.prev?.replace('/page/1', ''),
        }
      }

      return v
    }) as T
}

/** 共通処理を適用したGetStaticPathsを返す */
export const customPaginatePaths = (
  ...args: Parameters<typeof getPubCollection>
) => {
  return (async ({ paginate }) => {
    const entries = (await getPubCollection(...args)).sort(orderByPubDateDesc)

    return customPaginate(
      paginate(entries, {
        pageSize,
      })
    )
  }) satisfies GetStaticPaths
}
