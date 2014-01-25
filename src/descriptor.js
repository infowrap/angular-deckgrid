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
                var $columnOuterRepeater = tElement.find('[data-ng-repeat="column in columns"]');
                var $column = tElement.find('[data-ng-repeat="item in column"]');
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
                        'class="contents" ' +
                        'data-pusher-gif ' +
                        'data-constrain-width="270" ' +
                        'data-calc-width="{{item.asset.width}}" ' +
                        'data-calc-height="{{item.asset.height}}" ' +
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
                    $(learnTemplate).insertBefore($columnOuterRepeater);
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
