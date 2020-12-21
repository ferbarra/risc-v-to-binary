<template>
  <div id="app">
    <Converter/>
  </div>
</template>

<script>
import Converter from './components/converter.vue'

export default {
  name: 'App',
  components: {
    Converter
  }
}
</script>

<style>
body {
  background-color: black;
  color: white;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
</style>
