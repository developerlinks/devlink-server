const { request } = require('@devlink/cli-utils');

module.exports = function () {
  return request({
    url: '/material',
  });
};
