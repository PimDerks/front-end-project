module.exports = function(grunt) {

    // set the grunt force option (in wait of csslint task force option)
    grunt.option('force',true);

    // setup
    grunt.initConfig({

        pkg:grunt.file.readJSON('package.json'),

        /**
         * Set Environment variables
         */
        env:{
            src:'./src',
            dest:'./dest',
            dev: './dev',
            site:'./www',
            api:'./api',
            temp:'./tmp',
            spec:'./spec',
            static:'<%= env.src %>/static',
            banner:'/* <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
                   ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.homepage %>\n' +
                   ' */'
        },

        /**
         * Generate CSS files
         */
        sass:{
            dev:{
                options:{
                    style:'nested',
                    sourcemap:false
                },
                files:{
                    '<%= env.temp %>/css/screen.merged.css':'<%= env.static %>/sass/screen.scss',
                    '<%= env.temp %>/css/print.css':'<%= env.static %>/sass/print.scss'
                }
            }
        },
        csslint:{
            dev:{
                options:{
                    // https://github.com/stubbornella/csslint/wiki/Rules
                    // not all rules have been set to true since that would be too strict and not match project (as in we're not going to support IE6 so adjoining classes is irrelevant)
                    csslintrc:'.csslintrc',
                    force:true
                },
                src:['<%= env.temp %>/css/*.merged.css']
            }
        },
        autoprefixer:{
            modern:{
                options:{
                    browsers:['last 2 versions', 'ie 9']
                },
                src:'<%= env.temp %>/css/screen.merged.css',
                dest:'<%= env.temp %>/css/screen.prefixed.css'
            }
        },
        cssmin:{
            dev:{
                files:{
                    '<%= env.temp %>/css/styles.min.css':'<%= autoprefixer.modern.dest %>'
                }
            }
        },

        /**
         * Optimize JavaScript
         */
        jshint:{
            options:{
                jshintrc:'.jshintrc',

                // keep going on errors
                force:true
            },
            all:[
                '<%= env.static %>/js/client/**/*.js'
            ]
        },

        requirejs: {
            all: {
                options: {

                    // optimize javascript
                    optimize:'uglify', // none

                    // use the sites main configuration file
                    mainConfigFile:'<%= env.static %>/js/client/main.js',
                    appDir:'<%= env.static %>/js/',
                    baseUrl:'client/',
                    dir:'<%= env.temp %>/js',

                    // core modules to merge
                    modules:[
                        {
                            name:'main',
                            include:[

                                // conditioner tests
                                'conditioner/tests/media',
                                'conditioner/tests/viewport'

                                // ui modules
                                /* 'ui/Toggle',
                                'ui/ToggleGroup',
                                'ui/ToggleManager',
                                'ui/ToggleTrigger' */
                            ]
                        }
                    ],

                    // also merges text files
                    inlineText:true,

                    // remove all comments
                    preserveLicenseComments:false,

                    // stubModules can be used to remove unneeded plugins after build
                    //stubModules : ['text', 'hgn'],

                    // handlebars optimization
                    pragmasOnSave: {

                        // you can use this pragma to exclude compiler logic from Hogan.js in
                        // case you don't need to compile any templates after build
                        excludeHogan : true

                        /*

                        //removes Handlebars.Parser code (used to compile template strings) set
                        //it to `false` if you need to parse template strings even after build
                        excludeHbsParser:true,

                        // kills the entire plugin set once it's built.
                        excludeHbs:true,

                        // removes i18n precompiler, handlebars and json2
                        excludeAfterBuild: true
                        */
                    }
                }
            }
        },

        jasmine:{
            all:{
                src:[
                    '<%= env.static %>/js/client/**/*.js'
                ],
                options:{

                    specs:'<%= env.spec %>/*Spec.js',
                    helpers:['<%= env.static %>/js/shim/Function.bind.js'],
                    keepRunner:true,

                    template:require('grunt-template-jasmine-requirejs'),
                    templateOptions:{
                        requireConfigFile:'<%= env.static %>/js/client/main.js',
                        requireConfig:{
                            baseUrl:'./src/static/js/client',
                            paths:{
                                'static/js/client':'.'
                            },
                            config:{
                                'data/DataProvider':{
                                    'options':{
                                        'url':'http://localhost:4001/api/',
                                        'api':{
                                            /* 'getSpots':{
                                                'uri':'spot?page={0}&selectedAbilityIDs={1}&categoryGroupIDs={2}&searchTerm={3}&searchByCity={4}&latitude={5}&longitude={6}',
                                                'params':['page','abilities','categories','term','city','lat','lon']
                                            },
                                            'getLocation':{
                                                'uri': 'location?lat={0}&lng={1}',
                                                'params':['lat','lng']
                                            } */
                                        }
                                    }
                                }
                            },
                            deps:['conditioner']
                        }
                    }
                }
            }
        },

        uglify:{
            options:{
                //mangle:false,
                //compress:false
            },
            all:{
                files:[{
                    expand:true,
                    cwd:'<%= env.static %>/js',
                    src:'**/*.js',
                    dest:'<%= env.temp %>/js'
                }]
            },
            shim:{
                files:{
                    '<%= requirejs.all.options.dir %>/shim/all.js':[
                        '<%= env.static %>/js/shim/Function.bind.js',
                        '<%= env.static %>/js/shim/Object.defineProperty.js',
                        '<%= env.static %>/js/shim/Window.matchMedia.js',
                        '<%= env.static %>/js/shim/Window.matchMedia.addListener.js',
                        '<%= env.static %>/js/shim/ClassList.js',
                        '<%= env.static %>/js/shim/Dataset.js'
                    ]
                }
            }
        },

        /**
         * Clean
         */
        clean:{
            static:['<%= env.site %>/static/scss','<%= env.site %>/static/js'],
            templates:['<%= env.site %>/templates/'],
            dest:['<%= env.site %>/src/']
        },

        /**
         * Copy static
         */
        copy:{
            static:{
                files:[
                    {
                        expand:true,
                        cwd:'<%= env.temp %>',
                        src:'**',
                        dest:'<%= env.site %>/static/'
                    }
                ]
            },
            assets: {
                files:[
                    {
                        expand:true,
                        cwd:'<%= env.src %>/static/assets/',
                        src:'**',
                        dest:'<%= env.site %>/static/assets/'
                    }
                ]
            },
            media: {
                files:[
                    {
                        expand:true,
                        cwd:'<%= env.src %>/media/',
                        src:'**',
                        dest:'<%= env.site %>/media/'
                    }
                ]
            },
            dest:{
                files:[
                    {
                        expand:true,
                        cwd:'<%= env.site %>/src/',
                        src:'**',
                        dest:'<%= env.site %>'
                    }
                ]
            },
            dev:{
                files:[
                    {
                        expand:true,
                        cwd:'<%= env.site %>/static/',
                        src:'**',
                        dest:'<%= env.dev %>'
                    }
                ]
            }
        },

        /**
         * Generate static site using Swig
         */

        swig: {
            development: {
                init: {
                    autoescape: true
                },
                dest: '<%= env.site %>/',
                src: ['<%= env.src %>/templates/*.swig'],
                production: true,
                generateSitemap: false,
                generateRobotstxt: false
            }
        },

        /**
         * Setup Webserver
         */
        connect:{
            server:{
                options:{
                    hostname:'*',
                    port:4000,
                    keepalive:true,
                    base:'<%= env.site %>'
                }
            }
        },

        /**
         * Runs shell commands
         */
        shell:{

            /**
             * Run stub API
             */
            api:{
                command:'node restify port=4001',
                options:{
                    stdout:true,
                    execOptions: {
                        cwd:'<%= env.api %>'
                    }
                }
            }
        },

        /**
         * Watch static files
         */
        watch:{
            sass:{
                files:['<%= env.static %>/**/*.scss'],
                tasks:['_css','copy:static']
            },
            js:{
                files:['<%= env.static %>/**/*.js','<%= env.spec %>/**/*.js'],
                tasks:['_js','copy:static', '_dest']
            },
            swig:{
                files:['<%= env.src %>/**/*.swig','<%= env.src %>/**/*.html'],
                tasks:['_html','_dest']
            }
        },

        /**
         * Creates zip package of www folder
         */
        zip:{
            all:{
                cwd:'<%= env.site %>/static/',
                src:['<%= env.site %>/static/**'],
                dest:'<%= env.dest %>/static.zip'
            }
        },

        /**
         * Allows running of various concurrent tasks at once
         */
        concurrent:{
            all:{
                options:{
                    logConcurrentOutput: true,
                    limit:20
                },
                tasks:[

                    // start REST server and HTTP server
                    'shell:api',
                    'connect:server',

                    // watch static files
                    'watch:sass','watch:js',

                    // watch HTML files
                    'watch:swig',

                    // start first build
                    'build'
                ]
            }
        }

    });


    /**
     * Needs the following node modules
     */
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-swig');
    //grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-zip');


    // 'private' css build set
    grunt.registerTask('_css',['sass','csslint','autoprefixer']);

    // 'private' js build set
    grunt.registerTask('_js',['jshint','uglify:all','jasmine','requirejs','uglify:shim']);

    // 'private' html build set
    grunt.registerTask('_html',['clean:templates','swig','clean:static','copy:static','copy:assets','copy:media']);
    grunt.registerTask('_dest',['copy:dest','clean:dest']);

    /**
     * Quick build of the project
     */
    grunt.registerTask('build',['_css','_js','_html','_dest']);

    /**
     * Sets up dev environment
     */
    grunt.registerTask('dev',['concurrent']);

    /**
     * Builds project and creates zip package
     */
    grunt.registerTask('pack',['zip']);

    /**
     * Inject app scripts into styleguide
     */
    grunt.registerTask('inject',[]);

    /**
     * Inject app scripts into styleguide
     */
    grunt.registerTask('static',['copy:dev']);

};