define(['module', 'conditioner/Observer', 'ui/ToggleGroup','ui/ToggleManager','util/Element','util/HashChangeWindow'], function (module, Observer, ToggleGroup, ToggleManager, ElementHelper, HashChangeWindow) {

    'use strict';

    var exports = function (element, options){

        this._element = element;
        this._options = options || {};

        this._initialize();

    };

    exports.prototype = {

        /**
         * Initialize module.
         *
         * @memberof Toggle
         * @static
         * @private
         */

        _initialize:function(){

            // set id
            this._id = this._element.id;

            // add class
            this._element.classList.add('toggle');

            // register
            this._manager = ToggleManager.getInstance();
            this._manager.register(this);

            // listen
            this._setStateBind = this._setState.bind(this);
            Observer.subscribe(this, 'activate', this._setStateBind);
            Observer.subscribe(this, 'deactivate', this._setStateBind);

            // set initial state
            this._isActive = this.getState() === 'activated';

            // show/hide
            if(this._isActive){
                this.activate();
            } else {
                this.deactivate();
            }

            // listen to hash change
            if(this._options.hash){
                this._hashChangeWindow = HashChangeWindow.getInstance();
                this._onHashChangeBind = this._onHashChange.bind(this);
                Observer.subscribe(this._hashChangeWindow, 'hashchange', this._onHashChangeBind);
            }

        },

        /**
         * On hash change
         *
         * @class Toggle
         * @method _onHashChange
         * @private
         */

        _onHashChange: function (id) {

            if (id == this.getId() && !this.isActive()) {
                this.activate(true);
            }

        },

        /**
         * Activate.
         *
         * @class Toggle
         * @method activate
         * @param {Boolean} Disable hash-update.
         * @public
         */

        activate:function(){

            this._isActive = true;

            this._element.classList.add('toggle--activated');
            this._element.classList.remove('toggle--deactivated');

            if(this._options.hash){
                if(this._element.id){

                    var _this = this;

                    setTimeout(function(){

                        _this._hashChangeWindow.setHash(_this._element.id);

                    },50);



                }
            }

            Observer.publish(this, 'activate', this);
            this._setState();

        },

        /**
         * Deactivate.
         *
         * @memberof Toggle
         * @public
         */

        deactivate:function(){

            this._isActive = false;

            this._element.classList.add('toggle--deactivated');
            this._element.classList.remove('toggle--activated');

            Observer.publish(this, 'deactivate', this);

        },

        /**
         * Toggle between active and not active.
         *
         * @memberof Toggle
         * @public
         */

        toggle:function(){

            if(this._isActive){
                this.deactivate();
            } else {
                this.activate();
            }

        },

        /**
         * Get state
         *
         * @memberof Toggle
         * @return {String} The state of the toggle
         * @public
         */

        getState:function(){
            return this._element.getAttribute('data-state');
        },

        /**
         * Set state
         *
         * @memberof Toggle
         * @public
         */

        _setState:function(){

            if (this._isActive) {
                this._element.setAttribute('data-state','activated');
                this._element.classList.remove('toggle--deactivated');
                this._element.classList.add('toggle--activated');

            } else {
                this._element.setAttribute('data-state', 'deactivated');
                this._element.classList.remove('toggle--activated');
                this._element.classList.add('toggle--deactivated');
            }

        },

        /**
         * Get element
         *
         * @memberof Toggle
         * @return {Node} The element toggled.
         * @public
         */

        getElement:function(){
            return this._element;
        },

        /**
         * Get group
         *
         * @memberof Toggle
         * @return {String} The group the toggle belongs to, or null if no attribute found.
         * @public
         */

        getGroup:function(){
            return this._element.getAttribute('data-toggle-group');
        },

        /**
         * Get id
         *
         * @memberof Toggle
         * @return {String} The id for the element to toggle
         * @public
         */

        getId:function(){
            return this._id;
        },

        /**
         * Public method for checking the state of the toggle.
         *
         * @memberof Toggle
         * @return {Boolean}
         * @public
         */

        isActive:function(){
            return this._isActive;
        },

        /**
         * Clean up when unloading this module.
         *
         * @memberof Toggle
         * @static
         * @public
         */

        unload:function(){

            // Remove activated / deactivated classes
            this._element.classList.remove('toggle--activated');
            this._element.classList.remove('toggle--deactivated');

            // Remove state
            Observer.unsubscribe(this, 'activate', this._setStateBind);
            Observer.unsubscribe(this, 'deactivate', this._setStateBind);

        }

    };

    return exports;

});