<template>
  <div>
    <Sidebar  style="float:left; position: relative;" />
    <!-- <div id="div1"/>
    <div id="div2"/> -->
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Sidebar
  }
}
</script>

<style>
#div1 {
  width: 270px;
  height: 1025px;
  background: #202A39;
  float:left;
}
#div2 {
  width: 650px;
  height: 1025px;
  background: #3b72b1;
  float:left;
}
</style>
