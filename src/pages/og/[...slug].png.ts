import fs from 'fs'
import path from 'path'
import type { CollectionEntry, CollectionKey } from 'astro:content'
import { getPubCollection } from '@/utils'
import { ImageResponse } from '@vercel/og'
import { loadDefaultJapaneseParser } from 'budoux'

const parser = loadDefaultJapaneseParser()

interface Props {
  params: {
    slug: string
  }
  props: {
    entry: CollectionEntry<CollectionKey>
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
          entry,
        },
      } satisfies Props)
  )
}

export async function GET({ props }: Props) {
  const { entry } = props

  const primaryColor = {
    articles: '#478cbf',
    notes: '#47bf99',
  }[entry.collection]

  const svgData = (name: string) => {
    return (
      'data:image/svg+xml,' +
      encodeURIComponent(
        fs
          .readFileSync(path.resolve(`./src/icons/${name}.svg`), 'utf-8')
          .replace(/<path/g, `<path fill="${primaryColor}"`)
      )
    )
  }

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
                  children: parser.parse(entry.data.title).map((word) => ({
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
            tw: 'flex justify-between items-end',
            children: [
              {
                type: 'div',
                props: {
                  tw: 'flex items-center',
                  children: [
                    {
                      type: 'img',
                      props: {
                        tw: 'w-[32px] mr-[8px]',
                        src: svgData('pen'),
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        tw: 'text-[32px]',
                        children: [entry.data.author],
                      },
                    },
                  ],
                },
              },
              {
                type: 'img',
                props: {
                  tw: 'w-[80px]',
                  src: svgData('kodot-solid'),
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
