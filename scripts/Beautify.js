var fs = require('fs');
var beautify_js = require('js-beautify');
var beautify_css = require('js-beautify').css;
var beautify_html = require('js-beautify').html;
var colors = require('colors');
var isBinaryFile = require("isbinaryfile");

//var path = process.argv[2];
console.log("Starting Beautifier ...".magenta);

function getTime() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}

function detectMode(filepath) {

    // HTML
    if (filepath.slice(-5) === ".html" || filepath.slice(-4) === ".htm") {
        return 'html';
    }
    // JavaScript
    else if (filepath.slice(-3) === ".js" || filepath.slice(-5) === ".json") {
        return 'js';
    }
    // CSS
    else if (filepath.slice(-4) === ".css" || filepath.slice(-5) === ".scss") {
        return 'css';
    }
}

function beautify(path) {
    var results = [];

    fs.readdirSync(path).forEach(function (file) {

        file = path + '/' + file;
        var stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            beautify(file);
        } else if (!isBinaryFile.sync(file)) {
            results.push(file);
        }
    });


    for (var i = 0; i < results.length; i++) {
        var data = fs.readFileSync(results[i], 'utf8').toString();

        if (detectMode(results[i]) === 'js') {
            fs.writeFileSync(results[i], beautify_js(data), 'utf8');
            console.log(getTime() + colors.green(" Beautified " + results[i]));
        } else if (detectMode(results[i]) === 'css') {
            fs.writeFileSync(results[i], beautify_css(data), 'utf8');
            console.log(getTime() + colors.green(" Beautified " + results[i]));

        } else if (detectMode(results[i]) === 'html') {
            fs.writeFileSync(results[i], beautify_html(data), 'utf8');
            console.log(getTime() + colors.green(" Beautified " + results[i]));
        } else {
            console.warn(getTime() + colors.yellow(" Couldn't beautify " + results[i]));
        }
    }
}

var data = fs.readFileSync('index.html', 'utf8').toString();
fs.writeFileSync('index.html', beautify_html(data), 'utf8');
console.log(getTime() + colors.green(" Beautified " + 'index.html'));

beautify('src');
beautify('css');
