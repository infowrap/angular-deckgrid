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

angular.module('akoenig.deckgrid').directive('deckgridCard', [

    'DeckgridDescriptor',

    function initialize (DeckgridDescriptor) {

        'use strict';

        return DeckgridDescriptor.create('card');
    }
]).directive('deckgridAsset', [

    'DeckgridDescriptor',

    function initialize (DeckgridDescriptor) {

        'use strict';

        return DeckgridDescriptor.create('asset');
    }
]).directive('deckgridGallery', [

    'DeckgridDescriptor',

    function initialize (DeckgridDescriptor) {

        'use strict';

        return DeckgridDescriptor.create('gallery');
    }
]);
