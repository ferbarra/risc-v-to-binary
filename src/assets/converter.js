import formats from '../instructionFormat.js'
import registerNumbers from '../registryFormat.js'

function riscvToBinary(instructionString) {
  // decode the string represeting the instruction
  let mnemonic = instructionString.match(/\w+/);
  if (mnemonic.length == 0) {
    return '000';
  }
  let format = formats[mnemonic];
  let type = format.type;

  let binary;

  switch (type) {
    case 'R':
      binary = decodeRInstruction(instructionString);
      break;
    case 'I':
      binary = decodeIInstruction(instructionString);
      break;
    case 'S':
      binary = decodeSInstruction(instructionString);
      break;
    default:
      return;
  }

  return binary;
}

function decodeRInstruction(instructionString) {
  /*
   * all R instructions follow the same format.
   * mnemonic rd, rs1, rs2
   */
  
  // verify that the instruction string is in the correct format
  let typeRFormat = /^\s*\w+\s+\w+\s*,\s*\w+\s*,\s*\w+\s*$/;

  if (!typeRFormat.test(instructionString)) {
    return false
  }
  // extract the registers
  let tokensRegex = /\w+/g;
  let tokens = instructionString.match(tokensRegex);
  // ignore the the opcode (first token)
  let registers = tokens.slice(1, tokens.length);

  // get the register numbers if they are in mnemonic form 
  let registerNumbers = registers.map(registerNumber);
  let registersBinary = registerNumbers.map(decimalToBinary);
  let registersBinaryExtended = registersBinary 
    .map(r => { return extendBinary(r, 5, false) });
  
  console.log(registersBinaryExtended);
  
  return instructionString;
}

function decodeIInstruction(instructionString) {
  return instructionString;
}

function decodeSInstruction(instructionString) {
  return instructionString;
}

/**
 * Finds the register number corresponding to the register name
 */
function registerNumber(register) {
  
  // if the register name has the form x[0-31]
  if (/^x\d{1,2}$/.test(register)) {
    // extract the register number from the name
    return register.match(/\d+/)[0];
  }

  let registerXName = registerNumbers[register];

  if (registerXName === undefined) {
    return null;
  }
  
  return registerXName.match(/\d+/)[0];
}

function decimalToBinary(decimal) {
  return (decimal >>> 0).toString(2);
}

/*
 * Adds padding to the left of a binary number so that
 * it has the specified length. If specified, the
 * padding will preserve sign. When the desired length
 * is less than the current length nothing changes.
 * @param {string} binary Binary number representation
 * @param {number} length Length of binary after extension
 */
function extendBinary(binary, length, preserveSign) {
  let currentLength = binary.length;
  if (currentLength >= length) {
    return binary;
  }
  binary = binary.split('');
  let paddingDigit =  preserveSign ? binary[0] : '0';
  let paddingLength = length - currentLength;

  for (let i = 0; i < paddingLength; ++i) {
    binary.unshift(paddingDigit);
  }

  return binary.join('');
}

export default riscvToBinary
