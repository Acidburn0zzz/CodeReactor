/**
 * @author      Alex Mourtziapis <alex.mourtziapis@gmail.com>
 * @license     {@link http://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @class FileTreeView
 * @constructor
 * @param {Array<object>} directories - directories
 * @param {Array<object>} files - files
 * @param {int} tabSize - tabSize
 */
FileTreeView = function(directories, files, tabSize) {
    this.directories = [];
    if (directories !== undefined) {
        this.directories = directories;
    }

    this.files = [];
    if (files !== undefined) {
        this.files = files;
    }

    this.tabSize = 2;
    if (tabSize !== undefined) {
        this.tabSize = tabSize;
    }

    this.contentsLength = this.directories.length + this.directories.length;

};

FileTreeView.prototype = {

    sortByName: function() {
        //@ToDo
    },

    sortBySize: function() {
        //@ToDo
    },

    sortByLoC: function() {
        //@ToDo
    },

    appendFolder: function() {

    }
};

module.exports = FileTreeView;
