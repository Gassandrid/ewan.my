import asyncio
import json
import sys
from pathlib import Path
sys.dont_write_bytecode = True

from dependencies import browser_dependencies, bootstrap_code, warm_plan

try:
    import marimo
    from marimo import MarimoIslandGenerator
except ImportError as error:
    print(json.dumps({"error": f"marimo not installed: {error}"}))
    raise SystemExit(0)


def main() -> None:
    payload = json.load(sys.stdin)
    requirements = browser_dependencies(Path(sys.argv[1]).read_text())
    source = MarimoIslandGenerator.from_file(sys.argv[1], display_code=False)
    generator = MarimoIslandGenerator()
    generator._config = source._config
    generator._source_filename = source._source_filename
    # Install once, then express an explicit graph dependency from every cell.
    # Original Python strings/f-strings stay untouched. Pyodide runs the
    # compiled cells through the native mo.md/Html API.
    extension = Path(__file__).with_name("obsidian.py").read_text()
    context = json.dumps(payload.get("markdownContext", {}))
    generator.add_code(
        bootstrap_code(requirements)
        + f"import json as _obsidian_json\n"
        f"_obsidian_namespace = {{}}\n"
        f"exec({extension!r}, _obsidian_namespace)\n"
        f"_obsidian_namespace['install'](_obsidian_json.loads({context!r}))\n"
        "ewan_obsidian_ready = True",
        display_code=False, display_output=False,
    )
    for stub in source._stubs:
        generator.add_code("ewan_obsidian_ready\n" + stub.code, display_code=False)

    # Executing here only fills <marimo-cell-output> with a first paint; the
    # browser still runs every cell and replaces each output in place.
    # None: not executed; int: executed, with that many cells left empty;
    # str: execution failed, so the body is the unexecuted export.
    executed = None
    if payload.get("execute"):
        try:
            asyncio.run(generator.build())
            executed = 0
            # A cell that cannot run here (browser-only APIs, missing build
            # packages) starts empty instead of painting an error.
            for stub in generator._stubs:
                if stub.output is not None and stub.output.mimetype == "application/vnd.marimo+error":
                    stub._display_output = False
                    # Cells behind mo.stop (e.g. a run button) are meant to wait.
                    if not all("Stopped" in type(e).__name__ for e in stub.output.data):
                        executed += 1
        except Exception as error:
            executed = f"{type(error).__name__}: {error}"
    body = generator.render_body(max_width="none", margin="0")
    print(
        json.dumps(
            {
                "body": body,
                "executed": executed,
                "marimoVersion": marimo.__version__,
                "browserDependencies": requirements,
                "islandCount": body.count("<marimo-island"),
                "reactiveIslandCount": body.count('data-reactive="true"'),
            }
        )
    )


def warm() -> None:
    # A page with no output whose one cell makes the browser download what all
    # notebooks need: Pyodide, marimo, micropip UI pins and lockfile packages
    # (imports inside `if False` are found by loadPackagesFromImports, not run).
    plan = warm_plan([Path(p).read_text() for p in sys.argv[2:]])
    imports = "".join(f"    import {m}\n" for m in plan["modules"])
    generator = MarimoIslandGenerator()
    generator.add_code(bootstrap_code(plan["requirements"]) + "if False:\n" + (imports or "    pass\n"),
                       display_code=False)
    print(json.dumps({"body": generator.render_body(max_width="none", margin="0"), **plan}))


try:
    warm() if sys.argv[1] == "--warm" else main()
except Exception as error:
    print(json.dumps({"error": f"render failed: {error}"}))
