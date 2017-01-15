/**
 * @author      Alex Mourtziapis <alex.mourtziapis@gmail.com>
 * @license     {@link http://opensource.org/licenses/MIT|MIT License}
 */

/**
 *
 * @class Code_Reactor.Editor
 * @constructor
 * @param {number} width - viewports width (*optional)
 * @param {number} height - viewports height (*optional)
 * @param {string} id - text area id *
 * @param {Array<object>} args - CodeMirror args (*optional)
 */
Code_Reactor.Editor = function (Code_Reactor, width, height, id, args) {

  this.width = width || -1;

  this.height = height || -1;

  this.id = id || console.error('Error: "id" is undefined');

  this.args = args || {
    error: 1
  };

  this.editor = null;

  this.instance = Code_Reactor.editor.length;

  this.file = null;
};

Code_Reactor.Editor.prototype = {

  init: function () {
    this.editor = CodeMirror.fromTextArea(document.getElementById(this.id), this.args);
    var file = this.file;
    var instance = this.instance;

    this.editor.on("change", function (cm, change) {

      file = Code_Reactor.editor[instance].file;

      if (Code_Reactor.file[file]) {
        try {
          Code_Reactor.file[file].content = cm.getValue() || "";
        } catch (e) {
          console.warn(e);
        }

        if (Code_Reactor.isGlslModeOn) {
          Code_Reactor.billboard.load(cm.getValue());
          Code_Reactor.billboard.render(true);
        }

      }

    });

    this.editor.on("cursorActivity", function (cm, change) {
      document.getElementById('L_C_posX_posY').innerHTML = 'Line ' + cm.getCursor().line + ',Column ' + cm.getCursor().ch + '<font color="#888888"> - ' + cm.lineCount() + ' Lines</font>';
    });

    // set custom scale if defined
    if (this.width > 0 && this.height > 0) {
      this.editor.setSize(this.width, this.height);
    }
  },

  setSize: function (width, height) {
    this.editor.setSize(width, height);
  },

  loadContent: function (value) {
    this.editor.setValue(value);
  }

};
