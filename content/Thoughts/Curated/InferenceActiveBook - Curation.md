---
title:
class:
  - curation
media-type: png
image: "[[Attachments/Curation/InferenceActiveBook.png]]"
source:
related:
author:
description:
tags:
  - curation/cover
aliases:
---
![[Attachments/Curation/InferenceActiveBook.png]]

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
