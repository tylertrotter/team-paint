const httpStatus = require('http-status');
const { Game } = require('../models');
const ApiError = require('../utils/ApiError');

// /**
//  * Create a user
//  * @param {Object} userBody
//  * @returns {Promise<User>}
//  */
// const createUser = async (userBody) => {
//   if (await User.isEmailTaken(userBody.email)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   return User.create(userBody);
// };

// /**
//  * Query for users
//  * @param {Object} filter - Mongo filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<QueryResult>}
//  */
// const queryUsers = async (filter, options) => {
//   const users = await User.paginate(filter, options);
//   return users;
// };

/**
 * Get game by id
 * @param {ObjectId} id
 * @returns {Promise<Game>}
 */
const getGameById = async (id) => {
  return Game.findById(id);
};

// /**
//  * Get user by email
//  * @param {string} email
//  * @returns {Promise<User>}
//  */
// const getUserByEmail = async (email) => {
//   return User.findOne({ email });
// };

/**
 * Update game by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateGridSquare = async (gameId, x, y, color) => {
  const game = await getGameById(gameId);
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }
  await game.updateOne({ $set: { [`grid.${y}.${x}`]: color } });
  return game;
};

const updatePlayer = async (gameId, player, position) => {
  const game = await getGameById(gameId);
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }
  await game.updateOne({ $set: { [`players.${player}.position`]: position } });
  return game;
};

const incrementPlayerActions = async (gameId, player) => {
  const game = await getGameById(gameId);
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }
  await game.updateOne({ $inc: { [`players.${player}.movesUsed`]: 1 } });
  return game;
};

const grantActions = async (startTime) => {
  // get currentHour
  // endHour = startTime + 240 hrs
  // if (currentHour < endHour)
  //   elapsedHours = currentHour - startTime
  //   grantedActions = elapsedHours * 100

  // update `movesGranted` with grantedActions;
};

// /**
//  * Delete user by id
//  * @param {ObjectId} userId
//  * @returns {Promise<User>}
//  */
// const deleteUserById = async (userId) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   await user.remove();
//   return user;
// };

module.exports = {
  getGameById,
  updateGridSquare,
  updatePlayer,
  incrementPlayerActions,
  grantActions,
};
