const notes = document.querySelectorAll('.note');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let selectedNotes = [];
let previousSelections = [];
let currentSelections = [];
const radius = 160;
const centerX = 200;
const centerY = 200;

let colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#ffff00', '#00ffff'];
let currentColorIndex = 0;

canvas.width = 400;
canvas.height = 400;

function drawLines() {
    if (currentSelections.length < 2) return;

    ctx.strokeStyle = colors[currentColorIndex];
    ctx.lineWidth = 2;

    ctx.beginPath();
    currentSelections.forEach((note, index) => {
        const nextNote = currentSelections[(index + 1) % currentSelections.length];
        const startNoteElement = document.getElementById(note);
        const endNoteElement = document.getElementById(nextNote);

        const startX = startNoteElement.offsetLeft + startNoteElement.offsetWidth / 2;
        const startY = startNoteElement.offsetTop + startNoteElement.offsetHeight / 2;
        const endX = endNoteElement.offsetLeft + endNoteElement.offsetWidth / 2;
        const endY = endNoteElement.offsetTop + endNoteElement.offsetHeight / 2;

        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
    });
    ctx.closePath();
    ctx.stroke();
}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'z') {
        if (currentSelections.length > 0) {
            const lastNote = currentSelections.pop();
            const lastNoteElement = document.getElementById(lastNote);
            lastNoteElement.style.backgroundColor = '#fff';
            updateSelectionDisplay();
        }
        redrawAllLines();
    }
});

function redrawAllLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    previousSelections.forEach((selections, index) => {
        ctx.strokeStyle = colors[index % colors.length];
        ctx.lineWidth = 2;

        ctx.beginPath();
        selections.forEach((note, idx) => {
            const nextNote = selections[(idx + 1) % selections.length];
            const startNoteElement = document.getElementById(note);
            const endNoteElement = document.getElementById(nextNote);

            const startX = startNoteElement.offsetLeft + startNoteElement.offsetWidth / 2;
            const startY = startNoteElement.offsetTop + startNoteElement.offsetHeight / 2;
            const endX = endNoteElement.offsetLeft + endNoteElement.offsetWidth / 2;
            const endY = endNoteElement.offsetTop + endNoteElement.offsetHeight / 2;

            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
        });
        ctx.closePath();
        ctx.stroke();
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && currentSelections.length > 1) {
        previousSelections.push([...currentSelections]);
        drawLines();
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        currentSelections = [];
        resetNoteColors();
        updateSelectionDisplay();
    }
});

notes.forEach(note => {
    note.addEventListener('click', () => {
        const noteValue = note.innerText;

        if (!currentSelections.includes(noteValue)) {
            currentSelections.push(noteValue);
            note.style.backgroundColor = colors[currentColorIndex];
        } else {
            currentSelections = currentSelections.filter(n => n !== noteValue);
            note.style.backgroundColor = '#fff';
        }

        updateSelectionDisplay();
    });
});

function updateSelectionDisplay() {
    document.getElementById('selectedNotes').innerText = 'Notas selecionadas: ' + currentSelections.join(', ');
}

function resetNoteColors() {
    notes.forEach(note => {
        note.style.backgroundColor = '#fff';
    });
}

notes.forEach((note, index) => {
    const angle = (index / 12) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle) - note.offsetWidth / 2;
    const y = centerY + radius * Math.sin(angle) - note.offsetHeight / 2;

    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
});

const enterButton = document.getElementById('enterButton');
enterButton.addEventListener('click', () => {
    if (currentSelections.length > 1) {
        previousSelections.push([...currentSelections]);
        drawLines();
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        currentSelections = [];
        resetNoteColors();
        updateSelectionDisplay();
    }
});

const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    previousSelections = [];
    currentSelections = [];
    resetNoteColors();
    updateSelectionDisplay();
});

// Função para salvar a imagem do canvas como PNG
const saveImageButton = document.getElementById('saveImageButton');
saveImageButton.addEventListener('click', () => {
    const image = canvas.toDataURL('image/png'); // Captura a imagem do canvas no formato PNG
    const link = document.createElement('a');
    link.href = image;
    link.download = 'forma-geomusical.png'; // Nome do arquivo para download
    link.click();
});
