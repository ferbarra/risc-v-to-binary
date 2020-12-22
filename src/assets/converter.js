import formats from '../instructionFormat.js'

function riscvToBinary(instructionString) {
  let instruction = instructionString.split(' ');
  let mnemonic = instruction[0];
  let format = formats[mnemonic];
  let opcode = format.opcode;
  let rd = instruction[1];
  let rs1 = instruction[2];
  let rs2 = instruction[3];

	let binary = opcode;
  return binary;
}

export default riscvToBinary
