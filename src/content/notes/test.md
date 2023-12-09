---
title: test
pubDate: 2023-11-11
author: matsu7089
---

# GFM

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

## Footnote

A note[^1]

[^1]: Big note.

## Strikethrough

~one~ or ~~two~~ tildes.

## Table

| a   | b   |   c |  d  |
| --- | :-- | --: | :-: |

## Tasklist

- [ ] to do
- [x] done

## Code

```gdscript
extends Area2D
class_name Player

@onready var animated_sptite_2d := $AnimatedSprite2D as AnimatedSprite2D

var cell_pos := Vector2i(0, 0):
    set(v):
        position = v * Global.CELL_SIZE
        cell_pos = v
    get:
        return cell_pos

var hit_count := 0


func _ready() -> void:
    cell_pos = Vector2i(3, 6)
    animated_sptite_2d.play('default')


func _process(delta: float) -> void:
    if Input.is_action_just_pressed('up') && cell_pos.y != 0:
        cell_pos.y -= 1
    elif Input.is_action_just_pressed('down') && cell_pos.y != Global.CELL_H:
        cell_pos.y += 1
    elif Input.is_action_just_pressed('left') && cell_pos.x != 0:
        cell_pos.x -= 1
    elif Input.is_action_just_pressed('right') && cell_pos.x != Global.CELL_W:
        cell_pos.x += 1


func _on_area_entered(area: Area2D) -> void:
    hit_count += 1
```
