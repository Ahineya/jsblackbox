var chai = require('chai');
var Terminal = require('../js/terminal.js').Terminal;

describe('1 Terminal', function() {
    var t = new Terminal();
    it('1.1 Should create terminal object', function() {
        chai.assert((t instanceof Terminal), "Didn't create Terminal instance");
    });
});