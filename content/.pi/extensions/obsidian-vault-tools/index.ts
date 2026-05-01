import { join } from "node:path";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "typebox";

const commandParams = Type.Object({
  command: Type.String({
    description:
      "Command tail to execute. For obsidian_cli, omit the leading 'obsidian'. For vault_cli, omit the leading 'python3 .claude/vault_cli.py'.",
  }),
  timeoutSec: Type.Optional(
    Type.Number({
      description: "Optional timeout in seconds",
      minimum: 1,
      maximum: 600,
    }),
  ),
});

function formatResult(stdout: string, stderr: string, exitCode: number | null) {
  const chunks: string[] = [];
  if (stdout.trim()) chunks.push(stdout.trim());
  if (stderr.trim()) chunks.push(`[stderr]\n${stderr.trim()}`);
  if (!chunks.length) chunks.push("(no output)");
  chunks.push(`\n[exit code: ${exitCode ?? "unknown"}]`);
  return chunks.join("\n\n");
}

async function runShell(
  pi: ExtensionAPI,
  shellCommand: string,
  timeoutSec?: number,
  signal?: AbortSignal,
) {
  const result = await pi.exec("bash", ["-lc", shellCommand], {
    signal,
    timeout: (timeoutSec ?? 60) * 1000,
  });

  const text = formatResult(result.stdout ?? "", result.stderr ?? "", result.code ?? null);
  return {
    content: [{ type: "text" as const, text }],
    details: {
      command: shellCommand,
      exitCode: result.code ?? null,
      stdout: result.stdout ?? "",
      stderr: result.stderr ?? "",
      killed: result.killed ?? false,
    },
    isError: (result.code ?? 0) !== 0,
  };
}

export default function obsidianVaultTools(pi: ExtensionAPI) {
  pi.on("resources_discover", (event) => {
    return {
      skillPaths: [join(event.cwd, ".claude", "skills")],
    };
  });

  pi.registerCommand("reload-runtime", {
    description: "Reload project-local Pi extensions, skills, prompts, and themes",
    handler: async (_args, ctx) => {
      await ctx.reload();
      return;
    },
  });

  pi.registerTool({
    name: "obsidian_cli",
    label: "Obsidian CLI",
    description:
      "Run the Obsidian CLI against the currently running vault for exact note operations such as read, search, backlinks, links, tags, tasks, create, append, and property edits.",
    promptSnippet:
      "Use the native Obsidian CLI for exact vault operations when Obsidian is running.",
    promptGuidelines: [
      "Use obsidian_cli for exact vault reads, searches, backlinks, links, tags, tasks, note creation, and property edits.",
      "Prefer obsidian_cli over bash for native Obsidian note operations when the Obsidian app is running.",
      "Pass only the command tail to obsidian_cli, for example: read file=\"My Note\" or search query=\"active inference\" limit=5.",
    ],
    parameters: commandParams,
    async execute(_toolCallId, params, signal) {
      return runShell(pi, `obsidian ${params.command}`, params.timeoutSec, signal);
    },
  });

  pi.registerTool({
    name: "vault_cli",
    label: "Vault CLI",
    description:
      "Run the local vault analysis wrapper for semantic search, graph analysis, tag and topic analysis, git history, and attention flow.",
    promptSnippet:
      "Use the local vault_cli.py wrapper for semantic retrieval, graph analysis, and git-history questions about the Obsidian vault.",
    promptGuidelines: [
      "Use vault_cli for semantic search, context expansion, graph metrics, topic timelines, attention flow, note history, and other higher-level vault analysis.",
      "Prefer vault_cli over obsidian_cli when the user asks what they know about a topic, what is related to something, what changed over time, or what topics are getting attention.",
      "Pass only the command tail to vault_cli, for example: vault_rag \"active inference\" --limit 5 or vault_topic_timeline --tag comp-neuro --days 90.",
    ],
    parameters: commandParams,
    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      const scriptPath = join(ctx.cwd, ".claude", "vault_cli.py");
      return runShell(pi, `python3 ${JSON.stringify(scriptPath)} ${params.command}`, params.timeoutSec, signal);
    },
  });

  pi.registerTool({
    name: "reload_runtime",
    label: "Reload Runtime",
    description: "Reload project-local Pi extensions, skills, prompts, and themes after editing them.",
    promptSnippet:
      "Use reload_runtime after editing Pi extensions, skills, prompts, or themes in this project.",
    promptGuidelines: [
      "Use reload_runtime after modifying files under .pi/ or other Pi-loaded resources so the current session picks up the changes.",
    ],
    parameters: Type.Object({}),
    async execute() {
      pi.sendUserMessage("/reload-runtime", { deliverAs: "followUp" });
      return {
        content: [{ type: "text" as const, text: "Queued /reload-runtime as a follow-up command." }],
        details: {},
      };
    },
  });
}
