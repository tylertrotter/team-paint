import { createStore } from 'vuex';

// for serverless dev
import grid from './grid';
import players from './players';

export const store = createStore({
  state () {
    return {
      grid: grid,
      start: null,
      players: players
    }
  },
  mutations: {
    hydrateGame(state, p) {
      state.grid = p.grid;
      state.players = p.players;
      state.start = p.start;
    },
    paint(state, p) {
      state.grid[p.y][p.x] = p.color;
    },
    movePlayer(state, p) {
      state.players[p.player].position = p.position;
    },
    incrementActions(state, p) {
      state.players[p.player].movesUsed = state.players[p.player].movesUsed + 1;
    }
  }
})