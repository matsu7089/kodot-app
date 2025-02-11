import type { GetStaticPaths, Page, PaginateFunction } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'
import dayjsModule from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { pageSize } from '@/siteConfig'

dayjsModule.extend(utc)
dayjsModule.extend(timezone)
dayjsModule.tz.setDefault('Asia/Tokyo')

export const dayjs = dayjsModule

export type MarkdownCollectionKey = 'articles' | 'notes'

/** 公開されている記事リストを取得 */
export const getPubCollection = async (
  key: MarkdownCollectionKey,
  tag?: string
) =>
  await getCollection(
    key,
    ({ data: { isDraft, tags } }) =>
      (import.meta.env.PROD ? !isDraft : true) &&
      (tag ? tags.includes(tag) : true)
  )

/** 公開日の降順で並び替え */
export const orderByPubDateDesc = (
  a: CollectionEntry<MarkdownCollectionKey>,
  b: CollectionEntry<MarkdownCollectionKey>
) => b.data.pubDate.getTime() - a.data.pubDate.getTime()

/** 最新の記事を指定した数取得 */
export const getRecentEntries = async (
  limit: number,
  ...args: Parameters<typeof getPubCollection>
) => (await getPubCollection(...args)).sort(orderByPubDateDesc).slice(0, limit)

/** 1ページ目のPageを取得 */
export const getFirstPage = async (
  pathname: string,
  entries: Array<CollectionEntry<MarkdownCollectionKey>>
) => {
  const data = entries.slice(0, pageSize)
  const lastPage = Math.ceil(entries.length / pageSize)
  const last = pathname + '/page/' + lastPage
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
      first: pathname,
      last,
    },
  } satisfies Page
}

/** ページングの1ページ目を無くすカスタム関数 */
export const customPaginate = <T extends ReturnType<PaginateFunction>>(
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

/** 公開されている記事のタグリストを記事の多い順で取得 */
export const getTags = async (
  key: MarkdownCollectionKey
): Promise<string[]> => {
  const tagCountMap = (await getPubCollection(key)).reduce(
    (acc: { [tag: string]: number }, cur) => {
      cur.data.tags.forEach((tag) => {
        if (acc[tag]) {
          acc[tag]++
        } else {
          acc[tag] = 1
        }
      })

      return acc
    },
    {}
  )

  const tagList = Object.entries(tagCountMap)
    .sort((a, b) => b[1] - a[1])
    .map((v) => v[0])

  return tagList
}

/** 全てのタグリストを取得 */
export const getAllTags = async () => {
  return [...(await getTags('articles')), ...(await getTags('notes'))]
}

/** 文字列からハッシュ値を取得 */
const strToHash = (str: string) =>
  str.split('').reduce((acc, char) => {
    return (acc << 5) - acc + char.charCodeAt(0) ** 3
  }, 0)

/** 文字列からHSLを取得 */
export const strToHSL = (str: any, s: number, l: number) => {
  if (typeof str !== 'string') {
    return undefined
  }

  return `hsl(${strToHash(str) % 360}, ${s}%, ${l}%)`
}
