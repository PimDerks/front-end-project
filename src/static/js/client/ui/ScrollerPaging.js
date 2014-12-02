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
        this._indexNode = null;
        this._currentIndexItem = null;
        this._buttons = [];

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

            if(!this._indexNode){
                this._indexNode = document.createElement('ul');
                this._indexNode.className = 'reset-list scroller-paging paging-bullets paging-bullets-small';
            }

            this._buttons = [];

            var i, length, indexItem, button, visible = this._scroller.getVisibleAmount();

            for (i = 0, length = this._number; i < length; i++) {

                if (i % visible === 0 && !this._options.pagingPerItem || this._options.pagingPerItem) {

                    indexItem = document.createElement('li');

                    button = document.createElement('button');
                    button.setAttribute('type', 'button');
                    button.innerHTML = '<span class="screenreader">' + (i + 1) + '</span>';
                    button.className = 'scroller-paging-button';
                    button.addEventListener('click', this._handleButtonClick.bind(this, i));

                    indexItem.appendChild(button);
                    this._indexNode.appendChild(indexItem);
                    this._buttons.push(button);

                }

            }

        },

        /**
         * Handle clicks on button
         *
         * @memberof ScrollerPaging
         * @param {Number}
         * @static
         * @private
         */

        _handleButtonClick: function (index) {
            Observer.publish(this, 'click', index);
        },

        /**
         * Get the node containing the paging.
         *
         * @memberof ScrollerPaging
         * @return {Element}
         * @static
         * @private
         */

        getIndex: function () {
            return this._indexNode;
        },

        /**
         * Set active index
         *
         * @memberof ScrollerPaging
         * @param {Number}
         * @static
         * @private
         */

        setIndex: function (index) {

            // remove class active from index item
            if (this._currentIndexItem) {
                this._currentIndexItem.classList.remove('active');
            }

            if (!this._options.pagingPerItem) {
                index = Math.floor((index / this._number) * this._buttons.length);
            }

            // set class active to index item
            var indexItem = this._buttons[index].parentNode;
            indexItem.classList.add('active');
            this._currentIndexItem = indexItem;
            this._currentIndex = index;

        },

        /**
         * Create HTML for paging component
         *
         * @memberof ScrollerPaging
         * @static
         * @public
         */

        render:function () {

            // remove <li>'s
            var li = this._indexNode.querySelectorAll('li'),
                l = li.length;

            for (l >= 0; l--;) {
                ElementHelper.remove(li[l]);
            }

            var _this = this;
            setTimeout(function () {

                // re-initialize
                _this._initialize();
                _this.setIndex(_this._currentIndex);

            }, 500);

        },

        unload:function(){

            // remove buttons
            var l = this._buttons.length,
                i = 0;
            for(; i < l; i++){
                ElementHelper.remove(this._buttons[i]);
            }

            // remove element
            ElementHelper.remove(this._indexNode);

        }

    };

    return exports;

});