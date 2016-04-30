/**
 * @author      Alex Mourtziapis <alex.mourtziapis@gmail.com>
 * @license     {@link http://opensource.org/licenses/MIT|MIT License}
 */

/**
 *
 * @class Code_Reactor.Log
 * @constructor
 * @param {string} name - name of log file (*optional)
 * @param {string} filepath - the global filepath of the log file (*optional)
 * @param {number} maxSize - max size of log file in bytes (*optional)
 */
Log = function (nCode_Reactor, ame, filepath, maxSize) {

    global.Code_Reactor = Code_Reactor;

    this.name = "uunnamed";
    if (name !== undefined) {
        this.name = name;
    }

    // max size in bytes
    this.maxSize = 1024;
    if (maxSize !== undefined) {
        this.maxSize = maxSize;
    }

    this.filepath = Code_Reactor.appRoot + "\\log\\console.log";
    if (filepath !== undefined) {
        this.filepath = filepath;
    }

    this.encoding = 'utf8';

    this.enabled = false;

    this.instance = Code_Reactor.log.length;

    this.d = new Date();
};

Log.prototype = {
    log: function (type, value) {
        var fs = Code_Reactor.fs;
        var fileRoot = this.filepath.trim().split("\\");
        fileRoot = fileRoot[fileRoot.length - 2];

        value = type + " [" + this.getDMYString() + ":" + this.getHMSString() + "] " + value + "\n";
        console.log(value);

        if (!this.enabled) return null;

        try {
            var stats = fs.lstatSync(fileRoot);
        } catch (e) {
            fs.mkdirSync(fileRoot);
        }

        try {
            var stats = fs.lstatSync(this.filepath);

            if (stats.isFile()) {
                if (this.hasReachedMaxSize()) {
                    fs.writeFileSync(this.filepath, value, this.encoding);
                } else {
                    fs.appendFileSync(this.filepath, value, this.encoding);
                }
            }
        } catch (e) {
            var jsonfile = Code_Reactor.jsonfile;
            value = "#Version: " + jsonfile.readFileSync(Code_Reactor.appRoot + "\\package.json").version +
                "\n#OS: " + Code_Reactor.os.platform() + " " + Code_Reactor.os.release() +
                "\n#Mem: total: " + Code_Reactor.os.totalmem() + " | avail: " + Code_Reactor.os.freemem() +
                "\n" + value;
            fs.writeFileSync(this.filepath, value, this.encoding);
        }
    },

    hasReachedMaxSize: function () {
        var fs = Code_Reactor.fs;
        var filepath = this.filepath;
        var maxSize = this.maxSize;

        fs.watch(filepath, function (curr, prev) {
            fs.stat(filepath, function (err, stats) {
                return (stats.size > maxSize);
            });
        });

        return false;
    },

    getDMYString: function () {
        return (this.d.getDay() + "/" +
            this.d.getMonth() + "/" +
            this.d.getFullYear());
    },

    getHMSString: function () {
        return (this.d.getHours() + ":" +
            this.d.getMinutes() + ":" +
            this.d.getSeconds());
    }

};

module.exports = Log;
