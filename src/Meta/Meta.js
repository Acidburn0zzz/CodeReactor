/**
 * @author      Alex Mourtziapis <alex.mourtziapis@gmail.com>
 * @license     {@link http://opensource.org/licenses/MIT|MIT License}
 */

/**
 *
 * @class Code_Reactor.Meta
 * @constructor
 * @param {string} name - Meta file's name (*optional)
 * @param {string} filepath - Meta file's global filepath (*required)
 * @param {Array<object>} content - viewport to render the file on (*optional)
 */
Code_Reactor.Meta = function (name, filepath, content) {

    this.name = "unnamed";
    if (name !== undefined) {
        this.name = name;
    }

    this.filepath = null;
    if (filepath === undefined) {
        console.error("Forgot to give a filepath!");
    }

    this.content = null;
    if (content !== undefined) {
        this.content = content;
    }

    this.instance = Code_Reactor.meta.length;

    this.init();
};

Code_Reactor.Meta.prototype = {

    init: function () {
        var fs = Code_Reactor.fs;
        var jsonfile = Code_Reactor.jsonfile;

        try {
            var stats = fs.lstatSync(this.filepath);

            if (!Code_Reactor.isBinaryFile.sync(this.filepath) && stats.isFile()) {
                this.content = jsonfile.readFileSync(this.filepath);
            }
        } catch (e) {
            if (this.content !== null && typeof (this.content) === "object" && this.filepath !== null) {
                jsonfile.writeFileSync(this.filepath, this.content);
            }
        }
    },

    write: function (content, filepath) {
        var jsonfile = Code_Reactor.jsonfile;

        var fp = this.filepath;
        if (filepath !== undefined) {
            fp = filepath;
        }

        var cn = this.content;
        if (content !== undefined) {
            cn = content;
        }

        if (content !== null && typeof (content) === "object" && fp !== null) {
            jsonfile.writeFileSync(fp, content);
        }
    }
};
