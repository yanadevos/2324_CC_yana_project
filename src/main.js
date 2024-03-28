import Essentia from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.es.js";
// import essentia-wasm-module
import { EssentiaWASM } from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.es.js";
//import { KeyExtractor } from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.es.js";
import "./styles/style.css";

const essentia = new Essentia(EssentiaWASM);

console.log(essentia.version);
// prints all the available algorithms in essentia.js
console.log(essentia.algorithmNames);

// global var to load essentia instance from wasm build
let isEssentiaInstance = false;
// global audio vars
let audioCtx;
let bufferSize = 1024; // buffer size for mic stream and ScriptProcessorNode
let mic = null;
let scriptNode = null;
let gumStream;
let averageArray = [];
let notecolorArray = [];

const AudioContext = window.AudioContext || window.webkitAudioContext;
audioCtx = new AudioContext();

let canvas = document.getElementById("pitchCanvas");
let context = canvas.getContext("2d");
let recordButton = document.querySelector("#recordButton");

// Define global variables for the sine wave parameters
let amplitude = 10; // Amplitude of the sine wave
let frequency = 0.01; // Frequency of the sine wave
let phase = 0; // Initial phase of the sine wave
let yOffset = 0; // Vertical offset to position the sine wave in the middle of the canvas

const scales = [];

// Define color mappings for notes
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

// Function to convert frequency to note
function frequencyToNote(frequency) {
  const noteFrequencies = {
    B1: 61.74,
    C2: 65.41,
    "C#2": 69.3,
    D2: 73.42,
    "D#2": 77.78,
    E2: 82.41,
    F2: 87.31,
    "F#2": 92.5,
    G2: 98.0,
    "G#2": 103.83,
    A2: 110.0,
    "A#2": 116.54,
    B2: 123.47,
    C3: 130.81,
    "C#3": 138.59,
    D3: 146.83,
    "D#3": 155.56,
    E3: 164.81,
    F3: 174.61,
    "F#3": 185.0,
    G3: 196.0,
    "G#3": 207.65,
    A3: 220.0,
    "A#3": 233.08,
    B3: 246.94,
    C4: 261.63,
    "C#4": 277.18,
    D4: 293.66,
    "D#4": 311.13,
    E4: 329.63,
    F4: 349.23,
    "F#4": 369.99,
    G4: 392.0,
    "G#4": 415.3,
    A4: 440.0,
    "A#4": 466.16,
  };

  let closestFrequency = null;
  let minDifference = Infinity;

  for (const noteFrequency in noteFrequencies) {
    const difference = Math.abs(frequency - noteFrequencies[noteFrequency]);
    if (difference < minDifference) {
      closestFrequency = noteFrequency;
      minDifference = difference;
    }
  }

  return closestFrequency;
}

// ScriptNodeProcessor callback function to calculate RMS using essentia.js
let x = 0;
let pitchArray = [];
let lastAverage = 0;

// Function to extract key and mode
function extractKeyAndMode(audioData) {
  const computed = essentia.KeyExtractor(audioData);
  const KEYS = [
    "B1",
    "C2",
    "C#2",
    "D2",
    "D#2",
    "E2",
    "F2",
    "F#2",
    "G2",
    "G#2",
    "A2",
    "A#2",
    "B2",
    "C3",
    "C#3",
    "D3",
    "D#3",
    "E3",
    "F3",
    "F#3",
    "G3",
    "G#3",
    "A3",
    "A#3",
    "B3",
    "C4",
    "C#4",
    "D4",
    "D#4",
    "E4",
    "F4",
    "F#4",
    "G4",
    "G#4",
    "A4",
    "A#4",
  ];

  const keyIndex = KEYS.indexOf(computed.key);
  const mode = computed.scale === "major" ? 1 : 0;

  return { keyIndex, mode };
}

function essentiaExtractorCallback(audioProcessingEvent) {
  // Convert the float32 audio data into std::vector<float> for use with essentia algos
  let vectorSignal = essentia.arrayToVector(
    audioProcessingEvent.inputBuffer.getChannelData(0),
  );
  if (!vectorSignal) {
    throw "onRecordingError: empty audio signal input found!";
  }

  // Perform pitch detection using Essentia
  const bufferSize = 2000;
  const frameSize = bufferSize / 2;
  const hopSize = frameSize / 2;
  const lowestFreq = 40; // Lowered frequency range to 40 Hz
  const highestFreq = 20000; // Increased maximum frequency to 20000 Hz
  const sampleRate = 1000;

  const algoOutput = essentia.PitchMelodia(
    vectorSignal,
    10,
    10,
    frameSize,
    false,
    0.8,
    hopSize,
    1,
    40,
    highestFreq,
    500,
    lowestFreq,
    20,
    0.9,
    0.9,
    27.5625,
    lowestFreq,
    sampleRate,
    500,
  );
  const pitchFrames = essentia.vectorToArray(algoOutput.pitch);

  // Calculate mean pitch
  const numVoicedFrames = pitchFrames.filter((p) => p > 0).length;
  const meanPitch =
    pitchFrames.reduce((acc, val) => acc + val, 0) / numVoicedFrames;

  // Convert mean pitch to note
  const note = frequencyToNote(meanPitch);

  // Get color for the note
  const noteColor = noteColors[note.split("#")[0]];

  // Update phase of the sine wave based on mean pitch
  phase += meanPitch * frequency;

  //Log the mean pitch and note
  // console.log("Mean Pitch: " + meanPitch);
  // console.log("Note: " + note);

  // fill pitchArray to max length 10 and if full remove first
  pitchArray.push(meanPitch);
  if (pitchArray.length === 20) {
    pitchArray.shift();
  }
  // calculate average of last values
  const average = pitchArray.reduce((a, b) => a + b, 0) / pitchArray.length;

  // Define max number of points to keep
  const maxPoints = 300;

  // fill pitchArray to max length 500 and if full remove first
  averageArray.push(average);
  if (averageArray.length > maxPoints) {
    averageArray.shift();
  }

  notecolorArray.push(noteColor);
  if (notecolorArray.length > maxPoints) {
    notecolorArray.shift();
  }

  // Update phase of the sine wave based on mean pitch
  phase += meanPitch * frequency;

  const keyResult = essentia.KeyExtractor(
    vectorSignal,
    true, // averageDetuningCorrection
    4096, // frameSize
    4096, // hopSize
    12, // hpcpSize
    3500, // maxFrequency
    60, // maximumSpectralPeaks
    25, // minFrequency
    0.2, // pcpThreshold
    "bgate", // profileType
    44100, // sampleRate
    0.0001, // spectralPeaksThreshold
    440, // tuningFrequency
    "cosine", // weightType
    "hann", // windowType
  );

  // Key en mode uit keyResult halen
  const key = keyResult.key;
  let scale = keyResult.scale;

  // Gebruik de sleutel en schaal voor verdere verwerking
  console.log("Detected key:", keyResult);
  // console.log("Detected scale:", scale);
  // Extract key and mode
  const { keyIndex, mode } = extractKeyAndMode(vectorSignal);
  // console.log("Detected key index:", keyIndex);
  //console.log("Detected mode:", mode);
  // console.log(".");

  // keep an array of the last 20 scales

  scale = mode == 1 ? "major" : "minor";
  scales.push(scale);
  let amountForAverage = 20;
  if (scales.length === amountForAverage) {
    scales.shift();
  }
  const majors = scales.filter((s) => s === "major");
  let mostCommonScale;
  if (majors.length > amountForAverage / 2) {
    mostCommonScale = "major";
  } else {
    mostCommonScale = "minor";
  }
  console.log("Most common scale:", mostCommonScale);
}

// Function to start microphone recording stream
function startMicRecordStream() {
  if (audioCtx.state === "suspended") audioCtx.resume();
  if (navigator.mediaDevices.getUserMedia) {
    console.log("Initializing audio...");
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        gumStream = stream;
        if (gumStream.active) {
          mic = audioCtx.createMediaStreamSource(stream);
          if (audioCtx.state == "suspended") {
            audioCtx.resume();
          }
          scriptNode = audioCtx.createScriptProcessor(bufferSize, 1, 1);
          scriptNode.onaudioprocess = essentiaExtractorCallback;
          mic.connect(scriptNode);
          scriptNode.connect(audioCtx.destination);
        } else {
          throw "Mic stream not active";
        }
      })
      .catch((message) => {
        throw "Could not access microphone - " + message;
      });
  } else {
    throw "Could not access microphone - getUserMedia not available";
  }
}

// Event listener for record button click
window.onload = () => {
  recordButton.onclick = function () {
    var recording = this.classList.contains("recording");
    if (!recording) {
      this.setAttribute("disabled", true);
      startMicRecordStream();
    } else {
      stopMicRecordStream();
    }
  };
};

const xPosDistance = 3;
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  x = 0;
  // Draw lines for all points
  for (let i = 1; i < averageArray.length; i++) {
    // Draw line

    context.lineCap = "round";
    //context.shadowBlur = 50; // Increase shadow blur for bigger glow
    //context.shadowColor = notecolorArray[i]; // Brighter and more vibrant red glow
    context.strokeStyle = notecolorArray[i]; // Use note color if available, otherwise default color
    context.globalAlpha = 0.01;

    // Draw multiple strokes with decreasing opacity to spread the glow
    for (let j = 1; j <= 10; j++) {
      context.lineWidth = j * 9; // Increase line width for a wider glow effect
      context.globalAlpha = 0.02; // Decrease opacity for each stroke
      context.beginPath();
      context.moveTo(
        x - xPosDistance,
        yOffset + (averageArray[i - 1] || averageArray[i]) * 5,
      );
      context.lineTo(x, yOffset + averageArray[i] * 5);
      context.stroke();
    }

    x += xPosDistance;
  }

  // on requestanimationframe
  requestAnimationFrame(draw);
}
draw();
