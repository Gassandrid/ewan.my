---
class:
  - note
tags:
  - cs/ai
date: 2025-08-27
updated: 2026-11-18T23:57:08-05:00
source:
related:
author:
description:
aliases:
  - Tokenization
---

A token is simply an internal representation for Natural Language Processing models, where words are broken up into meaninfull fragments.

- [[11-18-2026]] more generally, tokenization beyond NLP is just the problem of deciding the most efficient atomic units for some problem. For conventional natural language modeling this usually approximates something like that of greek combination forms ( in their purpose not purely these ) for the atomic units of defining semantic meaning beyond a word. [In context tokenization](https://www.cartesia.ai/blog/from-tokens-to-bytes-part-1) seems to be making some waves for hierarchical networks that find efficient atomic units for the problem at hand ( one could imagine noticing repeated binary patterns that are effectively chuncked, or just think about how most compression libraries like gzip go about removing redundancy ).

This has been found to improve accuracy over simply just embedding the word, as some combinations encode general meaning regardless of the word ( example: token**ization**, the "ization" has meaning across words. )

[![TokenizationDemo.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/aeca4237c7717dfa238bce449524db3bb08a390fd2a9c2099ef3c53ec1e87a6e/TokenizationDemo.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/aeca4237c7717dfa238bce449524db3bb08a390fd2a9c2099ef3c53ec1e87a6e/TokenizationDemo.png)
