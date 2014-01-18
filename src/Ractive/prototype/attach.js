define( function () {

	'use strict';

	return function (target) {
        if ( this.el ) {
            throw new Error('Ractive cannot be attached to multiple elements');
        }
        this.el = target;
		return this.fragment.attach(target, 0);
	};

});