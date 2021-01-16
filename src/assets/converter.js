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
    return null;
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

  // formatted register ready to be assembled
  let rd = registersBinaryExtended[0];
  let rs1 = registersBinaryExtended[1];
  let rs2 = registersBinaryExtended[2];

  let mnemonic = tokens[0];
  let instructionFormat = formats[mnemonic];
  let { opcode, funct3, funct7 } = instructionFormat;

  let binary = assemble([
    {
      source: opcode,
      start: 0,
      end: opcode.length - 1,
      destination: 0,
    },
    {
      source: rd,
      start: 0,
      end: rd.length - 1,
      destination: 7,
    },
    {
      source: rs1,
      start: 0,
      end: rs1.length - 1,
      destination: 15,
    },
    {
      source: rs2,
      start: 0,
      end: rs2.length - 1,
      destination: 20
    },
    {
      source: funct3,
      start: 0,
      end: funct3.legth - 1,
      destination: 12,
    },
    {
      source: funct7,
      start: 0,
      end: funct7.length - 1,
      destination: 25,
    }
  ]);

  return binary.reverse.join('');
}

function decodeIInstruction(instructionString) {
  return instructionString;
}

function decodeSInstruction(instructionString) {
  // All S instructions have this format:
  // mnemonic rs2, immidiate(rs1)
  // where immidiate is an integer.
  let typeSFormat = /^\s*\w+\s+\w+\s*,\s*\d+\s*\(\s*\w+\s*\)\s*$/;
  if (!typeSFormat.test(instructionString)) {
    return null;
  }
  let tokensRegex = /\w+/g;
  let tokens = instructionString.match(tokensRegex);
  let registers = [ tokens[1], tokens[3] ];
  
  // get the register numbers
  let registerNumbers = registers.map(registerNumber);
  let registersBinary = registerNumbers.map(decimalToBinary);
  let registersBinaryExtended = registersBinary 
    .map(r => { return extendBinary(r, 5, false) });

  let rs1 = registersBinaryExtended[1];
  let rs2 = registersBinaryExtended[0];
  
  let immidiate = extendBinary(decimalToBinary(immidiate), 12, true);

  let mnemonic = tokens[0];
  let { opcode, funct3 } = formats[mnemonic];

  let binary = assemble([
    {
      source: opcode,
      start: 0,
      end: 6,
      destination: 0,
    },
    {
      source: immidiate,
      start: 0,
      end: 4,
      destination: 7,
    },
    {
      source: funct3,
      start: 0,
      end: 2,
      destination: 12,
    },
    {
      source: rs1,
      start: 0,
      end: 4,
      destination: 15,
    },
    {
      source: rs2,
      start: 0,
      end: 4,
      destination: 20,
    },
    {
      source: immidiate,
      start: 5,
      end: 11,
      destination: 25,
    },
  ]);

  return binary.reverse().join('');
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

/*
 * Creates an array made up of parts of other arrays.
 * @param {Array.<{
 *    source: string,
 *    start: number,
 *    end: number,
 *    destination: number}>} components - Index is 0 base
 * @returns {Array} Array formed by the components provided.
 */
function assemble(components) {
  let result = [];
  for (let component of components) {
    let { source, start, end, destination } = component;
    while (start <= end) {
      result[destination] = source[start];
      ++start;
      ++destination;
    }
  }
  return result;
}

export default riscvToBinary
