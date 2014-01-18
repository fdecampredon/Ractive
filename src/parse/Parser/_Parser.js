define([
	'parse/Parser/getText/_getText',
	'parse/Parser/getComment/_getComment',
	'parse/Parser/getMustache/_getMustache',
	'parse/Parser/getElement/_getElement',
	'config/types',

	'parse/Parser/utils/jsonifyStubs'
], function (
	getText,
	getComment,
	getMustache,
	getElement,
    types,

	jsonifyStubs
) {

	'use strict';

	var Parser;//, onlyWhitespace = /^\s*$/;

	Parser = function ( tokens, options ) {
		var stub, stubs;

		this.tokens = tokens || [];
		this.pos = 0;
		this.options = options;
		this.preserveWhitespace = options.preserveWhitespace;

		stubs = [];

		while ( stub = this.getStub() ) {
			stubs.push( stub );
		}

		this.result = jsonifyStubs( stubs );
	};

	Parser.prototype = {
		getStub: function () {
			var token = this.next();

			if ( !token ) {
				return null;
			}
            
            /*if (!this.preserveWhitespace && ( token.type === types.TEXT ) && onlyWhitespace.test( token.value ) ) {
                this.pos += 1;
                return this.getStub();
            }*/


			return this.getText( token )     ||
			       this.getComment( token )  ||
			       this.getMustache( token ) ||
			       this.getElement( token );
		},

		getText: getText,
		getComment: getComment,
		getMustache: getMustache,
		getElement: getElement,

		next: function () {
			return this.tokens[ this.pos ];
		}
	};

	return Parser;

});