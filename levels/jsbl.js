var fs = require('fs');

var file = fs.readFileSync('levels/levels.json', {encoding: 'utf-8'});

var l = file.length;

var newFile = "";

for (var i = 0; i<l; i++) {

    newFile+=String.fromCharCode((7 ^ (file.charCodeAt(i)))); // jshint ignore:line

}

fs.writeFileSync('levels/levels.jsbl', newFile);