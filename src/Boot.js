"use strict";

// @namespace Coder Reactor
let Code_Reactor = {

    fs: require('fs'),

    jsonfile: require('jsonfile'),

    os: require('os'),

    gui: require('nw.gui'),

    path: require('path'),

    appRoot: undefined,

    isBinaryFile: require("isbinaryfile"),

    shell: require('shelljs'),

    // @class Editor
    Editor: undefined,
    // @class File
    File: undefined,
    // @class Directory
    Directory: undefined,
    // @class Meta
    Meta: undefined,
    // @class Log
    Log: undefined,
    // @class SoundPlayer
    SoundPlayer: undefined,
    // @class Git
    Git: undefined,

    projectName: "unnamed",

    dirSeperator: undefined,

    CodeMirrorOptions: {
        tabSize: 4,
        indentWithTabs: false,
        theme: "monokai",
        indentUnit: 2,
        smartIndent: true,
        keyMap: "sublime",
        styleActiveLine: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        lineNumbers: true,
        lineWrapping: true
    },

    fontSize: 16,

    font_family: "typewcond_regular",

    projectPath: undefined,

    playlistURL: "https://soundcloud.com/alex-mourtziapis/sets/coding-playlist",

    /**
     * Git Module
     * @type {object}
     */
    git: undefined,

    /**
     * All currently open files
     * @type {Array<object>}
     */
    file: [],

    /**
     * All currently open directories
     * @type {Array<object>}
     */
    directory: [],

    /**
     * All currently active editors
     * @type {Array<object>}
     */
    editor: [],

    /**
     * Here where I store all Meta @class isntances!
     * @type {Array<object>}
     */
    meta: [],

    /**
     * Here where I store all Log @class isntances!
     * @type {Array<object>}
     */
    log: [],

    billboard: null,

    /**
     * Indicates if GLSL Mode is on {boolean}
     */
    isGlslModeOn: false,

    /**
     * Code Reactor shortcuts {Array<object>}
     */
    shortcuts: [{
        key: "ctrl+o",
        type: "keydown",
        active: function () {
            Code_Reactor.openFile();
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "ctrl+n",
        type: "keydown",
        active: function () {
            Code_Reactor.newFile();
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "ctrl+shift+s",
        type: "keydown",
        active: function () {
            Code_Reactor.saveFile(true);
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "ctrl+s",
        type: "keydown",
        active: function () {
            Code_Reactor.saveFile(false);
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "Alt+Ctrl+s",
        type: "keydown",
        active: function () {
            Code_Reactor.saveAllFiles();
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "ctrl+shift+o",
        type: "keydown",
        active: function () {
            Code_Reactor.openFolder();
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "ctrl+w",
        type: "keydown",
        active: function () {
            Code_Reactor.close(Code_Reactor.editor[0].file);
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "ctrl+shift+w",
        type: "keydown",
        active: function () {
            Code_Reactor.closeAll();
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "f12",
        type: "keydown",
        active: function () {
            Code_Reactor.gui.Window.get().showDevTools();
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "ctrl+shift+=",
        type: "keydown",
        active: function () {
            if (Code_Reactor.fontSize !== 26) {
                $(".CodeMirror").css("font-size", ++Code_Reactor.fontSize);
                document.getElementById('font-size').innerHTML = "Font Size - " + Code_Reactor.fontSize.toString() + 'px';
            }
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "ctrl+shift+-",
        type: "keydown",
        active: function () {
            if (Code_Reactor.fontSize !== 8) {
                $(".CodeMirror").css("font-size", --Code_Reactor.fontSize);
                document.getElementById('font-size').innerHTML = "Font Size - " + Code_Reactor.fontSize.toString() + 'px';
            }
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "f5",
        type: "keydown",
        active: function () {
            let win = Code_Reactor.gui.Window.get().reload();
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "f1",
        type: "keydown",
        active: function () {
            Code_Reactor.SoundPlayer.play();
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "ctrl+right",
        type: "keydown",
        active: function () {
            Code_Reactor.SoundPlayer.play_next();
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "ctrl+left",
        type: "keydown",
        active: function () {
            Code_Reactor.SoundPlayer.play_previous();
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "ctrl+up",
        type: "keydown",
        active: function () {
            Code_Reactor.SoundPlayer.increase_volume();
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }, {
        key: "ctrl+down",
        type: "keydown",
        active: function () {
            Code_Reactor.SoundPlayer.decrease_volume();
        },
        failed: function (msg) {
            // :(, fail to register the |key| or couldn't parse the |key|.
            console.error(msg);
        }
    }]
};

Code_Reactor.projectPath = Code_Reactor.appRoot;
Code_Reactor.appRoot = Code_Reactor.path.resolve();

window.onload = function () {
    try {
        Code_Reactor.SoundPlayer = new Code_Reactor.SoundPlayer(Code_Reactor);
        Code_Reactor.SoundPlayer.init();
    } catch (e) {
        console.error(e);
    }

    Code_Reactor.init();


    // Reload all files when editor gets focus
    Code_Reactor.gui.Window.get().on('focus', function () {
        Code_Reactor.openFolder(Code_Reactor.projectPath);
    });

    // Save all files when editor loses focus
    Code_Reactor.gui.Window.get().on('blur', function () {
        Code_Reactor.saveAllFiles();
    });
};

// window onresize event
window.onresize = function () {
    for (let i = 0; i < Code_Reactor.editor.length; i++) {
        Code_Reactor.editor[0].setSize(window.innerWidth - 250, window.innerHeight - 72);
    }
    Code_Reactor.toggleGLSLMode(true);
    Code_Reactor.editor[0].loadContent(Code_Reactor.editor[0].editor.getValue());
};

