/**
 * @author      Alex Mourtziapis <alex.mourtziapis@gmail.com>
 * @license     {@link http://opensource.org/licenses/MIT|MIT License}
 */

/**
 *
 * @class Code_Reactor.Directory
 * @constructor
 * @param {string} filepath - Directory's global filepath
 * @param {string} parent - Directory's parent element
 * @param {number} space - Tab space
 */
Code_Reactor.Directory = function (Code_Reactor, filepath, parent, space) {

    this.filepath = null;
    if (filepath !== undefined) {
        this.filepath = filepath;
    }

    this.instance = Code_Reactor.directory.length;

    this.toggled = false;

    // dir name
    this.foldername = null;

    this.files = null;

    if (parent !== undefined) {
        this.parent = parent;
    } else {
        this.parent = 'workplace';
        console.warn("Forgot to pass 'parent' parameter! \n Default value ('workplace') 'll be used");
    }

    this.id = 'ofolder' + this.instance;

    this.toAppend = true;

    this._space = 2;
    this.space = '';
    if (space !== undefined) {
        this._space = space;

        for (var i = 0; i < space; i++) {
            this.space += '&nbsp;';
        }
    } else {
        console.error("Forgot to pass 'space' parameter!");
    }

};

Code_Reactor.Directory.prototype = {

    init: function () {
        // fetch files
        this.appendFolderToWorkplace();
    },

    toggle: function () {

        if (this.files === null) {
            var pp = makeid(10);
            this.files = Code_Reactor._getAllFilesFromFolder(this.filepath);
            document.getElementById(this.id).innerHTML = "";

            var inject = '<li><span onclick="Code_Reactor.directory[' + this.instance + '].toggle()">' + this.foldername + '</span><ul id="' + pp + '">';
            var dirs = [];
            for (var i = 0; i < this.files.length; i++) {
                // if file
                if (this.files[i].file !== undefined) {
                    this.files[i] = Code_Reactor.openFile(this.files[i].file, false);
                    this.files[i].updateFilename(true);
                    inject += '<li><a href="#" onclick="Code_Reactor.file[' + this.files[i].instance + '].render()">&nbsp;&nbsp;&nbsp;' + this.space + this.files[i].filename + '</a></li>';
                }
                // if directory
                else if (this.files[i].dir !== undefined) {
                    dirs.push(this.files[i].dir);

                }

            }
            inject += '</ul></li>';

            document.getElementById(this.id).innerHTML += inject;

            for (var i = 0; i < dirs.length; i++) {
                var dir = new Code_Reactor.Directory(Code_Reactor, dirs[i], pp, this._space + 2);
                dir.init();
                Code_Reactor.directory.push(dir);
            }
        }

        var zz = document.getElementsByName('dir' + this.instance)[0];
        this.toggled = !this.toggled;
        zz.id = this.getIcon();
        $('#' + this.id + ' > li span').parent().find('ul').toggle();
    },

    close: function () {
        $("ul").remove("#" + this.id.toString());
    },

    updateFoldername: function () {
        this.foldername = this.filepath.split("/");
        this.foldername = this.foldername[this.foldername.length - 1];
        return this.foldername;
    },

    appendFolderToWorkplace: function (path) {
        var foldername = this.updateFoldername();
        var iconPadding_left = '';
        if (this._space > 2) {
            for (var i = 0; i < this._space - 2; i++) {
                iconPadding_left += '&nbsp;';
            }
        }
        foldername = iconPadding_left + '<div name="dir' + this.instance + '" id="' + this.getIcon() + '"></div>&nbsp;' + foldername;
        this.foldername = foldername;
        document.getElementById(this.parent).innerHTML += '<ul id="' + this.id + '"><li><span onclick="Code_Reactor.directory[' + this.instance + '].toggle()">' + foldername + '</span></li></ul>';
        this.toAppend = false;
    },

    getIcon: function () {
        if (this.toggled) {
            return 'triangle-down';
        } else {
            return 'triangle-right';
        }
    }

};
