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
  // gameId, x, y, color
  const { id, x, y, color } = req.body;
  // console.log(req);
  // console.log(gameId, x, y, color);
  await gameService.updateGridSquare(id, x, y, color);
  // console.log(req.body)
  res.send();
};

// const updateGame = catchAsync(async (req, res) => {
//   const user = await gameService.updateGameById(req.params.userId, req.body);
//   res.send(user);
// });

// const login = catchAsync(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await authService.loginUserWithEmailAndPassword(email, password);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.render('game', { user, tokens });
// });

module.exports = {
  getGame,
  getGamesForUser,
  paint,
};
