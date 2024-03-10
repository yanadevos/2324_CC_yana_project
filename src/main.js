import Essentia from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.es.js";
// import essentia-wasm-module
import { EssentiaWASM } from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.es.js";

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

let plotDiv = document.querySelector("#plotDiv"); // html div to print our results to
let recordButton = document.querySelector("#recordButton");

// ScriptNodeProcessor callback function to calculate RMS using essentia.js
function essentiaExtractorCallback(audioProcessingEvent) {
  // convert the float32 audio data into std::vector<float> for using with essentia algos
  let vectorSignal = essentia.arrayToVector(
    audioProcessingEvent.inputBuffer.getChannelData(0),
  );
  if (!vectorSignal) {
    throw "onRecordingError: empty audio signal input found!";
  }

  const bufferSize = 1024; // Bijvoorbeeld, dit moet een waarde zijn die bij uw toepassing past.
  const frameSize = bufferSize / 2;
  const hopSize = frameSize / 4;
  const lowestFreq = 65.40639; // frequentie van C2 in Hz
  const highestFreq = 2093.0045; // frequentie van C7 in Hz
  const sampleRate = 1000;

  // check https://mtg.github.io/essentia.js/docs/api/Essentia.html#RMS
  let RMSalgoOutput = essentia.RMS(vectorSignal);
  // convert the output to js arrray
  let rmsValue = RMSalgoOutput.rms;
  // console.log(RMSalgoOutput);
  const algoOutput = essentia.PitchMelodia(
    vectorSignal,
    10,
    3,
    frameSize,
    false,
    0.8,
    hopSize,
    1,
    40,
    highestFreq,
    100,
    lowestFreq,
    20,
    0.9,
    0.9,
    27.5625,
    lowestFreq,
    sampleRate,
    100,
  );
  const pitchFrames = essentia.vectorToArray(algoOutput.pitch);
  const confidenceFrames = essentia.vectorToArray(algoOutput.pitchConfidence);

  // average frame-wise pitches in pitch before writing to SAB
  const numVoicedFrames = pitchFrames.filter((p) => p > 0).length;
  // const numFrames = pitchFrames.length;
  const meanPitch =
    pitchFrames.reduce((acc, val) => acc + val, 0) / numVoicedFrames;
  const meanConfidence =
    confidenceFrames.reduce((acc, val) => acc + val, 0) / numVoicedFrames;

  //console.log("meanPitch", meanPitch);
  console.log("meanConfidence", meanConfidence);

  plotDiv.innerText = rmsValue;
}

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
          // onprocess callback (where we perform our analysis with essentia.js)
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

function stopMicRecordStream() {
  audioCtx.suspend().then(() => {
    // stop mic stream
    gumStream.getAudioTracks().forEach(function (track) {
      track.stop();
    });
    recordButton.classList.remove("recording");
    recordButton.innerHTML = 'Mic   <i class="microphone icon"></i>';

    mic.disconnect();
    scriptNode.disconnect();
    plotDiv.innerText = "";
  });
}

window.onload = () => {
  recordButton.onclick = function () {
    var recording = this.classList.contains("recording");
    if (!recording) {
      this.setAttribute("disabled", true);
      /*
      EssentiaWASM().then(function (essentiaModule) {
        if (!isEssentiaInstance) {
          essentia = new Essentia(essentiaModule);
          isEssentiaInstance = true;
        }*/
      startMicRecordStream(); // `enableButton` is just a function that re-enables the Start/Stop button
      /* });*/
    } else {
      stopMicRecordStream();
    }
  };
};
