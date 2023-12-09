import fs from 'fs'
import path from 'path'
import type { CollectionKey } from 'astro:content'
import { getPubCollection } from '@/utils'
import { ImageResponse } from '@vercel/og'
import { loadDefaultJapaneseParser } from 'budoux'

const parser = loadDefaultJapaneseParser()

interface Props {
  params: {
    slug: string
  }
  props: {
    collection: CollectionKey
    title: string
  }
}

export async function getStaticPaths() {
  const allEntries = (await getPubCollection('articles')).concat(
    await getPubCollection('notes')
  )

  return allEntries.map(
    (entry) =>
      ({
        params: {
          slug: `${entry.collection}/${entry.slug}`,
        },
        props: {
          collection: entry.collection,
          title: entry.data.title,
        },
      } satisfies Props)
  )
}

export async function GET({ props }: Props) {
  const { collection, title } = props

  const primaryColor = {
    articles: '#478cbf',
    notes: '#47bf99',
  }[collection]

  const kodotIconSvg =
    'data:image/svg+xml,' +
    encodeURIComponent(
      fs
        .readFileSync(path.resolve('./src/icons/kodot-solid.svg'), 'utf-8')
        .replace(/<path/g, `<path fill="${primaryColor}"`)
    )

  const html = {
    type: 'div',
    props: {
      tw: `flex h-full w-full flex-col border-[40px] border-[${primaryColor}] p-[40px]`,
      style: {
        fontFamily: 'M PLUS 1p',
      },
      children: [
        {
          type: 'div',
          props: {
            tw: 'flex flex-1 items-center text-[60px]',
            children: [
              {
                type: 'div',
                props: {
                  tw: 'flex flex-wrap',
                  children: parser.parse(title).map((word) => ({
                    type: 'span',
                    props: {
                      children: [word],
                    },
                  })),
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            tw: 'flex justify-between items-center',
            children: [
              {
                type: 'span',
                props: {
                  tw: 'text-[30px]',
                  children: [''],
                },
              },
              {
                type: 'img',
                props: {
                  tw: 'w-[80px]',
                  src: kodotIconSvg,
                },
              },
            ],
          },
        },
      ],
    },
  }

  return new ImageResponse(html, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'M PLUS 1p',
        data: fs.readFileSync(path.resolve('./src/pages/og/_m-plus-1p.ttf')),
        weight: 400,
        style: 'normal',
      },
    ],
  })
}
