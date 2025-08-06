<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sticky Notes Todo</title>
  <style>
    body {
      margin: 0;
      background: #f0f0f0;
      font-family: Arial, sans-serif;
    }

    #board {
      position: relative;
      height: 100vh;
      overflow: hidden;
    }

    .note {
      position: absolute;
      width: 200px;
      min-height: 150px;
      background-color: #fffec8;
      border: 1px solid #ccc;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
      padding: 10px;
      box-sizing: border-box;
      border-radius: 10px;
    }

    .note input[type="text"] {
      width: 100%;
      font-size: 16px;
      padding: 5px;
      border: none;
      background: transparent;
      outline: none;
    }

    .note-buttons {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }

    .note-buttons button {
      font-size: 14px;
      padding: 2px 6px;
      cursor: pointer;
    }

    .completed {
      text-decoration: line-through;
      opacity: 0.6;
    }

    #addBtn {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 10px 15px;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <button id="addBtn">+ Add Note</button>
  <div id="board"></div>

  <script>
    const board = document.getElementById("board");
    const addBtn = document.getElementById("addBtn");
    let notes = JSON.parse(localStorage.getItem("stickyNotes")) || [];
    let highestZIndex = 1;

    function saveNotes() {
      localStorage.setItem("stickyNotes", JSON.stringify(notes));
    }

    function renderNotes() {
      board.innerHTML = "";
      notes.forEach((note, i) => {
        const div = document.createElement("div");
        div.className = "note";
        div.style.left = note.left || "50px";
        div.style.top = note.top || "50px";
        div.style.backgroundColor = note.color || "#fffec8";
        div.style.zIndex = note.zIndex || 1;

        if (note.zIndex && note.zIndex > highestZIndex) {
          highestZIndex = note.zIndex;
        }

        const input = document.createElement("input");
        input.type = "text";
        input.value = note.text || "";
        if (note.completed) input.classList.add("completed");

        input.addEventListener("input", () => {
          notes[i].text = input.value;
          saveNotes();
        });

        const btnBox = document.createElement("div");
        btnBox.className = "note-buttons";

        const editBtn = document.createElement("button");
        editBtn.innerText = "✏";
        editBtn.addEventListener("click", () => {
          input.disabled = !input.disabled;
          input.focus();
        });

        const completeBtn = document.createElement("button");
        completeBtn.innerText = "✓";
        completeBtn.addEventListener("click", () => {
          notes[i].completed = !notes[i].completed;
          input.classList.toggle("completed");
          saveNotes();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "🗑";
        deleteBtn.addEventListener("click", () => {
          notes.splice(i, 1);
          saveNotes();
          renderNotes();
        });

        btnBox.append(editBtn, completeBtn, deleteBtn);
        div.append(input, btnBox);
        board.appendChild(div);

        // Drag support
        let isDragging = false, startX, startY, initialX, initialY;

        div.addEventListener("mousedown", (e) => {
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          initialX = parseInt(div.style.left) || 0;
          initialY = parseInt(div.style.top) || 0;

          highestZIndex += 1;
          div.style.zIndex = highestZIndex;
          notes[i].zIndex = highestZIndex;
          saveNotes();
        });

        document.addEventListener("mousemove", (e) => {
          if (!isDragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          div.style.left = initialX + dx + "px";
          div.style.top = initialY + dy + "px";
          notes[i].left = div.style.left;
          notes[i].top = div.style.top;
        });

        document.addEventListener("mouseup", () => {
          if (isDragging) {
            isDragging = false;
            saveNotes();
          }
        });

        // Touch for mobile
        div.addEventListener("touchstart", (e) => {
          isDragging = true;
          const touch = e.touches[0];
          startX = touch.clientX;
          startY = touch.clientY;
          initialX = parseInt(div.style.left) || 0;
          initialY = parseInt(div.style.top) || 0;

          highestZIndex += 1;
          div.style.zIndex = highestZIndex;
          notes[i].zIndex = highestZIndex;
          saveNotes();
        });

        document.addEventListener("touchmove", (e) => {
          if (!isDragging) return;
          const touch = e.touches[0];
          const dx = touch.clientX - startX;
          const dy = touch.clientY - startY;
          div.style.left = initialX + dx + "px";
          div.style.top = initialY + dy + "px";
          notes[i].left = div.style.left;
          notes[i].top = div.style.top;
        });

        document.addEventListener("touchend", () => {
          if (isDragging) {
            isDragging = false;
            saveNotes();
          }
        });
      });
    }

    addBtn.addEventListener("click", () => {
      notes.push({
        text: "",
        left: "60px",
        top: "60px",
        color: "#fffec8",
        zIndex: ++highestZIndex,
        completed: false
      });
      saveNotes();
      renderNotes();
    });

    renderNotes();
  </script>
</body>
</html>
