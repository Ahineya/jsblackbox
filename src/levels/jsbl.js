var fs = require('fs');

try {
    var file = fs.readFileSync('src/levels/levels.json', {encoding: 'utf-8'});

    var l = file.length;

    var newFile = "";

    for (var i = 0; i < l; i++) {

        newFile += String.fromCharCode((7 ^ (file.charCodeAt(i)))); // jshint ignore:line

    }

    fs.writeFileSync('levels/levels.jsbl', newFile);

    console.log('Levels built');
} catch(e) {
    console.log('Levels built failed', e.toString());
}