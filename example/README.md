# react-godot-bridge — Example App

A Next.js demo showing the full bidirectional bridge between React and a Godot WebAssembly game.

## Setup

1. **Install dependencies**

```bash
bun install   # or npm install
```

2. **Add your Godot export**

Export your Godot project for the Web platform and copy the output files into `public/game/`:

```
public/game/index.html
public/game/index.js
public/game/index.wasm
public/game/index.pck
```

Make sure your Godot project has the `ReactBridge` autoload installed (see [`../godot-plugin/`](../godot-plugin/README.md)).

3. **Run**

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local` to set a secret key (optional — leave empty for dev mode):

```
NEXT_PUBLIC_BRIDGE_KEY=your-secret-key
```

Set the same key in `ReactBridge.app_key` inside your Godot project.
