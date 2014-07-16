function Terminal(invalues, validvalues, func) {

    this.inValues = invalues || [1,2,3];
    this.validValues = validvalues || [1,2,3];
    this.program = 'function() {return 1;}';
    this.func = func || 'function() {return 1;}'; // jshint ignore:line
    this.status = false;
    this.verificationFunction = undefined;

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

    this._generateVerificationValues = function(verificationFunction) {

        if (typeof verificationFunction !== 'undefined') {
            eval('self.verificationFunction = ' + verificationFunction); // jshint ignore:line
        }

        var key;
        var verificationValues = self.verificationFunction();

        eval('var func = ' + self.func); // jshint ignore:line

        for(key in verificationValues) {
            var value = verificationValues[key];
            self.inValues.push(value);
            self.validValues.push(func(value));
        }

    };

    this._status = function() {
        return self.status;
    };

    this._process = function() {
        try {

            var func;

            eval('var func = '+self.program); // jshint ignore:line

            if (typeof func !== 'function') {
                throw new Error("System can accept functions only.");
            }

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
            throw e;
        }
    };

    return {
        get: this._get,
        program: this._program,
        status: this._status,
        process: this._process,
        verification: this._generateVerificationValues
    };
}

if ((typeof module) !== 'undefined') {
    module.exports.Terminal = Terminal;
}