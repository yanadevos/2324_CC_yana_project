import "./styles/style.css";
import Tuner from "./tuner.js";

import { OpenAI } from "openai";
import { OPENAI_API_KEY } from "../secret.js";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

document.getElementById("recordButton").addEventListener("click", function () {
  // Hier voeg je de CSS-klasse 'hidden' toe aan de omliggende elementen
  document.querySelector(".form__group").classList.add("hidden");
  document.querySelector("h1").classList.add("hidden");
});

document.getElementById("name").addEventListener("focus", function () {
  // Hier verwijder je de 'hidden' CSS-klasse wanneer het invoerveld wordt geselecteerd
  document.querySelector(".form__group").classList.remove("hidden");
  document.querySelector("h1").classList.remove("hidden");
});

const feeling = "anxious";
const input = "school";

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a lyrics writer that puts a lot of feeling in her songs.",
      },
      {
        role: "user",
        content: `Please generate a ${feeling} lyrics about ${input}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}
main();

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

const toonaarden = [
  {
    toonsoort: "mineur",
    grondtoon: "A",
    toonladder: ["A", "B", "C", "D", "E", "F", "G"],
  },
  {
    toonsoort: "majeur",
    grondtoon: "C",
    toonladder: ["C", "D", "E", "F", "G", "A", "B"],
  },
  {
    toonsoort: "mineur",
    grondtoon: "D",
    toonladder: ["D", "E", "F", "G", "A", "A#", "C"],
  },
  {
    toonsoort: "majeur",
    grondtoon: "F",
    toonladder: ["F", "G", "A", "A#", "C", "D", "E"],
  },
  {
    toonsoort: "mineur",
    grondtoon: "G",
    toonladder: ["G", "A", "A#", "C", "D", "D#", "F"],
  },
  {
    toonsoort: "majeur",
    grondtoon: "A",
    toonladder: ["A", "B", "C#", "D", "E", "F#", "G#"],
  },
  {
    toonsoort: "mineur",
    grondtoon: "C",
    toonladder: ["C", "D", "D#", "F", "G", "G#", "A#"],
  },
  {
    toonsoort: "majeur",
    grondtoon: "D",
    toonladder: ["D", "E", "F#", "G", "A", "B", "C#"],
  },
  {
    toonsoort: "mineur",
    grondtoon: "F",
    toonladder: ["F", "G", "G#", "A#", "C#", "C", "D#"],
  },
  {
    toonsoort: "majeur",
    grondtoon: "G",
    toonladder: ["G", "A", "B", "C", "D", "E", "F#"],
  },
  {
    toonsoort: "mineur",
    grondtoon: "E",
    toonladder: ["E", "F#", "G", "A", "B", "C", "D"],
  },
  {
    toonsoort: "mineur",
    grondtoon: "B",
    toonladder: ["B", "C#", "D", "E", "F#", "G", "A"],
  },
  {
    toonsoort: "mineur",
    grondtoon: "F#",
    toonladder: ["F#", "G#", "A", "B", "C#", "D", "E"],
  },
  {
    toonsoort: "mineur",
    grondtoon: "C#",
    toonladder: ["C#", "D#", "E", "F#", "G#", "A", "B"],
  },
  {
    toonsoort: "mineur",
    grondtoon: "G#",
    toonladder: ["G#", "A#", "B", "C#", "D#", "E", "F#"],
  },
  {
    toonsoort: "mineur",
    grondtoon: "D#",
    toonladder: ["D#", "E#", "F#", "G#", "A#", "B", "C#"],
  },
  {
    toonsoort: "mineur",
    grondtoon: "A#",
    toonladder: ["A#", "C", "C#", "D#", "F", "F#", "G#"],
  },
  {
    toonsoort: "majeur",
    grondtoon: "E",
    toonladder: ["E", "F#", "G#", "A", "B", "C#", "D#"],
  },
  {
    toonsoort: "majeur",
    grondtoon: "B",
    toonladder: ["B", "C#", "D#", "E", "F#", "G#", "A#"],
  },
  {
    toonsoort: "majeur",
    grondtoon: "F#",
    toonladder: ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
  },
  {
    toonsoort: "majeur",
    grondtoon: "C#",
    toonladder: ["C#", "D#", "E#", "F#", "G#", "A#", "C"],
  },
  {
    toonsoort: "majeur",
    grondtoon: "G#",
    toonladder: ["G#", "A#", "C", "C#", "D#", "F", "G"],
  },
  {
    toonsoort: "majeur",
    grondtoon: "D#",
    toonladder: ["D#", "F", "G", "G#", "A#", "C", "D"],
  },
  {
    toonsoort: "majeur",
    grondtoon: "A#",
    toonladder: ["A#", "C", "D", "D#", "F", "G", "A"],
  },
];

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
});

let canvas = document.getElementById("pitchCanvas");
let context = canvas.getContext("2d");

const xPosDistance = 10;
const yPosStart = canvas.height;
let pathPoints = []; // Array to store path points

// Function to adjust the wave height
function waveHeight(noteValue) {
  // Adjust the multiplier to change the height of the waves
  return noteValue + Math.sin(noteValue * 0.01) * 10; // Example multiplier: 0.1, Example amplitude: 10
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  pathPoints = []; // Clear path points before redrawing
  let x = 0;
  for (let i = 1; i < notes.length; i++) {
    context.lineCap = "round";
    context.strokeStyle = noteColors[notes[i].name];
    context.globalAlpha = 0.01;

    // Draw multiple strokes with decreasing opacity to spread the glow
    for (let j = 1; j <= 10; j++) {
      context.lineWidth = j * 9; // Increase line width for a wider glow effect
      context.globalAlpha = 0.05; // Decrease opacity for each stroke
      context.beginPath();
      context.moveTo(
        x - xPosDistance,
        yPosStart + (notes[i - 1]?.value || notes[i]?.value) * -5,
      );
      context.lineTo(x, yPosStart + waveHeight(notes[i].value) * -5); // Using waveHeight function
      context.stroke();

      // Store the path points
      pathPoints.push({ x: x, y: yPosStart + waveHeight(notes[i].value) * -5 }); // Using waveHeight function
    }

    x += xPosDistance;
  }

  // Draw text along the path
  var lyrics =
    "Fly me to the moon, let me play among the stars. Let me see what spring is like on a jupiter and mars. In other words???? Fly me to the moon, let me play among the stars. Let me see what spring is like on a jupiter and mars. In other words???? Fly me to the moon, let me play among the stars. Let me see what spring is like on a jupiter and mars. In other words???? Fly me to the moon, let me play among the stars. Let me see what spring is like on a jupiter and mars. In other words????Fly me to the moon, let me play among the stars. Let me see what spring is like on a jupiter and mars. In other words????Fly me to the moon, let me play among the stars. Let me see what spring is like on a jupiter and mars. In other words????Fly me to the moon, let me play among the stars. Let me see what spring is like on a jupiter and mars. In other words???? Fly me to the moon, let me play among the stars. Let me see what spring is like on a jupiter and mars. In other words????"; // Change this to your actual lyrics
  context.font = "20px Arial";
  context.fillStyle = "white";
  context.globalAlpha = 1;
  drawTextAlongPath(lyrics, pathPoints);

  // on requestanimationframe
  requestAnimationFrame(draw);
}
draw();

// Function to draw text along the path with proper rotation
function drawTextAlongPath(text, pathPoints) {
  var pathLength = calculatePathLength(pathPoints);
  var spaceBetweenLetters = pathLength / text.length;
  var textIndex = 0;
  var textLength = 0;

  context.save();
  context.textBaseline = "middle";

  var dx, dy;
  for (var i = 0; i < pathPoints.length - 1 && textIndex < text.length; i++) {
    var segment = {
      start: pathPoints[i],
      end: pathPoints[i + 1],
    };
    var segmentLength = distance(segment.start, segment.end);
    var segmentAngle = Math.atan2(
      segment.end.y - segment.start.y,
      segment.end.x - segment.start.x,
    );

    while (textLength < segmentLength && textIndex < text.length) {
      var charWidth = context.measureText(text[textIndex]).width;
      var ratio = textLength / segmentLength;
      dx = segment.start.x + ratio * (segment.end.x - segment.start.x);
      dy = segment.start.y + ratio * (segment.end.y - segment.start.y);

      context.save();
      context.translate(dx, dy);
      context.rotate(segmentAngle);
      context.fillText(text[textIndex], 0, 0);
      context.restore();

      textLength += charWidth;
      textIndex++;
    }

    textLength -= segmentLength;
  }

  context.restore();
}

// Function to calculate distance between two points
function distance(p1, p2) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Function to calculate the total length of the path
function calculatePathLength(path) {
  var totalLength = 0;
  for (var i = 1; i < path.length; i++) {
    var dx = path[i].x - path[i - 1].x;
    var dy = path[i].y - path[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }
  return totalLength;
}

function findClosestMatches(scaledNotes, toonaarden) {
  let closestMatches = [];
  let minDifference1 = Infinity;
  let minDifference2 = Infinity;

  for (const toon of toonaarden) {
    const difference = scaledNotes.reduce((acc, note, index) => {
      const noteIndex = toon.toonladder.indexOf(note.name);
      if (noteIndex !== -1) {
        const dist = Math.abs(index - noteIndex);
        return acc + dist;
      }
      return acc;
    }, 0);

    if (difference < minDifference1) {
      minDifference2 = minDifference1;
      closestMatches[1] = closestMatches[0];
      minDifference1 = difference;
      closestMatches[0] = toon;
    } else if (difference < minDifference2) {
      minDifference2 = difference;
      closestMatches[1] = toon;
    }
  }

  return closestMatches;
}

function determineTonality(scaledNotes, toonaarden) {
  const closestMatches = findClosestMatches(scaledNotes, toonaarden);

  const type1 = closestMatches[0].toonsoort;
  const type2 = closestMatches[1].toonsoort;

  if (type1 === type2) {
    return type1;
  } else {
    const grondtoon1Count = scaledNotes.filter(
      (note) => note.name === closestMatches[0].grondtoon,
    ).length;
    const grondtoon2Count = scaledNotes.filter(
      (note) => note.name === closestMatches[1].grondtoon,
    ).length;

    return grondtoon1Count >= grondtoon2Count ? type1 : type2;
  }
}

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

  console.log("Scale notes: " + scaleNotes);
  console.log(scaleNotes);

  const tonality = determineTonality(scaledNotes, toonaarden);
  console.log(tonality);
}

setInterval(calculate, 5000);
