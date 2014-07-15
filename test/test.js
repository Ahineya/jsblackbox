var chai = require('chai');
var Terminal = require('../js/terminal.js').Terminal;

describe('1 Terminal', function() {
    var t = new Terminal([1,2,3], [1,2,3]);
    it('1.1 Should create terminal object', function() {
        chai.assert((typeof t !== 'undefined'), "Didn't create Terminal instance");
    });

    it('1.2 should initialize with data', function() {
        chai.assert(t.get().input[0] === 1, "Input did't set correctly");
        chai.assert(t.get().input[1] === 2, "Input did't set correctly");
        chai.assert(t.get().input[2] === 3, "Input did't set correctly");

        chai.assert(t.get().valid[0] === 1, "Valid did't set correctly");
        chai.assert(t.get().valid[1] === 2, "Valid did't set correctly");
        chai.assert(t.get().valid[2] === 3, "Valid did't set correctly");
    });

    it('1.3 should be programmed', function() {
        chai.assert(t.program('(function(num) {return 1;})'), 'Terminal was not programmed');
    });

    it('1.4 should have false status before processing', function() {
        chai.assert(!t.status(), 'Status is incorrect');
    });

    it('1.5 should process incorrect program', function() {
        var values = t.process(); //[{value: 1, passed: true},{value: 1, passed: false},{value: 1, passed: false}]

        chai.assert(values[0].passed && (values[0].value === 1), "Incorrect processing");
        chai.assert(!values[1].passed && (values[1].value === 1), "Incorrect processing");
        chai.assert(!values[2].passed && (values[2].value === 1), "Incorrect processing");

    });

    it('1.6 should have false status after processing incorrect program', function() {
        chai.assert(!t.status(), 'Status is incorrect');
    });

    it('1.7 should be programmed again', function() {
        chai.assert(t.program('(function(num) {return num;})'), 'Terminal was not programmed');
    });

    it('1.8 should process correct program', function() {
        var values = t.process(); //[{value: 1, passed: true},{value: 2, passed: true},{value: 3, passed: true}]

        chai.assert(values[0].passed && (values[0].value === 1), "Incorrect processing");
        chai.assert(values[1].passed && (values[1].value === 2), "Incorrect processing");
        chai.assert(values[2].passed && (values[2].value === 3), "Incorrect processing");

    });

    it('1.9 should have true status after processing incorrect program', function() {
        chai.assert(t.status(), 'Status is incorrect');
    });

});