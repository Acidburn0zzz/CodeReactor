module.exports = function (grunt) {

    grunt.initConfig({
        nwjs: {
            options: {
                version: '0.12.3',
                macIcns: 'icons/icon.icns',
                winIco: 'icons/icon.ico',
                platforms: ['win', 'win32', 'win64',
                            'linux', 'linux32', 'linux64',
                            'osx', 'osx32', 'osx64']
            },
            src: ['./*', './icons/**/*', './css/*', './src/**/*', 'fonts/**/*',
                  './node_modules/app-root-path/**/*', './node_modules/beautifier/bin/*', './node_modules/beautifier/lib/*',
                  './node_modules/bootstrap/dist/js/bootstrap.min.js', './node_modules/bootstrap/dist/css/bootstrap.min.css', './node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
                  './node_modules/codemirror/addon/**/*', './node_modules/codemirror/lib/*', './node_modules/codemirror/mode/**/*',
                  './node_modules/codemirror/theme/*', './node_modules/codemirror/keymap/*',
                  './node_modules/grunt/lib/**/*', './node_modules/isbinaryfile/*',
                  './node_modules/jquery/dist/jquery.min.js', './node_modules/jquery.hotkeys/jquery.hotkeys.js',
                  './node_modules/jsonfile/index.js', './node_modules/shelljs/**/*'
                 ]
        }
    });

    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.registerTask('default', ['nwjs']);

};
