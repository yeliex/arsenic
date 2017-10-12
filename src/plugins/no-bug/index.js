const fs = require('fs');
const { resolve } = require('path');

const comment = fs.readFileSync(resolve(__dirname, './comment'), 'utf8');

module.exports = (app) => {
  if (app.config.nobug) {
    console.log(comment);
  }
};
