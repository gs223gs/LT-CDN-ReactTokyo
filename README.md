
こちらはReact Tokyo で LTをした時のRepositoryになります．

Bundlerが一切使えず，CDNのみで社内ツールを作成した話です．

実際にもう一度やるのは非常に心が痛いので，今回はcodexにやらせています．

## 現在の制約と構成

- `npm i` 禁止。すべて CDN 経由で利用（React/ReactDOM、React Router v5.3.4 UMD、TanStack Query v4.36.1 UMD、Babel standalone v7）。
- Babel standalone で `data-presets="typescript,react"` を使用し、ブラウザ内で TS/JSX をトランスパイル（型チェックなし）。

## 起動方法
VScode の拡張機能 `Live server`で起動してください


