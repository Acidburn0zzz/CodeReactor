var fs = require('fs');
var colors = require('colors');
var isBinaryFile = require("isbinaryfile");

console.log("Cleaning ...".magenta);

function getTime() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}

function clean(path) {
    fs.readdirSync(path).forEach(function (file) {

        file = path + '/' + file;
        var stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            clean(file);
        } else if (!isBinaryFile.sync(file)) {
            if (file.slice(-7) === ".min.js" || file.slice(-7) === ".js.map" || file.slice(-8) === ".min.css") {
                var dir = file.split('/');
                try {
                    dir = dir[dir.length - 2];
                } catch (e) {
                    console.log(e);
                }

                if (dir !== 'GlslCanvas') {
                    try {
                        fs.unlinkSync(file);
                        var filename = file.split('/');
                        filename = filename[filename.length - 1];
                        console.log(getTime() + colors.green(' Successfully deleted ' + filename));
                    } catch (e) {
                        console.warn(e);
                    }
                }
            }
        }
    });
}

clean('src');
clean('css');
