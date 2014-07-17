/*! jsblackbox - v0.0.2 - 2014-07-17
* http://jsblackbox.tk
* Copyright (c) 2014 ; Licensed  */
/*global window: false, localStorage: false, jQuery: false, Terminal: false */

(function($) {

    var levelsArr;
    var currentLevel = 0;

    $.get('levels/levels.jsbl').success(function(levels) {

        var templevels = '';
        for (var i = 0; i<levels.length; i++) {

            templevels +=String.fromCharCode(((levels.charCodeAt(i) ^ 7))); // jshint ignore:line

        }

        levels = JSON.parse(templevels);

        draw(levels);

        window.onresize = function() {
            draw(levels);
            $('.panel').css({
                'height': $('.level-container').height() - $('.description-wrapper').height() - 75 + 'px'
            });
        };

    });

    function draw(levels) {

        $('.level-circle').hide().remove();

        var count = 0;

        var l;

        levelsArr = [];

        var wonLevels = JSON.parse(localStorage.getItem('wonLevels')) || [];

        for (l in levels) {
            count++;
            levelsArr.push(levels[l]);
        }

        var dimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        var center = {
            x: dimensions.width / 2,
            y: dimensions.height / 2
        };

        var diameter =
            dimensions.height < dimensions.width ?
                (dimensions.height / 100 * 75) :
                (dimensions.width / 100 * 75);

        var x = (dimensions.width - diameter) / 2;
        var y = (dimensions.height - diameter)  / 2;

        var circle = $('.circle').length > 0 ? $('.circle') : $('<div></div>');
            circle.css({
                position: 'absolute',
                width: diameter + 'px',
                height: diameter + 'px',
                border: '1px solid green',
                left: x + 'px',
                top:  y + 'px',
                borderRadius: '50%'
            }).addClass('circle')
                .appendTo( $('.circle-container') );

        var delta = Math.PI * 2 / count;
        var angle = 0;

        var i = 0;

        for (l in levels) {

            var d = $('<div></div>')
                .css({
                    position: 'absolute',
                    left:  center.x + (diameter/2 * Math.cos(angle)) - diameter / 20 + 'px',
                    top: center.y + (diameter/2 * Math.sin(angle)) - diameter / 20 + 'px',
                    backgroundColor: wonLevels.indexOf(i) !== -1 ? 'lightgreen' : '#ccc', //levels[l].color || 'white',
                    width: diameter / 10 + 'px',
                    height: diameter / 10 + 'px',
                    border: '1px solid green',
                    borderRadius: '50%'
                })
                .hide()
                .addClass('level-circle')
                .append(
                    $('<p></p>')
                        .text(i+1)
                        .css({
                            display: 'block',
                            margin: '0px auto',
                            position: 'relative',
                            width: '10px'
                        })
                );

            d.find('p')
                .css({
                    marginTop: (parseInt(d.height())/2  - parseInt(d.find('p').height() ) /2 ) /2 + 'px' //Waaagh!
                });

            d.attr('data-level', levels[l].id);

            /* jshint ignore:start */
            (function(i) {
                d.off('click').on('click', function() {
                    /* jshint ignore:end */
                    currentLevel = i;
                    loadLevel(levelsArr[i]);
                    /* jshint ignore:start */
                });
            })(i);
            /* jshint ignore:end */

            d.appendTo( $('.circle-container')).show();

            angle += delta;

            i++;
        }

    }

    $('.cross').click(function() {
        toggleContainer('close');
    });

    $('.cross-popup').click(function() {
        $('.info').hide();
    });

    $('.js-info').click(function() {
        $('.info').show();
        $('.overview').show();
        $('.select-level').show();

        $('.comments').hide();
        $('.finish').hide();
    });

    $('.js-disqus').click(function() {
        $('.info').show();
        $('.overview').hide();
        $('.select-level').hide();
        $('.finish').hide();

        $('.comments').show();
    });

    $('.select-level').click(function() {
        $('.info').hide();
        toggleContainer('close');
    });

    function loadLevel(level) {

        $('.success-wrapper').hide();
        $('.tuning').find('tr').remove();
        $('.console').text('function(param) {return 1;}');
        $('.message').text('');
        $('.error').hide();

        $('.name').text('Terminal: ' + level.id);
        $('.message').html(level.description);

        $('.next').off('click').on('click', function () {
            currentLevel++;
            if (typeof levelsArr[currentLevel] !== 'undefined') {
                loadLevel(levelsArr[currentLevel]);
            } else {
                toggleContainer('hide');
                $('.comments').hide();
                $('.overview').hide();
                $('.finish').show();
                $('.info').show();
            }
        });

        level.input = level.input.slice(0,3);
        level.output = level.output.slice(0,3);

        var t = new Terminal(level.input, level.output, level.func);

        t.verification(level.verFunc);

        for (var i = 0; i < t.get().input.length; i++) {
            var row = $('<tr></tr>');

            var inputTd = $('<td></td>').text(level.input[i]);
            var outputTd = $('<td></td>');
            var expectedTd = $('<td></td>').text(level.output[i]);

            row.append(inputTd)
                .append(outputTd)
                .append(expectedTd);

            row.appendTo($('.tuning'));

        }

        (function (t) {

            $('.run').off('click').on('click', function () {

                var $error = $('.error');
                var $tuning = $('.tuning');

                $error.hide();

                t.program($('.console').text());

                try {
                    t.process(); //TODO: refactor this goto/labels. Shame on me.

                    t.verification();

                    var values = t.process();

                    $tuning.find('tr').remove();

                    for (var i = 0; i < t.get().input.length; i++) {
                        var row = $('<tr></tr>');

                        var inputTd = $('<td></td>').text(level.input[i]);
                        var outputTd = $('<td></td>')
                            .text(values[i].value)
                            .css({
                                backgroundColor: values[i].passed ? '#27ae60' : '#e74c3c'
                            });
                        var expectedTd = $('<td></td>').text(level.output[i]);

                        row.append(inputTd)
                            .append(outputTd)
                            .append(expectedTd);

                        row.appendTo($tuning);

                    }

                    if (t.status()) {
                        $error.hide();
                        $('.success').css({
                            marginTop: ($('.success-wrapper').height() / 2 - $('.success').height() / 2) / 2 + 'px'
                        });
                        $('.success-wrapper').show();

                        var wonLevels = JSON.parse(localStorage.getItem('wonLevels')) || [];
                        if (wonLevels.indexOf(i) === -1) {
                            wonLevels.push(currentLevel);
                            localStorage.setItem('wonLevels', JSON.stringify(wonLevels));
                        }

                        $('div[data-level='+levelsArr[currentLevel].id.replace(/\./g, '\\.')+']').css({
                            backgroundColor: 'lightgreen'
                        });
                    }

                } catch (e) {
                    $error.text('# ' + e.toString());
                    $error.show();
                }


            });
        })(t);

        toggleContainer('open', undefined, function() {
            $('.panel').css({
                'height': $('.level-container').height() - $('.description-wrapper').height() - 75 + 'px'
            });
        });


    }

    /*function getValueTd(rowIndex, column) {
        switch (column) {
            case 'input':
                column = 0;
                break;
            case 'output':
                column = 1;
                break;
            case 'expected':
                column = 2;
        }
        return $('.tuning')
            .find('tr')
            .eq(rowIndex)
                .find('td')
                .eq(column);
    }*/

    function toggleContainer(action, container, callback) {
        if (action.data) {
            action = action.data.action;
        }

        if (typeof container === 'undefined') {
            container = $('.level-container');
        }

        if (action === 'open') {
            container.show();
            container.animate({
                top: '10%',
                height: '90%'
            }, 100, function() {
                if (typeof callback !== 'undefined') {
                    callback();
                }
            });
        } else {
            container.animate({
                height: '0%',
                top: '100%'
            }, 100, function() {container.hide();});
        }
    }

    $(window).on('scroll', function(event) {
        event.preventDefault();
        window.scrollTo(0, 0);
    });

})(jQuery);

if ((typeof module) !== 'undefined') {
    var _ = require('underscore');
}

function Terminal(invalues, validvalues, func) {

    this.inValues = invalues || [1,2,3];
    this.validValues = validvalues || [1,2,3];
    this.program = '';
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

        //console.log(self.verificationFunction);


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
                var value = func(_.clone(self.inValues[i]));
                var st = _.isEqual(value, self.validValues[i]);
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