import "./styles/style.css";
import Tuner from "./tuner.js";

import { OpenAI } from "openai";
import { OPENAI_API_KEY } from "../secret.js";

let timestamp = new Date().getTime();

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

document.getElementById("recordButton").addEventListener("click", function () {
  // Hier voeg je de CSS-klasse 'hidden' toe aan de omliggende elementen
  document.querySelector(".form__group").classList.add("hidden");
  document.querySelector("h1").classList.add("hidden");
  document.querySelector("#recordButton").classList.add("hidden");

  input = document.getElementById("name").value;
});

document.getElementById("name").addEventListener("focus", function () {
  // Hier verwijder je de 'hidden' CSS-klasse wanneer het invoerveld wordt geselecteerd
  document.querySelector(".form__group").classList.remove("hidden");
  document.querySelector("h1").classList.remove("hidden");
});

let feeling = "anxious";
let input = "";
let lyrics = "";

async function getText() {
  console.log("hallooooo");

  console.log(input, feeling);
  if (input && feeling) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a lyrics writer that puts a lot of feeling in her songs.",
        },
        {
          role: "user",
          content: `Please generate a ${feeling} lyrics about ${input}, text should be around 250 words. The lyrics should not include any structural information like 'verse' or 'bridge'. Additionally, please continue building on the existing lyrical text, if any.\n\nExisting lyrics:\n${lyrics}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    lyrics += completion.choices[0].message.content;
    localStorage.setItem("lyrics-" + timestamp, lyrics);

    console.log(completion.choices[0].message.content);
  }
}

const noteColors = {
  C: "#FF9900",
  "C#": "#BB0000",
  D: "#9E00FF",
  "D#": "#FF450C",
  E: "#FF9900",
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
const maxNotesVisual = 75;
const maxNotes = 25;
const notes = [];
const differentNotes = [];
const frameRate = 13;
let lastDraw = new Date().getTime();

tuner.onNoteDetected = function (note) {
  // console.log(note);
  const now = new Date().getTime();
  if (now - lastDraw > 1000 / frameRate) {
    notes.push(note);
    if (notes.length > maxNotesVisual) {
      notes.shift();
    }
    lastDraw = now;
    draw();
  }

  if (!lastNote || lastNote.value !== note.value) {
    note.timestamp = new Date().getTime();
    note.duration = 0;
    if (lastNote && lastNote.timestamp) {
      note.duration = note.timestamp - lastNote.timestamp;
    }
    differentNotes.push(note);
    //console.log(note);
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

const xPosDistance = 15;
const yPosStart = canvas.height;
let pathPoints = []; // Array to store path points

// Function to adjust the wave height
function waveHeight(noteValue) {
  // Adjust the multiplier to change the height of the waves
  return noteValue + Math.pow(noteValue * 0.01, 4) * 2; // Example multiplier: 0.1, Example amplitude: 10
}

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
      context.globalAlpha = 0.05; // Decrease opacity for each stroke
      context.beginPath();
      context.moveTo(
        x - xPosDistance,
        yPosStart + (notes[i - 1]?.value || notes[i]?.value) * -5,
      );
      context.lineTo(x, yPosStart + waveHeight(notes[i].value) * -5); // Using waveHeight function
      context.stroke();

      // Store the path points
    }
    if (lyrics && i == notes.length - 1) {
      pathPoints.push({ x: x, y: yPosStart + waveHeight(notes[i].value) * -5 }); // Using waveHeight function
    }
    x += xPosDistance;
  }

  // pathPoints x should end with the x given as last point, but should then go back to the start with xPosDistance
  if (pathPoints.length > 0) {
    let lastPoint = pathPoints[pathPoints.length - 1].x;
    for (let i = pathPoints.length - 1; i >= 0; i--) {
      pathPoints[i].x = lastPoint - (pathPoints.length - i) * xPosDistance;
    }
  }

  // Draw text along the path
  context.font = "20px Arial";
  context.fillStyle = "white";
  context.globalAlpha = 1;
  drawTextAlongPath(lyrics, pathPoints);

  // on requestanimationframe
  //requestAnimationFrame(draw);
}

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
  let closestMatches = [...toonaarden];

  scaledNotes.forEach((note) => {
    // is not in found in toonladder of closesMatches, if no, remove from closestMatches
    const removeIndexes = [];
    closestMatches.forEach((match, index) => {
      if (!match.toonladder.find((n) => n === note.name)) {
        removeIndexes.push(index);
      }
    });
    // remove indexes from closestMatches
    const newClosestMatches = closestMatches.filter(
      (_, index) => !removeIndexes.includes(index),
    );

    if (newClosestMatches.length >= 2) {
      closestMatches = newClosestMatches;
    }
  });

  return closestMatches;
}

function determineTonality(scaledNotes, toonaarden) {
  const closestMatches = findClosestMatches(scaledNotes, toonaarden);
  console.log(closestMatches);
  let closestMatch = null;
  scaledNotes.forEach((note) => {
    // Find the closest match in the toonaarden array by grondtoon
    if (closestMatch == null) {
      closestMatch =
        closestMatches.find((match) => match.grondtoon === note.name) || null;
    }
  });

  return closestMatch ? closestMatch.toonsoort : closestMatches[0].toonsoort;
}

function calculate() {
  // calculate average note duration
  let sum = 0;
  for (let i = 0; i < differentNotes.length; i++) {
    sum += differentNotes[i].duration;
  }
  let avg = sum / differentNotes.length;
  console.log("Average note duration: " + avg);

  // now create a new array with all notes that are played longer than 100ms
  let longNotes = differentNotes.filter((note) => note.duration > 50);

  // now check if use notes are minor or major
  // Sort the notes by their value
  let scaleNotes = longNotes;

  // sort the scaledNotes on how many times the .name value is present
  scaleNotes.sort((a, b) =>
    scaleNotes.filter((note) => note.name === a.name).length >
    scaleNotes.filter((note) => note.name === b.name).length
      ? -1
      : 1,
  );

  // remove last 3 notes from scaleNotes
  scaleNotes = scaleNotes.slice(0, -3);

  // console.log(scaleNotes);
  // log just the note .name of each note object
  let scaleNoteNames = scaleNotes.map((note) => note.name);
  console.log(scaleNoteNames);

  const tonality = determineTonality(scaleNotes, toonaarden);
  console.log(tonality);

  if (tonality === "majeur") {
    feeling = "happy";
  } else {
    feeling = "sad";
  }

  getText();
}

setInterval(calculate, 10000);
