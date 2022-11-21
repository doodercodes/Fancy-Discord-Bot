const fs = require("node:fs");
const fetch = require("node-fetch");
// https://github.com/Automattic/node-canvas
const { createCanvas } = require("canvas");

const colorApiUrl = "https://www.thecolorapi.com/id?hex=";

function fetchApi(url, message) {
  let response = fetch(url)
    .then((data) => data.json())
    .then((data) => {
      let colorName = data.name.value;
      let colorHex = data.hex.value;

      createColorCanvas(colorHex, colorName);
      sendColor(message, colorHex);
    });
}
function sendColor(message, colorHex) {
  message.channel.send({
    content: `Color: \`${colorHex}\``,
    files: [`out.png`],
  });
}
function createColorCanvas(colorHex, colorName) {
  const canvas = createCanvas();
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  ctx.font = `bold 20vw Comic Sans MS`;
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(colorName, x, y);

  createWriteStream(canvas);
}
function createWriteStream(canvas) {
  const outDir = `${__dirname}/../../out.png`;
  const out = fs.createWriteStream(outDir);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on("finish", () => console.log("The PNG file was created."));
}
function generateRandomColor() {
  // generate random hex value
  let randCol = "";
  let chars = "0123456789abcdef";
  for (let i = 0; i < 6; i++) {
    randCol += chars[Math.floor(Math.random() * 16)];
  }
  const colorAppend = colorApiUrl + randCol;
  return colorAppend;
}

let obj = {
  name: "randomcolor",
  category: "Utility",
  description: "Gets a random color",
  run: async (client, message, args) => {
    let colorAppend = generateRandomColor();
    fetchApi(colorAppend, message);
  },
};

module.exports = obj;
