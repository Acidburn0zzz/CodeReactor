/**
 * @author      Alex Mourtziapis <alex.mourtziapis@gmail.com>
 * @license     {@link http://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Initialize Code Reactor
 * @method Code_Reactor.init
 */
Code_Reactor.init = function () {

    ////////////////////////////////////////////
    // CONFIGURATION
    ////////////////////////////////////////////
    let configPath = this.gui.App.dataPath + this.dirSeperator + "config.json";
    try {
        let stats = Code_Reactor.fs.lstatSync(configPath);

        if (!Code_Reactor.isBinaryFile.sync(configPath) && stats.isFile()) {
            let cc = Code_Reactor.jsonfile.readFileSync(configPath);

            if (cc.CodeMirrorOptions !== undefined) {
                Code_Reactor.CodeMirrorOptions = cc.CodeMirrorOptions;
            }
            if (cc.fontSize !== undefined) {
                Code_Reactor.fontSize = cc.fontSize;
            }
            if (cc.font_family !== undefined) {
                Code_Reactor.font_family = cc.font_family;
            }
            if (cc.projectPath !== undefined) {
                Code_Reactor.projectPath = cc.projectPath;
            }
            if (cc.playlistURL !== undefined) {
                Code_Reactor.playlistURL = cc.playlistURL;
            }
        }
    } catch (e) {
        this.updateConfig();
    }


    Code_Reactor.git = new Code_Reactor.Git(this);
    ////////////////////////////////////////////
    // CODE REACTOR LOG FILE(S)
    ////////////////////////////////////////////
    Code_Reactor.log.push(new Code_Reactor.Log(this, "Activity", Code_Reactor.appRoot + "\\log\\activity.log", 1024));
    console.log("Starting App...");

    ////////////////////////////////////////////
    // CODE REACTOR EDITOR #0
    ////////////////////////////////////////////
    Code_Reactor.editor.push(new Code_Reactor.Editor(this, window.innerWidth - 250, window.innerHeight - 72, 'code', Code_Reactor.CodeMirrorOptions));

    Code_Reactor.editor[0].init();

    Code_Reactor.newFile();

    $(".CodeMirror").css("font-size", Code_Reactor.fontSize.toString() + 'px');
    $(".CodeMirror").css("font-family", Code_Reactor.font_family);
    document.getElementById('font-size').innerHTML = "Font Size - " + Code_Reactor.fontSize.toString() + 'px';

    // declare "Code_Reactor.projectName" var
    let pp = Code_Reactor.appRoot.trim().split(this.dirSeperator);
    Code_Reactor.projectName = pp[pp.length - 1];
    // Update sidebars title
    document.getElementById('title').innerHTML = Code_Reactor.projectName;

    // Register all shortcuts
    console.log("Shorcuts have been registered!");
    Code_Reactor.shortcuts.forEach(function (value) {
        /* Register global hotkey */
        //Code_Reactor.gui.App.registerGlobalHotKey(new Code_Reactor.gui.Shortcut(value));

        /* Register applications hotkey */
        $("html *").bind(value.type, value.key, value.active);

    });

    Code_Reactor.git.set();

    try {
        let stat = Code_Reactor.fs.lstatSync(this.projectPath);
        if (stat && stat.isDirectory()) {
            Code_Reactor.openFolder(this.projectPath);
        }
    } catch (e) {
        console.warn(this.projectPath + " doesn't exist anymore!");
        console.log('Loading default "projectPath"');
        Code_Reactor.openFolder(this.appRoot);
    }
};

Code_Reactor.updateConfig = function () {
    let configPath = this.gui.App.dataPath + this.dirSeperator + "config.json";

    this.jsonfile.writeFileSync(configPath, {
        CodeMirrorOptions: this.CodeMirrorOptions,
        fontSize: this.fontSize,
        font_family: this.font_family,
        projectPath: this.projectPath,
        playlistURL: this.playlistURL
    });
};

/**
 * terminate application
 * @method Code_Reactor.terminate
 */
Code_Reactor.terminate = function () {
    //$("#terminate").attr('src', '../icons/tilebar/close_click.png');
    this.gui.App.quit();
};

/**
 * minimize main window
 * @method Code_Reactor.minimize
 */
Code_Reactor.minimize = function () {
    //$("#minimize").attr('src', '../icons/tilebar/minimize_click.png');
    this.gui.Window.get().minimize();
};

/**
 * toggle Fullscreen
 * @method Code_Reactor.toggleFullscreen
 */
Code_Reactor.toggleFullscreen = function () {
    this.gui.Window.get().toggleFullscreen();
};

/**
 * Open terminal
 * @method Code_Reactor.openTerminal
 */
Code_Reactor.openTerminal = function () {
    let exec = require('child_process').exec;

    switch (this.os.platform()) {
        case 'win32':
            exec('start cmd /T:8F /K "cd ' + Code_Reactor.projectPath + ' && title CodeReactor"', function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
            break;
        case 'linux':
            exec('uxterm -c "cd ' + Code_Reactor.projectPath + '"', function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
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
};

/**
 * Create a new file
 * @method Code_Reactor.newFile
 */
Code_Reactor.newFile = function () {
    this.file.push(new Code_Reactor.File(this, Code_Reactor.appRoot + this.dirSeperator + makeid(undefined, true), 0));
    this.file[this.file.length - 1].new();
};

/**
 * Create a new meta file
 * @method Code_Reactor.newMetaFile
 */
Code_Reactor.newMetaFile = function (name, filepath, content) {
    this.meta.push(new Code_Reactor.Meta(this, name, filepath, content));
};

/**
 * Open new file
 * @method Code_Reactor.openFile
 */
Code_Reactor.openFile = function (path, append, close) {
    if (close !== undefined && close === true) {
        this.closeAll();
    }

    let file = new Code_Reactor.File(this, path, 0);
    file.open(path, append);
    this.file.push(file);

    return file;
};

Code_Reactor.openDir = function (path, parent, spaces) {
    let dir = new Code_Reactor.Directory(this, path, parent, spaces);
    dir.init();
    this.directory.push(dir);

    return dir;
};

Code_Reactor.closeDir = function (instance) {
    this.directory[instance].close();
};

/**
 * Open folder
 * @method Code_Reactor.openFolder
 */
Code_Reactor.openFolder = function (path, close) {
    let rr = null;

    if (path !== undefined) {

        if (close === undefined || close === true) {
            Code_Reactor.closeAll();
        }
        // set new projects name
        this.setProjectName(path);
        // cd to new project's path
        Code_Reactor.shell.cd(this.projectPath);

        // get folders contents
        rr = this._getAllFilesFromFolder(path);
        for (let i = 0; i < rr.length; i++) {
            if (rr[i].file !== undefined) {
                Code_Reactor.openFile(rr[i].file);
            } else if (rr[i].dir !== undefined) {
                Code_Reactor.openDir(rr[i].dir, 'workplace', 2);
            } else {
                console.warn("Couldn't open file/dir");
            }
        }
        Code_Reactor.updateConfig();
    } else {
        let chooser = $('#dirDialog');
        chooser.unbind('change');
        chooser.change(function (evt) {

            if (close === undefined || close === true) {
                Code_Reactor.closeAll();
            }
            // set new projects name
            Code_Reactor.setProjectName($(this).val());
            // cd to new project's path
            Code_Reactor.shell.cd(this.projectPath);

            // get folders contents
            rr = Code_Reactor._getAllFilesFromFolder($(this).val());
            for (let i = 0; i < rr.length; i++) {
                if (rr[i].file !== undefined) {
                    Code_Reactor.openFile(rr[i].file);
                } else if (rr[i].dir !== undefined) {
                    Code_Reactor.openDir(rr[i].dir, 'workplace', 2);
                } else {
                    console.log("Couldn't open file/dir");
                }
            }
            Code_Reactor.updateConfig();
        });

        chooser.trigger('click');
    }
};

/**
 * Close file
 * @method Code_Reactor.close
 */
Code_Reactor.close = function (instance) {
    if (this.file.length > 0) {
        this.file[instance].close();
        Code_Reactor.file.splice(instance, 1);
    }
};

/**
 * Close all files
 * @method Code_Reactor.closeAll
 */
Code_Reactor.closeAll = function () {
    if (this.file.length > 0) {
        for (let i = 0; i < this.file.length; i++) {
            this.file[i].close();
        }
        this.file = [];
    }

    if (this.directory.length > 0) {
        for (i = 0; i < this.directory.length; i++) {
            this.directory[i].close();
        }
        this.directory = [];
    }
};

/**
 * Save last used file
 * @method Code_Reactor.saveFile
 */
Code_Reactor.saveFile = function (as) {
    this.file[this.editor[0].file].save(as);
};

/**
 * Save all loaded files
 * @method Code_Reactor.saveAllFiles
 */
Code_Reactor.saveAllFiles = function () {
    for (let i = 0; i < this.file.length; i++) {
        this.file[i].save(false);
    }
};

/**
 * Toggle GLSL Mode ON or off
 * @method Code_Reactor.saveFile
 */
Code_Reactor.toggleGLSLMode = function (on) {

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

        let list = document.getElementsByTagName("canvas");

        let sandbox = new GlslCanvas(list[0]);

        this.billboard = sandbox;

        render_all_GlslCanvas();
    }
};

/**
 * Set current projects name
 * @method Code_Reactor.setProjectName
 * @param {Sting} dir - Projects root
 */
Code_Reactor.setProjectName = function (dir) {
    let pp = dir.trim().split(this.dirSeperator);
    this.projectName = pp[pp.length - 1];
    this.projectPath = dir;

    document.getElementById('title').innerHTML = this.projectName;

    $("#dirDialog").attr("nwworkingdir", Code_Reactor.projectPath);
};

/**
 * Get all files from folder
 * @method Code_Reactor._getAllFilesFromFolder
 * @returns {Array<string>} - Each files path
 */
Code_Reactor._getAllFilesFromFolder = function (path, filesOnly) {
    let filesystem = Code_Reactor.fs;
    let results = [];

    filesystem.readdirSync(path).forEach(function (file) {

        file = path + '/' + file;
        let stat = filesystem.lstatSync(file);

        if (stat && stat.isDirectory()) {
            if (filesOnly) {
                results.concat(Code_Reactor._getAllFilesFromFolder(file));
            } else {
                results.push({
                    dir: file
                });
            }
        } else if (!Code_Reactor.isBinaryFile.sync(file)) {
            results.push({
                file: file
            });
        }

    });

    return results;
};

switch (Code_Reactor.os.platform()) {
    case 'win32':
        Code_Reactor.dirSeperator = "\\";
        //$("#dirDialog").attr("nwworkingdir", "C:\\");
        break;
    case 'linux':
        Code_Reactor.dirSeperator = "/";
        //$("#dirDialog").attr("nwworkingdir", "/");
        break;
    case 'freebsd':
        Code_Reactor.dirSeperator = "/";
        break;
    case 'darwin':
        Code_Reactor.dirSeperator = "/";
        break;
    default:
        $("#dirDialog").attr("nwworkingdir", Code_Reactor.appRoot);
        break;
}

function render_all_GlslCanvas() {
    if (Code_Reactor.isGlslModeOn) {
        Code_Reactor.billboard.setMouse(mouse);
        Code_Reactor.billboard.render();

        window.requestAnimFrame(render_all_GlslCanvas);
    }
}
