'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        clean: {
            src: ['dist']
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['src/js/*.js'],
                dest: 'dist/js/<%= pkg.name %>.js'
            },
            css: {
                src: ['src/css/reset.css', 'src/css/main.css'],
                dest: 'dist/css/main.css'
            }

        },
        run: {
            buildLevels: {
                cmd: 'node',
                args: [
                    'src/levels/jsbl.js',
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'],
                        dest: 'dist/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/lib/*'],
                        dest: 'dist/lib',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/levels/levels.jsbl'],
                        dest: 'dist/levels/',
                        filter: 'isFile'
                    }

                ]
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['src/js/**/*.js']
            },
            test: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['test/**/*.js']
            }
        },
        watch: {
            options: {
                livereload: true
            },

            html: {
                files: 'src/index.html',
                tasks: 'copy'
            },
            css: {
                options: {
                    livereload: false
                },
                files: 'src/css/*.css',
                tasks: ['concat:css']
            },
            watchedCss: {
                files: 'dist/css/main.css',
                tasks: []
            },
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test']
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        },
        'gh-pages': {
            options: {
                base: 'dist/'
            },
            src: ['**/*']
        },
        connect: {
            options: {
                port: process.env.PORT || 8090,
                base: 'dist/'
            },

            all: {}
        }

    });


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-run');

    // Default task.
    grunt.registerTask('default', ['jshint', 'clean', 'mochaTest', 'concat', 'run:buildLevels', 'copy', 'uglify']);
    grunt.registerTask('server', ['default', 'connect', 'watch']);
    grunt.registerTask('deploy', ['default', 'gh-pages']);


};