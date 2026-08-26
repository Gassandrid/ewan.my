import asyncio
import html
import json
import re
import sys

try:
    import marimo
    from marimo import MarimoIslandGenerator
except ImportError as error:
    print(json.dumps({"error": f"marimo not installed: {error}"}))
    raise SystemExit(0)


def main() -> None:
    payload = json.load(sys.stdin)
    generator = MarimoIslandGenerator.from_file(sys.argv[1], display_code=False)
    replacements = payload.get("wikiLinks", {})
    if replacements:
        wikilink = re.compile(r"(?<!!)\[\[([^\[\]\n]+)\]\]")

        def replace_wikilink(match: re.Match[str]) -> str:
            replacement = replacements.get(match.group(1))
            if replacement is None:
                return match.group(0)
            return f"[{replacement['label']}]({replacement['href']})"

        for stub in generator._stubs:
            stub._code = wikilink.sub(replace_wikilink, stub.code)

    if payload.get("staticPreview"):
        asyncio.run(generator.build())

    body = generator.render_body(max_width="none", margin="0")
    # Static previews are computed from the app before the transformed cell stubs
    # are hydrated in the browser. Rewrite their rendered markdown too so a
    # wikilink never flashes as literal Obsidian syntax during the cold start.
    for raw, replacement in replacements.items():
        anchor = (
            f'<a href="{html.escape(replacement["href"], quote=True)}">'
            f'{html.escape(replacement["label"])}</a>'
        )
        body = body.replace(f"[[{raw}]]", anchor)
    print(
        json.dumps(
            {
                "body": body,
                "marimoVersion": marimo.__version__,
                "islandCount": body.count("<marimo-island"),
                "reactiveIslandCount": body.count('data-reactive="true"'),
            }
        )
    )


try:
    main()
except Exception as error:
    print(json.dumps({"error": f"render failed: {error}"}))
