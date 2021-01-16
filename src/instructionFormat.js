var formats = {
  'add': {
    type: 'R',
    opcode: '0110011',
    funct3: '000',
    funct7: '0000000',
  },
  'sll': {
    type: 'R',
    opcode: '0110011',
    funct3: '001',
    funct7: '0000000',
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
    opcode: '0100011',
    funct3: '010',
  },
};

export default formats
