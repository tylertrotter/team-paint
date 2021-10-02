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
  if (!user.games) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game list not found');
  }
  res.render('games', user);
};

const updateGame = catchAsync(async (req, res) => {
  const user = await gameService.updateGameById(req.params.userId, req.body);
  res.send(user);
});

// const login = catchAsync(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await authService.loginUserWithEmailAndPassword(email, password);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.render('game', { user, tokens });
// });

module.exports = {
  getGame,
  getGamesForUser,
  updateGame,
};
