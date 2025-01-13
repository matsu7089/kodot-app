import {
  createSignal,
  Match,
  onMount,
  Show,
  Switch,
  type Component,
} from 'solid-js'

export const ContactForm: Component = () => {
  const [category, setCategory] = createSignal('')
  const [content, setContent] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [token, setToken] = createSignal('')
  const [submitting, setSubmitting] = createSignal(false)
  const [errorMessage, setErrorMessage] = createSignal('')
  const [submitCompleted, setSubmitCompleted] = createSignal(false)
  let categorySelect!: HTMLSelectElement

  const handleCategoryChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value
    setCategory(value)
    setContent('')
  }

  const handleContentChange = (e: Event) => {
    const value = (e.target as HTMLTextAreaElement).value
    setContent(value)
  }

  const handleEmailChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    setEmail(value)
  }

  const buttonDisabled = () => {
    if (submitting()) {
      return true
    }

    switch (category()) {
      case 'request': {
        return content() === '' || token() === ''
      }
      case 'other': {
        return content() === '' || email() === '' || token() === ''
      }
      default: {
        return true
      }
    }
  }

  onMount(() => {
    categorySelect.value = ''

    // @ts-ignore next-line - turnstileの型が無いので無視
    window.onloadTurnstileCallback = () => {
      // @ts-ignore next-line - turnstileの型が無いので無視
      turnstile.render('#cf-turnstile', {
        sitekey: '0x4AAAAAAAiVc2NLoTLOHTzW',
        callback: (token: string) => setToken(token),
        'expired-callback': () => setToken(''),
        size: 'flexible',
        theme: 'dark',
      })
    }
  })

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    if (submitting()) {
      return
    }

    setSubmitting(true)
    setErrorMessage('')

    const response = await fetch(import.meta.env.PUBLIC_CONTACT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        category: category(),
        content: content(),
        email: email(),
        token: token(),
      }),
    })

    const data = await response.json()
    setSubmitting(false)

    if (response.ok && !data.error) {
      setSubmitCompleted(true)
    } else {
      setErrorMessage(data.error || '予期せぬエラーが発生しました。')
    }
  }

  return (
    <>
      <Show when={!submitCompleted()}>
        <span class="text-lg">
          <span class="text-red-500">*</span> カテゴリー
        </span>
        <select
          ref={categorySelect}
          class="pixel-border p-2 w-full bg-transparent mt-2"
          onChange={handleCategoryChange}
          disabled={submitting()}
        >
          <option value="">選択してください</option>
          <option value="question">記事内容に関するご質問等</option>
          <option value="request">記事をリクエストしたい</option>
          <option value="other">
            その他（サイト不具合や運営にコンタクトを取りたい場合等）
          </option>
        </select>
        <div class="mt-4">
          <Switch>
            <Match when={category() === 'question'}>
              <p>
                記事内容に関するご質問等は Discord
                にて受け付けておりますので、大変お手数ですがこちらをご利用ください。🙇
              </p>
            </Match>
            <Match when={category() === 'request'}>
              <span class="text-lg">
                <span class="text-red-500">*</span> 記事のテーマ
              </span>
              <textarea
                class="pixel-border p-2 w-full bg-transparent mt-2"
                oninput={handleContentChange}
                rows="3"
                maxLength="2000"
                disabled={submitting()}
              ></textarea>
              <p class="mt-2">
                ※必ずリクエストされたテーマで記事を書くとは限りませんが、参考にさせていただきます！
              </p>
            </Match>
            <Match when={category() === 'other'}>
              <span class="text-lg">
                <span class="text-red-500">*</span> お問い合わせ内容
              </span>
              <textarea
                class="pixel-border p-2 w-full bg-transparent mt-2"
                oninput={handleContentChange}
                rows="3"
                maxLength="2000"
                disabled={submitting()}
              ></textarea>
              <span class="text-lg mt-2">
                <span class="text-red-500">*</span> メールアドレス
              </span>
              <input
                class="pixel-border p-2 w-full bg-transparent mt-2"
                oninput={handleEmailChange}
                maxLength="255"
                disabled={submitting()}
              ></input>
              <p class="mt-2">※メール返信までお時間を頂く場合がございます。</p>
            </Match>
          </Switch>
        </div>
        <Show when={errorMessage() !== ''}>
          <div class="pixel-border p-2 mt-4">エラー：{errorMessage()}</div>
        </Show>
        <div
          style={{
            display:
              category() === 'request' || category() === 'other'
                ? 'block'
                : 'none',
          }}
        >
          <div id="cf-turnstile" class="mt-8"></div>
          <button
            class="pixel-border py-2 px-4 mt-4 bg-kodot-blue text-white dark:text-gh-dimmed-text"
            style={{
              opacity: buttonDisabled() ? 0.5 : 1,
              cursor: buttonDisabled() ? 'not-allowed' : 'pointer',
            }}
            onclick={handleSubmit}
          >
            {submitting() ? '送信中…' : '送信する'}
          </button>
        </div>
      </Show>
      <Show when={submitCompleted()}>
        <p>送信完了しました。ご入力ありがとうございました！</p>
      </Show>
    </>
  )
}
