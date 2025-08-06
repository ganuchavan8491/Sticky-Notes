const board = document.getElementById('board');
const addBtn = document.getElementById('addBtn');
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const textInput = document.getElementById('noteText');
const colorInput = document.getElementById('noteColor');

let notes = JSON.parse(localStorage.getItem('stickyNotes')) || [];

function saveNotes() {
  localStorage.setItem('stickyNotes', JSON.stringify(notes));
}

function renderNotes() {
  board.innerHTML = '';
  notes.forEach((note, i) => {
    const div = document.createElement('div');
    div.className = 'note';
    div.style.background = note.color;
    div.style.left = note.x || '20px';
    div.style.top = note.y || '20px';
    div.style.position = 'absolute';
    div.style.zIndex = 1;

    div.innerHTML = `
      <div class="actions">
        <button onclick="editNote(${i})">✏️</button>
        <button onclick="deleteNote(${i})">🗑</button>
      </div>
      ${note.text}
      <div class="time">${note.time}</div>
    `;

    // DRAG HANDLER
    let isDragging = false;
    let startX, startY, initialX, initialY;

    div.addEventListener("mousedown", function (e) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = parseInt(div.style.left) || 0;
      initialY = parseInt(div.style.top) || 0;

      div.style.zIndex = 9999; // Bring this note to front

      function onMouseMove(e) {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        div.style.left = initialX + dx + "px";
        div.style.top = initialY + dy + "px";
      }

      function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        div.style.zIndex = 1; // Reset z-index

        // Save final position
        notes[i].x = div.style.left;
        notes[i].y = div.style.top;
        saveNotes();
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp, { once: true });
    });

    board.appendChild(div);
  });
}



// Make board a drop target
board.addEventListener('dragover', (e) => {
  e.preventDefault();
});

board.addEventListener('drop', (e) => {
  const index = e.dataTransfer.getData("text/plain");
  const x = e.clientX;
  const y = e.clientY;

  // Update note position
  notes[index].x = `${x - 100}px`;  // center offset
  notes[index].y = `${y - 50}px`;
  saveNotes();
  renderNotes();
});

function showPopup() {
  popup.style.display = 'block';
  overlay.style.display = 'block';
  textInput.value = '';
}

function hidePopup() {
  popup.style.display = 'none';
  overlay.style.display = 'none';
}

function saveNote() {
  const text = textInput.value.trim();
  const color = colorInput.value;
  if (!text) return;

  const note = {
    text,
    color,
    time: new Date().toLocaleString(),
    x: '10px',
    y: '10px'
  };

  notes.push(note);
  saveNotes();
  renderNotes();
  hidePopup();
}

function deleteNote(index) {
  notes.splice(index, 1);
  saveNotes();
  renderNotes();
}

function editNote(index) {
  const newText = prompt("Edit your note:", notes[index].text);
  if (newText !== null) {
    notes[index].text = newText.trim();
    notes[index].time = new Date().toLocaleString();
    saveNotes();
    renderNotes();
  }
}

addBtn.addEventListener('click', showPopup);
overlay.addEventListener('click', hidePopup);
renderNotes();

// Color cycle animation for the + button
let Btn = document.getElementById("addBtn");
let head = document.getElementById("heading"); // You must add id="heading" in your <h2>

const colors = ["#dff800ff", "#f321e5ff", "#31067aff", "#ff0471ff", "#98ffe2ff"];
let j = 0;

setInterval(() => {
  if (addBtn) Btn.style.backgroundColor = colors[j];
  if (heading) head.style.color = colors[j];
  j = (j + 1) % colors.length;
}, 1000);
