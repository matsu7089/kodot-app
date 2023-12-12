/** サイト名 */
export const siteName = 'Kodot App'

/** ページングで1画面に出す最大の記事数 */
export const pageSize = 12

/** 日付表示フォーマット */
export const dateFormat = 'YYYY-MM-DD'

// theme
export type PrimaryColor = 'blue' | 'green'

type ClassMap = Record<PrimaryColor, string>

export const primaryTextClass = {
  blue: 'text-kodot-blue',
  green: 'text-kodot-green',
} as const satisfies ClassMap

export const primaryBgClass = {
  blue: 'bg-kodot-blue dark:bg-kodot-blue-dark',
  green: 'bg-kodot-green dark:bg-kodot-green-dark',
} as const satisfies ClassMap
