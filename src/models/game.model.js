const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const gameSchema = mongoose.Schema({
  players: {
    red: {
      name: String,
      position: {
        x: Number,
        y: Number,
      },
      movesGranted: Number,
      movesUsed: Number,
    },
    blue: {
      name: String,
      position: {
        x: Number,
        y: Number,
      },
      movesGranted: Number,
      movesUsed: Number,
    },
    yellow: {
      name: String,
      position: {
        x: Number,
        y: Number,
      },
      movesGranted: Number,
      movesUsed: Number,
    },
  },
  start: Date,
  grid: Array,
});
// add plugin that converts mongoose to json
gameSchema.plugin(toJSON);
gameSchema.plugin(paginate);

// /**
//  * Check if password matches the user's password
//  * @param {string} password
//  * @returns {Promise<boolean>}
//  */
// userSchema.methods.isPasswordMatch = async function (password) {
//   const user = this;
//   return bcrypt.compare(password, user.password);
// };

// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

/**
 * @typedef Game
 */
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
