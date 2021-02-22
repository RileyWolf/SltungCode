<template>
  <div>
    <Header/>
    <Sidebar/>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    Header
  }
}
</script>

<style>
</style>
