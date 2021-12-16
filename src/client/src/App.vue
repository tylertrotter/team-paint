<template>
  <div class="game">
    <context-grid :player="color" :game-id="gameId" />
    <meta-data :player="color" />
  </div>
</template>

<script>
import contextGrid from './components/contextGrid.vue';
import metaData from './components/metaData.vue';
import axios from 'axios';
import { mapMutations } from 'vuex';



export default {
  name: 'App',
  components: {
    contextGrid,
    metaData
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
    background: #ddd;
    overflow: hidden;
    font-family: Arial, Helvetica, sans-serif;
  }

  .game {
    margin: 0 auto;
  }

  .context-grid {
    max-width: 100vh;
  }

  @media (min-aspect-ratio: 100/78) {
    .game {
      display: flex;
      width: calc(100vh + 200px);
    }
    .meta-data {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 200px;
      height: 100vh;
    }

  }

  @media (max-aspect-ratio: 100/78) {
    .game {
      height: calc(100vh - 200px);
    }
  }

</style>
