export default {
  computed: {
    getActionsLeft() {
      return this.$store.state.players[this.player].movesGranted - this.$store.state.players[this.player].movesUsed;
    }
  }
}