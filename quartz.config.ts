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
    pageTitle: "GΛSSAИDRΙϽ.ΧΨZ",
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
        header: "Bricolage Grotesque",
        body: "Bricolage Grotesque",
        code: "JetBrains Mono",
      },

      colors: {
        lightMode: {
          light: "#fffdfa",
          lightgray: "#e0dcd3",
          gray: "#b8b8b8",
          darkgray: "#2A354B",
          dark: "#08142C",
          secondary: "#274B75",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },

        darkMode: {
          light: "#0c0f14",
          lightgray: "#1D232D",
          gray: "#5A657B",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7188A9",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
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
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false, parseTags: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest", lazyLoad: true }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.RunPythonPlugin(),
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
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
