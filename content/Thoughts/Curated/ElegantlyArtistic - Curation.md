---
title: Elegant
class:
  - curation
media-type: webp
image: "[[Attachments/Curation/ElegantlyArtistic.webp]]"
source:
related:
author:
description:
tags:
  - curation
aliases:
---
![[Attachments/Curation/ElegantlyArtistic.webp]]

## Mentions

```base
filters:
  and:
    - this.image != ""
    - file.hasLink(this.image)

views:
  - type: table
    name: "Files Using This Image"
    order:
      - file.name
      - file.folder
      - file.mtime
```
