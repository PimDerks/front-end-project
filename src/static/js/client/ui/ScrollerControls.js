define(['module', 'conditioner/Observer', 'util/element'], function (module, Observer, ElementHelper) {

    'use strict';

    var exports = function (Scroller, ScrollerOptions) {

        if (!Scroller) {
            return;
        }

        this._options = ScrollerOptions;
        this._scroller = Scroller;
        this._items = this._scroller.getItems();
        this._number = this._items.length;
        this._element= null;

        this._initialize();

    };

    exports.prototype = {

        /**
         * Create elements
         *
         * @memberof ScrollerPaging
         * @static
         * @private
         */

        _initialize: function () {

            // create element
            this._element = document.createElement('div');
            this._element.className = 'scroller-controls';

            // insert after scroller
            ElementHelper.insertAfter(this._element, this._scroller.getElement());

            this._onPrevBind = this._onPrev.bind(this);
            this._onNextBind = this._onNext.bind(this);

            // create prev button
            this._prev = this._createButton('Previous', 'button-transparent scroller-prev hide', 'icon-left-big');
            this._prev.addEventListener('click', this._onPrevBind);
            this._element.appendChild(this._prev);

            // create next button
            this._next = this._createButton('Next', 'button-transparent scroller-next hide', 'icon-right-big');
            this._next.addEventListener('click', this._onNextBind);
            this._element.appendChild(this._next);

        },

        /**
         * Get element.
         *
         * @memberof ScrollerControls
         * @static
         * @return {Node}
         * @private
         */

        _createButton: function(labelText, cssClass, iconClass){

            // create button
            var button = document.createElement('button');
            button.setAttribute('type', 'button');

            // create icon
            var icon = document.createElement('span');
            icon.className = 'icon ' + iconClass;
            icon.setAttribute('aria-hidden','true');

            // create label
            var label = document.createElement('span');
            label.className = 'screenreader';
            label.innerHTML = labelText;

            // set button html
            button.appendChild(icon);
            button.appendChild(label);
            button.className = cssClass;
            return button;
        },

        /**
         * Get element.
         *
         * @memberof ScrollerControls
         * @static
         * @return {Node}
         * @public
         */

        getElement: function(){
            return this._element;
        },

        /**
         * Handle clicks on next-button
         *
         * @memberof ScrollerPaging
         * @static
         * @private
         */

        _onNext: function () {
            this._scroller.navigate('next');
        },

        /**
         * Handle clicks on prev-button.
         *
         * @memberof ScrollerPaging
         * @static
         * @private
         */

        _onPrev: function () {
            this._scroller.navigate('prev');
        },

        /**
         * Hide previous
         *
         * @memberof ScrollerPaging
         * @static
         * @private
         */

        hidePrev: function(){
            this._prev.classList.add('hide');
        },

        /**
         * Hide next
         *
         * @memberof ScrollerPaging
         * @static
         * @private
         */

        hideNext: function(){
            this._next.classList.add('hide');
        },

        /**
         * Show previous
         *
         * @memberof ScrollerPaging
         * @static
         * @private
         */

        showPrev: function(){
            this._prev.classList.remove('hide');
        },

        /**
         * Show next
         *
         * @memberof ScrollerPaging
         * @static
         * @private
         */

        showNext: function(){
            this._next.classList.remove('hide');
        },

        unload: function(){

            // stop listening
            this._next.removeEventListener('click', this._onNextBind);
            this._prev.removeEventListener('click', this._onPrevBind);

            // remove buttons
            ElementHelper.remove(this._next);
            ElementHelper.remove(this._prev);

            // remove node
            ElementHelper.remove(this._element);

        }

    };

    return exports;

});