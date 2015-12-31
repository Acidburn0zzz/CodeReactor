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

    fs.readdirSync(path).forEach(function (file) {

        file = path + '/' + file;
        var stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            beautify(file);
        } else if (!isBinaryFile.sync(file)) {
            var data = fs.readFileSync(file, 'utf8').toString();

            if (detectMode(file) === 'js' && file.slice(-7) !== ".min.js") {
                fs.writeFileSync(file, beautify_js(data), 'utf8');
                console.log(getTime() + colors.green(" Beautified " + file));
            } else if (detectMode(file) === 'css' && file.slice(-8) !== ".min.css") {
                fs.writeFileSync(file, beautify_css(data), 'utf8');
                console.log(getTime() + colors.cyan(" Beautified " + file));
            } else if (detectMode(file) === 'html') {
                fs.writeFileSync(file, beautify_html(data), 'utf8');
                console.log(getTime() + colors.gray(" Beautified " + file));
            } else {
                console.warn(getTime() + colors.red(" Couldn't beautify " + file));
            }
        }
    });

}

var data = fs.readFileSync('index.html', 'utf8').toString();
fs.writeFileSync('index.html', beautify_html(data), 'utf8');
console.log(getTime() + colors.gray(" Beautified " + 'index.html'));

beautify('src');
beautify('css');
