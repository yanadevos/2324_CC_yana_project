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
    "C#1": 34.6478,
    D1: 36.7081,
    "D#1": 38.8909,
    E1: 41.2034,
    F1: 43.6535,
    "F#1": 46.2493,
    G1: 48.9994,
    "G#1": 51.9131,
    A1: 55,
    "A#1": 58.2705,
    B1: 61.7354,
    C2: 65.4064,
    "C#2": 69.2957,
    D2: 73.4162,
    "D#2": 77.7817,
    E2: 82.4069,
    F2: 87.3071,
    "F#2": 92.4986,
    G2: 97.9989,
    "G#2": 103.826,
    A2: 110,
    "A#2": 116.541,
    B2: 123.471,
    C3: 130.813,
    "C#3": 138.591,
    D3: 146.832,
    "D#3": 155.563,
    E3: 164.814,
    F3: 174.614,
    "F#3": 184.997,
    G3: 195.998,
    "G#3": 207.652,
    A3: 220,
    "A#3": 233.082,
    B3: 246.942,
    C4: 261.626,
    "C#4": 277.183,
    D4: 293.665,
    "D#4": 311.127,
    E4: 329.628,
    F4: 349.228,
    "F#4": 369.994,
    G4: 391.995,
    "G#4": 415.305,
    A4: 440,
    "A#4": 466.164,
    B4: 493.883,
    C5: 523.251,
    "C#5": 554.365,
    D5: 587.33,
    "D#5": 622.254,
    E5: 659.255,
    F5: 698.456,
    "F#5": 739.989,
    G5: 783.991,
    "G#5": 830.609,
    A5: 880,
    "A#5": 932.328,
    B5: 987.767,
    C6: 1046.5,
    "C#6": 1108.73,
    D6: 1174.66,
    "D#6": 1244.51,
    E6: 1318.51,
    F6: 1396.91,
    "F#6": 1479.98,
    G6: 1567.98,
    "G#6": 1661.22,
    A6: 1760,
    "A#6": 1864.66,
    B6: 1975.53,
    C7: 2093,
    "C#7": 2217.46,
    D7: 2349.32,
    "D#7": 2489.02,
    E7: 2637.02,
    F7: 2793.83,
    "F#7": 2959.96,
    G7: 3135.96,
    "G#7": 3322.44,
    A7: 3520,
    "A#7": 3729.31,
    B7: 3951.07,
    C8: 4186.01,
    "C#8": 4434.92,
    D8: 4698.64,
    "D#8": 4978.03,
    E8: 5274.04,
    F8: 5587.65,
    "F#8": 5919.91,
    G8: 6271.93,
    "G#8": 6644.88,
    A8: 7040,
    "A#8": 745862,
    B8: 7902.13,
    C9: 8372.02,
    "C#9": 8869.84,
    D9: 9397.27,
    "D#9": 9956.06,
    E9: 10548.08,
    F9: 11175.3,
    "F#9": 11839.82,
    G9: 12543.86,
    "G#9": 13289.75,
    A9: 14080,
    "A#9": 14917.24,
    B9: 15804.27,
    C10: 16744.04,
    "C#10": 17739.68,
    D10: 18794.55,
    "D#10": 19912.13,
    E10: 21096.16,
    F10: 22350.61,
    "F#10": 23679.63,
    G10: 25087.72,
    "G#10": 26579.5,
    A10: 28160,
    "A#10": 29834.49,
    B10: 31608.54,
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
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
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

  // Draw line
  context.lineWidth = 4; // Increase line width for a wider glow effect
  context.lineCap = "round";
  context.shadowBlur = 12; // Increase shadow blur for bigger glow
  context.shadowColor = noteColor; // Brighter and more vibrant red glow
  context.strokeStyle = noteColor; // Use note color if available, otherwise default color
  context.globalAlpha = 0.01;

  // Draw multiple strokes with decreasing opacity to spread the glow
  for (let i = 1; i <= 5; i++) {
    context.globalAlpha = 0.1 * i; // Decrease opacity for each stroke
    context.beginPath();
    context.moveTo(x - 1, yOffset + lastAverage * 5);
    context.lineTo(x, yOffset + average * 5);
    context.stroke();
  }

  x++;
  lastAverage = average;

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
  const scale = keyResult.scale;

  // Gebruik de sleutel en schaal voor verdere verwerking
  // console.log("Detected key:", key);
  // console.log("Detected scale:", scale);
  // Extract key and mode
  const { keyIndex, mode } = extractKeyAndMode(vectorSignal);
  // console.log("Detected key index:", keyIndex);
  // console.log("Detected mode:", mode);
  // console.log(".");

  // keep an array of the last 20 scales
  scales.push(scale);
  let amountForAverage = 100;
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
