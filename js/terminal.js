function Terminal(invalues, validvalues) {

    this.inValues = invalues || [1,2,3];
    this.validValues = validvalues || [1,2,3];
    this.program = '(function() {return 1;})';
    this.status = false;

    var self = this;

    this._get = function() {
        return {
            input: self.inValues,
            valid: self.validValues
        };
    };

    this._program = function(program) {
        if (program !== '') {
            self.program = program;
            return true;
        }

        return false;
    };

    this._status = function() {
        return self.status;
    };

    this._process = function() {
        try {
            var func = eval(self.program); // jshint ignore:line

            var result = [];

            var status = true;

            for (var i = 0; i < self.inValues.length; i++) {
                var value = func(self.inValues[i]);
                var st = value === self.validValues[i];
                result.push({
                    value: value,
                    passed: st
                });

                if (!st) {
                    status = false;
                }

            }

            self.status = status;

            return result;

        } catch (e) {
            return e.toString();
        }
    };

    return {
        get: this._get,
        program: this._program,
        status: this._status,
        process: this._process
    };
}

if ((typeof module) !== 'undefined') {
    module.exports.Terminal = Terminal;
}