---
title: REGEX Reference
date: 2025-02-24
updated: 2025-06-11
tags:
  - cs
  - generated
---

Very simple generated markdown reference for REGEX Pattern Matching Shorthands and whatnot.

--- 

## Basic Syntax

|Pattern|Description|
|---|---|
|`.`|Matches any character except a newline|
|`^`|Start of a line|
|`$`|End of a line|
|`*`|Matches 0 or more of the preceding character|
|`+`|Matches 1 or more of the preceding character|
|`?`|Matches 0 or 1 of the preceding character|
|`{n}`|Matches exactly `n` occurrences|
|`{n,}`|Matches `n` or more occurrences|
|`{n,m}`|Matches between `n` and `m` occurrences|
|`\`|Escapes special characters|

## Character Classes

|Pattern|Description|
|---|---|
|`[abc]`|Matches `a`, `b`, or `c`|
|`[^abc]`|Matches any character except `a`, `b`, or `c`|
|`[a-z]`|Matches any lowercase letter|
|`[A-Z]`|Matches any uppercase letter|
|`[0-9]`|Matches any digit|
|`\d`|Matches any digit (same as `[0-9]`)|
|`\D`|Matches any non-digit|
|`\w`|Matches any word character (letters, numbers, underscore)|
|`\W`|Matches any non-word character|
|`\s`|Matches any whitespace (spaces, tabs, newlines)|
|`\S`|Matches any non-whitespace|

## Groups & References

|Pattern|Description|
|---|---|
|`(abc)`|Capturing group|
|`(?:abc)`|Non-capturing group|
|`\1`, `\2`|Backreferences to captured groups|
|`(?<name>abc)`|Named capturing group|
|`\k<name>`|Reference to named group|

## Assertions & Anchors

|Pattern|Description|
|---|---|
|`^`|Start of line|
|`$`|End of line|
|`\b`|Word boundary|
|`\B`|Not a word boundary|
|`(?=abc)`|Positive lookahead|
|`(?!abc)`|Negative lookahead|
|`(?<=abc)`|Positive lookbehind (not all regex engines support this)|
|`(?<!abc)`|Negative lookbehind|

## Special Obsidian Use Cases

|Pattern|Description|
|---|---|
|`\[\[.*?\]\]`|Matches Obsidian wiki-style links `[[Link]]`|
|`!\[.*?\]\(.*?\)`|Matches embedded images `![](image.png)`|
|`#\w+`|Matches a hashtag `#tag`|
|`- \[ \]`|Matches an empty checkbox `- [ ]`|
|`- \[x\]`|Matches a completed checkbox `- [x]`|

## Examples

|Regex|Matches|
|---|---|
|`\d{4}-\d{2}-\d{2}`|Dates in `YYYY-MM-DD` format|
|`#[a-zA-Z0-9_-]+`|Obsidian tags|
|`!\[.*?\]\(.*?\)`|Embedded images|
|`\[\[(.*?)\]\]`|Wiki links and captures link text|

This sheet should help with most regex-related tasks in Obsidian, whether searching, replacing, or structuring notes!

```mermaid
graph TD
    subgraph Encoder
        direction TB
        A[Input Embedding] --> B(Positional Encoding);
        B --> C{Multi-Head<br>Attention};
        C --> D(Add & Norm);
        D --> E{Feed Forward};
        E --> F(Add & Norm);
        F --> G((Encoder Output));
    end

    subgraph Decoder
        direction TB
        H[Output Embedding] --> I(Positional Encoding);
        I --> J{Masked Multi-Head<br>Attention};
        J --> K(Add & Norm);
        G --> L{Multi-Head<br>Attention};
        K --> L;
        L --> M(Add & Norm);
        M --> N{Feed Forward};
        N --> O(Add & Norm);
    end
    
    O --> P[Linear];
    P --> Q[Softmax];
    Q --> R((Final Output Probabilities));

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style H fill:#f9f,stroke:#333,stroke-width:2px
    style R fill:#ccf,stroke:#333,stroke-width:2px
    style G fill:#ccf,stroke:#333,stroke-width:2px

```

