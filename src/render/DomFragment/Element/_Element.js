define([
	'render/DomFragment/Element/initialise/_initialise',

	'render/DomFragment/Element/prototype/teardown',
	'render/DomFragment/Element/prototype/toString',
	'render/DomFragment/Element/prototype/find',
	'render/DomFragment/Element/prototype/findAll',
	'render/DomFragment/Element/prototype/findComponent',
	'render/DomFragment/Element/prototype/findAllComponents',
	'render/DomFragment/Element/prototype/bind',
    'utils/defineProperty',
	'utils/create',
	'render/DomFragment/Element/initialise/decorate/_decorate',
	'render/DomFragment/Element/initialise/addEventProxies/_addEventProxies',
	'render/DomFragment/Element/shared/executeTransition/_executeTransition'
], function (
	initialise,

	teardown,
	toString,
	find,
	findAll,
	findComponent,
	findAllComponents,
	bind,
    defineProperty,
    create,
	decorate,
	addEventProxies,
    executeTransition
) {

	'use strict';

	var DomElement = function ( options, docFrag ) {
		initialise( this, options, docFrag );
	};

	DomElement.prototype = {
        attach: function (target, index) {
            var parentFragment = this.parentFragment;
            var contextStack = parentFragment.contextStack;
            var root = parentFragment.root;
            var descriptor = this.descriptor;
            
            
            this.node = target.childNodes[index];
            defineProperty( this.node, '_ractive', {
                value: {
                    proxy: this,
                    keypath: ( contextStack.length ? contextStack[ contextStack.length - 1 ] : '' ),
                    index: parentFragment.indexRefs,
                    events: create( null ),
                    root: root
                }
            });
            
            
            var numAttributes= this.attributes? this.attributes.length : 0,  i;
            for (i = 0; i < numAttributes; i++) {
                this.attributes[i].attach(this.node);
            }
            // append children, if there are any
            if ( descriptor.f ) {
                // Special case - contenteditable
                //TODO
                /*if ( element.node && element.node.getAttribute( 'contenteditable' ) ) {
                    if ( element.node.innerHTML ) {
                        // This is illegal. You can't have content inside a contenteditable
                        // element that's already populated
                        errorMessage = 'A pre-populated contenteditable element should not have children';
                        if ( root.debug ) {
                            throw new Error( errorMessage );
                        } else {
                            warn( errorMessage );
                        }
                    }
                }*/
                if (this.fragment) {
                    //reset the index since we are now in a new element
                    this.fragment.attach(this.node, 0);
                }
            }
            
            addEventProxies( this, descriptor.v );
            
            // deal with two-way bindings
            if ( root.twoway ) {
                this.bind();

                // Special case - contenteditable
                if ( this.node.getAttribute( 'contenteditable' ) && this.node._ractive.binding ) {
                    // We need to update the model
                    this.node._ractive.binding.update();
                }
            }
            
            // name attributes are deferred, because they're a special case - if two-way
            // binding is involved they need to update later. But if it turns out they're
            // not two-way we can update them now
            //TODO 
            /*if ( attributes.name && !attributes.name.twoway ) {
                attributes.name.update();
            }*/
            
            
            // if this is an <img>, and we're in a crap browser, we may need to prevent it
            // from overriding width and height when it loads the src
            //TODO
            /*if ( element.node.tagName === 'IMG' && ( ( width = element.attributes.width ) || ( height = element.attributes.height ) ) ) {
                element.node.addEventListener( 'load', loadHandler = function () {
                    if ( width ) {
                        element.node.width = width.value;
                    }

                    if ( height ) {
                        element.node.height = height.value;
                    }

                    element.node.removeEventListener( 'load', loadHandler, false );
                }, false );
            }*/
    
            // apply decorator(s)
            if ( descriptor.o ) {
                decorate( descriptor.o, root, this, contextStack );
            }

            // trigger intro transition
            if ( descriptor.t1 ) {
                executeTransition( descriptor.t1, root, this, contextStack, true );
            }

            //TODO
            /*if ( element.node.tagName === 'OPTION' ) {
                // Special case... if this option's parent select was previously
                // empty, it's possible that it should initialise to the value of
                // this option.
                if ( pNode.tagName === 'SELECT' && ( selectBinding = pNode._ractive.binding ) ) { // it should be!
                    selectBinding.deferUpdate();
                }

                // Special case... a select may have had its value set before a matching
                // option was rendered. This might be that option element
                if ( element.node._ractive.value == pNode._ractive.value ) {
                    element.node.selected = true;
                }
            }*/

            //TODO
            /*if ( element.node.autofocus ) {
                // Special case. Some browsers (*cough* Firefix *cough*) have a problem
                // with dynamically-generated elements having autofocus, and they won't
                // allow you to programmatically focus the element until it's in the DOM
                root._deferred.focusable = element.node;
            }*/
            
        },
		detach: function () {
			if ( this.node ) {
				// need to check for parent node - DOM may have been altered
				// by something other than Ractive! e.g. jQuery UI...
				if ( this.node.parentNode ) {
					this.node.parentNode.removeChild( this.node );
				}
				return this.node;
			}
		},

		teardown: teardown,

		firstNode: function () {
			return this.node;
		},

		findNextNode: function () {
			return null;
		},

		// TODO can we get rid of this?
		bubble: function () {}, // just so event proxy and transition fragments have something to call!

		toString: toString,
		find: find,
		findAll: findAll,
		findComponent: findComponent,
		findAllComponents: findAllComponents,
		bind: bind
	};

	return DomElement;

});