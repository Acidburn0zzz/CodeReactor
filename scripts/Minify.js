var fs = require('fs');
var colors = require('colors');
var isBinaryFile = require("isbinaryfile");
var UglifyJS = require("uglify-js");
var UglifyCSS = require('uglifycss');

console.log("Starting Minifier ...".magenta);

function getTime() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}

function _minify(path) {
    fs.readdirSync(path).forEach(function (file) {

        file = path + '/' + file;
        var stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            _minify(file);
        } else if (!isBinaryFile.sync(file)) {

            var filename = file.split('/');
            filename = filename[filename.length - 1];
            var pp = filename.split('.');

            if (pp[pp.length - 1] === 'js' && filename.slice(-7) !== ".min.js") {
                console.log(getTime() + colors.green(' Minifying ' + filename + ' ...'));

                try {
                    var result = UglifyJS.minify([file], {
                        outSourceMap: filename + '.map'
                    });
                } catch (e) {
                    console.warn(colors.red(e));
                }

                var ff = file.replace('.js', '.min.js');
                fs.writeFileSync(ff, result.code, 'utf8');
                fs.writeFileSync(file + '.map', result.map, 'utf8');
            } else if (pp[pp.length - 1] === 'css' && filename.slice(-8) !== ".min.css") {
                console.log(getTime() + colors.cyan(' Minifying ' + filename + ' ...'));

                try {
                    var result = UglifyCSS.processFiles([file], {
                        maxLineLen: 500,
                        expandVars: true
                    });

                    var ff = file.replace('.css', '.min.css');
                    fs.writeFileSync(ff, result, 'utf8');
                } catch (e) {
                    console.warn(colors.red(e));
                }
            } else {
                console.log(getTime() + colors.red(" Couldn't minify " + filename + ' ...'));

            }
        }
    });
}

_minify('src');
_minify('css');
