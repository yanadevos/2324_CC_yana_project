import Tuner from './tuner.js';

const Application = function () {
  this.a4 = 440;
  this.tuner = new Tuner(this.a4);
};

Application.prototype.start = function () {
  const self = this;

  this.tuner.onNoteDetected = function (note) {    
    console.log(note);
  };

  self.tuner.init();
};

const app = new Application();

document.querySelector("#recordButton").addEventListener("click", () => {
  app.start();
})