import "./styles/style.css";
import Tuner from './tuner.js';

const noteColors = {
  C: "#FF9900",
  "C#": "#BB0000",
  D: "#9E00FF",
  "D#": "#FF774D",
  E: "#D9D9D9",
  F: "#B52C00",
  "F#": "#FF9900",
  G: "#1363FF",
  "G#": "#9E00FF",
  A: "#E0027A",
  "A#": "#9E00FF",
  B: "#FF0000",
};

const tuner = new Tuner(440);

let lastNote = null;
const maxNotes = 100;
const notes = [];
const differentNotes = [];

tuner.onNoteDetected = function (note) {   
  console.log(note);

  notes.push(note);
  if (notes.length > maxNotes) {
    notes.shift();
  }   
  if (!lastNote || lastNote.value !== note.value) {
    note.timestamp = new Date().getTime();
    note.duration = 0;
    if (lastNote && lastNote.timestamp) {
      note.duration = note.timestamp - lastNote.timestamp;
    }
    differentNotes.push(note);
    if (differentNotes.length > maxNotes) {
      differentNotes.shift();
    }
    lastNote = note;
  }
};

document.querySelector("#recordButton").addEventListener("click", () => {
  tuner.init();
})

let canvas = document.getElementById("pitchCanvas");
let context = canvas.getContext("2d");

const xPosDistance = 10;
const yPosStart = canvas.height;

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  let x = 0;
  for (let i = 1; i < notes.length; i++) {
    context.lineCap = "round";
    context.strokeStyle = noteColors[notes[i].name];
    context.globalAlpha = 0.01;

    // Draw multiple strokes with decreasing opacity to spread the glow
    for (let j = 1; j <= 10; j++) {
      context.lineWidth = j * 9; // Increase line width for a wider glow effect
      context.globalAlpha = 0.02; // Decrease opacity for each stroke
      context.beginPath();
      context.moveTo(
        x - xPosDistance,
        yPosStart + (notes[i - 1]?.value || notes[i]?.value)*-5,
      );
      context.lineTo(x, yPosStart + notes[i].value*-5);
      context.stroke();
    }

    x += xPosDistance;
  }

  // on requestanimationframe
  requestAnimationFrame(draw);
}
draw();


function calculate() {
  // calculate average note duration 
  let sum = 0;
  for (let i = 0; i < differentNotes.length; i++) {
    sum += differentNotes[i].duration;
  }
  let avg = sum / differentNotes.length;
  console.log("Average note duration: " + avg);

  // now check if use notes are minor or major
  // Sort the notes by their value
  let scaleNotes = differentNotes;
  scaleNotes.sort((a, b) => a.value - b.value);

  // Function to calculate intervals between notes
  const calculateIntervals = (sortedNotes) => {
      let intervals = [];
      for (let i = 1; i < sortedNotes.length; i++) {
          let interval = sortedNotes[i].value - sortedNotes[i - 1].value;
          intervals.push(interval);
      }
      return intervals;
  };

  // Function to determine if the intervals represent a major or minor chord/scale
  const determineChordType = (intervals) => {
      // This is a simplistic way to determine chord type based on common intervals
      const majorIntervals = [4, 3]; // Major third followed by minor third
      const minorIntervals = [3, 4]; // Minor third followed by major third

      if (intervals.length >= 2) {
          if (intervals[0] === majorIntervals[0] && intervals[1] === majorIntervals[1]) {
              return 'Major';
          } else if (intervals[0] === minorIntervals[0] && intervals[1] === minorIntervals[1]) {
              return 'Minor';
          }
      }

      return 'Unknown';
  };

  const intervals = calculateIntervals(scaleNotes);
  console.log(intervals)
  const chordType = determineChordType(intervals);

  console.log(`The chord/scale is likely: ${chordType}`);
}

setInterval(calculate, 5000);