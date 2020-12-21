import formats from '../instructionFormat.js'

function riscvToBinary(instructionString) {
  let instruction = instructionString.split(' ');
  let mnemonic = instruction[0];
  let format = formats[mnemonic];
  let opcode = format.opcode;

	let binary = opcode;
  return binary;
}

export default riscvToBinary
