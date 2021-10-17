<template>
<div v-if="!player">Loading...</div>
<div v-else class="context-grid">
  <div class="context-grid__container" :data-move="move">
    <div class="player" :class="'player--' + player" />
    <div v-for="(row, y) in contextGrid" :key="y" class="context-grid__y">
      <div 
        v-for="(color, x) in row" 
        :key="x"
        class="context-grid__x"
        :class="[{'is-space': color}, {'is-occupied': y === 6 && x === 6}, {[player]: y === 6 && x === 6}]"
        >
          <div v-if="color && color !== '#fff'" :style="`background-color: ${color};`" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import axios from 'axios';
  // const GRID_WIDTH = 300;
  // const GRID_HEIGHT = 300;
  const CONTEXT_GRID_SIZE = 11;
  const CONTEXT_GRID_BUFFER = 2;
  const PRIMARY_COLORS = {
    red: 'hsl(0 90% 50%)',
    blue: 'hsl(222 90% 50%)',
    yellow: 'hsl(60 90% 50%)'
  }
  const HEADERS = { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') };

  export default {
    name: 'contextGrid',
    props: {
      player: {
        default: 'yellow',
        type: String
      },
      gameId: {
        default: null,
        type: String
      }
    },
    data() {
      return {
        move: null,
        timer: null
      }
    },
    created() {
      document.addEventListener('keyup', this.handleKeyUp);
    },
    beforeUnmount() {
      document.removeEventListener('keyup', this.handleKeyUp);
    },
    mounted() {
    },
    computed: {
      getPlayer() {
        return this.$store.state.players[this.player];
      },
      contextGrid() {
        const wholeGrid = this.$store.state.grid;
        const contextGridAndBuffer = CONTEXT_GRID_SIZE + CONTEXT_GRID_BUFFER;
        const startX = this.getPlayer.position.x - Math.ceil(contextGridAndBuffer / 2);
        const endX = this.getPlayer.position.x + Math.ceil(contextGridAndBuffer / 2);
        const startY = this.getPlayer.position.y - Math.ceil(contextGridAndBuffer / 2);
        const endY = this.getPlayer.position.y + Math.ceil(contextGridAndBuffer / 2);
        const contextGrid = [];

        let yI = (CONTEXT_GRID_BUFFER / 2) * -1;
        let xI;
        for (let y = startY; y < endY; y++) {
          contextGrid[yI] = [];

          xI = (CONTEXT_GRID_BUFFER / 2) * -1;
          if (y >= 0) {
            for (let x = startX; x < endX; x++) {
              contextGrid[yI][xI] = x >= 0 ? wholeGrid[y][x] : null;
              xI++;
            }
          } 
          else {
            for(let i = 0; i < contextGridAndBuffer; i++)
              contextGrid[yI].push(null);
          }
          yI++;
        }
        return contextGrid;
      }
    },
    methods: {
      ...mapMutations([
        'paint',
        'movePlayer'
      ]),
      handlePaint() {
        const payload = {
          id: this.gameId,
          x: this.getPlayer.position.x,
          y: this.getPlayer.position.y,
          color: this.getColor(PRIMARY_COLORS[this.player])
        }
        this.paint(payload);
        axios({ 
          url: this.$hostname + 'g/paint', 
          method: 'post',
          headers: HEADERS,
          data: payload
        });
      },
      handleKeyUp(e) {
        if (this.move)
          return;
          
        if (e.code === 'ArrowRight')
          this.moveGrid('left');
        else if (e.code === 'ArrowLeft')
          this.moveGrid('right');
        else if (e.code === 'ArrowUp')
          this.moveGrid('down');
        else if (e.code === 'ArrowDown')
          this.moveGrid('up');
        else if (e.code === 'Space')
          this.handlePaint();
      },
      moveGrid(direction) {
        this.move = direction;
        const moveX = direction === 'left' ? 1 : direction === 'right' ? -1 : 0;
        const moveY = direction === 'up' ? 1 : direction === 'down' ? -1 : 0;
        const position = {
          x: this.getPlayer.position.x + moveX,
          y: this.getPlayer.position.y + moveY
        };

        axios({ 
          url: this.$hostname + 'g/update-player/'+this.player, 
          method: 'post',
          headers: HEADERS,
          data: {
            id: this.gameId,
            position
          }
        });
          
        this.timer = setTimeout(()=> {
          this.movePlayer({
              player: this.player,
              position
            });
          
          // actually move grid
          this.move = null;
        }, 400)
      },
      getColor(paintedColor) {
        const grid = this.$store.state.grid;

        const currentColor = grid[this.getPlayer.position.y][this.getPlayer.position.x];
        const current = currentColor === '#fff' ? null : this.getHSL(currentColor);
        const painted = this.getHSL(paintedColor);
        return `hsl(${current ? this.getH(current.H, painted.H) : painted.H} 90% ${current ? this.getL(current.L, painted.L) : '90%'})`;
      },
      getHSL(hslString) {
        const hslParts = hslString.replace('hsl(', '').replace(')', '').replace(',', '').replace(/%/g, '').split(' ');
        return {
          H: +hslParts[0],
          S: +hslParts[1],
          L: +hslParts[2]
        }
      },
      getH (currentH, paintedH) {
        if (currentH !== 0 && !currentH)
          return paintedH;
        const wrapAroundWheel = Math.abs(currentH - paintedH) > 180 ? 180 : 0;
        return (currentH + paintedH) / 2 + wrapAroundWheel;
      },
      getL (currentL) {
        return Math.max(currentL - 10, 50) + '%';
      }
    }
  }
</script>

<style>
  [data-move] {
    transition: .2s;
  }

  [data-move] .player {
    transition: .4s;
  }

  :root:root [data-move='left'] {
    transform: translate(calc(-100% / var(--adjusted-grid-size) - (100% / var(--adjusted-grid-size))), calc(-100% / var(--adjusted-grid-size)));
  }

  [data-move='left'] .player {
    /* Why is this number 25? */
     transform: scale(1.05) translate(25%, -50%);
  }

  :root:root [data-move='up'] {
    transform: translate(calc(-100% / var(--adjusted-grid-size)), calc(-100% / var(--adjusted-grid-size) - (100% / var(--adjusted-grid-size))));
  }

  [data-move='up'] .player {
     transform: scale(1.05) translate(-50%, 25%);   
  }

  :root:root [data-move='right'] {
    transform: translate(0, calc(-100% / var(--adjusted-grid-size)));
  }

  [data-move='right'] .player {
     transform: scale(1.05) translate(-120%, -50%);
  }

  :root:root [data-move='down'] {
    transform: translate(calc(-100% / var(--adjusted-grid-size)), 0);
  }

  [data-move='down'] .player {
     transform: scale(1.05) translate(-50%, -120%);   
  }

  .context-grid {
    overflow: hidden;
    position: absolute;
    padding-bottom: 100%;
    height: 0;
    width: 100%;

    /* overflow: visible; */
    /* transform: scale(.7); */
    /* outline: 3px solid red; */
  }

  .context-grid__container {
    opacity: .9;
    --context-grid-size: 11;
    --adjusted-grid-size: 13;
    --grid-square-width: calc(100% / var(--context-grid-size));
    background: repeating-linear-gradient(
      45deg,
      white, 
      white 1px,
      #ddd 2px,
      #ddd 3px,
      white 3px,
      white 4px
    );
    width: calc(100% + (var(--grid-square-width) * 2));
    transform: translate(calc(-100% / var(--adjusted-grid-size)), calc(-100% / var(--adjusted-grid-size)));

  }

  .context-grid__y {
    display: flex;
  }
  
  .context-grid__x {
    position: relative;
    width: calc(100% / var(--adjusted-grid-size));
    padding-bottom: calc(100% / var(--adjusted-grid-size));
  }

  .context-grid__x.is-space {
    outline: 1px dashed #aaa;
    background: white;
  }

  @keyframes paint {
    0% { transform: scale(.3); }
    100% { transform: scale(1); }
  }

  .context-grid__x > div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    transform: scale(.9);
  }

  .context-grid__x.is-occupied > div {
    animation: paint .2s;
  }

  .player {
    position: absolute;
    width: var(--grid-square-width);
    height: 0;
    padding-bottom: var(--grid-square-width);
    border-radius: 50%;
    /* transform: scale(1.1); */
    border: 5px solid transparent;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    box-shadow: inset 0 0 0 2px white, 0 0 0 2px white;
  }

  .player--red {
    border-color: red;
  }

  .player--blue {
    border-color: blue;
  }

  .player--yellow {
    border-color: yellow;
  }
</style>