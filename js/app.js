

(function() {

    $.get('/levels/test.jsbl').success(function(levels) {
        //console.log(levels);

        levels = JSON.parse(levels);

        draw(levels);

        window.onresize = function() {
            draw(levels);
        }

    });

    function draw(levels) {

        $('.level-circle').hide().remove();

        var count = 0;

        for (var l in levels) {
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
                .appendTo( $('.container') );

        var delta = Math.PI * 2 / count;
        var angle = 0;

        var i = 0;

        for (var l in levels) {
            i++;
            var d = $('<div></div>')
                .css({
                    position: 'absolute',
                    left:  center.x + (diameter/2 * Math.cos(angle)) - diameter / 20 + 'px',
                    top: center.y + (diameter/2 * Math.sin(angle)) - diameter / 20 + 'px',
                    backgroundColor: '#aaa', //levels[l].color || 'white',
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
                })

            d.appendTo( $('.container')).show();

            angle += delta;
        }

    }


})();