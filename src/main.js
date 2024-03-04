import Essentia from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.es.js";
// import essentia-wasm-module
import { EssentiaWASM } from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.es.js";

const essentia = new Essentia(EssentiaWASM);

/*
// run an specific algorithm
let yourOutput = essentia.'<your-essentia-algo>'(<inputs> ..., <parameters> (optional)...);

yourOutput.'<your_output-key>'/*/

console.log(essentia.version);
// prints all the available algorithms in essentia.js
console.log(essentia.algorithmNames);
