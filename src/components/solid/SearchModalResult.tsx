import {
  createSignal,
  For,
  Index,
  onMount,
  Show,
  type Component,
} from 'solid-js'

const isDev = import.meta.env.DEV

export const SearchModalResult: Component = () => {
  const initMessage = "Let's go on an adventure!"
  const [resultMessage, setResultMessage] = createSignal(initMessage)
  const [searchResults, setSearchResult] = createSignal<Array<any>>([])
  const [remainResults, setRemainResult] = createSignal<Array<any>>([])
  const [isFetching, setIsFetching] = createSignal(false)

  const setOverflowY = (v: string) => {
    document.documentElement.style.overflowY = v
  }

  const process = async (results: Array<any>, shouldResultClear?: boolean) => {
    if (isFetching()) {
      return
    }

    setIsFetching(true)

    const pageSize = 5
    const data = await Promise.all(
      results.slice(0, pageSize).map((r) => r.data()),
    )

    setSearchResult([...(shouldResultClear ? [] : searchResults()), ...data])
    setRemainResult(results.slice(pageSize))

    setIsFetching(false)
  }

  onMount(async () => {
    const searchButton = document.getElementById('search') as HTMLElement
    const dialog = document.getElementById('dialog') as HTMLDialogElement
    const input = document.getElementById('input') as HTMLInputElement
    const checkArticles = document.getElementById(
      'check-articles',
    ) as HTMLInputElement
    const moreButton = document.getElementById('more') as HTMLButtonElement

    const showModal = () => {
      dialog.showModal()
      setOverflowY('hidden')
    }

    searchButton.addEventListener('click', showModal)

    document.addEventListener('keydown', (event) => {
      if (event.key !== '/' || document.activeElement === input) {
        return
      }

      event.preventDefault()

      if (dialog.open) {
        input.focus()
      } else {
        showModal()
      }
    })

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close()
      }
    })

    moreButton.addEventListener('click', () => {
      process(remainResults())
    })

    dialog.addEventListener('close', () => {
      input.value = ''
      setOverflowY('')
      setSearchResult([])
      setResultMessage(initMessage)
    })

    if (isDev) {
      return
    }

    const handleSearch = async () => {
      setResultMessage('Searching...')

      const searchOptions = checkArticles.checked
        ? { filters: { collection: 'articles' } }
        : null

      /** @ts-ignore-next-line pagefindの型が無いので無視 */
      const search = await window.pagefind.debouncedSearch(
        input.value,
        searchOptions,
      )

      if (search === null) {
        return
      }

      const results = search.results
      const numOfResults = results.length

      await process(results, true)

      setResultMessage(
        numOfResults === 1 ? '1 result' : `${numOfResults || 'No'} results`,
      )
    }

    input.addEventListener('input', handleSearch)
    checkArticles.addEventListener('input', handleSearch)
  })

  const createTitleAndExcerpt = (result: any) => {
    return (
      <>
        <p>
          <a class="hover:text-kodot-blue hover:underline" href={result.url}>
            {result.meta?.title || result.title}
          </a>
        </p>
        <p
          class="text-xs [&>mark]:bg-kodot-blue [&>mark]:text-white"
          innerHTML={result.excerpt}
        ></p>
      </>
    )
  }

  return (
    <>
      <p class="font-ps2 m-4 text-center">{resultMessage()}</p>
      <div class="mt-4 mx-4">
        <For each={searchResults()}>
          {(result) => (
            <div class="mt-4 pb-4 [&:not(:last-child)]:border-b-4 border-current">
              <div class="flex">
                <div>{createTitleAndExcerpt(result)}</div>
                <Show when={result.meta.image}>
                  <img
                    class="mr-2 w-40 aspect-[16/9] object-cover"
                    src={result.meta.image}
                  ></img>
                </Show>
              </div>
              <ul class="ml-4 mt-2">
                <Index each={result.sub_results.slice(0, 3)}>
                  {(item) => (
                    <li class="list-square">{createTitleAndExcerpt(item())}</li>
                  )}
                </Index>
              </ul>
            </div>
          )}
        </For>
      </div>
      <button
        id="more"
        class="w-full font-ps2 p-4 hover:text-kodot-blue disabled:text-gray-500 disabled:opacity-50"
        disabled={isFetching() || remainResults().length === 0}
        style={{ display: searchResults().length === 0 ? 'none' : 'block' }}
      >
        Load more
      </button>
    </>
  )
}
