const path = require('path');
const catchAsync = require('../utils/catchAsync');

const getHome = catchAsync(async (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/'));
});

module.exports = {
  getHome,
};
