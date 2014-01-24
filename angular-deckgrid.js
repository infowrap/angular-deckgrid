/*! angular-deckgrid (v0.4.0) - Copyright: 2013, André König (andre.koenig@posteo.de) - MIT */
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

    'Deckgrid',

    function initialize (Deckgrid) {

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
                                '<div data-ng-repeat="item in column"></div>' +
                            '</div>';

            // this.template = learnTemplate +
            //                 '<div data-ng-repeat="column in columns" class="{{layout.classList}}">' +
            //                     '<div data-ng-repeat="item in column" ' + infowrapDirective + '>' + innerContents + '</div>' +
            //                 '</div>' +
            //                 additionalTemplate;

            this.compile = function(tElement, tAttrs) {

                var type = tAttrs.deckgrid;
                var $column = tElement.find('div');
                var columnAttrs = {
                    'data-bb-wrap-card':'item'
                };
                var innerContents = '';
                var learnTemplate = '';
                var additionalTemplate = '';

                if (type === 'asset') {
                    columnAttrs = {
                        'data-bb-wrap-asset':'item'
                    };
                    learnTemplate = '<div ' +
                        'data-ng-if="mother.section.assets.length == 0" ' +
                        'class="{{layout.classList}}" ' +
                        '>' +
                        '<div ' +
                          'class="component learn" ' +
                          'data-type="{{mother.section.type}}" ' +
                          'data-icon="{{mother.section.type}}" ' +
                          '>' +
                        '</div>' +
                      '</div>';
                    additionalTemplate = '<div ' +
                        'class="{{layout.classList}}" ' +
                        'data-ng-if="mother.section.type!=\'file\' && $root.activeWrap.editable" ' +
                        '>' +
                        '<div ' +
                          'data-resource-edit ' +
                          'class="component new" ' +
                          'data-ng-class="$root.classForSectionType(mother.section)" ' +
                          'data-allow-new="true" ' +
                          'data-id="$root.activeWrap.id" ' +
                          'data-title="{{$root.addComponentTitleForSection(mother.section)}}" ' +
                          'data-type="{{mother.section.type}}" ' +
                          'data-layout="{{mother.section.type}}" ' +
                          'data-modal-class-name="{{$root.classForSectionType(mother.section)}}" ' +
                          '></div>' +
                      '</div>' +
                      '<div ' +
                        'class="{{layout.classList}}" ' +
                        'data-ng-if="mother.section.type==\'file\' && $root.isDetailPage && $root.activeWrap.editable" ' +
                        '>' +
                        '<div ' +
                          'class="component new" ' +
                          'data-ng-class="$root.classForSectionType(mother.section)" ' +
                          'data-filepicker-btn ' +
                          'data-store-location="S3" ' +
                          'data-target-id="$root.activeWrap.id" ' +
                          'data-target-type="wrap" ' +
                          '></div>' +
                      '</div>';
                } else if (type === 'gallery') {
                    columnAttrs = {
                        'data-ng-click':'$event.stopPropagation(); mother.showSlide(item.id);',
                        'class':'image',
                        'data-has-image':'true'
                    };
                    innerContents =  '<div ' +
                        'class="spinner" ' +
                        'data-icon="spinner"' +
                        '></div> ' +
                    '<img ' +
                        'data-unveil-item="item.asset" ' +
                        'class="contents unveil-item" ' +
                        'data-target-load=".image" ' +
                        'data-force="true" ' +
                        'data-constrain-width="270" ' +
                        'data-fit="clip" ' +
                        'src="data:image/gif;base64,R0lGODlhdQLcAIAAAP///wAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQzNjU5OTdEN0M5MTExRTNBNjc3QjZDQzk1RTc0MDQzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQzNjU5OTdFN0M5MTExRTNBNjc3QjZDQzk1RTc0MDQzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDM2NTk5N0I3QzkxMTFFM0E2NzdCNkNDOTVFNzQwNDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDM2NTk5N0M3QzkxMTFFM0E2NzdCNkNDOTVFNzQwNDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQBAAAAACwAAAAAdQLcAAAC/4SPqcvtD6OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITCqXzKbzCY1Kp9Sq9YrNarfcrvcLDovH5LL5jE6r1+y2+w2Py+f0uv2Oz+v3/L7/DxgoOEhYaHiImKi4yNjo+AgZKTlJWWl5iZmpucnZ6fkJGio6SlpqeoqaqrrK2ur6ChsrO0tba3uLm6u7y9vr+wscLDxMXGx8jJysvMzc7PwMHS09TV1tfY2drb3N3e39DR4uPk5ebn6Onq6+zt7u/g4fLz9PX29/j5+vv8/f7/8PMKDAgQQLGjyIMKHChQwbOnwIMaLEiRQrWryIMaPGjf8cO3r8CDKkyJEkS5o8iTKlypUsW7p8CTOmzJk0a9q8iTOnzp08e/r8CTSo0KFEixo9ijSp0qVMmzp9CjWq1KlUq1q9ijWr1q1cu3r9Cjas2LFky5o9izat2rVs27p9Czeu3Ll069q9izev3r18+/r9Cziw4MGECxs+jDix4sWMGzt+DDmy5MmUK1u+jDmz5s2cO3v+DDq06NGkS5s+jTq16tWsW7t+DTu27Nm0a9u+jTu37t28e/v+DTy48OHEixs/jjy58uXMmzt/Dj269OnUq1u/jj279u3cu3v/Dj68+PHky5s/jz69+vXs27t/Dz++/Pn069u/jz+//v38+/sb/w9ggAIOSGCBBh6IYIIKLshggw4+CGGENRUAADs="' +
                        '/>' +
                    '<div ' +
                        'data-ng-show="mother.editing" ' +
                        'data-icon="delete" ' +
                        'data-ng-click="$event.stopPropagation(); mother.removeImage(item.id);" ' +
                        '></div> ' +
                    '</div>';
                    additionalTemplate = '<div ' +
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
                }

                if (learnTemplate) {
                    $(learnTemplate).insertBefore(tElement);
                }

                if (columnAttrs) {
                    for(var prop in columnAttrs){
                        $column.attr(prop, columnAttrs[prop]);
                    }
                }

                if (innerContents) {
                    $column.html(innerContents);
                }

                if (additionalTemplate) {
                    $(additionalTemplate).insertAfter(tElement);
                }

                return this.$$link;
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

    function initialize ($window, $log, $rootScope) {

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
            this.$$scope.layout = this.$$getLayout();

            this.$$createColumns();

            //
            // Register model change.
            //
            watcher = this.$$scope.$watch('model', this.$$onModelChange.bind(this), true);
            this.$$watchers.push(watcher);

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
                return $log.error('angular-deckgrid: No CSS configuration found (see ' +
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
            var content = $window.getComputedStyle(this.$$elem, ':before').content,
                layout;

            if (content) {
                content = content.replace(/'/g, '');  // before e.g. '3 .column.size-1of3'
                content = content.replace(/"/g, '');  // before e.g. "3 .column.size-1of3"
                content = content.split(' ');

                if (2 === content.length) {
                    layout = {};
                    layout.columns = (content[0] | 0);
                    layout.classList = content[1].replace(/\./g, ' ').trim();
                }
            }

            return layout;
        };

        /**
         * @private
         *
         * Event that will be triggered if a CSS media query changed.
         *
         */
        Deckgrid.prototype.$$onMediaQueryChange = function $$onMediaQueryChange () {
            var self = this,
                layout = this.$$getLayout();

            //
            // Okay, the layout has changed.
            // Creating a new column structure is not avoidable.
            //
            if (layout && layout.columns !== this.$$scope.layout.columns) {
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
