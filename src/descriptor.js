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
                                '<div data-ng-repeat="item in column"></div>' +
                            '</div>';

            this.compile = function(tElement, tAttrs) {

                var type = tAttrs.deckgrid;
                var extraType = tAttrs.extraType;
                var extraIcon = tAttrs.extraIcon;
                var showLearnIf = tAttrs.showLearnIf;
                var learnText = tAttrs.learnText;
                var isExamples = tAttrs.isExamples;
                var $columnOuterRepeater = tElement.find('[data-ng-repeat="column in columns"]');
                var $column = tElement.find('[data-ng-repeat="item in column"]');
                var columnAttrs = {
                    'data-bb-wrap-card':'item'
                };
                var innerContents = '';
                var learnTemplate = '';
                var additionalTemplate = '';

                if (type === 'card') {
                  if (isExamples) {
                    columnAttrs['data-allow-marketing'] = true;
                  }

                  if (learnText) {
                    learnTemplate = '<div ' +
                        (showLearnIf ? 'data-ng-if="' + showLearnIf + '" ' : '') +
                        'class="{{layout.classList}}" ' +
                        '>' +
                        '<div ' +
                          'class="component learn" ' +
                          'data-type="' + extraType + '" ' +
                          'data-icon="' + extraIcon + '" ' +
                          '>' +
                          '<div class="contents"> ' +
                          learnText +
                          '</div>' +
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
                    // learnTemplate = '<div ' +
                    //     'data-ng-if="mother.section.assets.length == 1" ' +
                    //     'class="{{layout.classList}}" ' +
                    //     '>' +
                    //     '<div ' +
                    //       'class="component learn" ' +
                    //       'data-type="{{mother.section.type}}" ' +
                    //       'data-icon="{{mother.section.type}}" ' +
                    //       '>' +
                    //     '</div>' +
                    //   '</div>';
                } else if (type === 'gallery') {
                    columnAttrs = {
                        'data-ng-click':'$event.stopPropagation(); mother.showSlide(item.id);',
                        'class':'image loading-spinner',
                        'data-unveil-item':'item.asset',
                        'data-constrain-width':'270',
                        'data-fit':'max',
                        'data-force':'true',
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
                      'data-iw-multi-select-btn="item" ' +
                      'data-ng-if="$root.multiSelect.enabled && $root.multiSelect.options.type == \'slide\'"' +
                      '></div>';
                    // '<div ' +
                    //     'data-ng-show="mother.editing" ' +
                    //     'data-icon="delete" ' +
                    //     'data-ng-click="$event.stopPropagation(); mother.removeImage(item.id);" ' +
                    //     '></div> ' +
                    // '</div>';
                    additionalTemplate = '<div ' +
                        'class="{{layout.classList}}" ' +
                        '>' +
                        '<div ' +
                          'class="image new" ' +
                          'data-has-image="false" ' +
                          'data-editor="true" ' +
                          'data-filepicker-btn ' +
                          'data-ng-show="$root.activeWrap.editable" ' +
                          'data-process-when="$root.activeWrap.editable" ' +
                          'data-store-location="S3" ' +
                          'data-mime-types="image/*" ' +
                          'data-target-id="mother.asset.id" ' +
                          'data-target-parent-id="$root.activeWrap.id" ' +
                          'data-target-type="gallery" ' +
                          'data-title="Add Images" ' +
                          '></div>' +
                        '</div>';

                } else if (type === 'notification') {
                    columnAttrs = {
                        'data-bb-notification-card':'item',
                        'data-dashboard':'true',
                        'data-wraps':'mother.wraps',
                        'data-groups':'mother.groups'
                    };
                    learnTemplate = '<div ' +
                        (showLearnIf ? 'data-ng-if="' + showLearnIf + '" ' : '') +
                        'class="{{layout.classList}}" ' +
                        '>' +
                        '<div ' +
                          'class="component learn" ' +
                          'data-type="' + extraType + '" ' +
                          'data-icon="' + extraIcon + '" ' +
                          '>' +
                          '<div class="contents"> ' +
                          learnText +
                          '</div>' +
                        '</div>' +
                      '</div>';
                } else if (type === 'user') {

                    columnAttrs = {
                        'data-bb-user-row':'item',
                        'data-user-type':extraType
                    };
                    learnTemplate = '<div ' +
                        'class="{{layout.classList}}" ' +
                        '>' +
                        '<div ' +
                          'class="component learn" ' +
                          'data-type="' + extraType + '" ' +
                          'data-icon="' + extraIcon + '" ' +
                          '>' +
                          '<div class="contents"> ' +
                          learnText +
                          '</div>' +
                        '</div>' +
                      '</div>';

                    additionalTemplate = '<div ' +
                        'class="{{layout.classList}}" ' +
                        '>' +
                        '<div ' +
                        'class="component new ' + extraType + '" ' +
                        'data-bb-share ' +
                        'data-ng-click="showOptions($event)" ' +
                        'data-target="$root.activeWrap" ' +
                        'data-type="' + (extraType === 'followers' ? 'follow' : 'collaborate') + '" ' +
                        'data-target-name="$root.activeWrap.name" ' +
                        'data-title="Invite ' + _.capitalize(extraType) + '" ' +
                        '></div>' +
                        '</div>';
                } else if (type === 'member') {
                    columnAttrs = {
                        'data-bb-user-row':'item',
                        'data-user-type':extraType
                    };
                    additionalTemplate = '<div ' +
                        'class="{{layout.classList}}" ' +
                        '>' +
                        '<div ' +
                        'class="component new ' + extraType + '" ' +
                        'data-bb-share ' +
                        'data-ng-click="showOptions($event)" ' +
                        'data-target="mother.group.id" ' +
                        'data-type="member" ' +
                        'data-target-name="mother.group.name" ' +
                        'data-title="Invite Group Members" ' +
                        '></div>' +
                        '</div>';
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
                    $(learnTemplate).insertAfter($columnOuterRepeater);
                }

                if (additionalTemplate) {
                    $(additionalTemplate).insertAfter($columnOuterRepeater);
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
