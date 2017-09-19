(function ($) {
    'use strict';

    nn.init = nn.init || {};
    $.extend(nn.init, {

        /**
         * Call all init functions from the nn object
         * @name ubs.init.all(c)
         *
         * @param {String} c DOM Context
         * @param {String} readyState - "documentready", "onload" or undefined
         */
        all: function (c, readyState) {
            var initQueueElement;

            c = c || "body";
            //only execute on first init
            if (!nn.global.status.setupComplete) {
                //set global environment
                this.setEnv();
                nn.global.env.setEnv();

                //set status variables
                this.setStatus();
                nn.global.status.setStatus();

                //init config
                if (nn.config.init) {
                    nn.config.init();
                }

                //cache elements
                nn.global.cache.setCache(c);

                nn.global.status.setupComplete = true;
            }

            //if no modules for init are saved build a list with all modules/elements for initialisation.
            //list gets saved so that it only has to be build once for documentready and onload initialisation.
            //Afterwards the list gets deleted.
            if (nn.global.modules && nn.global.modules.length === 0) {
                this.getModulesList.init(c);
            }

            this.initQueue = this.initQueue || [];
            //if initialization is currently running a list gets build with objects containing the init context and ready state.
            //the elements from the array will get executed one after each other (fifo) till the list is empty.
            if (this.initongoing && readyState !== "onload") {
                initQueueElement = {};
                initQueueElement.context = c;
                initQueueElement.readystate = readyState;
                this.initQueue.push(initQueueElement);
                return;
            }

            this.initongoing = true;
            this.initModules(readyState, c);
        },

        /**
         * Set all global environment variables
         */
        setEnv: function () {
            var env = nn.global.env;

            if (typeof CQ !== 'undefined' && typeof CQ.utils !== 'undefined') {
                if (typeof CQ.utils.WCM.isEditMode !== 'undefined' && typeof CQ.utils.WCM.isPreviewMode !== 'undefined' &&
                    typeof CQ.utils.WCM.isDesignMode !== 'undefined') {

                    if (CQ.utils.WCM.isEditMode()) {
                        env.cqEdit = true;
                        env.publish = false;
                    } else if (CQ.utils.WCM.isPreviewMode()) {
                        env.cqPreview = true;
                        env.publish = false;
                    } else if (CQ.utils.WCM.isDesignMode()) {
                        env.cqDesign = true;
                        env.publish = false;
                    }
                }
            }
        },

        /**
         * Set all global status variables
         */
        setStatus: function () {
            var status = nn.global.status;
            status.svg = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');
            status.direction = $('html').css('direction');
            if (window.self !== parent) {
                status.iframe = true;
            }
        },

        /**
         * Create a list of all
         */
        getModulesList: {

            moduleList: {
                first: [],
                middle: [],
                last: [],
                cache: []
            },

            /**
             * build a list of all modules/elements for initialization correctly sorted
             *
             * @param c - context to search in
             */
            init: function (c) {
                //find all modules in context
                var $dataModules,
                    config;

                $dataModules = $(c).find("[data-nn-init]").addBack("[data-nn-init]");
                config = nn.config;

                //get all modules that should get initialized first
                $dataModules = this.buildModuleList("first", $dataModules, config.loadFirst);
                //get all modules that should get initialized last
                $dataModules = this.buildModuleList("last", $dataModules, config.loadLast);
                //get all modules where no specific init order is that. These modules are sorted automatically in the order they appear in the html
                this.buildModuleList("middle", $dataModules, $dataModules);
                //concatenate first, middle and last modules
                nn.global.modules = this.moduleList.first.concat(this.moduleList.middle, this.moduleList.last);

            },

            /**
             * Build a list of all modules/elements that should get initialized
             *
             *
             * @string moduleList - defines what modules are threaded. Possible values "first", "middle" or "last"
             * @object $dataModules - object that lists of all modules/elements that have been marked with the data attribute
             * @array modulesToLoad - array of modules that should get initialized
             * @returns {*} - returns an object containing remaining list of $dataModules that have not been initialized yet
             */
            buildModuleList: function (moduleList, $dataModules, modulesToLoad) {
                var gml = nn.init.getModulesList,
                    self = this;

                //reset array
                this.moduleList[moduleList] = [];
                $.each(modulesToLoad, function (key, value) {
                    var moduleName,
                        $modulesByType,
                        $moduleObject,
                        moduleSplitName,
                        $module = $(this);

                    // not necessary to filter in the middle part. All elements in modulesToLoad === $dataModules get initialized
                    if (moduleList === "middle") {
                        moduleName = $(this).data("nn-init");
                        //remove leading and trailing spaces
                        moduleName = moduleName.replace(/^\s+/, '').replace(/\s+$/, '');

                        //split when multiple modules should get initialized
                        moduleSplitName = moduleName.split(' ');

                        $.each(moduleSplitName, function () {
                            gml.addModule(this, moduleList, $module);
                        });

                    }
                    else {
                        moduleName = value;
                        //filter out elements that are in modulesToLoad list and are included in $dataModules
                        //all other elements have a global context
                        $modulesByType = $dataModules.filter("[data-nn-init~='" + moduleName + "']");

                        if ($modulesByType.length) {
                            $.each($modulesByType, function () {
                                $moduleObject = $(this);
                                //add element to the module init list
                                gml.addModule(moduleName, moduleList, $moduleObject);
                            });
                        }
                        else {
                            //add module to the module init list
                            gml.addModule(moduleName, moduleList);
                        }
                    }

                });

                //check if queued elements are in cache - if the case add them now
                for (var i = 0; self.moduleList.cache.length; i++) {
                    self.moduleList[moduleList].push(self.moduleList.cache.pop());
                }

                return $dataModules;
            },

            /**
             * adds a module/element to the moduleList
             *
             * @string moduleName - the name of the module to add
             * @param moduleList - the specific moduleList to add to
             * @param $element - the element to add - should one exist
             */
            addModule: function (moduleName, moduleList, $element) {
                var config = nn.config,
                    queuedModule,
                    requiredModules,
                    $queuedModuleElement = $(),
                    configModule = {}; // module in config file

                if ($element) {
                    //only add elements that are not listed yet in "first" or "last"
                    if ($element.data("nn-listed-" + moduleName)) {
                        return;
                    }
                    //mark module that gets added
                    $element.data("nn-listed-" + moduleName, true);
                }

                //create a config object for the element cloning settings from the config file
                configModule[moduleName] = $.extend(true, {}, config.module[moduleName]);
                //add more specific parameters
                configModule[moduleName] = this.addDataParameters(configModule[moduleName], moduleName, $element);

                if (nn.global.status.debug && configModule[moduleName].required) {
                    requiredModules = configModule[moduleName].required;
                    if (typeof requiredModules === 'string') {
                        requiredModules = [requiredModules];
                    }

                    for (var i = 0; i < requiredModules.length; i++) {
                        if (config.module[requiredModules[i]].devVersion) {
                            config.module[requiredModules[i]].path = config.module[requiredModules[i]].devVersion.path;
                        }
                    }
                }

                if (configModule[moduleName].initAfterChildren) {
                    //add first all children, cache element
                    this.moduleList.cache.push(configModule);
                } else {
                    if (this.moduleList.cache.length) {
                        //check if last cached element can get added
                        queuedModule = this.moduleList.cache.pop();
                        $.each(queuedModule, function (key, value) {
                            $queuedModuleElement = value.jQueryElement;
                        });
                        if ($element.parents().filter($queuedModuleElement).length) {
                            this.moduleList.cache.push(queuedModule);
                        } else {
                            this.moduleList[moduleList].push(queuedModule);
                        }
                    }

                    //add the module with config informations to the moduleList
                    this.moduleList[moduleList].push(configModule);
                }

            },

            /**
             * adds parameters of the data attribute "data-nn-params" to the global configuration settings.
             * data attributes have always priority and overwrite all other configurations
             *
             *
             * @param configModule - the global config settings of a module
             * @string moduleName - the name of the module to add
             * @param $element - the specific element that gets initilalized
             * @returns {*} - returns the element specific enriched configModule
             */
            addDataParameters: function (configModule, moduleName, $element) {
                var params;
                if ($element) {
                    configModule.jQueryElement = $element;
                    //get params
                    params = $element.data("nn-params-" + moduleName.toLowerCase());
                    //fallback to generic params for legacy support
                    if (!params) {
                        params = $element.data("nn-params");
                    }
                    if (params) {
                        if (typeof params !== "object") {
                            // replace single quotes with double quotes to generate well formed string for Json transformation
                            params = params.replace(/'/g, "\"");
                            params = $.parseJSON(params);
                        }
                        $.extend(true, configModule, params);
                    }
                }
                return configModule;
            }

        },

        /**
         * All modules and elements get initialised
         *
         *
         * @param readyState - state we are in. Either "documentready", "onload" or undefined
         * @param c - the context. Standard is "body"
         */
        initModules: function (readyState, c) {

            var self = this,
                module,
                moduleName,
                initObject,
                $moduleContext;

            //iterate over module array

            $.each(nn.global.modules, function (key, value) {
                //iterate over elements in every array slot
                $.each(value, function (key, value) {
                    module = value;
                    // remap module name is set
                    if (module.moduleMap) {
                        moduleName = module.moduleMap;
                    }
                    else {
                        moduleName = key;
                    }
                    //check if module has correct environment.
                    if (nn.init.checkModuleEnv(module.env)) {
                        // check if Module has correct ready state
                        if (nn.init.checkModuleReadyState(module.initOn, readyState)) {
                            // get context of module  if false module is not valid for init
                            $moduleContext = nn.init.getModuleContext(module, moduleName, c);
                            if ($moduleContext) {
                                self._checkForScripts(moduleName, $moduleContext, module);
                                
                            }
                        }
                    }
                });
            });
            //set init state and reset the modules
            if (readyState === 'onload' || readyState === undefined) {
                nn.global.modules = [];
                nn.global.status.initialized = true;
                this.initongoing = false;
                // init first object from the initQueue
                if (this.initQueue.length) {
                    initObject = this.initQueue.shift();
                    this.all(initObject.context, initObject.readystate);
                }

            }
        },

        /**
         * Check if some additional Scripts need to be loaded.
         * That can either be some additional required modules to load or defeered loading of the current module
         *
         * @param {string} - moduleName
         * @param {jquery object} - $moduleContext
         * @param {object} - module
         * @private
         */
        _checkForScripts: function (moduleName, $moduleContext, module) {
            var requiredModule;

            //check if some required modules/scripts are defined for module
            if (module.required && module.required.length > 0) {
                requiredModule = module.required[0];
                module.required.shift();
                // check if javascript for module exists in namespace as jquery plugin or in global space
                if ($.fn[requiredModule] || nn[requiredModule] || window[requiredModule] || typeof requiredModule === 'function') {
                    nn.init._checkForScripts(moduleName, $moduleContext, module);
                }
                else {
                    nn.init._deferredModuleLoadingAndInit(moduleName, $moduleContext, module, requiredModule);
                }
            }
            // check if module has a deferred loading script
            else {
                // check if javascript for module exists in namespace or as jquery plugin
                if ($.fn[moduleName] || nn[moduleName]) {
                    nn.init.initSingleModule(moduleName, $moduleContext, module.options);
                }
                else {
                    nn.init._deferredModuleLoadingAndInit(moduleName, $moduleContext, module);
                }
            }
        },

        /**
         * loads the javascript for a current module and afterwards initializes it
         * or if there are script module requirements first loads those
         * queues up multiple modules that need the same script to avoid double loads
         *
         * @param {string} - moduleName
         * @param {jquery object} - $moduleContext
         * @param {object} - module
         * @param {string} - requiredModuleName
         */
        _deferredModuleLoadingAndInit: function (moduleName, $moduleContext, module, requiredModuleName) {
            var self = this,
                cacheSetting = false,
                deferredModule,
                deferredModuleName;

            //get path to the module to load
            if (requiredModuleName) {
                deferredModuleName = requiredModuleName;
                deferredModule = nn.config.module[requiredModuleName];
            } else {
                deferredModule = module;
                //when not required loading load the actual module
                deferredModuleName = moduleName;
            }
            //create the deferred loading object for the specific module
            this.deferred = this.deferred || {};
            this.deferred[deferredModuleName] = this.deferred[deferredModuleName] || {};
            this.deferred[deferredModuleName].modules = this.deferred[deferredModuleName].modules || [];
            this.deferred[deferredModuleName].modules.push([moduleName, $moduleContext, module]);
            //load the module if path to it is set
            if (!this.deferred[deferredModuleName].status) {
                if (deferredModule.path) {
                    this.deferred[deferredModuleName].status = 'loading';
                    if (deferredModule.ajaxCache) {
                        cacheSetting = deferredModule.ajaxCache;
                    }
                    $.ajax({
                        url: deferredModule.path,
                        dataType: 'script',
                        cache: cacheSetting
                    })
                        .done(function () {
                            $.each(self.deferred[deferredModuleName].modules, function () {
                                if (this[2].required) {
                                    nn.init._checkForScripts.apply(null, this);
                                } else {
                                    nn.init.initSingleModule.apply(null, this);
                                }
                            });

                            self.deferred[deferredModuleName].status = 'ready';
                            self.deferred[deferredModuleName].modules = [];
                        });
                }
            } else if (this.deferred[deferredModuleName].status === 'ready') {
                if (requiredModuleName) {
                    nn.init._checkForScripts(moduleName, $moduleContext, module);
                } else {
                    nn.init.initSingleModule(moduleName, $moduleContext, module);
                }
            }
        },

        /**
         * initializes either the widget, plugin or init method for an element
         *
         * @param {string} - moduleName
         * @param {jquery object} - $moduleContext
         * @param {object} - moduleOptions
         */
        initSingleModule: function (moduleName, $moduleContext, moduleOptions) {
            // check if plugin or widget with name exist
            if ($.fn[moduleName]) {
                //console.log("init of Plugin: " + moduleName);
                $moduleContext[moduleName](moduleOptions);
            }

            else if (nn[moduleName]) {
                //else call init method
                //console.log("init of Module: " + moduleName);
                nn[moduleName].init($moduleContext, moduleOptions);
            }

            // reset module list state (otherwise element is not listed on re-init)
            $moduleContext.data('nn-listed-' + moduleName, false);

            // set element init state
            $moduleContext.data('nn-init-state' + moduleName, true);
        },

        /**
         * function checks if an element should get initialized
         *
         * elements that have a context get checked if they have been initialized before
         * elements without a context that are initialized globally get checked if the global init was already executed
         * both can be overwritten by setting "forceInit" of the module to "true" to enforce re-init of the element
         *
         * @param module - the module/element the context is searched
         * @param {string} - moduleName
         * @param c - the global init context
         * @returns {boolean} or {element} - returns false if element was already initialised or the context for the element/module
         */

        getModuleContext: function (module, moduleName, c) {
            var context = false,
                $moduleObject;

            //check if init is executed on jquery module element as context
            $moduleObject = module.jQueryElement;
            if ($moduleObject) {
                // check if already initialized
                if (!$moduleObject.data("nn-init-state" + moduleName) || module.forceInit) {
                    context = $moduleObject;
                }
            }
            else {
                // check if global init was already executed
                if (!nn.global.status.initialized || module.forceInit) {
                    if (nn.config.initModulesNotInDOM || module.initModulesNotInDOM) {
                        context = $(c);
                    }
                }
            }
            return context;
        },

        /**
         * Check if element/module is in correct ready state
         *
         * @param {string} moduleInitOn - the state the specific module/element should get initialized with. Possible values "documentready", "onload" or undefined
         * @param {string} readyState - current ready state that gets initialized. Possible values "documentready", "onload" or undefined
         * @returns {boolean}
         */
        checkModuleReadyState: function (moduleInitOn, readyState) {
            var init = false;
            // no ready state is set than init everything. That means the call was done after page the page load.
            if (readyState === undefined) {
                init = true;
            }
            else if (moduleInitOn === undefined) {
                //the module/element has no initOn set than as default value "documentready" is used
                if (readyState === "documentready") {
                    init = true;
                }
            }
            else if (moduleInitOn === readyState) {
                init = true;
            }
            return init;
        },

        /**
         * Checks if the module/element is permitted for init in the current environment
         *
         * @param moduleEnv - the permitted environment(s) for the specific module/element
         * @returns {boolean}
         */
        checkModuleEnv: function (moduleEnv) {
            var globalEnv,
                inEnv = false,
                allModuleEnv;
            //no module environment set than default is true
            if (moduleEnv === undefined) {
                inEnv = true;
            }
            else {
                //module environment is set - check if it is allowed
                globalEnv = nn.global.env;
                allModuleEnv = moduleEnv.split(" ");
                $.each(allModuleEnv, function (key, value) {
                    if (value === "all" || globalEnv[value]) {
                        inEnv = true;
                        return false;
                    }
                });
            }
            return inEnv;
        }
    });

}(nn.jQuery || jQuery));