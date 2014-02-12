/*! angular-deckgrid (v0.6.8) - Copyright: 2013, André König (andre.koenig@posteo.de) - MIT */
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

angular.module('akoenig.deckgrid', []);

angular.module('akoenig.deckgrid').directive('deckgrid', [

    'DeckgridDescriptor',

    function initialize (DeckgridDescriptor) {

        'use strict';

        return DeckgridDescriptor.create();
    }
]);

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

angular.module('akoenig.deckgrid').factory('DeckgridDescriptor', [

    '$rootScope',
    'Deckgrid',

    function initialize ($rootScope, Deckgrid) {

        'use strict';

        /**
         * This is a wrapper around the AngularJS
         * directive description object.
         *
         */
        function Descriptor () {
            this.restrict = 'AE';

            this.scope = {
                'model': '=source'
            };

            //
            // Will be created in the linking function.
            //
            this.$$deckgrid = null;

            this.template = '<div data-ng-repeat="column in columns" class="{{layout.classList}}">' +
                                '<div data-ng-repeat-start="item in column"></div>' +
                                '<div data-ng-repeat-end></div>' +
                            '</div>';

            this.compile = function(tElement, tAttrs) {

                var type = tAttrs.deckgrid;
                var extraType = tAttrs.extraType;
                var extraIcon = tAttrs.extraIcon;
                var showLearnIf = tAttrs.showLearnIf;
                var learnText = tAttrs.learnText;
                var $columnOuterRepeater = tElement.find('[data-ng-repeat="column in columns"]');
                var $column = tElement.find('[data-ng-repeat-start="item in column"]');
                var columnAttrs = {
                    'data-bb-wrap-card':'item'
                };
                var innerContents = '';
                var learnTemplate = '';
                var additionalTemplate = '';

                if (type === 'card') {
                  if (learnText) {
                    learnTemplate = '<div ' +
                          'class="component learn" ' +
                          'data-ng-if="' + (showLearnIf ? showLearnIf + ' && ' : '') + '$parent.$last && $last" ' +
                          'data-type="' + extraType + '" ' +
                          'data-icon="' + extraIcon + '" ' +
                          '>' +
                          '<div class="contents"> ' +
                          learnText +
                          '</div>' +
                        '</div>';
                  }
                } else if (type === 'asset') {
                    if ($rootScope.isDetailPage) {
                      // modify semantics of directive naming value on detail views (for css)
                      tElement.attr('data-deckgrid', 'assets-full');
                    }
                    columnAttrs = {
                        'data-bb-wrap-asset':'item'
                    };
                    learnTemplate = '<div ' +
                        'data-ng-if="mother.section.assets.length == 1" ' +
                        'class="{{layout.classList}}" ' +
                        '>' +
                        '<div ' +
                          'class="component learn" ' +
                          'data-type="{{mother.section.type}}" ' +
                          'data-icon="{{mother.section.type}}" ' +
                          '>' +
                        '</div>' +
                      '</div>';
                } else if (type === 'gallery') {
                    columnAttrs = {
                        'data-ng-click':'$event.stopPropagation(); mother.showSlide(item.id);',
                        'class':'image loading-spinner',
                        'data-unveil-item':'item.asset',
                        'data-constrain-width':'270',
                        'data-fit':'max',
                        'data-has-image':'true'
                    };
                    innerContents =  '<div ' +
                        'class="spinner" ' +
                        'data-icon="spinner"' +
                        '></div> ' +
                    '<img ' +
                        'class="pusher" ' +
                        'data-pusher-gif ' +
                        'data-constrain-width="270" ' +
                        'data-calc-width="{{item.asset.width}}" ' +
                        'data-calc-height="{{item.asset.height}}" ' +
                        'data-fp-fallback="item.asset.url" ' +
                        '/>' +
                    '<div ' +
                        'data-ng-show="mother.editing" ' +
                        'data-icon="delete" ' +
                        'data-ng-click="$event.stopPropagation(); mother.removeImage(item.id);" ' +
                        '></div> ' +
                    '</div>';
                    additionalTemplate = '<div ' +
                      'data-ng-if="$parent.$last && $last" ' +
                      'class="image new" ' +
                      'data-has-image="false" ' +
                      'data-editor="true" ' +
                      'data-filepicker-btn ' +
                      'data-ng-show="mother.editing" ' +
                      'data-process-when="$root.activeWrap.editable" ' +
                      'data-store-location="S3" ' +
                      'data-mime-types="image/*" ' +
                      'data-target-id="mother.asset.id" ' +
                      'data-target-parent-id="$root.activeWrap.id" ' +
                      'data-target-type="gallery" ' +
                      'data-title="Add Images" ' +
                      '></div>';
                } else if (type === 'notification') {
                    columnAttrs = {
                        'data-bb-notification-card':'item',
                        'data-dashboard':'true',
                        'data-wraps':'mother.wraps',
                        'data-groups':'mother.groups'
                    };
                    learnTemplate = '<div ' +
                          'data-ng-if="' + (showLearnIf ? showLearnIf + ' && ' : '') + '$parent.$last && $last" ' +
                          'class="component learn" ' +
                          'data-type="' + extraType + '" ' +
                          'data-icon="' + extraIcon + '" ' +
                          '>' +
                          '<div class="contents"> ' +
                          learnText +
                          '</div>' +
                        '</div>';
                } else if (type === 'user') {

                    columnAttrs = {
                        'data-bb-user-row':'item',
                        'data-user-type':extraType
                    };
                    learnTemplate = '<div ' +
                          'data-ng-if="$parent.$last && $last" ' +
                          'class="component learn" ' +
                          'data-type="' + extraType + '" ' +
                          'data-icon="' + extraIcon + '" ' +
                          '>' +
                          '<div class="contents"> ' +
                          learnText +
                          '</div>' +
                        '</div>';
                    additionalTemplate = '<div ' +
                      'data-ng-if="$parent.$last && $last" ' +
                      'class="component new ' + extraType + '" ' +
                      'data-bb-share ' +
                      'data-ng-click="showOptions($event)" ' +
                      'data-target="$root.activeWrap" ' +
                      'data-type="' + (extraType === 'followers' ? 'follow' : 'collaborate') + '" ' +
                      'data-target-name="$root.activeWrap.name" ' +
                      'data-title="Invite ' + _.capitalize(extraType) + '" ' +
                      '></div>';
                } else if (type === 'member') {
                    columnAttrs = {
                        'data-bb-user-row':'item',
                        'data-user-type':extraType
                    };
                    additionalTemplate = '<div ' +
                      'data-ng-if="$parent.$last && $last" ' +
                      'class="component new ' + extraType + '" ' +
                      'data-bb-share ' +
                      'data-ng-click="showOptions($event)" ' +
                      'data-target="mother.group.id" ' +
                      'data-type="member" ' +
                      'data-target-name="mother.group.name" ' +
                      'data-title="Invite Group Members" ' +
                      '></div>';
                }

                if (columnAttrs) {
                    for(var prop in columnAttrs){
                        $column.attr(prop, columnAttrs[prop]);
                    }
                }

                if (innerContents) {
                    $column.html(innerContents);
                }

                if (learnTemplate) {
                    if (type === 'asset') {
                      $(learnTemplate).insertAfter($columnOuterRepeater);
                    } else {
                      $(learnTemplate).insertAfter($column);
                    }
                }

                if (additionalTemplate) {
                    $(additionalTemplate).insertAfter($column);
                }





                return this.$$link.bind(this);
            };

            //this.link = this.$$link.bind(this);
        }

        /**
         * @private
         *
         * Cleanup method. Will be called when the
         * deckgrid directive should be destroyed.
         *
         */
        Descriptor.prototype.$$destroy = function $$destroy () {
            this.$$deckgrid.destroy();
        };

        /**
         * @private
         *
         * The deckgrid link method. Will instantiate the deckgrid.
         *
         */
        Descriptor.prototype.$$link = function $$link (scope, elem) {
            scope.$on('$destroy', this.$$destroy.bind(this));

            // scope.cardTemplate = attrs.cardtemplate;

            scope.mother = scope.$parent;

            this.$$deckgrid = Deckgrid.create(scope, elem[0]);
        };

        return {
            create : function create () {
                return new Descriptor();
            }
        };
    }
]);

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

angular.module('akoenig.deckgrid').factory('Deckgrid', [

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
                // var i = 0;

                // if (!rule.media) {
                //     return false;
                // }

                // i = rule.cssRules.length - 1;

                // for (i; i >= 0; i = i - 1) {
                //     if (angular.isDefined(rule.cssRules[i].selectorText) && rule.cssRules[i].selectorText.match(/\[(\w*-)?deckgrid\]::?before/g)) {
                //         return true;
                //     }
                // }

                for (var i = 0; i < rule.cssRules.length; i++) {
                    var cssRule = rule.cssRules[i];
                    var selectorText = cssRule.selectorText;
                    if (selectorText && (selectorText.indexOf('[data-deckgrid') > -1 && selectorText.indexOf(']::before') > -1)) {
                        return true;
                    }
                }

                return false;
            }

            // for (var i = 0; i < numSheets; i += 1) {
            //     var rules = sheets[i].cssRules,
            //             numRules = rules.length;

            //     for (var j = 0; j < numRules; j += 1) {
            //         if (rules[j].constructor === CSSMediaRule) {
            //             mqls['mql' + j] = window.matchMedia(rules[j].media.mediaText);
            //             mqls['mql' + j].addListener(mediaChange);
            //             mediaChange(mqls['mql' + j]);
            //         }
            //     }
            // }

            angular.forEach(sheets, function onIteration (stylesheet) {
                // var rules = extractRules(stylesheet);
                var rules = stylesheet.cssRules;

                angular.forEach(rules, function inRuleIteration (rule) {
                    if (rule.constructor === CSSMediaRule && hasDeckgridStyles(rule)) {
                        // console.log(rule);
                        mediaQueries.push($window.matchMedia(rule.media.mediaText));
                    }
                    // if (hasDeckgridStyles(rule)) {
                    //     mediaQueries.push($window.matchMedia(rule.media.mediaText));
                    // }
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
            var content, layout, self = this, configLoopLimit = 3, loopCnt = 0, getConfigTimeout;

            var getCssConfig = function(){
                content = $window.getComputedStyle(self.$$elem, ':before').content;
            };

            var resolveLayout = function(){
                content = content.replace(/'/g, '');  // before e.g. '3 .column.size-1of3'
                content = content.replace(/"/g, '');  // before e.g. "3 .column.size-1of3"
                content = content.split(' ');

                if (2 === content.length) {
                    layout = {};
                    layout.columns = (content[0] | 0);
                    layout.classList = content[1].replace(/\./g, ' ').trim();
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
]);
