var jQuery = jQuery;
var window = window;

(function($) {

    $.get('levels/test.jsbl').success(function(levels) {

        levels = JSON.parse(levels);
        $.map(levels, function(val) {
            delete val.func;
            return val;
        });

        draw(levels);

        window.onresize = function() {
            draw(levels);
        };

    });

    function draw(levels) {

        $('.level-circle').hide().remove();

        var count = 0;

        var l;

        for (l in levels) {
            count++;
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
            i++;
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
                        .text(i)
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

            d.click(
                {level: levels[l]}, loadLevel
            );

            d.appendTo( $('.circle-container')).show();

            angle += delta;
        }

    }

    $('.cross').click(function() {
        toggleContainer('close');
    });

    function loadLevel(event) {
        var level = event.data.level;
        console.log(level);

        $('.name').text('Level: '+level.id);
        $('.message').html(level.description);

        toggleContainer('open');
    }

    function toggleContainer(action, container) {
        if (action.data) {
            action = action.data.action;
        }

        if (typeof container === 'undefined') {
            container = $('.level-container');
        }

        if (action === 'open') {
            container.animate({
                top: '10%',
                height: '90%'
            }, 100);
        } else {
            container.animate({
                height: '0%',
                top: '100%'
            }, 100);
        }
    }

    $(window).on('scroll', function(event) {
        event.preventDefault();
        window.scrollTo(0, 0);
    });

})(jQuery); // jshint ignore:line
