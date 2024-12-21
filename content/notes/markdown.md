---
isDraft: true
title: Markdownの記法について
pubDate: 2024-08-04
author: matsu7089
tags: []
---

## 記法の拡張箇所

GitHub 風の Markdown 記法が利用できます。
一部拡張をしているので、その箇所を記載します。

### BreakLine

```md
Markdown ファイルの改行が
そのまま反映されます
```

result:
Markdown ファイルの改行が
そのまま反映されます

### Link

1 行で URL だけ記載するとカード表示になります。

```md
https://github.com/matsu7089/kodot-app
```

result:

https://github.com/matsu7089/kodot-app

### Emoji

```md
:+1: :dog: :cat:
```

result:
:+1: :dog: :cat:

### Code

````md
```gdscript:hello.gd
func _init():
    print("Hello, World!")
```
````

result:

```gdscript:hello.gd
func _init():
    print("Hello, World!")
```

## 特殊な記法

### Container

```md
:::note Title

note タイトル有り

:::

:::note

note タイトル無し

:::
```

result:

:::note Title

note タイトル有り

:::

:::note

note タイトル無し

:::

---

note 以外に warning, caution が利用できます。

```md
:::warning Title

warn 表示サンプル

:::

:::caution Title

caution 表示サンプル

:::
```

result:

:::warning Title

warning タイトル有り

:::

:::caution Title

caution タイトル有り

:::

※ Container はネストできません。
