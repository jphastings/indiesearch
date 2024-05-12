import util  from 'util';
import { exec as unPromisedExec } from 'child_process';
const exec = util.promisify(unPromisedExec);

const toolbarSizes = [16, 19, 32, 38, 48, 64, 72];
const appIconSizes = [48, 96, 128, 256, 512];

main();

async function main() {
  await Promise.all(toolbarSizes.map(size => generatePng("toolbar", size)));
  await Promise.all(appIconSizes.map(size => generatePng("app_icon", size)));
}

async function generatePng(name, size) {
  return exec(`rsvg-convert -h ${size} images/${name}.svg > images/${name}_${size}px.png`)
}
