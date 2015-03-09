var gobble = require('gobble');

module.exports = gobble('src').transform('babel', {blacklist: ['regenerator'], optional: ['asyncToGenerator']});