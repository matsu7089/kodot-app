import type { Component } from 'solid-js'
import { createSignal, For } from 'solid-js'

type UploadImageInfo = {
  id: string
  width: number
  height: number
}

export const ImageUploader: Component = () => {
  const [uploadedImageInfo, setUploadedImageInfo] = createSignal<
    Array<UploadImageInfo>
  >([])
  let inputRef!: HTMLInputElement

  const handleFile = async (file: File | null | undefined) => {
    if (!file) {
      return
    }

    if (!/image\/(jpe?g|png|gif|webp)/.test(file.type)) {
      alert('許可された画像を選択してください。')
      return
    }

    const arrayBuffer = await file.arrayBuffer()

    const response = await fetch('/image-uploader', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: arrayBuffer,
    })

    if (!response.ok) {
      alert('画像のアップロードに失敗しました。')
    }

    const info: UploadImageInfo = await response.json()

    setUploadedImageInfo([...uploadedImageInfo(), info])
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer?.files[0]
    handleFile(file)
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
  }

  const handleFileInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement | null
    const file = target?.files?.[0]
    handleFile(file)
  }

  const handleCopy = (index: number) => {
    const info = uploadedImageInfo()[index]
    navigator.clipboard.writeText(info.id)
  }

  return (
    <div>
      <h2 class="text-2xl">画像アップロード</h2>
      <div
        class="mt-4 h-64 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.click()}
      >
        クリックかファイルをドロップしてアップロード
        <br />
        画像形式: jpg / jpeg / png / gif / webp
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        class="hidden"
        onChange={handleFileInputChange}
      />

      <div class="grid grid-cols-4 gap-4 mt-4">
        <For each={uploadedImageInfo()}>
          {(info, index) => (
            <div>
              <img class="object-contain" src={info.id} />
              <button
                class="w-full p-2 border"
                type="button"
                onclick={() => handleCopy(index())}
              >
                画像リンクをコピー
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
