import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"

let blockCounter = 0
const generateBlockId = () => `py-block-${blockCounter++}`

export const RunPythonPlugin: QuartzTransformerPlugin = () => ({
  name: "RunPythonPlugin",

  externalResources() {
    return {
      js: [
        {
          src: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js",
          loadTime: "afterDOMReady",
          contentType: "external",
          async: true,
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js",
          loadTime: "beforeDOMReady",
          contentType: "external",
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js",
          loadTime: "beforeDOMReady",
          contentType: "external",
        },
        {
          contentType: "inline",
          loadTime: "afterDOMReady",
          script: `
            console.log('Global Pyodide script initializing...');
            let pyodideInstance = null;
            let isPyodideLoading = false;
            let pyodideLoadPromise = null;
            let capturedOutput = { stdout: '', stderr: '' };

            const pythonStdoutRedirect = \`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
            \`;

            async function loadPyodideGlobal() {
              if (pyodideInstance) {
                console.log('Pyodide already loaded.');
                return pyodideInstance;
              }
              if (isPyodideLoading) {
                console.log('Pyodide load already in progress, waiting...');
                return pyodideLoadPromise; // Wait for the existing promise
              }

              console.log('Starting Pyodide load...');
              isPyodideLoading = true;
              document.querySelectorAll('.python-run-button').forEach(btn => btn.disabled = true);

              pyodideLoadPromise = new Promise(async (resolve, reject) => {
                try {
                  if (typeof loadPyodide === 'undefined') {
                    console.error('loadPyodide function not found. Ensure pyodide.js is loaded.');
                    reject(new Error('loadPyodide not available'));
                    return;
                  }

                  pyodideInstance = await loadPyodide({
                  });
                  console.log('Pyodide core loaded successfully.');

                  // common packages
                  console.log('Loading common Python packages...');
                  await pyodideInstance.loadPackage(['matplotlib', 'numpy', 'pandas', 'scipy', 'sympy', 'scikit-learn','pyodide','seaborn', 'torch']);
                  console.log('Common packages loaded.');

                  console.log('Setting up global stdout/stderr redirection...');
                  pyodideInstance.runPython(pythonStdoutRedirect);
                  console.log('Global redirection setup complete.');


                  console.log('Pyodide fully initialized.');
                  isPyodideLoading = false;

                  document.querySelectorAll('.python-run-button').forEach(btn => btn.disabled = false);
                  console.log('Python run buttons enabled.');

                  resolve(pyodideInstance);
                } catch (error) {
                  console.error('Error loading Pyodide or packages:', error);
                  isPyodideLoading = false;
                  reject(error);
                }
              });
              return pyodideLoadPromise;
            }

            async function executePythonBlock(blockId) {
              const button = document.getElementById(blockId + '-button');
              const playIcon = button.querySelector('.play-icon');
              const spinner = button.querySelector('.spinner');
              const plotElement = document.getElementById(blockId + '-plot');
              const textElement = document.getElementById(blockId + '-text');
              const outputWrapper = document.getElementById(blockId + '-outputWrapper');
              const editorInstance = window.codeMirrorInstances[blockId]; 

              if (!editorInstance) {
                  console.error('CodeMirror instance not found for block:', blockId);
                  textElement.textContent = 'Error: Editor instance not found.';
                  outputWrapper.classList.add('expanded');
                  return;
              }

              const code = editorInstance.getValue();

              if (!pyodideInstance && !isPyodideLoading) {
                  console.log('Pyodide not loaded, initiating load...');
                  try {
                    await loadPyodideGlobal(); 
                  } catch (error) {
                    console.error('Failed to load Pyodide for execution:', error);
                    textElement.textContent = 'Error: Pyodide failed to load. ' + error.message;
                    outputWrapper.classList.add('expanded');
                    return; 
                  }
              } else if (isPyodideLoading) {
                 console.log('Pyodide is loading, waiting to execute...');
                 try {
                    await pyodideLoadPromise; 
                 } catch (error) {
                    console.error('Pyodide loading failed while waiting:', error);
                    textElement.textContent = 'Error: Pyodide failed to load. ' + error.message;
                    outputWrapper.classList.add('expanded');
                    return; 
                 }
              }


              textElement.innerHTML = ''; 
              plotElement.innerHTML = ''; 
              plotElement.style.display = 'none'; 

              playIcon.style.display = 'none';
              spinner.style.display = 'inline-block';
              button.disabled = true;

              try {
                console.log('Executing Python code for block:', blockId);

                pyodideInstance.runPython('sys.stdout.seek(0); sys.stdout.truncate(0); sys.stderr.seek(0); sys.stderr.truncate(0)');

                await pyodideInstance.loadPackagesFromImports(code);

                let result = await pyodideInstance.runPythonAsync(code);

                let stdout = pyodideInstance.runPython('sys.stdout.getvalue()');
                let stderr = pyodideInstance.runPython('sys.stderr.getvalue()');

                let outputContent = '';
                if (stdout) {
                    outputContent += stdout;
                }
                if (stderr) {
                    outputContent += '\\n--- STDERR ---\\n' + stderr;
                }

                 if (result !== undefined && result !== null) {
                    outputContent += '\\nResult: ' + result.toString();
                }
                textElement.textContent = outputContent; // Use textContent for safety

                let figureExists = pyodideInstance.runPython(\`
import matplotlib.pyplot as plt
len(plt.get_fignums()) > 0
                \`);

                if (figureExists) {
                  console.log('Matplotlib figure detected, generating plot image...');
                  let plotData = pyodideInstance.runPython(\`
import io
import base64
import matplotlib.pyplot as plt

buf = io.BytesIO()
plt.savefig(buf, format='png', bbox_inches='tight') # Use tight bbox
buf.seek(0)
img_str = base64.b64encode(buf.read()).decode('UTF-8')
plt.close() 
img_str
                  \`);

                  if (plotData) {
                    const imgElement = document.createElement('img');
                    imgElement.src = 'data:image/png;base64,' + plotData;
                    plotElement.appendChild(imgElement);
                    plotElement.style.display = 'block'; 
                    console.log('Plot image displayed.');
                  } else {
                      console.log('Plot generation returned no data.');
                  }
                } else {
                     console.log('No active Matplotlib figures detected.');
                }


              } catch (error) {
                console.error('Error running Python code in block ' + blockId + ':', error);
                textElement.textContent = '--- PYTHON ERROR --- \\n' + error.message;
              } finally {
                console.log('Finished execution for block:', blockId);
                playIcon.style.display = 'inline'; // Use 'inline' consistently
                spinner.style.display = 'none';
                button.disabled = false; // Re-enable button
                outputWrapper.classList.add('expanded');
              }
            }

             document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM Content Loaded, initiating Pyodide load...');
                 loadPyodideGlobal().catch(err => {
                    console.error("Initial Pyodide load failed:", err);
                 });

                 window.codeMirrorInstances = window.codeMirrorInstances || {};
             });

          `,
        },
      ],
      css: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css",
          loadTime: "beforeDOMReady",
          contentType: "external",
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/material-palenight.min.css",
          loadTime: "beforeDOMReady",
          contentType: "external",
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/base16-light.min.css",
          loadTime: "beforeDOMReady",
          contentType: "external",
        },
        {
          contentType: "inline",
          loadTime: "beforeDOMReady",
          style: `
              /* Styles from your original block, potentially move to global CSS */
               .spinner {
                 display: none; /* Hide by default */
                 width: 16px; /* Match icon size */
                 height: 16px; /* Match icon size */
                 border: 2px solid #f3f3f3; /* Light grey circle */
                 border-top: 2px solid #bd93f9; /* Theme color spinner */
                 border-radius: 50%;
                 animation: spin 1s linear infinite;
                 vertical-align: middle; /* Align with icon */
               }
               @keyframes spin {
                 0% { transform: rotate(0deg); }
                 100% { transform: rotate(360deg); }
               }
               .play-icon {
                 width: 16px; /* Consistent size */
                 height: 16px;
                 vertical-align: middle;
                 display: inline; /* Default state */
               }
               .python-run-button:disabled .play-icon {
                 /* Optional: slightly grey out icon when disabled */
                 /* filter: grayscale(50%); */
               }
               .python-run-button:disabled {
                  cursor: not-allowed; /* Indicate disabled state */
               }

               .python-output {
                 display: none; /* Managed by expanded class */
                 margin-top: 10px;
                 padding: 10px;
                 background-color: rgba(128, 128, 128, 0.5); /* grey and mostly transparent */
                 border: 2px solid rgba(64, 64, 64, 0.8); /* darker gray and less transparent border */
                 border-radiums: 10px; /* rounded corners */
               }
               .python-output.visible {
                 display: block; /* make visible after running */
               }


                 .code-wrapper { /* Added wrapper div */
                    margin-bottom: 1rem; /* Space between blocks */
                 }
                 .code-block {
                   max-width: 800px;
                   width: 100%;
                   background-color: #282a36;
                   border-radius: 0.5rem;
                   overflow: hidden; /* Important for rounded corners with CodeMirror */
                   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                   position: relative; /* Needed for gradient */
                 }
                 .code-header {
                   display: flex;
                   justify-content: space-between;
                   align-items: center;
                   padding: 0.5rem 1rem;
                   background-color: #44475a;
                   border-bottom: 1px solid #6272a4;
                 }
                 .code-language {
                   color: #f8f8f2;
                   font-family: monospace;
                   font-size: 0.875rem;
                 }
                 .code-actions {
                   display: flex;
                   gap: 0.5rem;
                 }
                 .code-actions button {
                   background: none;
                   border: none;
                   color: #bd93f9;
                   cursor: pointer;
                   padding: 0.25rem;
                   transition: color 0.2s;
                   display: flex; /* Align icon/spinner */
                   align-items: center;
                 }
                 .code-actions button:hover:not(:disabled) {
                   color: #ff79c6;
                 }
                 .code-content {
                   position: relative; /* For gradient */
                   height: 150px; /* Initial collapsed height */
                   transition: height 0.3s ease-in-out;
                   overflow: hidden;
                   /* CodeMirror will handle background */
                 }
                 .code-content.expanded {
                   height: auto; 
                   max-height: 600px;
                   overflow-y: auto;
                 }
                 .CodeMirror {
                   height: 100%; 
                   /* background: #282a36 !important; 
                 }
                 .code-gradient {
                   position: absolute;
                   bottom: 0;
                   left: 0;
                   right: 0;
                   height: 2rem;
                   background: linear-gradient( to top, rgba(40, 42, 54, 1), rgba(40, 42, 54, 0) );
                   pointer-events: none;
                   z-index: 1; 
                   transition: opacity 0.3s ease-in-out;
                 }
                 .code-content.expanded .code-gradient {
                    opacity: 0; 
                 }

                 .output-wrapper {
                   max-height: 0;
                   overflow: hidden;
                   transition: max-height 0.4s ease-in-out;
                   background-color: #282a36; 
                   border-radius: 0 0 0.5rem 0.5rem; 
                   margin-top: -1px; 
                   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                 }
                 .output-wrapper.expanded {
                   max-height: 500px; 
                   overflow-y: auto; 
                 }
                 .output-header {
                   display: flex;
                   justify-content: space-between;
                   align-items: center;
                   padding: 0.5rem 1rem;
                   background-color: #44475a; 
                   border-bottom: 1px solid #6272a4; 
                 }
                 .output-title {
                   color: #f8f8f2;
                   font-family: monospace;
                   font-size: 0.875rem;
                 }
                 .close-output-btn {
                   background: none;
                   border: none;
                   color: #bd93f9;
                   cursor: pointer;
                   padding: 0.25rem;
                   transition: color 0.2s;
                   display: flex;
                   align-items: center;
                 }
                 .close-output-btn:hover {
                   color: #ff79c6;
                 }
                 .output-content {
                    color: #f8f8f2;
                    font-family: monospace;
                    font-size: 0.875rem;
                    padding: 0.5rem 1rem; /* Padding for text/plots */
                    white-space: pre-wrap; /* Wrap text output */
                    word-break: break-all; /* Break long words */
                 }
                 .python-plot img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin-top: 0.5rem; 
                    background: white; 
                    padding: 5px;
                    border-radius: 3px;
                 }

            `,
        },
      ],
    }
  },

  markdownPlugins() {
    return [
      () => (tree: Root, _file) => {
        blockCounter = 0
        visit(tree, "code", (node, index, parent) => {
          if (node.lang === "python-r" && parent?.children && index !== undefined) {
            const id = generateBlockId()

            const htmlContent = `
<div class='code-wrapper' id='wrapper-${id}'>
  <div class='code-block'>
    <div class='code-header'>
      <div class='code-language'>Python</div>
      <div class='code-actions'>
        <button id='${id}-copy' aria-label='Copy code'>
          </button>
        <button id='${id}-button' class='python-run-button' aria-label='Run code' disabled> <span class='play-icon'>
             </span>
          <span class='spinner'></span> </button>
        <button id='${id}-expand' aria-label='Expand code'>
          </button>
      </div>
    </div>
    <div id='codeContent-${id}' class='code-content'>
      <textarea id='codeTextarea-${id}' style='display: none;'>${node.value}</textarea> <div id='codeGradient-${id}' class='code-gradient'></div>
    </div>
  </div>
  <div id='${id}-outputWrapper' class='output-wrapper'> <div class='output-header'>
        <div class='output-title'>Output</div>
        <button id='${id}-closeOutputBtn' class='close-output-btn' aria-label='Close output'>
          </button>
      </div>
      <div class='output-content'>
        <div class='python-text' id='${id}-text' style='white-space: pre-wrap;'></div>
        <div class='python-plot' id='${id}-plot'></div>
      </div>
    </div>
</div>

<script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js'></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/material-palenight.min.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/base16-light.min.css" />

<script>
(function() {
  // --- Script specific to block ${id} ---

  const blockId = '${id}'; // Store ID for easy reference
  const codeContent = document.getElementById('codeContent-' + blockId);
  const codeTextarea = document.getElementById('codeTextarea-' + blockId);
  const codeGradient = document.getElementById('codeGradient-' + blockId);
  const copyBtn = document.getElementById(blockId + '-copy');
  const runBtn = document.getElementById(blockId + '-button');
  const expandBtn = document.getElementById(blockId + '-expand');
  const closeOutputBtn = document.getElementById(blockId + '-closeOutputBtn');
  const outputWrapper = document.getElementById(blockId + '-outputWrapper');
  const textOutput = document.getElementById(blockId + '-text');
  const plotOutput = document.getElementById(blockId + '-plot');

  let isExpanded = false;
  let editorInstance = null; 

  // wierd way of doing svg, but it is necessary for compilation bugs
  function createSvgElement(svgData) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      for (const attr in svgData.attrs) {
          svg.setAttribute(attr, svgData.attrs[attr]);
      }
      svgData.children.forEach(childData => {
          const child = document.createElementNS('http://www.w3.org/2000/svg', childData.tag);
          for (const attr in childData.attrs) {
              child.setAttribute(attr, childData.attrs[attr]);
          }
          svg.appendChild(child);
      });
      return svg;
  }

  const svgCopy = {
      attrs: { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      children: [
          { tag: 'rect', attrs: { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' } },
          { tag: 'path', attrs: { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' } }
      ]
  };
  const svgPlay = {
      attrs: { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'currentColor', stroke: 'currentColor', 'stroke-width': '1', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, // Changed fill/stroke
      children: [ { tag: 'polygon', attrs: { points: '5 3 19 12 5 21 5 3' } } ]
  };
  const svgExpand = {
      attrs: { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      children: [ { tag: 'polyline', attrs: { points: '6 9 12 15 18 9' } } ] 
  };
   const svgCollapse = { // New: Up arrow
      attrs: { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      children: [ { tag: 'polyline', attrs: { points: '18 15 12 9 6 15' } } ]
  };
  const svgCheck = { 
      attrs: { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      children: [ { tag: 'polyline', attrs: { points: '20 6 9 17 4 12' } } ]
  };
   const svgClose = {
        attrs: { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
        children: [
            { tag: 'line', attrs: { x1: '18', y1: '6', x2: '6', y2: '18' } },
            { tag: 'line', attrs: { x1: '6', y1: '6', x2: '18', y2: '18' } }
        ]
    };


  function initializeEditorWhenReady() {
      if (typeof CodeMirror !== 'undefined') {
          console.log('CodeMirror ready for block:', blockId);
          editorInstance = CodeMirror.fromTextArea(codeTextarea, {
            mode: 'python',
            theme: 'material-palenight',
            lineNumbers: true,
            lineWrapping: true,
            readOnly: false,
            style: 'background-color: auto',
          });

           window.codeMirrorInstances = window.codeMirrorInstances || {};
           window.codeMirrorInstances[blockId] = editorInstance;

           editorInstance.setSize(null, '150px');

          const codeBlock = editorInstance.getWrapperElement();

          // Refresh editor after slight delay to ensure layout calculation
          // setTimeout(() => editorInstance.refresh(), 50);

           editorInstance.on('focus', () => codeBlock.classList.add('cm-focused'));
           editorInstance.on('blur', () => codeBlock.classList.remove('cm-focused'));

      } else {
          console.log('CodeMirror not ready yet for block ' + blockId + ', retrying...');
          setTimeout(initializeEditorWhenReady, 100);
      }
  }


  function setupButtons() {
      copyBtn.appendChild(createSvgElement(svgCopy));
      runBtn.querySelector('.play-icon').appendChild(createSvgElement(svgPlay));
      expandBtn.appendChild(createSvgElement(svgExpand)); 
      closeOutputBtn.appendChild(createSvgElement(svgClose));

      expandBtn.addEventListener('click', () => {
          isExpanded = !isExpanded;
          codeContent.classList.toggle('expanded', isExpanded);
          codeGradient.style.opacity = isExpanded ? '0' : '1'; 

          expandBtn.innerHTML = ''; 
          expandBtn.appendChild(createSvgElement(isExpanded ? svgCollapse : svgExpand));

          if (editorInstance) {
              editorInstance.setSize(null, isExpanded ? 'auto' : '150px');
               if (isExpanded) {
                   setTimeout(() => editorInstance.refresh(), 10); 
               } else {
                    editorInstance.refresh();
               }
          }
      });

      copyBtn.addEventListener('click', () => {
          if (!editorInstance) return;
          navigator.clipboard.writeText(editorInstance.getValue()).then(() => {
              copyBtn.innerHTML = ''; 
              copyBtn.appendChild(createSvgElement(svgCheck)); 
              setTimeout(() => {
                  copyBtn.innerHTML = ''; 
                  copyBtn.appendChild(createSvgElement(svgCopy)); 
              }, 1500); 
          }).catch(err => {
              console.error('Failed to copy code:', err);
          });
      });

      runBtn.addEventListener('click', () => {
         console.log('Run button clicked for block:', blockId);
         if (typeof executePythonBlock === 'function') {
             executePythonBlock(blockId); 
         } else {
             console.error('Global executePythonBlock function not found!');
             textOutput.textContent = 'Error: Execution environment not ready.';
             outputWrapper.classList.add('expanded');
         }
      });

      closeOutputBtn.addEventListener('click', () => {
          textOutput.innerHTML = ''; // Clear text
          plotOutput.innerHTML = ''; // Clear plot
          outputWrapper.classList.remove('expanded'); // Collapse the output area
      });
  }

  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
         initializeEditorWhenReady();
         setupButtons();
      });
  } else {
      initializeEditorWhenReady();
      setupButtons();
  }

})(); 
</script>
`

            const newNode = {
              type: "html",
              value: htmlContent,
            } as any

            parent.children.splice(index, 1, newNode)
            return index + 1
          }
        })
      },
    ]
  },
})
