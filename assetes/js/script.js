const board = document.getElementById('board');
const addBtn = document.getElementById('addBtn');
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const textInput = document.getElementById('noteText');
const colorInput = document.getElementById('noteColor');
const heading = document.getElementById('heading');

let notes = JSON.parse(localStorage.getItem('stickyNotes')) || [];
let noteOffset = 0;
let zCounter = 10;

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
    div.style.zIndex = note.z || 1;

    div.innerHTML = `
      <div class="actions">
        <label>
            <input type="checkbox" onchange="markComplete(${i})" ${note.complete ? "checked" : ""}> ✔️
        </label>
        <button onclick="editNote(${i})">✏️</button>
        <button onclick="deleteNote(${i})">🗑</button>
      </div>
      <div class="note-text" style="${note.complete ? 'text-decoration: line-through;' : ''}">${note.text}</div>
      <div class="time">${note.time}</div>
    `;

    let isDragging = false;
    let startX, startY, initialX, initialY;

    const bringToTop = () => {
      zCounter++;
      div.style.zIndex = zCounter;
      notes[i].z = zCounter;
      saveNotes();
    };

    div.addEventListener("mousedown", function (e) {
      isDragging = true;
      bringToTop();
      startX = e.clientX;
      startY = e.clientY;
      initialX = parseInt(div.style.left) || 0;
      initialY = parseInt(div.style.top) || 0;

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
        notes[i].x = div.style.left;
        notes[i].y = div.style.top;
        saveNotes();
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    div.addEventListener("touchstart", function (e) {
      isDragging = true;
      bringToTop();
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      initialX = parseInt(div.style.left) || 0;
      initialY = parseInt(div.style.top) || 0;

      function onTouchMove(e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        div.style.left = initialX + dx + "px";
        div.style.top = initialY + dy + "px";
      }

      function onTouchEnd() {
        isDragging = false;
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
        notes[i].x = div.style.left;
        notes[i].y = div.style.top;
        saveNotes();
      }

      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onTouchEnd);
    });

    div.addEventListener('click', bringToTop);

    board.appendChild(div);
  });
}

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
    complete: false,
    time: new Date().toLocaleString(),
    x: `${10 + (noteOffset % 200)}px`,
    y: `${10 + (noteOffset % 300)}px`,
    z: ++zCounter
  };

  noteOffset += 40;

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

function markComplete(index) {
  notes[index].complete = !notes[index].complete;
  notes[index].time = new Date().toLocaleString();
  saveNotes();
  renderNotes();
}

addBtn.addEventListener('click', showPopup);
overlay.addEventListener('click', hidePopup);
renderNotes();

// Color animation
const colors = ["#dff800ff", "#f321e5ff", "#31067aff", "#ff0471ff", "#98ffe2ff"];
let j = 0;
setInterval(() => {
  if (addBtn) addBtn.style.backgroundColor = colors[j];
  if (heading) heading.style.color = colors[j];
  j = (j + 1) % colors.length;
}, 1000);
