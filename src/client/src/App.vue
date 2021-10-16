<template>
  <context-grid :player="color" :game-id="gameId" />
</template>

<script>
import contextGrid from './components/contextGrid.vue';
import axios from 'axios';
import { mapMutations } from 'vuex';



export default {
  name: 'App',
  components: {
    contextGrid
  },
  data() {
    return {
      color: 'red',
      gameId: window.location.hash ? window.location.hash.substr(1) : '6152686219ccb8df400044d8'
    }
  },
  mounted() {
    // window.location.hash = '';
    const user = localStorage.getItem('user');
    axios.get(this.$hostname + 'g/'+this.gameId, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }})
      .then(response => {
        console.log(response.data);
        this.hydrateGame(response.data);

        const colors = ['red', 'blue', 'yellow'];
        for(let i = 0; i < colors.length; i++) {
          if (response.data.players[colors[i]].id === user) {
            this.color = colors[i];
            break;
          }
        }
      })
  },
  methods: {
    ...mapMutations([
      'hydrateGame'
    ]),
  }
}
</script>

<style>
  body {
    margin: 0;
  }
</style>
