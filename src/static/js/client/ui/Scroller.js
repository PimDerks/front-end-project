define(['module','conditioner/Observer','util/element','util/event','util/ResponsiveWindow','hammer','ui/ScrollerPaging', 'ui/ScrollerControls'],function(module, Observer, ElementHelper, EventHelper, ResponsiveWindow, Hammer, ScrollerPaging, ScrollerControls){

    'use strict';

    var exports = function(element, options) {

        this._element = element;
        this._options = options;

        this._initialize();

    };

    exports.prototype = {

        /**
         * Initialize the module.
         * @memberof Scroller
         * @static
         * @private
         */

        _initialize:function(){

            // set index
            this._index = this._options.start ? this._options.start : 0;

            // wrap
            this._scroller = document.createElement('div');
            this._scroller.className = 'scroller';

            // wrapper
            this._wrapper = document.createElement('div');
            this._wrapper.className = 'scroller-wrapper';

            this._wrapper.style.opacity = '0';


            // wrap
            this._wrapper.appendChild(this._scroller);
            ElementHelper.insertAfter(this._wrapper, this._element);

            // insert
            this._scroller.appendChild(this._element);

            // add class
            this._element.classList.add('scroller-items');

            // get items
            this._items = this.getItems();

            // measure
            this._measure();

            // init paging if there are enough items
            if (this._options.paging && (this._itemsVisible < this._items.length)) {
                this._paging = new ScrollerPaging(this, this._options);
                this._pagingNode = this._paging.getIndex();
                this._wrapper.appendChild(this._pagingNode);
                this._setIndexBind = this._setIndex.bind(this);
                Observer.subscribe(this._paging, 'click', this._setIndexBind);
            }

            if(this._options.controls){
                this._controls = new ScrollerControls(this, this._options);
                this._controlsNode = this._controls.getElement();
                this._wrapper.appendChild(this._controlsNode);
            }

            // listen to resize event
            this._responsiveWindow = ResponsiveWindow.getInstance();
            this._onResizeBind = this._onResize.bind(this);
            Observer.subscribe(this._responsiveWindow, 'resize', this._onResizeBind);

            // start autoplay
            if (this._options.auto) {
                this._autoplay();
            }

            // listen to mouseenter and leave
            this._onMouseEnterBind = this._onMouseEnter.bind(this);
            this._onMouseLeaveBind = this._onMouseLeave.bind(this);
            this._onKeyDownBind = this._onKeyDown.bind(this);

            this._element.addEventListener('mouseover', this._onMouseEnterBind, false);
            this._element.addEventListener('mouseout', this._onMouseLeaveBind, false);
            window.addEventListener('keydown', this._onKeyDownBind, false);

            // enable hammer
            this._hammer = new Hammer(this._element, {
                drag_lock_to_axis: true
            });
            this._handleHammerBind = this._handleHammer.bind(this);
            this.enable();

            // start
            this._setIndex(this._getIndex());

            // Update
            if(Modernizr.cssanimations){
                EventHelper.addPrefixedEvent(this._element, 'TransitionEnd', this._update.bind(this));
            }


            var self = this;
            setTimeout(function(){
                self._wrapper.style.opacity = 1;
            },300);


        },

        /**
         * Enable Hammer events
         *
         * @memberof Scroller
         * @static
         * @public
         */

        enable:function(){

            this._hammer.on('release dragleft dragright swipeleft swiperight', this._handleHammerBind);

        },

        /**
         * Disable Hammer events
         *
         * @memberof Scroller
         * @static
         * @public
         */

        disable:function(){

            this._hammer.off('release dragleft dragright swipeleft swiperight', this._handleHammerBind);

        },

        /**
         * Handles all Hammer events.
         *
         * @memberof Scroller
         * @param {Event}
         * @static
         * @private
         */

        _handleHammer: function(e){

            if(Modernizr.csstransitions){
                this._element.classList.remove('animate');
            }

            // disable browser scrolling
            if(
                e.gesture &&
                e.type != 'release' &&
                !this._delta &&
                e.gesture.direction !== 'up' &&
                e.gesture.direction !== 'down'){
                e.gesture.preventDefault();
            }

            switch(e.type) {

                case 'dragright':
                case 'dragleft':

                    var current = parseFloat(this._getCurrentOffset(),10),
                        delta = e.gesture.deltaX,
                        result = current + delta;
                    this._delta = result;
                    this._direction = e.gesture.direction;

                    if (Modernizr.csstransitions && result < 0) {
                        this._element.style.mozTransform = 'translateX(' + result + 'px)';
                        this._element.style.msTransform = 'translateX(' + result + 'px)';
                        this._element.style.WebkitTransform = 'translate3d(' + result + 'px,0,0)';
                        this._element.style.Transform = 'translate3d(' + result + 'px,0,0)';
                    }

                    break;

                case 'swipeleft':

                    e.gesture.stopDetect();
                    this.navigate('next');
                    break;

                case 'swiperight':

                    e.gesture.stopDetect();
                    this.navigate('prev');
                    break;

                case 'release':

                    if(!this._delta){
                        return;
                    }

                    this._onRelease();

                    // more then 50% moved, navigate
                    if(Math.abs(this._delta) > this._itemWidth/2) {
                        if(this._direction == 'left') {
                            this.navigate('next');
                        } else {
                            this.navigate('prev');
                        }
                    } else {
                        this._setIndex(this._getIndex());
                    }

                    break;
            }
        },

        /**
         * Set index from offset.
         *
         * @memberof Scroller
         * @param {Number} Offset.
         * @static
         * @private
         */

        _setIndexFromOffset: function (offset) {

            var index = Math.floor(parseFloat(offset.toString().replace('-', ''), 10) / this._itemWidth);

            // Set index
            this._index = index;

            // Update
            this._update();

        },

        /**
         * Start autoplay.
         *
         * @memberof Scroller
         * @static
         * @private
         */

        _autoplay: function () {
            var _this = this;
            this._autoplayTimer = setInterval(function () {
                _this.navigate('next');
            }, this._options.auto);
        },

        /**
         * On release.
         *
         * @memberof Scroller
         * @static
         * @private
         */

        _onRelease: function () {

            if(Modernizr.csstransitions){
                this._wrapper.classList.remove('dragging');
            }

        },

        /**
         * On mouse enter
         *
         * @memberof Scroller
         * @static
         * @private
         */

        _onMouseEnter: function () {

            this._hovering = true;

            if (!this._options.auto) {
                return;
            }

            clearInterval(this._autoplayTimer);

        },

        /**
         * On mouse leave
         *
         * @memberof Scroller
         * @static
         * @private
         */

        _onMouseLeave: function () {

            this._hovering = false;

            if (!this._options.auto) {
                return;
            }

            this._autoplay();

        },

        /**
         * On keydown
         *
         * @memberof Scroller
         * @param {Event} Key.
         * @static
         * @private
         */

        _onKeyDown: function (e) {
            if (this._hovering) {
                switch (e.keyCode) {
                    case 37:
                        this.navigate('prev');
                        break;
                    case 39:
                        this.navigate('next');
                        break;

                }
            }
        },

        /**
         * Navigate to the given index
         * @memberof Scroller
         * @static
         * @public
         */

        navigate:function(direction){

            var index = this._getIndex(),
                amount = this._options.pagingPerItem ? 1 : this._itemsVisible;

            switch (direction) {
                case 'next':
                    index = index + amount;
                    break;
                case 'prev':
                    index = index - amount;
                    break;
            }

            if(index < 0){
                index = 0;
            }

            this._setIndex(index);
        },

        /**
         * Set index (zero-based!)
         *
         * @memberof Scroller
         * @param {Number} The index to jump to.
         * @static
         * @private
         */

        _setIndex: function (index) {

            if(Modernizr.csstransitions){
                this._element.classList.add('animate');
            }

            index = this._capIndex(index);

            var offset;

            if (Modernizr.csstransitions) {
                offset = this._getOffsetForIndex(index);
                this._element.style.MozTransform = 'translate3d(' + offset + 'px,0,0)';
                this._element.style.msTransform = 'translateX(' + offset + 'px)';
                this._element.style.WebkitTransform = 'translate3d(' + offset + 'px,0,0)';
                this._element.style.Transform = 'translate3d(' + offset + 'px,0,0)';
            } else {
                this._element.style.left = this._getOffsetForIndex(index) + 'px';
            }

            // Set index
            this._index = index;

            var max = this._getMaxOffset();
            offset = offset + '';

            // Update
            if(!Modernizr.cssanimations || offset.replace('-','') == max){
                this._update();
            }

            // let the world know
            Observer.publish(this, 'change', this._index);

            // reset delta
            this._delta = null;

        },

        /**
         * Get offset for index
         *
         * @memberof Scroller
         * @param {Number} The index to jump to.
         * @return {Number} The offset to set the element to.
         * * @static
         * @private
         */

        _getOffsetForIndex: function (index) {

            // var
            var offset;

            // get max
            var max = this._getMaxOffset();

            // calc
            if (this._options.center) {
                var scrollerWidth = this._getScrollerWidth() / 2,
                    itemWidth = this._getItemWidth();

                offset = (scrollerWidth - (this._itemWidth * index)) - (itemWidth / 2);

            } else {
                offset = this._itemWidth * index;
            }

            // cap
            if (offset.toString().replace('-','') > max && !this._options.center) {
                return '-' + max;
            }

            if (this._options.center) {
                return offset;
            } else {
                return offset > 0 ? '-' + offset : 0;
            }

        },

        /**
         * Get the current offset.
         *
         * @memberof Scroller
         * @static
         * @private
         */

        _getCurrentOffset: function(){
            var offset = this._getOffsetForIndex(this._index);
            return offset;
        },

        /**
         * Update
         *
         * @memberof Scroller
         * @static
         * @private
         */

        _update: function () {

            // Set index
            if (this._paging) {
                this._paging.setIndex(this._getIndex());
            }

            // Set controls
            if (this._controls) {

                // hide prev
                if(this._index === 0){
                    this._controls.hidePrev();
                } else {
                    this._controls.showPrev();
                }

                // hide next
                if(this._index === (this._items.length - 1)){
                    this._controls.hideNext();
                } else {
                    this._controls.showNext();
                }
            }

            /*
            var self = this;
            setTimeout(function(){

            },1000);

             */
            this._wrapper.classList.add('scroller-wrapper-initialized');

        },

        /**
         * Get index
         *
         * @memberof Scroller
         * @return {Number} The index the scroller is currently on.
         * @static
         * @private
         */

        _getIndex: function () {
            return this._index;
        },

        /**
         * Cap index
         *
         * @memberof Scroller
         * @param {Number} The index to ca
         * @return {Number} The capped index;
         * @static
         * @private
         */

        _capIndex: function (index) {

            if (this._options.loop) {

                // max
                index = index > (this._items.length - 1) ? 0 : index;

                // min
                index = index < 0 ? this._items.length - 1 : index;

            } else {

                // max
                index = index > (this._items.length - 1) ? this._items.length - 1 : index;

                // min
                index = index < 0 ? 0 : index;
            }

            return index;

        },

        /**
         * Get items
         *
         * @memberof Scroller
         * @return {Array} The children of the element.
         * @static
         * @public
         */

        getItems:function () {
            return this._element.parentNode.querySelectorAll('.scroller-items > li');
        },

        /**
         * Get item width
         *
         * @memberof Scroller
         * @return {Number} The width of a single item in pixels.
         * @static
         * @public
         */

        _getItemWidth:function () {
            return ElementHelper.getWidth(this._items[0]);
        },

        /**
         * Get the amount of items visible.
         *
         * @memberof Scroller
         * @return {Number} The amount of items visible.
         * @static
         * @public
         *
         */

        getVisibleAmount:function () {
            return this._itemsVisible;
        },

        /**
         * Get the amount of slides.
         *
         * @memberof Scroller
         * @return {Number} The amount of slides visible.
         * @static
         * @public
         *
         */

        getAmount:function () {
            return Math.ceil(this._items.length / this._itemsVisible);
        },

        /**
         * Get scroller width
         *
         * @memberof Scroll
         * @return {Number} The width of the scroller in pixels.
         * @static
         * @public
         */

        _getScrollerWidth:function () {
            return ElementHelper.getWidth(this._scroller);
        },

        /**
         * Get scroller node.
         *
         * @memberof Scroller
         * @return {Node}
         * @static
         * @public
         */

        getElement:function () {
            return this._element;
        },

        /**
         * Reposition everything when the window resizes.
         *
         * @memberof Scroller
         * @static
         * @private
         */

        _onResize:function () {

            this._wrapper.classList.remove('scroller-wrapper-initialized');

            // set explicit width on children
            var l = this._items.length,
                i = 0;
            for (; i < l; i++) {
                this._items[i].style.width = '';
            }

            this._element.style.width = '';

            // delay before rendering again
            var _this = this;
            if(this._resizeTimer){
                clearTimeout(this._resizeTimer);
            }

            this._resizeTimer = setTimeout(function () {

                if (_this._options.paging && _this._itemsVisible < _this._items.length) {
                    _this._paging.render();
                }

                // re-initialize
                _this._measure();

                // reset
                _this._setIndex(_this._getIndex());

            }, 500);

        },

        /**
         * Get the maximum offset.
         *
         * @memberof Scroller
         * @return {Number}
         * @static
         * @private
         */

        _getMaxOffset:function () {

            if (this._itemsVisible > this._items.length) {
                return 0;
            }

            var max = 0;

            if (this._options.center) {

                // regular max
                max = (this._items.length * this._getItemWidth()) - this._getScrollerWidth();

                // add half of scroller
                max = max + this._getScrollerWidth() / 2;

                // subtract half of item width
                max = max - this._getItemWidth() / 2;

            } else {
                max = (this._items.length * this._getItemWidth()) - this._getScrollerWidth();
            }

            return max;

        },

        /**
         * Measure items.
         * @memberof Scroller
         * @static
         * @private
         */

        _measure:function () {

            this._itemWidth = this._getItemWidth();
            this._scrollerWidth = this._getScrollerWidth();

            // set explicit width on children
            var l = this._items.length,
                i = 0;
            for (; i < l; i++) {
                this._items[i].style.width = this._itemWidth + 'px';
            }

            // calculate total width
            this._element.style.width = (l * this._itemWidth) + 'px';

            // items visible
            this._itemsVisible = Math.floor(this._scrollerWidth / this._itemWidth);
            if (this._itemsVisible < 1) {
                this._itemsVisible = 1;
            }

            // show all items
            this._scroller.classList.add('scroller-initialized');


        },

        /**
         * Clean up when unloading this module.
         * @memberof Marker
         * @static
         * @public
         */

        unload:function(){

            ElementHelper.remove(this._wrapper);
            ElementHelper.insertAfter(this._element, this._wrapper);

            // insert
            this._scroller.appendChild(this._element);

            // remove class
            this._element.classList.remove('scroller-items');

            // unsubscribe
            Observer.unsubscribe(this._responsiveWindow, 'resize', this._onResizeBind);
            this._element.removeEventListener('touchstart', this._onTouchStartBind);
            this._element.removeEventListener('mouseover', this._onMouseEnterBind);
            this._element.removeEventListener('mouseout', this._onMouseLeaveBind);
            this._element.removeEventListener('mousedown', this._onMouseDownBind);
            this._element.removeEventListener('mouseup', this._onMouseUpBind);
            window.removeEventListener('keydown', this._onKeyDownBind);

            // remove paging
            if(this._options.paging){
                this._paging.unload();
            }

            // remove controls
            if(this._options.controls){
                this._controls.unload();
            }


        }

    };

    return exports;

});