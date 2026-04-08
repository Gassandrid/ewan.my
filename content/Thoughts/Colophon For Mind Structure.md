---
date: 2026-03-30T18:44:51-04:00
updated: 2026-04-08T10:23:44-04:00
class:
  - note
created_on: "[[03-30-2026]]"
tags:
  - journal/workflow
source:
related:
author:
description: a design for how I map the mind, from obsidian configuration to daemon mind capture processes like activitywatch and transcription/diarization services
aliases:
  - How I use Obsidian
---

## Obsidian

### Configuration

Most of my workflow would work without plugins, so dont think of this as a vastly different obsidian experience. Most just make writing just a little faster.

#### Functional

**Latex Suite**

Beyond making latex faster than handwritten math, provides a great engine for instant snippets which you can customize. I love it for instant callouts, like the desmos callouts i have in notes like [[Triple Integrals Practice]].

**Zotero Integration**

If you work with any kind of academic papers this is one of the most useful features of obsidian. Read papers and annotate with zotero, auto import into obsidian extracting all important properties. You can then query with an obsidian base.

**Linter**

So important for several different things. Auto create date front matter property, move tags to front matter, standardizes your formatting.

**Notebook Navigator**

Because I use tags profusely this is a must-have. You can view tags just like you would folders, in the same bar and recent files viewing. I mostly use omni search for finding files I want, but for finding by tag this is the best.

You may not like the interface, but brings like 5 different plugins into one. 

**Excalidraw**

great for math diagrams, especially topologies. Works well with mermaid, which I should use more often.

**Git**

I do a lot of data science, and thus having time series data for my notes is a must. This is the easiest way to back up your vault online with Github, and you get a super rich history of how you write notes over time.

**Smart Connections**

Bordering on not being that useful because the author is paywalling a lot of features, but this provides simple semantic search [[Cosine Similarity]] for any given note.

##### Nitpicks

**Omnisearch**

I love it a lot but this isn't that different from Obsidians built in `CMD+O` file picker, it just reads note content as well which I never really use. Also has an OCR for searching text in images.

**Tab Switcher**

Browser style `ctrl+tab` switching, where it is treated as a "most recent" stack instead of just cycling through all open tabs.

**Templater**

i don't think its that useful, most templates I have are just front matter properties

**ActivityWatch**

for working with the [[ActivityWatch]] computer usage daemon.

**JupyMd**

I dont use this that much, but if I have python codeblocks that are runnable on my website this is a good place to do it. Also converts jupyter notebooks to markdown, a much more token efficient format.

**Maps**

Made by obsidian team, a *map view* for obsidian bases. Nice for if you document places.

**Paste Image Rename**

Simple enough, prompts you to name an image when you paste it in. good for managing images folder in the long term.

#### Visual

##### Plugins

**Hide Window Controls**

Made a simple JS snippet to hide the MACOS traffic lights because I hate them. You will have to look up how to make your own plugin, its pretty easy, but heres the javascript:

`main.js`

```js
const { Plugin } = require("obsidian");

/** @type {(w: Electron.BrowserWindow) => void} */
function hideWindowControls(w) {
  w.setWindowButtonVisibility(false);
}

module.exports = class extends Plugin {
  onload() {
    if (process.platform === "darwin") {
      hideWindowControls(electronWindow);

      this.app.workspace.on("window-open", (_, { activeWindow }) => {
        hideWindowControls(activeWindow);
      });
    }
  }
};
```

`styles.css`

```css
body.mod-macos .workspace-tab-header-container {
  padding-left: 4px !important;
}
```

**Hider**

Gets rid of all the elements I dont want. Essential if you come from [[Neovim]] and like your clean workspaces.

**Vertical Tabs**

Arc/Zen style tabs, nice for me so I can hide/unhide when I please.

**Persistent Graph**: if you want the graph to be sort of useful, this keeps the positions instead of redoing the graph sim every time.

##### Theme

I use **primary** as it was easiest to make in [[My Color Palette]], I would also recommend minimal if you like [[Neovim]]. See my snippet for making primary different.

### Snippets

**Complementary menu buttons hider** I use this in combination with the plugin, it seems to work when you use both.

```css
.workspace-titlebar {
  -webkit-app-region: drag; /* Allow dragging */
}

.workspace-titlebar-buttons {
  display: none;
}
```

**Main colorscheme**

```css
.theme-light {
    --background-primary: #f5f1eb;
    --background-primary-alt: #f5f1eb;
    --background-secondary: #e6dfd6;
    --background-secondary-alt: #e6dfd6;
    --background-modifier-hover: rgba(166, 124, 109, 0.15); 

    --text-normal: #2d2520;
    --text-muted: #4a4238;
    --text-faint: #9a8f82;
    --text-on-accent: #f5f1eb; 
    --text-selection: rgba(191, 97, 89, 0.2);

    --interactive-accent: #bf6159;      /* Rust */
    --interactive-accent-hover: #a67c6d; /* Secondary */
    --text-accent: #bf6159;
    --text-accent-hover: #a67c6d;
    
    --link-color: #bf6159;
    --link-color-hover: #a67c6d;
    --link-external-color: #bf6159;
    --link-external-color-hover: #a67c6d;
    --url-color: #bf6159;

    --nav-item-background-active: rgba(191, 97, 89, 0.15);
    --nav-item-text-color-active: #bf6159;
    --background-modifier-active-hover: rgba(191, 97, 89, 0.1);

    --background-modifier-border: #f5f1eb; 
    --background-modifier-border-hover: #e6dfd6;
    --interactive-normal: #f5f1eb;
    --interactive-hover: #e6dfd6;

    --hr-color: #4a4238;
    --caret-color: #bf6159; 
    --graph-line: #8b7f73;
    --graph-node: #bf6159;

    --color-red: #bf6159;
    --color-orange: #c78d75;
    --color-yellow: #cc9e54;
    --color-green: #869c7a;
    --color-cyan: #56706b;
    --color-blue: #728c99;
    --color-purple: #9d868e;
    --color-pink: #9d868e;
}

.theme-dark {
    --background-primary: #1a1714;
    --background-primary-alt: #1a1714;
    --background-secondary: #2a2520;
    --background-secondary-alt: #2a2520;
    --background-modifier-hover: rgba(197, 155, 141, 0.15);

    --text-normal: #ebe7e1;
    --text-muted: #d4cec7;
    --text-faint: #6b6158;
    --text-on-accent: #1a1714;
    --text-selection: rgba(219, 142, 136, 0.2);

    --interactive-accent: #db8e88;      /* Rust */
    --interactive-accent-hover: #c59b8d; /* Secondary */
    --text-accent: #db8e88;
    --text-accent-hover: #c59b8d;

    --link-color: #db8e88;
    --link-color-hover: #c59b8d;
    --link-external-color: #db8e88;
    --link-external-color-hover: #c59b8d;
    --url-color: #db8e88;

    --nav-item-background-active: rgba(219, 142, 136, 0.15);
    --nav-item-text-color-active: #db8e88;
    --background-modifier-active-hover: rgba(219, 142, 136, 0.1);

    --background-modifier-border: #1a1714;
    --background-modifier-border-hover: #2a2520;
    --interactive-normal: #1a1714;
    --interactive-hover: #2a2520;

    --hr-color: #d4cec7;
    --caret-color: #db8e88; 

    --graph-line: #4a4238;
    --graph-node: #db8e88;

    --color-red: #db8e88;
    --color-orange: #deaea0;
    --color-yellow: #e0bc7e;
    --color-green: #aebd9f;
    --color-cyan: #8daeb3;
    --color-blue: #9bb0bd;
    --color-purple: #c9b1b9;
    --color-pink: #c9b1b9;
}

.cm-cursorLayer .cm-cursor {
    background-color: var(--caret-color) !important;
    opacity: 0.6; 
}

.markdown-source-view.mod-cm6 .cm-link, 
.markdown-source-view.mod-cm6 .cm-hmd-internal-link, 
.markdown-preview-view a, 
.cm-s-obsidian span.cm-link, 
.cm-s-obsidian span.cm-hmd-internal-link {
    color: var(--link-color) !important;
    text-decoration: none !important;
}
```

---

### Workflow

#### Inbox and Task Management

[[Using an Inbox System]] - this is by far the simplest and most ideal way to manage tasks. I think that [[Tasknotes in my workflow]] no longer works for me, as it is simply overcomplex and reduces productivity, I dont need 6 kanban boards for my kind of work.

Please take note that for an inbox system to work, you must utilize [[Using an Inbox System#04-02-2026 Stub Notes|stub notes]] to their fullest. Don't be afraid of "letting an idea go", as it will resurface organically in your own exploration and accumulation of novel ideas. Also stub notes will resurface in [[Passive Obsidian Worktime]].

- this is also the same motivation behind the idea of excessive [[Bullet Point Notation]].
	- bullet point notes convey all the information you need with less words, but also bring a hierarchical approach to the note itself
	- I like to think of it like markdown's own heading hierarchichy, but more efficient. I am trying to use them more often, however sometimes it is just better to stream conciousness.
	- inspired by [[Yana Log Notes]] ( see [here](https://yana-log.net/) )

#### Timeseries and Daily Notes

Bit harder and less straightforward. Using the `git` plugin along with some LLM analysis ( easiest way to go about it, you could do without if you are ok with the time sink ), you can get a better feel for how your notes/habits change over time. I myself made a simple MCP server to complement the obsidian cli for an agent that allows it to see topic topology via total # git diffs for notes with a certain tag:

![[tagFiringRates.png]]

But the better way to do this is to use links to daily notes excessively. [[Note updates as links to daily notes]] covers this, but essentially you encode the timeseries nature of returning to old notes as headings with a link to the day you made that change. This has the advantage of allowing you to go back to a certain daily note and see the backlinks as what you did.

#### Templates

Using templates profusely, from [the current ceo's method](https://stephango.com/vault), where you don't really focus on keeping any content within the body of the templates, just the frontmatter. 

This allows you to both have the flexibility of an emergent organization system while also getting the *compositional* and rigid nature of **Object Oriented Proggraming**, where you assign each note a "structure", for which certain qualities hold true for all notes of that class. Another useful thing about having a universal category property like `class`, is I can re use general property names and assign them different use cases in the context of different classes. 

For example, **[[Neurotransmitter Template]]** for me has `class:neurotransmitter`, and because this only gets inserted with the template I know any note of this class has properties like `type`, `upstream`, `inhibitors/activators`, etc. I am reusing general properties here, as across the [[Neurotransmitter Template]] and others like [[Receptor Template]]/[[Process Template]] ALL have a `type` property, but it is context dependent on the `class` property.

#### Frontmatter

Talked a little about it above, but to keep frontmatter efficient look for ways to reuse the same property under different contexts across notes. There are also properties that **ALL** notes will have:

```yml
class:
  - note
created_on: "[[<% tp.date.now('MM-DD-YYYY') %>]]" # up to you if you think this is usefull
tags:
source: # quick references, can be OTHER NOTES or URLs, this is the primary way this note was inspired to be made. e.g. watch a youtube video, import, then the concept note will have a source pointing to that video.
related:
author:
description: # one sentence description of the note, used in website
aliases: # we use aliases for everything
```

#### Hierarchical Tags

Tags follow a hierarchical dot notation: `comp-neuro/equipment/eeg`, `cs/data-science`, `phd/prep/reu`. This lets you filter broadly (`comp-neuro`) or precisely (`comp-neuro/equipment/eeg`) in the tag panel and in Bases queries. 

Notebook Navigator plugin makes these browsable as a folder-like tree. Keep tags structural rather than descriptive, tags describe *what a note is*, wikilinks describe *what it's about*.

**Tags are folders, except a note can be in multiple folders**

#### Aliases

[[Using Aliases More Frequently]] - aliases are a GREAT way to help link old ideas. Not only makes searching easier, but when typing a name for a link in the `[[` menu, you can type the alias and press enter, and it will create the link but with the display name set to the alias you typed. Great for long note names like [[Uniform Manifold Approximation and Projection|UMAP]], i just typed "umap" and it linked to the full path [[Uniform Manifold Approximation and Projection]].

These also make adding backlinks so much easier. the bets way to link up new/old ideas into a note is to profusely use the backlinks/outgoing links panels, as they have options to find keyword note names in the note content and create the link for you. if a note has aliases, it will also search all notes for that alias keyword as well. I can go to the [[Uniform Manifold Approximation and Projection|UMAP]] note, go to backlinks panel, and find all notes that just have the keyword "UMAP" in their contents and create the link, instead of just searching for "Uniform Manifold Approximation and Projection", which will never be fully typed out in a note.

### Consuming Knowledge

By far my biggest obsidian "moat" in my life. A detailed explanation can be seen in the first note of the series, [[Consuming and Choosing Content Effectively]].

As the current setup stands, I have a lot of information source templates ( [[youtube template]], [[Book Template]], [[zotero_paper_template]] ), and VIEWs for these kinds of notes ( [[Books.base]], [[Youtube.base]], [[Papers.base]] ).

Each knowledge source is unique, but one thing they all share is the frontmatter property `status`. This usually follows the form *open/in-progress/done* from my tasknotes days, but now is treated much more generally and tied to the notes `class` property. For example, the [[Medication Template]] uses the `status` property for *interested/taking/stopping*, for [[Substance Protocol]] stack tracking.

There is a lot of other little things here, please read the full note [[Consuming and Choosing Content Effectively]]!

>[!Warning] On a related note
> If you have explored my [[Nootropic Compounds.base|Nootropic Compounds]]/[[Neuropharmacology]] notes at all, I also recommend reading [[Utilizing Cognition Enhancement Effectively]], this is kind of building straight off of [[Consuming and Choosing Content Effectively]]. If you really want to dial in your mind, the world of neuropharma might be for you. If you want to get started, I would consider something like [[TAK-653]] and possibly [[ACD-856]]/[[Tropisetron]] as a starting point.

---

%%

## Mind Capture Layer

Obsidian is the semantic layer — ideas, connections, outputs. But cognition runs 24/7, most of it leaving no trace in notes. The mind capture layer is a set of background daemons and sensors that passively record the substrate: what you're looking at, what you're saying, where your attention is going, and what your brain is doing while it all happens. Together they fill in the space between vault commits.

### [[ActivityWatch]]

**What it is**: an open-source, local-first daemon that continuously logs computer activity — active window title, app name, URL (with browser extension), and AFK status. No cloud. Runs silently in the background and exposes data via a REST API at `localhost:5600`.

**Setup**:

1. Install from [activitywatch.net](https://activitywatch.net) — the menu bar app starts the server automatically on login
2. Install the browser extension (Firefox/Chrome) for URL-level granularity beyond just "Firefox was active"
3. Install the **ActivityWatch** Obsidian plugin to log vault-specific activity (which notes are open and for how long)

**Data access**: the web UI at `localhost:5600` gives you basic visualizations. For analysis, the REST API returns JSON buckets you can pull into pandas. The `aw-client` Python package is the cleanest interface.

**Why it matters here**: ActivityWatch is the behavioral telemetry backbone. Every window switch, URL visit, and dwell time is timestamped and retrievable. This is the same signal layer that recommendation algorithms use as their latent state proxy — watch time, switching frequency, session structure. Cross-referenced with vault commits and EEG timestamps, it's the highest-frequency behavioral readout in the stack.

### Parakeet Transcription Engine

local speech-to-text daemon built on NVIDIA's NeMo Parakeet model, running via MLX on Apple Silicon. Press `alt+R` to start recording, release to transcribe; the result goes straight to clipboard. No cloud, no latency beyond inference time. 

i lowkey vibe coded this one day out of spite for the fact that whispr flow DOESNT RUN ON DEVICE!?!?!?!?! This runs basically just as fast/good, and is completely local. Assumes you are on a macbook like me though.

uses the `parakeet-mlx` python lib, the MLX port of NVIDIA's `parakeet-tdt-1.1b`, runs fully on the neural engine. Fast enough that streaming transcription during recording is practical.

**Usage convention**: voicenotes get logged with the standard callout:

```markdown
>[!Quote] Transcription
> transcribed text here
```

This marks machine-transcribed content so you know the origin when reviewing later.

**Why it matters here**: typing speed is a bottleneck on thought capture rate. Speech removes the bottleneck. The transcription engine turns ambient thinking — commuting, cooking, walking — into vault-ready text. It also produces a timestamped audio log if you keep the recordings, which pairs with ActivityWatch for reconstruction of what you were doing and thinking at a given moment.

### Spatial Transcription and Diarization

Still a work in progress, but I am working on extending this towards spatial microphone arrays for more complex interaction modeling. If you can set this up in your house, this is one of the easiest ways to improve the heuristic of your higher level cognition model. I started this on work for the [[UVM Glass Brain Lab]], but the transcription work can be taken anywhere.

**What it is**: the [[reSpeaker 4 Mic Array]] is a circular USB mic array with 4 directional microphones. Combined with speaker diarization (determining who said what from spatial audio cues), it produces conversation logs with speaker attribution rather than just a flat transcript.

**Pipeline**: `reSpeaker` → raw multi-channel audio → `claude-parakeet-speaker-diarization` → transcribed, diarized JSON/SQLite with `spoken-by` annotations per segment.

**Diarization approach**: direction-of-arrival from the mic array separates speaker channels before transcription, which is more robust than post-hoc diarization on a mono recording. Lecture rooms, conversations, thinking aloud — all get attributed. The SQLite output schema maps directly to [[Isomorph]]'s event symbol format: a timestamped segment with speaker identity, transcript text, and relations.

**Why it matters here**: the parakeet engine captures monologue (your own internal narration). The spatial setup captures dialogue and environmental speech. Together they cover the full acoustic record of a day. For [[Isomorph]], this is the audio input stream that generates event symbols with `spoken-by` connections — who said what, when, in what context.

### EEG

I use the [[BrainAccess HALO]], a dry-electrode EEG headband with 4 channels — forehead (Fp1, Fp2) and occipital (O1, O2). 250Hz sampling, Bluetooth, ~$400. No gel, wearable enough for extended sessions.

**SDK**: `brainaccess-python` gives you a simple streaming interface. Data comes out as a numpy array at 250Hz; from there it's standard MNE or scipy signal processing.

**ZUNA**: [[Zuna|Zyphra's ZUNA]] is a diffusion VAE foundation model trained on EEG data. Run raw BrainAccess output through it to get denoised, enhanced signals with better spatial resolution than the raw 4-channel recording justifies. Weights on HuggingFace, Python inference. Think of it as the EEG equivalent of a super-resolution model — it uses population-level priors to fill in what 4 electrodes can't directly capture.

**Meaningful markers from 4 channels**:

- Alpha (8-12 Hz, occipital): attention and visual processing suppression
- Theta (4-8 Hz, frontal): working memory load, encoding
- Gamma (30+ Hz): active processing, feature binding
- Frontal asymmetry (Fp1-Fp2 alpha difference): approach/withdrawal motivation

**Limitations**: 4 channels can't localize sources or do serious connectivity analysis. Good for session-level markers (cognitive load, arousal, attentional mode) but not for resolving individual brain regions. ZUNA improves this somewhat but the hardware ceiling is real. Treat it as a high-frequency cognitive mode monitor, not a neural imaging tool.

### Eye Tracking

**The Tobii ET5 problem on MacBook**: the ET5 is a bar-mounted device designed to clip below a gaming monitor (24-30 inch, landscape). It physically attaches under the display. On a MacBook Pro, the built-in screen geometry makes this awkward to impossible — the device sits below the keyboard, not below the screen. It works well if you use an external monitor regularly; for laptop-native use it's the wrong form factor.

**Practical options for MacBook Pro**:

**Eyeware Beam** — the most pragmatic current solution. Uses your iPhone's TrueDepth camera (the same Face ID sensor) as a research-grade eye tracker. Install the iOS app, the Mac client, and it exposes a gaze stream at 60Hz with ~1-2 degree accuracy. Works with any screen including the built-in display. ~$50/year subscription. Python SDK available. For the Obsidian + computer use pipeline, this is the right choice: always available, no external hardware required, accurate enough for content-level attention tracking.

**Webcam-based gaze estimation** — zero hardware cost, lower accuracy (~3-5 degrees). Useful for coarse attention zones (which part of the screen, which app) rather than precise fixation. Options: `OpenGaze` (GazeML-based, Python), `GazeRecorder` (browser-based). Good for prototyping the analysis pipeline before committing to hardware.

**Tobii ET5 + external monitor** — if you run an external display as primary, the ET5 works fine on macOS. The gaming SDK has limited data access on macOS (primarily Windows-focused), but the Tobii Research SDK provides proper gaze stream access at 60Hz with full Python integration. Worth noting: the ET5 is a consumer/gaming device; the Pro lineup is the research hardware, but at 10x the cost. The ET5 Research SDK bridges the gap acceptably for this use case.

**Data format**: regardless of source, gaze data is (timestamp, x, y, confidence) at N Hz. The key integration is syncing gaze timestamps with ActivityWatch window data — which app + which URL + where on screen + how long. That triple gives you content-level attention with spatial resolution inside the content.

---

## Integration — Putting It Together

Each layer runs as an independent daemon; integration happens at analysis time via timestamp alignment.

| Layer | Tool | Frequency | What it captures |
|---|---|---|---|
| Behavior | ActivityWatch | continuous | app/URL/window dwell |
| Semantics | Obsidian git | per commit | knowledge graph state |
| Audio | parakeet + reSpeaker | on-demand / always-on | speech, thoughts, dialogue |
| Physiology | BrainAccess + ZUNA | 250Hz (sessions) | cognitive mode, load, arousal |
| Attention | Eyeware Beam / ET5 | 60Hz (sessions) | gaze, fixation, saccade |
| Content | TRIBE v2 | offline batch | predicted neural fingerprints per stimulus |

The join key across all of them is UTC timestamp. ActivityWatch, EEG, and eye tracking are all timestamped streams. Vault commits give you a lower-frequency but content-rich anchor. The analysis pipeline is just: align on time, build the multi-modal observation vector, feed into whatever latent state model you're running.

This is what [[Mapping The Mind]] describes at the philosophical level and [[Isomorph]] describes at the engineering level.
%%
