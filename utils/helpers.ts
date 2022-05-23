import fs from "fs";

export function readKey(key: string) {
  return fs.readFileSync(key).toString().trim();
}

export function convertStringArrayToBytes32(hooks: any, array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(hooks.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}
