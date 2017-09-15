const fs = require('fs');
const { resolve } = require('path');

const comment = fs.readFileSync(resolve(__dirname, './comment'), 'utf8');

module.exports = () => {
  console.log(comment);
};
