const { parseString, Builder } = require('xml2js');

const builder = new Builder({ cdata: 'force', headless: true, rootName: 'xml' });

function toJSON(input, options) {
  return new Promise((resolve, reject) => {
    parseString(input, Object.assign({}, { explicitArray: false, ignoreAttrs: true }, options), (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res.xml);
    });
  });
}

const toXML = input => builder.buildObject(input);

/* eslint no-extend-native: 0 */
Object.defineProperty(String.prototype, 'parseXML', {
  value: function* parseXML(options) {
    return yield toJSON(this, options);
  },
  enumerable: false
});

Object.defineProperty(Object.prototype, 'toXML', {
  value: function stringifyJSON() {
    return toXML(this);
  },
  enumerable: false
});

const XML = {
  toJSON,
  toXML
};

module.exports = XML;
