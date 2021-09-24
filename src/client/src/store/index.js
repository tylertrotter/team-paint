import { createStore } from 'vuex';
import grid from './grid';

export const store = createStore({
  state () {
    return {
      grid,
      game: {
        start: 'date',
        players: {
          red: {
            name: 'Tyler',
            position: {
              x: 1,
              y: 0
            },
            movesGranted: 233,
            movesUsed: 44
          },
          blue: {
            name: 'Nate',
            position: {
              x: 2,
              y: 2
            },
            movesGranted: 23,
            movesUsed: 1
          },
          yellow: {
            name: 'Daniel',
            position: {
              x: 5,
              y: 5
            },
            movesGranted: 23,
            movesUsed: 44
          }
        }
      }
    }
  },
  mutations: {
    paint(state, p) {
      state.grid[p.y][p.x] = p.color;
    },
    movePlayer(state, p) {
      state.game.players[p.player].position = p.position;
    }
  }
})