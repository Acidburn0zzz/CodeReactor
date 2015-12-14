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
        },
        copy: {
            main: {
                files: [
                    {
                        src: './libraries/win32/ffmpegsumo.dll',
                        dest: './build/Code_Reactor/win32/ffmpegsumo.dll',
                        flatten: true
                    },
                    {
                        src: './libraries/win64/ffmpegsumo.dll',
                        dest: './build/Code_Reactor/win64/ffmpegsumo.dll',
                        flatten: true
                    },
                    {
                        src: './libraries/linux32/libffmpegsumo.so',
                        dest: './build/Code_Reactor/linux32/libffmpegsumo.so',
                        flatten: true
                    },
                    {
                        src: './libraries/linux64/libffmpegsumo.so',
                        dest: './build/Code_Reactor/linux64/libffmpegsumo.so',
                        flatten: true
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.registerTask('default', ['nwjs', 'copy']);

};
