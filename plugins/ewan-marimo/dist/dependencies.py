"""Dependency bootstrap for the pinned islands runtime, which ignores PEP 723."""
import ast
import json
import re
import sys
import tomllib
from collections import Counter

# Pure-Python UI packages absent from Pyodide's bundled package index. Keep this
# narrow: scientific packages already handled by loadPackagesFromImports stay
# under Pyodide's version constraints. A notebook can override this fallback.
BROWSER_PACKAGE_DEFAULTS = {"wigglystuff": "wigglystuff==0.5.21", "plotly": "plotly==5.24.1"}


# Import names whose PyPI distribution differs, for build-time execution.
DISTRIBUTIONS = {"sklearn": "scikit-learn", "skimage": "scikit-image", "PIL": "pillow",
                 "yaml": "pyyaml", "cv2": "opencv-python", "bs4": "beautifulsoup4"}
BROWSER_MODULES = {"js", "pyodide", "micropip", "marimo"}


def imported_modules(source):
    imports = set()
    for node in ast.walk(ast.parse(source)):
        if isinstance(node, ast.Import):
            imports.update(alias.name.split(".")[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module and not node.level:
            imports.add(node.module.split(".")[0])
    return imports


def declared_dependencies(source):
    metadata = re.search(r"(?m)^# /// script\s*\n((?:#(?:[^\n]*)\n)*)# ///\s*$", source)
    if not metadata:
        return []
    text = "\n".join(line[2:] if line.startswith("# ") else line[1:] for line in metadata[1].splitlines())
    declared = tomllib.loads(text).get("dependencies", [])
    if not isinstance(declared, list) or not all(isinstance(item, str) for item in declared):
        raise ValueError("PEP 723 dependencies must be a list of requirement strings")
    return declared


def third_party_modules(source):
    return sorted(m for m in imported_modules(source)
                  if m not in sys.stdlib_module_names and m not in BROWSER_MODULES)


def browser_dependencies(source):
    imports = imported_modules(source)
    declared_by_name = {requirement_name(item): item for item in declared_dependencies(source)}
    # Only bootstrap supported UI libraries. Existing notebook pins for
    # native/scientific packages cannot replace Pyodide's compiled packages.
    return [declared_by_name.get(module, requirement)
            for module, requirement in BROWSER_PACKAGE_DEFAULTS.items() if module in imports]


def build_requirements(source, marimo_version):
    """Packages that execute a notebook at build time the way the browser will:
    the runtime's marimo, the exact UI pins micropip installs, and every other
    import unpinned (Pyodide supplies its own builds, not the author's pins)."""
    requirements = [f"marimo=={marimo_version}", *browser_dependencies(source)]
    names = {requirement_name(r) for r in requirements}
    extras = [DISTRIBUTIONS.get(m, m) for m in third_party_modules(source)]
    extras += [requirement_name(r) for r in declared_dependencies(source)]
    for name in extras:
        if requirement_name(name) not in names:
            names.add(requirement_name(name))
            requirements.append(name)
    return requirements


def warm_plan(sources):
    """One browser session that downloads what every notebook will need."""
    pins = Counter(r for source in sources for r in browser_dependencies(source))
    chosen = {}
    for requirement, _ in pins.most_common():
        chosen.setdefault(requirement_name(requirement), requirement)
    modules = sorted({m for source in sources for m in third_party_modules(source)})
    return {"requirements": list(chosen.values()), "modules": modules}


def requirement_name(requirement):
    match = re.match(r"[A-Za-z0-9][A-Za-z0-9._-]*", requirement)
    if match is None:
        raise ValueError(f"Expected a named PEP 508 requirement: {requirement!r}")
    return re.sub(r"[-_.]+", "-", match[0]).lower()


def bootstrap_code(requirements):
    if not requirements:
        return ""
    # Pyodide preloads lockfile versions of imported packages (e.g. anywidget
    # 0.10) before any cell runs; a newer pinned widget may require more.
    # micropip 0.9 cannot upgrade in place, so drop the preloaded one and retry.
    return (
        "import sys as _browser_sys\n"
        "if _browser_sys.platform == 'emscripten':\n"
        "    import re as _browser_re\n"
        "    import micropip as _browser_pip\n"
        "    for _browser_attempt in range(4):\n"
        "        try:\n"
        f"            await _browser_pip.install({requirements!r})\n"
        "            break\n"
        "        except ValueError as _browser_error:\n"
        "            _browser_conflict = _browser_re.search(r'but (\\S+)==\\S+ is already installed', str(_browser_error))\n"
        "            if _browser_conflict is None or _browser_attempt == 3:\n"
        "                raise\n"
        "            _browser_pip.uninstall(_browser_conflict[1])\n"
    )


if __name__ == "__main__":
    # python dependencies.py build NOTEBOOK MARIMO_VERSION
    command, *args = sys.argv[1:]
    if command == "build":
        with open(args[0]) as file:
            print(json.dumps(build_requirements(file.read(), args[1])))
