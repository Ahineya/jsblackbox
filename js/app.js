var jQuery = jQuery;
var window = window;
var Terminal = Terminal;

(function($) {

    var levelsArr;
    var currentLevel = 0;

    $.get('levels/test.jsbl').success(function(levels) {

        levels = JSON.parse(levels);

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
                    backgroundColor: '#ccc', //levels[l].color || 'white',
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

            d.attr('data-level', l);

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
        $('.info').hide();
    });

    $('.js-info').click(function() {
        $('.info').show();
    });

    $('.select-level').click(function() {
        $('.info').hide();
        toggleContainer('close');
    });

    function loadLevel(level) {

        $('.success-wrapper').hide();
        $('.tuning').find('tr').remove();
        $('.console').text('');
        $('.message').text('');
        $('.error').hide();

        //console.log('here');

        //currentLevel = event.data.current;

        //var level = event.data.level;
        //console.log(level);

        $('.name').text('Level: ' + level.id);
        $('.message').html(level.description);

        $('.next').off('click').on('click', function () {
            currentLevel++;
            loadLevel(levelsArr[currentLevel]);
        });

        level.input = level.input.slice(0,3);
        level.output = level.output.slice(0,3);

        //console.log(level);

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
                    $('.success').css({
                        marginTop: ($('.success-wrapper').height() / 2 - $('.success').height() / 2) / 2 + 'px'
                    });
                    $('.success-wrapper').show();


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

})(jQuery); // jshint ignore:line
