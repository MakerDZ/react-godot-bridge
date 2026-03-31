extends Node

## Autoload singleton that acts as the central hub for all communication
## between the Godot game and the React parent window.
##
## React → Godot: listen via  ReactBridge.on_react_event.connect(my_func)
## Godot → React: call        ReactBridge.emit_to_react("event_name", { "key": value })

signal on_react_event(event_name: String, payload: Dictionary)

## Secret key that must match the appKey passed to <GodotBridgeProvider>.
## Set this before _ready() runs, e.g. from an exported project setting.
var app_key: String = ""

## Restrict incoming messages to this origin. Leave "*" to allow all.
var allowed_origin: String = "*"

# Keep hard references so Godot's GC never frees these callbacks.
var _msg_callback
var _window

func _ready() -> void:
	if OS.has_feature("web"):
		_window = JavaScriptBridge.get_interface("window")
		_msg_callback = JavaScriptBridge.create_callback(_on_message)
		_window.addEventListener("message", _msg_callback)
		print("[ReactBridge] Listening for postMessage events.")

## Called by JavaScriptBridge when the iframe receives a postMessage.
func _on_message(args) -> void:
	var event_obj = args[0]

	# Origin validation
	if allowed_origin != "*" and event_obj.origin != allowed_origin:
		return

	var raw = event_obj.data
	if typeof(raw) != TYPE_STRING:
		return

	var envelope = JSON.parse_string(raw)
	if typeof(envelope) != TYPE_DICTIONARY:
		return

	# Schema guard
	if not envelope.has("event") or typeof(envelope["event"]) != TYPE_STRING:
		return

	# Secret key validation — skipped when app_key is empty (dev mode)
	if app_key != "":
		var meta = envelope.get("metadata", {})
		if typeof(meta) != TYPE_DICTIONARY or meta.get("secret", "") != app_key:
			print("[ReactBridge] Message rejected: secret key mismatch.")
			return

	var event_name: String = envelope["event"]
	var payload: Dictionary = envelope.get("payload", {})
	print("[ReactBridge] Event received: ", event_name, " | payload: ", payload)
	on_react_event.emit(event_name, payload)

## Send an event from Godot to the React parent window.
func emit_to_react(event_name: String, payload: Dictionary = {}) -> void:
	if not OS.has_feature("web"):
		print("[ReactBridge] emit_to_react('%s') skipped — not a web build." % event_name)
		return

	var envelope = {
		"event": event_name,
		"payload": payload,
		"metadata": {
			"secret": app_key,
			"timestamp": Time.get_unix_time_from_system()
		}
	}
	_window.parent.postMessage(JSON.stringify(envelope), "*")
