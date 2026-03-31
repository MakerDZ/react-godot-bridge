# react-godot-bridge — Godot Plugin

The GDScript Autoload singleton that pairs with the [`react-godot-bridge`](https://npmjs.com/package/react-godot-bridge) npm package.

## Installation

1. Copy the `addons/react_bridge/` folder into your Godot project's root.
2. Open **Project → Project Settings → Autoload**.
3. Add `res://addons/react_bridge/ReactBridge.gd` with the name `ReactBridge`.
4. Optionally enable the plugin under **Project → Plugins**.

Your `project.godot` autoload entry should look like:

```ini
[autoload]
ReactBridge="*res://addons/react_bridge/ReactBridge.gd"
```

## Usage

### Receive events from React

Connect to the `on_react_event` signal from any scene script:

```gdscript
func _ready() -> void:
    ReactBridge.on_react_event.connect(_on_react_event)

func _on_react_event(event_name: String, payload: Dictionary) -> void:
    match event_name:
        "jump":
            $Player.position.y += payload.get("height", 1.0)
        "set_weather":
            $Sky.condition = payload.get("type", "sunny")
```

### Send events to React

Call `emit_to_react` from anywhere in your game:

```gdscript
ReactBridge.emit_to_react("player_died", { "score": 1500 })
ReactBridge.emit_to_react("level_complete", { "level": 3, "time_ms": 4200 })
```

## Security

| Property | Default | Description |
|----------|---------|-------------|
| `app_key` | `""` | Must match `appKey` in `<GodotBridgeProvider>`. Empty = dev mode (no validation). |
| `allowed_origin` | `"*"` | Restrict incoming `postMessage` origin for production. |

Set these before `_ready()` runs, e.g. from a project setting or a dedicated config script.

## Compatibility

- Godot 4.x Web export only (`JavaScriptBridge` is not available on other platforms)
- Single-threaded and multi-threaded exports are both supported
