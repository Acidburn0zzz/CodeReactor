/**
 * @author      Alex Mourtziapis <alex.mourtziapis@gmail.com>
 * @license     {@link http://opensource.org/licenses/MIT|MIT License}
 */

/**
 *
 * @class Code_Reactor.File
 * @constructor
 * @param {string} - filepath (*optional)
 * @param {number} - viewport to render the file on (*required)
 */
Code_Reactor.File = function (filepath, viewport) {

    this.filepath = null;
    if (filepath === undefined) {
        console.log('filepath not given!');
    } else {
        this.filepath = filepath;
    }

    this.encoding = 'utf8';

    this.viewport = 0;
    if (viewport === undefined) {
        console.error("Eh fatcho, you forgot to pass the viewport parameter");
    } else {
        this.viewport = viewport;
    }

    this.filename = null;

    this.content = "";

    this.mode = "";

    this.instance = Code_Reactor.file.length;

    Code_Reactor.editor[this.viewport].file = this.instance;

};

Code_Reactor.File.prototype = {

    new: function () {
        this.appendToWorkplace();
    },

    open: function (path, append) {
        var fs = Code_Reactor.fs;
        var encoding = this.encoding;
        var viewport = this.viewport;
        var contentToLoad = null;
        Code_Reactor.editor[this.viewport].file = this.instance;

        if (path !== undefined) {
            // Update "filepath" variable
            this.filepath = path;

            if (append === true || append === undefined) {
                // appened to Opened Files List
                this.appendToWorkplace();
            }

            // Detect files mode
            this.detectMode();

            // load files content into contentToLoad variable
            contentToLoad = fs.readFileSync(path, encoding);

            // render file in the viewport of your choice
            Code_Reactor.editor[viewport].loadContent(contentToLoad.toString());

            Code_Reactor.log[0].log("Log", path + " was opened succesfully!");
        } else {
            this.chooseFile(
                function (fp) {
                    if (append === true || append === undefined) {
                        // appened to Opened Files List
                        Code_Reactor.file[Code_Reactor.editor[viewport].file].appendToWorkplace();
                    }

                    contentToLoad = fs.readFileSync(fp, encoding);

                    // render file in the viewport of your choice
                    Code_Reactor.editor[viewport].loadContent(contentToLoad.toString());

                    Code_Reactor.log[0].log("Log", fp + " was opened succesfully!");
                }, '#fileDialog', false);
        }

        this.content = contentToLoad;
    },

    save: function (as) {
        var fs = Code_Reactor.fs;
        var encoding = this.encoding;
        var contentToWrite = this.content;

        // Save file as ___________
        if (as) {
            this.chooseFile(function (fp) {
                fs.writeFile(fp, contentToWrite, function (err) {
                    if (err) {
                        return Code_Reactor.log[0].log("Error", err);
                    }

                    Code_Reactor.log[0].log("Log", fp + " was saved succesfully!");
                });

            }, '#fileDialog2', false);
        }
        // Save file
        else {
            var openedFile = Code_Reactor.file[Code_Reactor.editor[this.viewport].file];
            fs.writeFile(openedFile.filepath, openedFile.content, function (err) {
                if (err) {
                    return Code_Reactor.log[0].log("Error", err);
                }

                Code_Reactor.log[0].log("Log", openedFile.filepath + " was saved succesfully!");
            });
        }

    },

    close: function () {
        this.removeFromOpenedFilesList();
        if (Code_Reactor.file.length > 0) {
            if (this.instance === 0) {
                Code_Reactor.file[0].render();
            } else {
                Code_Reactor.file[this.instance - 1].render();
            }
            Code_Reactor.log[0].log("Log", this.filepath + " was closed succesfully!");
        }
    },

    updateFilename: function (inSubDir) {
        this.filename = this.filepath.split(Code_Reactor.dirSeperator);

        if (Code_Reactor.dirSeperator === "\\") {
            if (inSubDir !== undefined && inSubDir === true) {
                this.filename = this.filepath.split("/");
            } else {
                if (this.filepath.indexOf("/") > -1) {
                    this.filename = this.filename[this.filename.length - 1].replace("/", "\\");
                    return this.filename;
                }
            }
        }

        this.filename = this.filename[this.filename.length - 2] + Code_Reactor.dirSeperator + this.filename[this.filename.length - 1];
        return this.filename;
    },

    chooseFile: function (func, name, append) {
        var chooser = $(name);
        var viewport = this.viewport;

        chooser.unbind('change');
        chooser.change(function (evt) {
            // Update "filepath" variable
            Code_Reactor.file[Code_Reactor.editor[viewport].file].filepath = $(this).val();
            if (append === true || append === undefined) {
                // appened to Opened Files List
                Code_Reactor.file[Code_Reactor.editor[viewport].file].appendToWorkplace();
            }
            // Detect files mode
            Code_Reactor.file[Code_Reactor.editor[viewport].file].detectMode();

            func($(this).val());
        });

        chooser.trigger('click');
    },

    detectMode: function () {

        // C
        if (this.filepath.slice(-2) === ".c" || this.filepath.slice(-2) === ".h") {
            this.mode = "text/x-csrc";
            document.getElementById('mode').innerHTML = 'C';
        }
        // C Plus Plus
        else if (this.filepath.slice(-4) === ".cpp" || this.filepath.slice(-4) === ".cxx" ||
            this.filepath.slice(-4) === ".hpp" || this.filepath.slice(-4) === ".hxx" ||
            this.filepath.slice(-3) === ".cc" || this.filepath.slice(-4) === ".c++" ||
            this.filepath.slice(-3) === ".hh" || this.filepath.slice(-4) === ".h++") {
            this.mode = "text/x-c++src";
            document.getElementById('mode').innerHTML = 'C++';
        }
        // Java
        else if (this.filepath.slice(-5) === ".java" || this.filepath.slice(-6) === ".class" || this.filepath.slice(-4) === ".jar") {
            this.mode = "text/x-java";
            document.getElementById('mode').innerHTML = 'Java';
        }
        // C#
        else if (this.filepath.slice(-3) === ".cs") {
            this.mode = "text/x-csharp";
            document.getElementById('mode').innerHTML = 'C#';
        }
        // Objective C
        else if (this.filepath.slice(-2) === ".m" || this.filepath.slice(-3) === ".mm" || this.filepath.slice(-2) === ".h") {
            this.mode = "text/x-objectivec";
            document.getElementById('mode').innerHTML = 'ObjC';
        }
        // HTML
        else if (this.filepath.slice(-5) === ".html" || this.filepath.slice(-4) === ".htm") {
            this.mode = "text/html";
            document.getElementById('mode').innerHTML = 'HTML';
        }
        // JavaScript
        else if (this.filepath.slice(-3) === ".js" || this.filepath.slice(-5) === ".json") {
            this.mode = "text/javascript";
            document.getElementById('mode').innerHTML = 'Javascript';
        }
        // CSS
        else if (this.filepath.slice(-4) === ".css" || this.filepath.slice(-5) === ".scss") {
            this.mode = "text/css";
            document.getElementById('mode').innerHTML = 'CSS';
        }
        // Python
        else if (this.filepath.slice(-3) === ".py" || this.filepath.slice(-4) === ".pyc" ||
            this.filepath.slice(-4) === ".pyd" || this.filepath.slice(-4) === ".pyo" ||
            this.filepath.slice(-4) === ".pyw" || this.filepath.slice(-4) === ".pyz") {
            this.mode = "text/x-python";
            document.getElementById('mode').innerHTML = 'Python';
        }
        // Cython
        else if (this.filepath.slice(-3) === ".cy") {
            this.mode = "text/x-cython";
            document.getElementById('mode').innerHTML = 'Cython';
        }
        // Erlang
        else if (this.filepath.slice(-4) === ".erl" || this.filepath.slice(-4) === ".hrl") {
            this.mode = "text/x-erlang";
            document.getElementById('mode').innerHTML = 'Erlang';
        }
        // Diff
        else if (this.filepath.slice(-5) === ".diff") {
            this.mode = "text/x-diff";
            document.getElementById('mode').innerHTML = 'diff';
        }
        // Brainfuck
        else if (this.filepath.slice(-2) === ".b" || this.filepath.slice(-3) === ".bf") {
            this.mode = "text/x-brainfuck";
            document.getElementById('mode').innerHTML = 'Brainfuck';
        }
        // D
        else if (this.filepath.slice(-2) === ".d") {
            this.mode = "text/x-d";
            document.getElementById('mode').innerHTML = 'D';
        }
        // Lua
        else if (this.filepath.slice(-4) === ".lua") {
            this.mode = "text/x-lua";
            document.getElementById('mode').innerHTML = 'Lua';
        }
        // Shell
        else if (this.filepath.slice(-3) === ".sh") {
            this.mode = "text/x-sh";
            document.getElementById('mode').innerHTML = 'Shell';
        }
        // Go
        else if (this.filepath.slice(-3) === ".go") {
            this.mode = "text/x-go";
            document.getElementById('mode').innerHTML = 'Go';
        }
        // Markdown
        else if (this.filepath.slice(-3) === ".md") {
            this.mode = "text/x-markdown";
            document.getElementById('mode').innerHTML = 'Markdown';
        }
        // Perl
        else if (this.filepath.slice(-3) === ".pl" || this.filepath.slice(-3) === ".pm" || this.filepath.slice(-4) === ".plx") {
            this.mode = "text/x-perl";
            document.getElementById('mode').innerHTML = 'Perl';
        }
        // XML
        else if (this.filepath.slice(-4) === ".xml") {
            this.mode = "application/xml";
            document.getElementById('mode').innerHTML = 'XML';
        }
        // CMake
        else if (this.filepath.slice(10) === "CMakeLists") {
            this.mode = "text/x-cmake";
            document.getElementById('mode').innerHTML = 'CMake';
        }
        // Rust
        else if (this.filepath.slice(-3) === ".rs" || this.filepath.slice(-5) === ".rlib") {
            this.mode = "text/x-rustsrc";
            document.getElementById('mode').innerHTML = 'Rust';
        }
        // OCaml
        else if (this.filepath.slice(-3) === ".ml" || this.filepath.slice(-4) === ".mli") {
            this.mode = "text/x-ocaml";
            document.getElementById('mode').innerHTML = 'OCaml';
        }
        // F#
        else if (this.filepath.slice(-3) === ".fs") {
            this.mode = "text/x-fsharp";
            document.getElementById('mode').innerHTML = 'F#';
        }
        // Fortran
        else if (this.filepath.slice(-2) === ".f" || this.filepath.slice(-4) === ".for" || this.filepath.slice(-4) === ".f90" || this.filepath.slice(-4) === ".f95") {
            this.mode = "text/x-Fortran";
            document.getElementById('mode').innerHTML = 'Fortran';
        }
        // PHP
        else if (this.filepath.slice(-4) === ".php") {
            this.mode = "text/x-php";
            document.getElementById('mode').innerHTML = 'PHP';
        }
        // Swift
        else if (this.filepath.slice(-6) === ".swift") {
            this.mode = "text/x-swift";
            document.getElementById('mode').innerHTML = 'Swift';
        }
        // YAML
        else if (this.filepath.slice(-4) === ".yml" || this.filepath.slice(-5) === ".yaml") {
            this.mode = "text/x-yaml";
            document.getElementById('mode').innerHTML = 'YAML';
        }
        // Plain Text
        else {
            document.getElementById('mode').innerHTML = 'Plain Text';
        }

        // GLSL
        if (this.filepath.slice(-5) === ".glsl" ||
            this.filepath.slice(-5) === ".frag") {
            this.mode = "text/x-glsl";

            Code_Reactor.editor[this.viewport].editor.setOption("theme", "glsl");
            Code_Reactor.toggleGLSLMode(true);
            document.getElementById('mode').innerHTML = 'GLSL';
        } else {
            Code_Reactor.editor[this.viewport].editor.setOption("theme", "monokai");
            Code_Reactor.toggleGLSLMode(false);
        }

        Code_Reactor.editor[this.viewport].editor.setOption("mode", this.mode);
    },

    appendToWorkplace: function () {
        var filename = this.updateFilename();
        console.log('append: ' + filename);

        document.getElementById('workplace').innerHTML += '<li id="ofile' + this.instance.toString() + '"><a href="#" onclick="Code_Reactor.file[' + this.instance.toString() + '].render()">' + filename + '</a></li>';
    },

    removeFromOpenedFilesList: function () {
        $("li").remove("#ofile" + this.instance.toString());
    },

    render: function () {
        this.detectMode();
        Code_Reactor.editor[this.viewport].file = this.instance;
        Code_Reactor.editor[this.viewport].loadContent(this.content);
    }

};
