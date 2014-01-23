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
        function Descriptor (type) {
            this.restrict = 'AE';

            var infowrapDirective = 'data-bb-wrap-card="item"';
            var additionalTemplate = '';

            if (type === 'asset') {
                infowrapDirective = 'data-bb-wrap-asset="item"';
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
            }

            this.template = '<div data-ng-repeat="column in columns" class="{{layout.classList}}">' +
                                '<div data-ng-repeat="item in column" ' + infowrapDirective + '></div>' +
                            '</div>' +
                            additionalTemplate;

            this.scope = {
                'model': '=source'
            };

            //
            // Will be created in the linking function.
            //
            this.$$deckgrid = null;

            this.link = this.$$link.bind(this);
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
        Descriptor.prototype.$$link = function $$link (scope, elem, attrs) {
            scope.$on('$destroy', this.$$destroy.bind(this));

            // scope.cardTemplate = attrs.cardtemplate;

            scope.mother = scope.$parent;

            this.$$deckgrid = Deckgrid.create(scope, elem[0]);
        };

        return {
            create : function create (type) {
                return new Descriptor(type);
            }
        };
    }
]);
