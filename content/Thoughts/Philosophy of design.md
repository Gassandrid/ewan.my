---
date: 2025-12-09
updated: 2026-11-20T00:59:38-05:00
class:
  - note
tags:
  - art/design
source:
related:
author:
description:
aliases:
  - My Color Palette
  - My Design Palette
---

My palette for ewan.my, the homelab, slides, figures and desktop themes. Blue ink `#303B49` on warm paper `#F5F1EB`, with green, gold and rust as the accents ( see [[#Accent order]] ). mostly based off of the [flexoki](https://stephango.com/flexoki) theme.

| Light                                | Dark                                 | **Name**       | **Light Hex** | **Dark Hex** |
| ------------------------------------ | ------------------------------------ | -------------- | ------------- | ------------ |
| <span style="color:#F5F1EB">⬤</span> | <span style="color:#25262A">⬤</span> | **Light**      | `#F5F1EB`     | `#25262A`    |
| <span style="color:#E3DFD9">⬤</span> | <span style="color:#353436">⬤</span> | **Light Gray** | `#E3DFD9`     | `#353436`    |
| <span style="color:#92908E">⬤</span> | <span style="color:#8E8983">⬤</span> | **Gray**       | `#92908E`     | `#8E8983`    |
| <span style="color:#4B5058">⬤</span> | <span style="color:#D4CEC7">⬤</span> | **Dark Gray**  | `#4B5058`     | `#D4CEC7`    |
| <span style="color:#303B49">⬤</span> | <span style="color:#EBE7E1">⬤</span> | **Dark**       | `#303B49`     | `#EBE7E1`    |
| <span style="color:#A38072">⬤</span> | <span style="color:#c59b8d">⬤</span> | **Secondary**  | `#A38072`     | `#c59b8d`    |
| <span style="color:#858384">⬤</span> | <span style="color:#a89a8d">⬤</span> | **Tertiary**   | `#858384`     | `#a89a8d`    |
| <span style="color:#AD6E60">⬤</span> | <span style="color:#db8e88">⬤</span> | **Rust**       | `#AD6E60`     | `#db8e88`    |
| <span style="color:#C18E77">⬤</span> | <span style="color:#deaea0">⬤</span> | **Clay**       | `#C18E77`     | `#deaea0`    |
| <span style="color:#E89A39">⬤</span> | <span style="color:#e0bc7e">⬤</span> | **Ochre**      | `#E89A39`     | `#e0bc7e`    |
| <span style="color:#899780">⬤</span> | <span style="color:#aebd9f">⬤</span> | **Sage**       | `#899780`     | `#aebd9f`    |
| <span style="color:#587571">⬤</span> | <span style="color:#8daeb3">⬤</span> | **Pine**       | `#587571`     | `#8daeb3`    |
| <span style="color:#748C9C">⬤</span> | <span style="color:#9bb0bd">⬤</span> | **Slate**      | `#748C9C`     | `#9bb0bd`    |
| <span style="color:#A08A98">⬤</span> | <span style="color:#c9b1b9">⬤</span> | **Mauve**      | `#A08A98`     | `#c9b1b9`    |
| <span style="color:#5B6B45">⬤</span> | <span style="color:#adb98f">⬤</span> | **Veld**       | `#5B6B45`     | `#adb98f`    |
| <span style="color:#BC8D2F">⬤</span> | <span style="color:#d8ae5a">⬤</span> | **Gold**       | `#BC8D2F`     | `#d8ae5a`    |

## Accent order

- [[11-19-2026]] the accents used in the following priority
	- **green** ( veld ) for links and navigation. it's the big field of the flag so it gets used the most
		- a browner bushveld green, not the flag's emerald. the first one i tried was minty and looked off in dark mode
		- light and dark get their own values, not one colour flipped
	- **gold** for where you are: pointers, the tag tape's read head, the current note, focus, a link's underline on hover
		- it's the thin border on the flag, so it stays thin and rare here. spread it everywhere and it stops meaning anything
		- the real flag gold ( `#FFB81C` ) disappears on paper as a line, so it's the same hue with less saturation and more depth
		- gold can't be text on light paper ( ~2.7:1 ), which is another reason links are green
	- **rust** stays the red, for citations and things that need attention
	- clay, sage, pine, slate, mauve and ochre stay quiet, for callouts and charts

## Principles

- one reading width ( 720px ) that only shrinks on phones, like [stephango.com](https://stephango.com/) and [aarnphm.xyz](https://aarnphm.xyz/)
- square paper and hairlines, no rounded chips or tinted boxes
- links are quiet: role coloured text over a faint underline that turns gold on hover. same rule for tags, breadcrumbs and the sidebars
- note metadata ( date, pagerank, tags, nearby ) lives in one ruled strip under the title; each cell opens a drawer instead of taking space at the bottom of the page

## Fonts

Headers: IM Fell DW Pica (400 only; vary by size and italic)

Body: PP Neue Montreal

Code: IBM Plex Mono

---

## Reference

- https://stephango.com/ the goat
- https://aarnphm.xyz/ as well
- https://palletism.art/collections/sunprint idk seems cool
