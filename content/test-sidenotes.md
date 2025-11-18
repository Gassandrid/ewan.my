---
title: Test Sidenotes
---

# Test Sidenotes

This is a test of the sidenotes plugin with the original `{{sidenotes[...]}}` syntax.

## Basic Sidenote

Here's some text with a sidenote{{sidenotes[note1]: This is a margin note that appears next to the text}}. Pretty cool!

## Multiple Sidenotes

You can have multiple sidenotes{{sidenotes[first]: First sidenote}} in the same paragraph{{sidenotes[second]: Second sidenote}} and they stack nicely.

## Sidenote with Formatting

This sidenote has **bold** and *italic*{{sidenotes[formatted]: This has **bold text**, *italic text*, and even `code` in it!}}.

## Sidenote with Wikilinks

You can reference other notes{{sidenotes[links]: See [[test-citations]] for citation examples}}.

## Long Sidenote

Short text but long note{{sidenotes[long]: This is a longer sidenote that contains multiple sentences. It should demonstrate how longer content flows in the sidenote layout. The sidenote system should handle this gracefully by either displaying it in the margin on wide screens, or inline on narrow screens. This ensures readability across different viewport sizes.}}.

## Inline Mode

Force inline mode{{sidenotes[inline, dropdown=true]: This sidenote will always be inline/dropdown, even on wide screens}}.
