var formats = {
  'add': {
    type: 'R',
    opcode: '0110011'
  },
  'addi': {
    type: 'I',
    opcode: '0010011'
  },
  'lw': {
    type: 'I',
    opcode: '0000011'
  },
  'sw': {
    type: 'S',
    opcode: '0100011'
  },
}

export default formats
