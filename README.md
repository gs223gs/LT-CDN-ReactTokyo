
こちらはReact Tokyo で LTをした時のRepositoryになります．

Bundlerが一切使えず，CDNのみで社内ツールを作成した話です．

実際にもう一度やるのは非常に心が痛いので，今回はcodexにやらせています．

## 現在の制約と構成

- `npm i` 禁止。すべて CDN 経由で利用（React/ReactDOM、React Router v5.3.4 UMD、TanStack Query v4.36.1 UMD、Babel standalone v7）。
- ルーティングは `HashRouter`（静的ホスティングで `/logfetch` 直叩き 404 を避けるため）。
- Babel standalone で `data-presets="typescript,react"` を使用し、ブラウザ内で TS/JSX をトランスパイル（型チェックなし）。
- コンポーネントは分割ファイル（`home.tsx` / `logfetch.tsx` / `app.tsx`）で、`window.Components` 経由で参照するグローバル登録方式。
- `file://` で開くと外部 TSX 読み込みが CORS でブロックされるため、簡易サーバ（例: `python3 -m http.server 5500`）などで `http://127.0.0.1:5500` を使うのが安全。
- Babel/Tailwind 未使用だが、Babel の「in-browser transformer」警告は開発用の定型で無視可。
