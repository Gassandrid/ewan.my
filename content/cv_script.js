document.addEventListener("DOMContentLoaded", function () {
  // Create the command palette element
  const palette = document.createElement("div");
  palette.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    max-width: 90%;
    background-color: #fafafa;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  `;

  // Create the command palette content
  palette.innerHTML = `
    <input type="text" placeholder="Type a command or search..." style="
      width: 100%;
      padding: 12px 16px;
      border: none;
      background-color: #fafafa;
      color: #101010;
      font-size: 16px;
      outline: none;
      border-radius: 8px 8px 0 0;
    ">
    <div id="commandList" style="
      max-height: 300px;
      overflow-y: auto;
    ">
      <div class="command" data-action="print" style="
        padding: 10px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
      ">
        <span style="margin-right: 12px; color: #4CAF50;">🖨️</span>
        <span style="color: #101010;">Print</span>
      </div>
      <div class="command" data-action="linkedin" style="
        padding: 10px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
      ">
        <span style="margin-right: 12px; color: #2196F3;">🔗</span>
        <span style="color: #101010;">Open LinkedIn</span>
      </div>
      <div class="command" data-action="github" style="
        padding: 10px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
      ">
        <span style="margin-right: 12px; color: #9C27B0;">🐙</span>
        <span style="color: #101010;">Open GitHub</span>
      </div>
    </div>
  `;

  // Add the command palette to the body
  document.body.appendChild(palette);

  const input = palette.querySelector("input");
  const commandList = document.getElementById("commandList");

  // Function to show the command palette
  function showPalette() {
    palette.style.display = "block";
    input.focus();
  }

  // Function to hide the command palette
  function hidePalette() {
    palette.style.display = "none";
    input.value = "";
    showAllCommands();
  }

  // Event listener for the hotkey
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "j") {
      e.preventDefault();
      showPalette();
    } else if (e.key === "Escape") {
      hidePalette();
    }
  });

  // Filter commands based on input
  input.addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const commands = commandList.getElementsByClassName("command");
    for (let command of commands) {
      const text = command.textContent.toLowerCase();
      command.style.display = text.includes(filter) ? "flex" : "none";
    }
  });

  // Show all commands
  function showAllCommands() {
    const commands = commandList.getElementsByClassName("command");
    for (let command of commands) {
      command.style.display = "flex";
    }
  }

  // Handle command selection
  commandList.addEventListener("click", function (e) {
    const command = e.target.closest(".command");
    if (command) {
      const action = command.dataset.action;
      switch (action) {
        case "print":
          window.print();
          break;
        case "linkedin":
          window.open("https://www.linkedin.com/in/eilleeenzhang/", "_blank");
          break;
        case "github":
          window.open("https://github.com/fanteastick", "_blank");
          break;
      }
      hidePalette();
    }
  });

  // Close the palette when clicking outside of it
  document.addEventListener("click", function (e) {
    if (e.target !== palette && !palette.contains(e.target)) {
      hidePalette();
    }
  });
});
