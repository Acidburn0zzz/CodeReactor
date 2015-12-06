/**
 * @author      Alex Mourtziapis <alex.mourtziapis@gmail.com>
 * @license     {@link http://opensource.org/licenses/MIT|MIT License}
 */

// @namespace Coder Reactor 
var Code_Reactor = {

    fs: require('fs'),

    jsonfile: require('jsonfile'),

    os: require('os'),

    gui: require('nw.gui'),

    appRoot: require('app-root-path').toString(),

    isBinaryFile: require("isbinaryfile"),

    shell: require('shelljs'),

    projectName: "unnamed",

    dirSeperator: null,

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

    /**
     * Initialize Code Reactor
     * @method Code_Reactor.init
     */
    init: function () {
        switch (this.os.platform()) {
            case 'win32':
                this.dirSeperator = "\\";
                $("#dirDialog").attr("nwworkingdir", "C:\\");
                break;
            case 'linux':
                this.dirSeperator = "/";
                $("#dirDialog").attr("nwworkingdir", "/");
                break;
            case 'freebsd':
                //@ToDO
                break;
            case 'darwin':
                //@ToDO
                break;
            default:
                $("#dirDialog").attr("nwworkingdir", this.appRoot);
                break;
        }

        ////////////////////////////////////////////
        // CONFIGURATION
        ////////////////////////////////////////////
        var configPath = this.gui.App.dataPath + this.dirSeperator + "config.json";
        try {
            var stats = Code_Reactor.fs.lstatSync(configPath);

            if (!Code_Reactor.isBinaryFile.sync(configPath) && stats.isFile()) {
                var cc = Code_Reactor.jsonfile.readFileSync(configPath);

                Code_Reactor.CodeMirrorOptions = cc.CodeMirrorOptions;
                Code_Reactor.fontSize = cc.fontSize;
                Code_Reactor.font_family = cc.font_family;
            }
        } catch (e) {
            Code_Reactor.jsonfile.writeFileSync(configPath, {
                CodeMirrorOptions: Code_Reactor.CodeMirrorOptions,
                fontSize: Code_Reactor.fontSize,
                font_family: Code_Reactor.font_family
            });
        }

        ////////////////////////////////////////////
        // CODE REACTOR LOG FILE(S)
        ////////////////////////////////////////////
        Code_Reactor.log.push(new Code_Reactor.Log("Activity", Code_Reactor.appRoot + "\\log\\activity.log", 1024));
        Code_Reactor.log[0].log("Log", "Starting App...");

        ////////////////////////////////////////////
        // CODE REACTOR EDITOR #0
        ////////////////////////////////////////////
        Code_Reactor.editor.push(new Code_Reactor.Editor(window.innerWidth - 250, window.innerHeight - 72, 'code', Code_Reactor.CodeMirrorOptions));

        Code_Reactor.editor[0].init();

        Code_Reactor.newFile();

        $(".CodeMirror").css("font-size", Code_Reactor.fontSize.toString() + 'px');
        $(".CodeMirror").css("font-family", Code_Reactor.font_family);
        document.getElementById('font-size').innerHTML = "Font Size - " + Code_Reactor.fontSize.toString() + 'px';

        // declare "Code_Reactor.projectName" var
        var pp = Code_Reactor.appRoot.trim().split(this.dirSeperator);
        Code_Reactor.projectName = pp[pp.length - 1];
        // Update sidebars title
        document.getElementById('title').innerHTML = Code_Reactor.projectName;

        // Register all shortcuts
        Code_Reactor.log[0].log("Log", "Shorcuts have been registered!");
        Code_Reactor.shortcuts.forEach(function (value) {
            /* Register global hotkey */
            //Code_Reactor.gui.App.registerGlobalHotKey(new Code_Reactor.gui.Shortcut(value));

            /* Register applications hotkey */
            $("*").bind('keydown', value.key, value.active);

        });

        Code_Reactor.Git.set();
    },

    /**
     * terminate application
     * @method Code_Reactor.terminate
     */
    terminate: function () {
        //$("#terminate").attr('src', '../icons/tilebar/close_click.png');
        this.gui.App.quit();
    },

    /**
     * minimize main window
     * @method Code_Reactor.minimize
     */
    minimize: function () {
        //$("#minimize").attr('src', '../icons/tilebar/minimize_click.png');
        this.gui.Window.get().minimize();
    },

    /**
     * toggle Fullscreen
     * @method Code_Reactor.toggleFullscreen
     */
    toggleFullscreen: function () {
        this.gui.Window.get().toggleFullscreen();
    },

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

    /**
     * Open terminal
     * @method Code_Reactor.openTerminal
     */
    openTerminal: function () {
        var exec = require('child_process').exec;

        switch (this.os.platform()) {
            case 'win32':
                exec('start cmd /K "cd ' + Code_Reactor.projectPath + '"', function callback(error, stdout, stderr) {
                    // result
                });
                break;
            case 'linux':
                exec('uxterm -c "cd ' + Code_Reactor.projectPath + '"', function callback(error, stdout, stderr) {
                    // result
                });
                break;
            case 'freebsd':
                //@ToDO
                break;
            case 'darwin':
                //@ToDO
                break;
            default:
                $("#dirDialog").attr("nwworkingdir", this.appRoot);
                break;
        }
    },

    /**
     * Create a new file
     * @method Code_Reactor.newFile
     */
    newFile: function () {
        this.file.push(new Code_Reactor.File(Code_Reactor.appRoot + this.dirSeperator + makeid(undefined, true), 0));
        this.file[this.file.length - 1].new();
    },

    /**
     * Create a new meta file
     * @method Code_Reactor.newMetaFile
     */
    newMetaFile: function (name, filepath, content) {
        this.meta.push(new Code_Reactor.Meta(name, filepath, content));
    },

    /**
     * Open new file
     * @method Code_Reactor.openFile
     */
    openFile: function (path, append) {
        var file = new Code_Reactor.File(path, 0);
        file.open(path, append);
        this.file.push(file);

        return file;
    },

    openDir: function (path, parent, spaces) {
        var dir = new Code_Reactor.Directory(path, parent, spaces);
        dir.init();
        this.directory.push(dir);

        return dir;
    },

    closeDir: function (instance) {
        this.directory[instance].close();
    },

    totalDirs: 0,

    /**
     * Open folder
     * @method Code_Reactor.openFolder
     */
    openFolder: function (path, close) {
        var rr = null;

        if (close === undefined || close === true) {
            this.closeAll();
        }

        if (path !== undefined) {
            // set new projects name
            this.setProjectName(path);
            // cd to new project's path
            Code_Reactor.shell.cd(this.projectPath);

            // get folders contents
            rr = this._getAllFilesFromFolder(path);
            for (var i = 0; i < rr.length; i++) {
                if (rr[i].file !== undefined) {
                    Code_Reactor.openFile(rr[i].file);
                } else if (rr[i].dir !== undefined) {
                    Code_Reactor.openDir(rr[i].dir, 'workplace', 2);
                } else {
                    Code_Reactor.log[0].log("Log", "Couldn't open file/dir");
                }
            }
        } else {
            var chooser = $('#dirDialog');
            chooser.unbind('change');
            chooser.change(function (evt) {
                // set new projects name
                Code_Reactor.setProjectName($(this).val());
                // cd to new project's path
                Code_Reactor.shell.cd(this.projectPath);

                // get folders contents 
                rr = Code_Reactor._getAllFilesFromFolder($(this).val());
                for (var i = 0; i < rr.length; i++) {
                    if (rr[i].file !== undefined) {
                        Code_Reactor.openFile(rr[i].file);
                    } else if (rr[i].dir !== undefined) {
                        Code_Reactor.openDir(rr[i].dir, 'workplace', 2);
                    } else {
                        Code_Reactor.log[0].log("Log", "Couldn't open file/dir");
                    }
                }
            });

            chooser.trigger('click');
        }
    },

    /**
     * Close file
     * @method Code_Reactor.close
     */
    close: function (instance) {
        if (this.file.length > 0) {
            this.file[instance].close();
            Code_Reactor.file.splice(instance, 1);
        }
    },

    /**
     * Close all files
     * @method Code_Reactor.closeAll
     */
    closeAll: function () {
        if (this.file.length > 0) {
            for (var i = 0; i < this.file.length; i++) {
                this.file[i].close();
            }
            this.file = [];
        }
    },

    /**
     * Save last used file
     * @method Code_Reactor.saveFile
     */
    saveFile: function (as) {
        this.file[this.editor[0].file].save(as);
    },

    billboard: null,

    /**
     * Indicates if GLSL Mode is on {boolean}
     */
    isGlslModeOn: false,

    /**
     * Toggle GLSL Mode ON or off
     * @method Code_Reactor.saveFile
     */
    toggleGLSLMode: function (on) {

        this.isGlslModeOn = on;

        if (this.billboard !== null) {
            $("#GlslCanvas0").remove();
            this.billboard = null;
        }

        if (on) {
            AppendCanvas([{
                    name: "id",
                    value: "GlslCanvas0"
        }], window.innerWidth - 250, window.innerHeight - 72, 'code-wrapper', {
                    src: "",
                    isPath: false
                },
                undefined);

            var list = document.getElementsByTagName("canvas");

            var sandbox = new GlslCanvas(list[0]);

            this.billboard = sandbox;

            render_all_GlslCanvas();
        }
    },

    /**
     * Set current projects name
     * @method Code_Reactor.setProjectName
     * @param {Sting} dir - Projects root
     */
    setProjectName: function (dir) {
        var pp = dir.trim().split(this.dirSeperator);
        this.projectName = pp[pp.length - 1];
        this.projectPath = dir;

        document.getElementById('title').innerHTML = this.projectName;

        $("#dirDialog").attr("nwworkingdir", Code_Reactor.projectPath);
    },

    /**
     * Get all files from folder
     * @method Code_Reactor._getAllFilesFromFolder
     * @returns {Array<string>} - Each files path
     */
    _getAllFilesFromFolder: function (path) {
        var filesystem = Code_Reactor.fs;
        var results = [];

        filesystem.readdirSync(path).forEach(function (file) {

            file = path + '/' + file;
            var stat = filesystem.statSync(file);

            if (stat && stat.isDirectory()) {
                results.push({
                    dir: file
                });
            } else if (!Code_Reactor.isBinaryFile.sync(file)) {
                results.push({
                    file: file
                });
            }

        });

        return results;
    },

    /**
     * Code Reactor shortcuts {Array<object>}
     */
    shortcuts: [
        {
            key: "ctrl+o",
            active: function () {
                Code_Reactor.openFile();
            },
            failed: function (msg) {
                // :(, fail to register the |key| or couldn't parse the |key|.
                Code_Reactor.log[0].log("Error", msg);
            }
        },
        {
            key: "ctrl+n",
            active: function () {
                Code_Reactor.newFile();
            },
            failed: function (msg) {
                // :(, fail to register the |key| or couldn't parse the |key|.
                Code_Reactor.log[0].log("Error", msg);
            }
        },
        {
            key: "ctrl+shift+s",
            active: function () {
                Code_Reactor.saveFile(true);
            },
            failed: function (msg) {
                // :(, fail to register the |key| or couldn't parse the |key|.
                Code_Reactor.log[0].log("Error", msg);
            }
        },
        {
            key: "ctrl+s",
            active: function () {
                Code_Reactor.saveFile(false);
            },
            failed: function (msg) {
                // :(, fail to register the |key| or couldn't parse the |key|.
                Code_Reactor.log[0].log("Error", msg);
            }
        },
        {
            key: "ctrl+shift+o",
            active: function () {
                Code_Reactor.openFolder();
            },
            failed: function (msg) {
                // :(, fail to register the |key| or couldn't parse the |key|.
                Code_Reactor.log[0].log("Error", msg);
            }
        },
        {
            key: "ctrl+w",
            active: function () {
                Code_Reactor.close(Code_Reactor.editor[0].file);
            },
            failed: function (msg) {
                // :(, fail to register the |key| or couldn't parse the |key|.
                Code_Reactor.log[0].log("Error", msg);
            }
        },
        {
            key: "ctrl+shift+w",
            active: function () {
                Code_Reactor.closeAll();
            },
            failed: function (msg) {
                // :(, fail to register the |key| or couldn't parse the |key|.
                Code_Reactor.log[0].log("Error", msg);
            }
        },
        {
            key: "`",
            active: function () {
                Code_Reactor.gui.Window.get().showDevTools();
            },
            failed: function (msg) {
                // :(, fail to register the |key| or couldn't parse the |key|.
                Code_Reactor.log[0].log("Error", msg);
            }
        },
        {
            key: "ctrl+shift+=",
            active: function () {
                $(".CodeMirror").css("font-size", ++Code_Reactor.fontSize);
                document.getElementById('font-size').innerHTML = "Font Size - " + Code_Reactor.fontSize.toString() + 'px';
            },
            failed: function (msg) {
                // :(, fail to register the |key| or couldn't parse the |key|.
                Code_Reactor.log[0].log("Error", msg);
            }
        },
        {
            key: "ctrl+shift+-",
            active: function () {
                $(".CodeMirror").css("font-size", --Code_Reactor.fontSize);
                document.getElementById('font-size').innerHTML = "Font Size - " + Code_Reactor.fontSize.toString() + 'px';
            },
            failed: function (msg) {
                // :(, fail to register the |key| or couldn't parse the |key|.
                Code_Reactor.log[0].log("Error", msg);
            }
        }
    ]

};

Code_Reactor.projectPath = Code_Reactor.appRoot;

function render_all_GlslCanvas() {
    if (Code_Reactor.isGlslModeOn) {
        Code_Reactor.billboard.setMouse(mouse);
        Code_Reactor.billboard.render();

        window.requestAnimFrame(render_all_GlslCanvas);
    }
}

// window onload event
window.onload = function () {
    Code_Reactor.init();
};

// window onresize event
window.onresize = function () {
    for (var i = 0; i < Code_Reactor.editor.length; i++) {
        Code_Reactor.editor[0].setSize(window.innerWidth - 250, window.innerHeight - 72);
    }
    Code_Reactor.toggleGLSLMode(true);
    Code_Reactor.editor[0].loadContent(Code_Reactor.editor[0].editor.getValue());
};
