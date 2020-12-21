<template>
  <div id="converter">
    <form>
      <p>{{ riscv }}</p>
      <input type="text" v-model="riscv" />           
      <button type="button" v-on:click="updateBinaryRepresentation">To Binary</button>
    </form>
    <p>{{ binary }}</p>
  </div>
</template>

<script>
import riscvToBinary from '../assets/converter.js';
export default {
  name: 'Converter',
  data() {
    return {
      riscv: "",
      binary: ""
    }
  },
  methods: {
    updateBinaryRepresentation() {
      let riscvInstruction = this.riscv;
      this.binary = riscvToBinary(riscvInstruction);
    }
  }
}
</script>

<style lang="scss">
#converter {
  background-color: "dark-grey";
}
</style>
