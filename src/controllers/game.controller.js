const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { gameService } = require('../services');

// const getGame = catchAsync(async (req, res) => {
//   const game = await gameService.getGameById(req.params.gameId);
//   if (!game) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   res.send(game);
// });

const getGame = async (req, res) => {
  const { gameId } = req.params;
  const game = await gameService.getGameById(gameId);
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }

  res.send(game);
};

const getGamesForUser = async (req, res, user) => {
  // req.headers.authorization = Bearer {{auth_token}};

  if (!user.games) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game list not found');
  }
  res.render('games', user);
};

const paint = async (req, res) => {
  const { id, x, y, color } = req.body;
  await gameService.updateGridSquare(id, x, y, color);
  res.send();
};

const updatePlayer = async (req, res) => {
  const { id, position } = req.body;
  await gameService.updatePlayer(id, req.params.player, position);
  res.send();
};

const incrementPlayerActions = async (req, res) => {
  const { id } = req.body;
  await gameService.incrementPlayerActions(id, req.params.player);
  res.send();
};

const grantActions = async (req, res) => {
  // get startTime with req.params.gameId

  //gameService.grantActions(startTime)
  res.send();
};

module.exports = {
  getGame,
  getGamesForUser,
  paint,
  updatePlayer,
  incrementPlayerActions,
  grantActions
};
