<template>
  <context-grid player="red" />
</template>

<script>
import contextGrid from './components/contextGrid.vue';

export default {
  name: 'App',
  components: {
    contextGrid
  }
}
</script>

<style>
  body {
    margin: 0;
  }
</style>
