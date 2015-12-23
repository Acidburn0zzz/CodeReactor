var fs = require('fs');
var beautify_js = require('js-beautify');
var beautify_css = require('js-beautify').css;
var beautify_html = require('js-beautify').html;
var colors = require('colors');
var isBinaryFile = require("isbinaryfile");

var path = process.argv[2];

console.log("Initializing beautifier script".green);

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
            results.concat(beautify(file));
        } else if (!isBinaryFile.sync(file)) {
            results.push(file);
        }
    });


    for (var i = 0; i < results.length; i++) {
        var data = fs.readFileSync(results[i], 'utf8').toString();

        if (detectMode(results[i]) === 'js') {
            fs.writeFileSync(results[i], beautify_js(data), 'utf8');
            console.log(colors.green("Beautified " + results[i]));
        } else if (detectMode(results[i]) === 'css') {
            fs.writeFileSync(results[i], beautify_css(data), 'utf8');
            console.log(colors.green("Beautified " + results[i]));

        } else if (detectMode(results[i]) === 'html') {
            fs.writeFileSync(results[i], beautify_html(data), 'utf8');
            console.log(colors.green("Beautified " + results[i]));
        } else {
            console.warn(colors.yellow("Couldn't beautify " + results[i]));
        }
    }
    //return results;
}

if (path !== undefined) {
    beautify(path);
} else {
    console.log("Missing Argument 'Folder_Path' !".red);
    beautify('../src');
    beautify('../css');

    var data = fs.readFileSync('../index.html', 'utf8').toString();
    fs.writeFileSync('../index.html', beautify_html(data), 'utf8');
    console.log(colors.green("Beautified " + '../index.html'));
}
