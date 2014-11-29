define(['module','conditioner/Observer'],function(module, Observer){

    'use strict';

    /**
     * Constructs HashChangeWindow object.
     *
     * @class HashChangeWindow
     * @constructor
     */
    var HashChangeWindow = function () {

        this._initialize();

        // listen
        window.addEventListener('hashchange', this._onHashChange.bind(this));

    };

    HashChangeWindow.prototype = {

        /**
         * Set hash
         * @method _initialize
         */
        _initialize: function () {

            this._hash = this._getHashFromLocation();

            if (!this._hash) {
                return;
            }

        },

        /**
         * Set hash
         * @method _onHashChange
         */
        _onHashChange: function () {

            var newHash = this._getHashFromLocation();
            if (newHash != this._hash) {
                Observer.publish(this, 'hashchange', this._getHashFromLocation());
            }

        },

        /**
         * Set hash
         * @method setHash
         * @param {String}
         */

        setHash: function (id) {

            var hash = this._getNewHash(id);

            if (history.pushState) {
                history.pushState(null, null, hash);
            }
            else {
                location.hash = hash;
            }

            Observer.publish(this, 'hashchange', this.getHash());

        },

        /**
         * Get hash
         * @method get
         */

        getHash: function () {

            return this._hash;

        },

        /**
         * Get hash
         * @method get
         */

        _getNewHash: function (id) {

            this._hash = id;

            if (history.pushState) {
                return '#' + id;
            } else {
                return '#!' + id;
            }

        },

        /**
         * Get hash
         * @method get
         */

        _getHashFromLocation: function () {

            return location.hash.replace('#', '').replace('!', '');

        }
    };

    // Register class
    var _instance;
    return {
        getInstance: function () {
            if (!_instance) {
                _instance = new HashChangeWindow();
            }
            return _instance;
        }
    };

});
