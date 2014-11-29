define(['module', 'conditioner/Observer'], function (module, Observer) {

    'use strict';

    var exports = function (id){

        this._index = 0;
        this._id = id;
        this._togglers = [];
        this._closeAllExceptBind = this._closeAllExcept.bind(this);


    };

    exports.prototype = {

        /**
         * Register a toggle
         *
         * @memberof ToggleGroup
         * @param {Object} Toggle
         * @public
         */

        register:function(Toggle){

            // add
            this._togglers.push(Toggle);

            // listen
            Observer.subscribe(Toggle, 'activate', this._closeAllExceptBind);

        },

        /**
         * Remove a toggle
         *
         * @memberof ToggleGroup
         * @param {Object} Toggle
         * @public
         */

        remove:function(Toggle) {

            var l = this._togglers.length;
            for (var i = 0; i < l; i++) {
                if (this._togglers[i] == Toggle) {
                    this._togglers.splice(i, 1);
                    return;
                }
            }

        },

        /**
         * Close all toggles except the given Toggle.
         *
         * @memberof ToggleGroup
         * @param {Object} Toggle
         * @private
         */

        _closeAllExcept:function(Toggle){

            // get new index
            var newIndex = this.getIndexForToggle(Toggle),
                current = this.getIndex();

            if(newIndex == current){
                return;
            }

            // close previously active toggle
            if(newIndex > current){
                this._togglers[current].deactivate('prev');
            } else {
                this._togglers[current].deactivate('next');
            }

            // get index for passed in toggle
            this._index = newIndex;

            // Let the world know
            Observer.publish(this, 'change', this._index);

        },

        /**
         * Close all toggles except the given index.
         *
         * @memberof ToggleGroup
         * @param {Number} The index to show
         * @private
         */

        _closeAllExceptIndex:function(newIndex){

            var current = this.getIndex();

            // close previously active toggle
            this._togglers[current].deactivate();

            // set new index
            this._index = newIndex;

            // Let the world know
            Observer.publish(this, 'change');

        },

        /**
         * Get the index for a given toggle
         *
         * @memberof ToggleGroup
         * @param {Object} Toggle
         * @public
         */

        getIndexForToggle:function(Toggle){

            var l = this._togglers.length,
                i = 0,
                index;

            for (; i < l; i++) {
                var current = this._togglers[i];
                if (current == Toggle) {
                    index = i;
                }
            }

            return index;

        },

        /**
         * Get the amount of items.
         *
         * @memberof ToggleGroup
         * @return {Number} The number of items.
         * @public
         */

        getAmount:function(){
            return this._togglers.length;
        },

        /**
         * Close all toggles except the given index.
         *
         * @class ToggleGroup
         * @method show
         * @param {Number} The index to show
         * @public
         */

        show:function(index) {
            this._togglers[index].activate();
        },

        /**
         * Get the current active index
         *
         * @class ToggleGroup
         * @method _getIndex
         * @return {Number} Active index
         * @public
         */

        getIndex:function(){
            return this._index;
        },

        /**
         * Unload.
         *
         * @class ToggleGroup
         * @method unload
         * @public
         */

        unload:function() {

            // Empty array
            this._togglers = [];

        }

    };

    return exports;

});