<template>
  <div class="meta-data">
    <div class="meta-data__moves">
      Actions <span class="meta-data__action-number"> {{ getActionsLeft }} </span>
    </div>

    <div class="meta-data__other-stuff">
      <ul class="meta-data__players">
        <li v-for="player in ['red', 'blue', 'yellow']" :key="player">
          <div class="meta-data__player-color" :style="`background: ${getColor(player)};`"></div> 
          {{ getUserName(player) }}
        </li>
      </ul>
      <small class="meta-data__date">{{ formatDate(startDate) }}</small>
    </div>
  </div>
</template>

<script>
  import PRIMARY_COLORS from '/src/primaryColors';
  import getActionsLeft from '/src/mixins/get-actions-left';

  export default {
    name: 'MetaData',
    mixins: [getActionsLeft],
    props: {
      player: {
        type: String,
        default: null
      }
    },
    methods: {
      getColor(color) {
        return PRIMARY_COLORS[color];
      },
      getUserName(color) {
        return this.players[color].name;
      },
      formatDate(date) {
        const d = new Date(date);
        const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      }
    },
    computed: {
      players() {
        return this.$store.state.players;
      },
      startDate() {
        return this.$store.state.start;
      },    
    }
  }
</script>

<style>
  .meta-data {
    background: transparent;
    padding: 20px;
  }

  .meta-data__action-number {
    font-weight: bold;
    font-size: 20px;
  }

  .meta-data__players {
    text-align: left;
    list-style: none;
    padding-left: 0;
  }

  .meta-data__players li + li {
    margin-top: .3em;
  }

  .meta-data__player-color {
    display: inline-block;
    width: .8em;
    height: .8em;
    border-radius: 50%;
    background: gray;
    border: 2px solid white;
    margin-right: .2em;
    vertical-align: top;
  }

</style>