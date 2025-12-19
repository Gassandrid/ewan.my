import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { Staticrypt } from "./quartz/password"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Ewan.my",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },

    locale: "en-US",
    baseUrl: "ewan.my",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    generateSocialImages: true,
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Fraunces",
        body: "PP Neue Montreal",
        code: "IBM Plex Mono",
      },

      colors: {
        lightMode: {
          light: "#f5f1eb",
          lightgray: "#e6dfd6",
          gray: "#9a8f82",
          darkgray: "#4a4238",
          dark: "#2d2520",
          secondary: "#a67c6d",
          tertiary: "#8b7f73",
          highlight: "rgba(166, 124, 109, 0.1)",
          textHighlight: "#f4d9c688",
          rust: "#bf6159",
          clay: "#c78d75",
          ochre: "#cc9e54",
          sage: "#869c7a",
          pine: "#56706b",
          slate: "#728c99",
          mauve: "#9d868e",
        },

        darkMode: {
          light: "#1a1714",
          lightgray: "#2a2520",
          gray: "#6b6158",
          darkgray: "#d4cec7",
          dark: "#ebe7e1",
          secondary: "#c59b8d",
          tertiary: "#a89a8d",
          highlight: "rgba(197, 155, 141, 0.12)",
          textHighlight: "#d4a58888",
          rust: "#db8e88",
          clay: "#deaea0",
          ochre: "#e0bc7e",
          sage: "#aebd9f",
          pine: "#8daeb3",
          slate: "#9bb0bd",
          mauve: "#c9b1b9",
        },
      },
    },
  },

  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.SyntaxHighlighting(),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: true, parseTags: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest", lazyLoad: true }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.Citations({ bibliography: "./content/References.bib" }),
      Plugin.Sidenotes(),
      Plugin.RunPythonPlugin(),
      Plugin.NotebookEmbedding(),
      // Staticrypt(),
      // Plugin.RunRPlugin(),

      // Plugin.Tabs(),
      // Plugin.FancyText(),
    ],

    filters: [Plugin.RemoveDrafts()],

    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
