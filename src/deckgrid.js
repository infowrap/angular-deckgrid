/*
 * angular-deckgrid
 *
 * Copyright(c) 2013 Andre Koenig <akoenig@posteo.de>
 * MIT Licensed
 *
 */

/**
 * @author André König (akoenig@posteo.de)
 *
 */

angular.module('akoenig.deckgrid').provider('Deckgrid', function(){

    var _configLoopLimit = 3;
    var _defaultLayout = {
        columns: 1,
        classList: "column column-1-width"
    };

    return {
        setConfigLoopLimit: function(limit){
            if (limit){
                _configLoopLimit = limit;
            }
        },
        setDefaultLayout: function(layout){
            if (layout){
                _defaultLayout = layout;
            }
        },
        $get: [

            '$window',
            '$log',
            '$rootScope',
            '$q',
            '$timeout',

            function initialize ($window, $log, $rootScope, $q, $timeout) {

                'use strict';

                /**
                 * The deckgrid directive.
                 *
                 */
                function Deckgrid (scope, element) {
                    var self = this,
                        watcher;

                    this.$$elem = element;
                    this.$$watchers = [];

                    this.$$scope = scope;
                    this.$$scope.columns = [];

                    //
                    // The layout configuration will be parsed from
                    // the pseudo "before element." There you have to save all
                    // the column configurations.
                    //
                    this.$$getLayout().then(function(layout){
                        self.$$scope.layout = layout;
                        self.$$createColumns();

                        //
                        // Register model change.
                        //
                        watcher = self.$$scope.$watch('model', self.$$onModelChange.bind(self), true);
                        self.$$watchers.push(watcher);

                        //
                        // Register media query change events.
                        //
                        angular.forEach(self.$$getMediaQueries(), function onIteration (rule) {
                            function onDestroy () {
                                rule.removeListener(self.$$onMediaQueryChange.bind(self));
                            }

                            rule.addListener(self.$$onMediaQueryChange.bind(self));

                            self.$$watchers.push(onDestroy);
                        });
                    });
                }

                /**
                 * @private
                 *
                 * Extracts the media queries out of the stylesheets.
                 *
                 * This method will fetch the media queries out of the stylesheets that are
                 * responsible for styling the angular-deckgrid.
                 *
                 * @return {array} An array with all respective styles.
                 *
                 */
                Deckgrid.prototype.$$getMediaQueries = function $$getMediaQueries () {
                    // var stylesheets = [],
                    var mediaQueries = [];

                    var sheets = document.styleSheets;

                    // stylesheets = Array.prototype.concat.call(
                    //     Array.prototype.slice.call(document.querySelectorAll('style[type=\'text/css\']')),
                    //     Array.prototype.slice.call(document.querySelectorAll('link[rel=\'stylesheet\']'))
                    // );


                    function extractRules (stylesheet) {
                        try {
                            return (stylesheet.sheet.cssRules || []);
                        } catch (e) {
                            return [];
                        }
                    }

                    function hasDeckgridStyles (rule) {
                        var regexe   = /\[(\w*-)?deckgrid[^\]]*\]::?before/g,
                            i        = 0,
                            selector = '';

                        if (!rule.media || angular.isUndefined(rule.cssRules)) {
                            return false;
                        }

                        i = rule.cssRules.length - 1;

                        for (i; i >= 0; i = i - 1) {
                            selector = rule.cssRules[i].selectorText;

                            if (angular.isDefined(selector) && selector.match(regexe)) {
                                return true;
                            }
                        }

                        return false;
                    }

                    angular.forEach(sheets, function onIteration (stylesheet) {
                        //var rules = extractRules(stylesheet);
                        // the above is commented out because it does not work with document.styleSheets
                        var rules = stylesheet.cssRules;

                        angular.forEach(rules, function inRuleIteration (rule) {
                            if (rule.constructor === CSSMediaRule && hasDeckgridStyles(rule)) {
                                mediaQueries.push($window.matchMedia(rule.media.mediaText));
                            }
                        });
                    });

                    return mediaQueries;
                };

                /**
                 * @private
                 *
                 * Creates the column segmentation. With other words:
                 * This method creates the internal data structure from the
                 * passed "source" attribute. Every card within this "source"
                 * model will be passed into this internal column structure by
                 * reference. So if you modify the data within your controller
                 * this directive will reflect these changes immediately.
                 *
                 * NOTE that calling this method will trigger a complete template "redraw".
                 *
                 */
                Deckgrid.prototype.$$createColumns = function $$createColumns () {
                    var self = this;

                    if (!this.$$scope.layout) {
                        return $log.log('angular-deckgrid: No CSS configuration found (see ' +
                                           'https://github.com/akoenig/angular-deckgrid#the-grid-configuration)');
                    }

                    this.$$scope.columns = [];

                    angular.forEach(this.$$scope.model, function onIteration (card, index) {
                        var column = (index % self.$$scope.layout.columns) | 0;

                        if (!self.$$scope.columns[column]) {
                            self.$$scope.columns[column] = [];
                        }

                        self.$$scope.columns[column].push(card);
                    });
                };

                /**
                 * @private
                 *
                 * Parses the configuration out of the configured CSS styles.
                 *
                 * Example:
                 *
                 *     .deckgrid::before {
                 *         content: '3 .column.size-1-3';
                 *     }
                 *
                 * Will result in a three column grid where each column will have the
                 * classes: "column size-1-3".
                 *
                 * You are responsible for defining the respective styles within your CSS.
                 *
                 */
                Deckgrid.prototype.$$getLayout = function $$getLayout () {
                    var defer = $q.defer();
                    var content, layout, self = this, configLoopLimit = _configLoopLimit, loopCnt = 0, getConfigTimeout;

                    var getCssConfig = function(){
                        content = $window.getComputedStyle(self.$$elem, ':before').content;
                    };

                    var resolveLayout = function(){
                        content = content.replace(/'/g, '');  // before e.g. '3 .column.size-1of3'
                        content = content.replace(/"/g, '');  // before e.g. "3 .column.size-1of3"
                        content = content.split(' ');

                        layout = {};
                        if (2 === content.length) { 
                            layout.columns = (content[0] | 0);
                            layout.classList = content[1].replace(/\./g, ' ').trim();
                        } else {
                            // use default
                            layout = _defaultLayout;
                        }

                        if (getConfigTimeout) {
                            // cancel any pending timeouts if they exists
                            $timeout.cancel(getConfigTimeout);
                        }
                        defer.resolve(layout);
                    };

                    var getConfigTimeoutLoop = function(){
                        getConfigTimeout = $timeout(function(){
                            getCssConfig();
                            if (content) {
                                resolveLayout();
                            } else if (loopCnt < configLoopLimit) {
                                loopCnt++;
                                getConfigTimeoutLoop();
                            }
                        }, 300);
                    };

                    getCssConfig();

                    if (content) {
                        resolveLayout();
                    } else {
                        getConfigTimeoutLoop();
                    }

                    return defer.promise;
                };

                /**
                 * @private
                 *
                 * Event that will be triggered if a CSS media query changed.
                 *
                 */
                Deckgrid.prototype.$$onMediaQueryChange = function $$onMediaQueryChange () {
                    var self = this;
                    this.$$getLayout().then(function(layout){
                        //
                        // Okay, the layout has changed.
                        // Creating a new column structure is not avoidable.
                        //
                        if (layout && layout.columns !== self.$$scope.layout.columns) {
                            self.$$scope.layout = layout;
                            var onApply = function() {
                                self.$$createColumns();
                            };

                            var phase = $rootScope.$$phase;
                            if (phase === '$apply' || phase === '$digest') {
                                // digest in progress, just execute function
                                onApply();
                            } else {
                                self.$$scope.$apply(onApply);
                            }
                        }
                    });
                };

                /**
                 * @private
                 *
                 * Event that will be triggered when the source model has changed.
                 *
                 */
                Deckgrid.prototype.$$onModelChange = function $$onModelChange (oldModel, newModel) {
                    var self = this;

                    if (oldModel) {
                        if (angular.isUndefined(newModel)){
                            self.$$createColumns();
                        } else if (oldModel.length !== newModel.length) {
                            self.$$createColumns();
                        // } else if(oldModel.length > 0 && !angular.equals(oldModel[0],newModel[0])) {
                        } else if (oldModel.length > 0 && (angular.isUndefined(self.$$scope.columns) || self.$$scope.columns.length === 0)) {
                            self.$$createColumns();
                        }
                    }
                };

                /**
                 * Destroys the directive. Takes care of cleaning all
                 * watchers and event handlers.
                 *
                 */
                Deckgrid.prototype.destroy = function destroy () {
                    var i = this.$$watchers.length - 1;

                    for (i; i >= 0; i = i - 1) {
                        this.$$watchers[i]();
                    }
                };

                return {
                    create : function create (scope, element) {
                        return new Deckgrid(scope, element);
                    }
                };
            }
        ]
    };
});
