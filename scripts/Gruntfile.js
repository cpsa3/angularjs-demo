'use strict'

module.exports = function(grunt) {
    // Load grunt tasks automatically  
    //require('load-grunt-tasks')(grunt);

    var cfg = {
        src: 'app/',
        dist: 'dist/',
        tmp: '.tmp/',
        serverHost: 'localhost',
        serverPort: 9000,
        livereload: 35729
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        srcMapDemo: grunt.file.readJSON('app/srcmap/srcmap-demo.json'),
        cfg: cfg,

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: 'checkstyle', //require('jshint-stylish'),
                reporterOutput: cfg.tmp + 'jshint-report.xml',
                force: true
            },
            all: ['app/modules/**/*.js']
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            demo: {
                options: {
                    sourceMap: false,
                },
                files: "<%= srcMapDemo.files %>"
            }
        },
        // Optimize RequireJS projects using r.js.
        requirejs: {
            compile: {
                options: {
                    mainConfigFile: "app/main.js",
                    baseUrl: "app",
                    removeCombined: true,
                    findNestedDependencies: true,
                    dir: "dist",
                    modules: [{
                        name: "app",
                        exclude: [
                            "jquery",
                            "angular",
                            "uiRouter"
                        ]
                    }]
                }
            }
        },
        copy: {
            demo: {
                expand: true,
                // makes all src relative to cwd
                cwd: cfg.tmp,
                src: 'uglify/**',
                dest: cfg.dist,
            },
        },
        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            js: {
                //expand: true,
                src: [
                    'dist/*.js'
                ],
                //dest: 'tmp'
            }
        },
        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'tmp'
            }
        },
        usemin: {
            html: {
                files: [{
                    src: 'dist/index.html'
                }]
            },
        },
        //开启服务
        connect: {
            options: {
                port: cfg.serverPort,
                hostname: cfg.serverHost,
                livereload: cfg.livereload
            },
            dev: {
                options: {
                    open: true,
                    base: cfg.src
                }
            }
        },
        //监控文件变化
        watch: {
            dev: {
                options: {
                    livereload: cfg.livereload
                },
                files: [
                    cfg.src + '/**/*.{html,js}'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('default', ['jshint']);
    //grunt.registerTask('build', ['useminPrepare', 'filerev', 'usemin']);
    grunt.registerTask('dev', ['connect:dev', 'watch:dev']);
    grunt.registerTask('release', ['uglify:demo', 'requirejs:compile', 'copy:demo']);
};
