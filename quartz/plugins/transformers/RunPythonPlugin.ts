import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"

let blockCounter = 0
const generateBlockId = () =>
  `py-block-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 10)}`

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
            
            // Make everything truly global
            window.pyodideInstance = window.pyodideInstance || null;
            window.isPyodideLoading = window.isPyodideLoading || false;
            window.pyodideLoadPromise = window.pyodideLoadPromise || null;
            window.codeMirrorInstances = window.codeMirrorInstances || {};

            const pythonStdoutRedirect = \`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
            \`;

            async function loadPyodideGlobal() {
              if (window.pyodideInstance) {
                console.log('Pyodide already loaded globally.');
                return window.pyodideInstance;
              }
              if (window.isPyodideLoading) {
                console.log('Pyodide load already in progress, waiting...');
                return window.pyodideLoadPromise; 
              }

              console.log('Starting Pyodide global load...');
              window.isPyodideLoading = true;
              
              // Disable all current buttons
              document.querySelectorAll('.python-run-button').forEach(btn => btn.disabled = true);

              window.pyodideLoadPromise = new Promise(async (resolve, reject) => {
                try {
                  if (typeof loadPyodide === 'undefined') {
                    console.error('loadPyodide function not found. Ensure pyodide.js is loaded.');
                    reject(new Error('loadPyodide not available'));
                    return;
                  }

                  window.pyodideInstance = await loadPyodide({});
                  console.log('Pyodide core loaded successfully.');

                  // Load common packages
                  console.log('Loading common Python packages...');
                  await window.pyodideInstance.loadPackage(['matplotlib', 'numpy', 'pandas', 'scipy', 'sympy', 'scikit-learn']);
                  console.log('Common packages loaded.');

                  console.log('Setting up global stdout/stderr redirection...');
                  window.pyodideInstance.runPython(pythonStdoutRedirect);
                  console.log('Global redirection setup complete.');

                  console.log('Pyodide fully initialized globally.');
                  window.isPyodideLoading = false;

                  // Enable all buttons across the entire site
                  enableAllPythonButtons();

                  resolve(window.pyodideInstance);
                } catch (error) {
                  console.error('Error loading Pyodide or packages:', error);
                  window.isPyodideLoading = false;
                  reject(error);
                }
              });
              return window.pyodideLoadPromise;
            }

            function enableAllPythonButtons() {
              console.log('Enabling all Python run buttons globally...');
              document.querySelectorAll('.python-run-button').forEach(btn => {
                btn.disabled = false;
              });
            }

            // Check for buttons that need enabling (for navigation/preloading scenarios)
            function checkAndEnableButtons() {
              if (window.pyodideInstance) {
                console.log('Pyodide ready, ensuring all buttons are enabled...');
                enableAllPythonButtons();
              } else if (!window.isPyodideLoading) {
                console.log('Pyodide not loaded, starting load...');
                loadPyodideGlobal().catch(err => {
                  console.error("Pyodide load failed:", err);
                });
              }
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

              // Ensure Pyodide is ready
              if (!window.pyodideInstance) {
                  if (window.isPyodideLoading) {
                     console.log('Pyodide is loading, waiting to execute...');
                     try {
                        await window.pyodideLoadPromise; 
                     } catch (error) {
                        console.error('Pyodide loading failed while waiting:', error);
                        textElement.textContent = 'Error: Pyodide failed to load. ' + error.message;
                        outputWrapper.classList.add('expanded');
                        return; 
                     }
                  } else {
                      console.log('Pyodide not loaded, initiating load...');
                      try {
                        await loadPyodideGlobal(); 
                      } catch (error) {
                        console.error('Failed to load Pyodide for execution:', error);
                        textElement.textContent = 'Error: Pyodide failed to load. ' + error.message;
                        outputWrapper.classList.add('expanded');
                        return; 
                      }
                  }
              }

              textElement.innerHTML = ''; 
              textElement.classList.remove('error', 'success'); 
              plotElement.innerHTML = ''; 
              plotElement.style.display = 'none'; 

              playIcon.style.display = 'none';
              spinner.style.display = 'inline-block';
              button.disabled = true;
              button.classList.add('loading');

              try {
                console.log('Executing Python code for block:', blockId);

                window.pyodideInstance.runPython('sys.stdout.seek(0); sys.stdout.truncate(0); sys.stderr.seek(0); sys.stderr.truncate(0)');

                await window.pyodideInstance.loadPackagesFromImports(code);

                let result = await window.pyodideInstance.runPythonAsync(code);

                let stdout = window.pyodideInstance.runPython('sys.stdout.getvalue()');
                let stderr = window.pyodideInstance.runPython('sys.stderr.getvalue()');

                let outputContent = '';
                if (stdout) {
                    outputContent += stdout;
                }
                if (stderr) {
                    outputContent += '\\n--- STDERR ---\\n' + stderr;
                }

                 if (result !== undefined ? result !== null : false) {
                    outputContent += '\\nResult: ' + result.toString();
                }
                textElement.textContent = outputContent; 

                let figureExists = window.pyodideInstance.runPython(\`
import matplotlib.pyplot as plt
len(plt.get_fignums()) > 0
                \`);

                if (figureExists) {
                  console.log('Matplotlib figure detected, generating plot image...');
                  let plotData = window.pyodideInstance.runPython(\`
import io
import base64
import matplotlib.pyplot as plt

buf = io.BytesIO()
plt.savefig(buf, format='png', bbox_inches='tight')
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

                textElement.classList.add('success');

              } catch (error) {
                console.error('Error running Python code in block ' + blockId + ':', error);
                textElement.textContent = '--- PYTHON ERROR --- \\n' + error.message;
                textElement.classList.add('error');
              } finally {
                console.log('Finished execution for block:', blockId);
                playIcon.style.display = 'inline'; 
                spinner.style.display = 'none';
                button.disabled = false; 
                button.classList.remove('loading');
                outputWrapper.classList.add('expanded');
              }
            }

            // Make the execution function globally available
            window.executePythonBlock = executePythonBlock;

            // Initial setup and page visibility handling
            function initializePage() {
              console.log('Initializing page for Pyodide...');
              checkAndEnableButtons();
            }

            // Event listeners for various page scenarios
            document.addEventListener('DOMContentLoaded', initializePage);
            
            document.addEventListener('visibilitychange', () => {
              if (!document.hidden) {
                console.log('Page became visible, checking buttons...');
                setTimeout(checkAndEnableButtons, 200);
              }
            });

            window.addEventListener('focus', () => {
              console.log('Window focused, checking buttons...');
              setTimeout(checkAndEnableButtons, 200);
            });

            window.addEventListener('popstate', () => {
              console.log('Navigation detected, checking buttons...');
              setTimeout(checkAndEnableButtons, 300);
            });

            // Override history methods to catch programmatic navigation
            (function() {
              const originalPushState = history.pushState;
              const originalReplaceState = history.replaceState;
              
              history.pushState = function() {
                originalPushState.apply(history, arguments);
                setTimeout(checkAndEnableButtons, 300);
              };
              
              history.replaceState = function() {
                originalReplaceState.apply(history, arguments);
                setTimeout(checkAndEnableButtons, 300);
              };
            })();

          `,
        },
      ],
      css: [
        {
          content: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css",
        },
        {
          content:
            "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/material-palenight.min.css",
        },
        {
          content:
            "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/base16-light.min.css",
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

  const blockId = '${id}'; 
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
      attrs: { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'currentColor', stroke: 'currentColor', 'stroke-width': '1', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, 
      children: [ { tag: 'polygon', attrs: { points: '5 3 19 12 5 21 5 3' } } ]
  };
  const svgExpand = {
      attrs: { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      children: [ { tag: 'polyline', attrs: { points: '6 9 12 15 18 9' } } ] 
  };
   const svgCollapse = { 
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
      if (typeof CodeMirror !== 'undefined' ? Boolean(codeTextarea) : false) {
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

           editorInstance.on('focus', () => codeBlock.classList.add('cm-focused'));
           editorInstance.on('blur', () => codeBlock.classList.remove('cm-focused'));

           // Check if Pyodide is ready and enable button if so
           if (window.pyodideInstance) {
               runBtn.disabled = false;
           }

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
          
          if (isExpanded) {
              codeContent.style.height = 'auto';
              codeContent.classList.add('expanded');
              
              const naturalHeight = codeContent.scrollHeight;
              const targetHeight = Math.min(naturalHeight, 600); 
              
              codeContent.style.height = '150px';
              codeContent.offsetHeight;
              codeContent.style.height = targetHeight + 'px';
              
              setTimeout(() => {
                  if (isExpanded) {
                      codeContent.style.height = 'auto';
                  }
              }, 400);
          } else {
              const currentHeight = codeContent.scrollHeight;
              codeContent.style.height = currentHeight + 'px';
              codeContent.offsetHeight;
              codeContent.style.height = '150px';
              codeContent.classList.remove('expanded');
              
              setTimeout(() => {
                  if (!isExpanded) {
                      codeContent.style.height = '150px';
                  }
              }, 400);
          }
          
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
              copyBtn.classList.add('copied');
              copyBtn.innerHTML = ''; 
              copyBtn.appendChild(createSvgElement(svgCheck)); 
              setTimeout(() => {
                  copyBtn.classList.remove('copied');
                  copyBtn.innerHTML = ''; 
                  copyBtn.appendChild(createSvgElement(svgCopy)); 
              }, 1500); 
          }).catch(err => {
              console.error('Failed to copy code:', err);
          });
      });

      runBtn.addEventListener('click', () => {
         console.log('Run button clicked for block:', blockId);
         if (typeof window.executePythonBlock === 'function') {
             window.executePythonBlock(blockId); 
         } else {
             console.error('Global executePythonBlock function not found!');
             textOutput.textContent = 'Error: Execution environment not ready.';
             outputWrapper.classList.add('expanded');
         }
      });

      closeOutputBtn.addEventListener('click', () => {
          textOutput.innerHTML = ''; 
          textOutput.classList.remove('error', 'success'); 
          plotOutput.innerHTML = ''; 
          outputWrapper.classList.remove('expanded'); 
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
