define(['module', 'conditioner/Observer', 'ui/Toggle','ui/ToggleManager','util/element'], function (module, Observer, _parent, ToggleManager, ElementHelper) {

    'use strict';

    var MAX_MOVE_DIST_SQUARED = 1200;
    var _downTarget = null;
    var _downOrigin = {x:0,y:0};

    var exports = function (element, options){

        _parent.call(this, element, options);

    };

    var p = exports.prototype = Object.create(_parent.prototype);

    /**
     * Initialize toggle trigger
     *
     * @memberof ToggleTrigger
     * @method _initialize
     * @private
     */

    p._initialize = function(){

        // call parent
        _parent.prototype._initialize.call(this);

        // get manager instance
        this._manager = ToggleManager.getInstance();

        // bind
        this._onMouseDownBind = this._onMouseDown.bind(this);
        this._onMouseUpBind = this._onMouseUp.bind(this);
        this._onMouseMoveBind = this._onMouseMove.bind(this);
        this._onKeyUpBind = this._onKeyUp.bind(this);
        this._onChangeBind = this._onChange.bind(this);
        this._bindEvents();

    };

    /**
     * Bind events to element.
     *
     * @memberof ToggleTrigger
     * @method _bindEvents
     * @private
     */

    p._bindEvents = function(){

        var nodeName = this._element.nodeName.toLowerCase(),
            type = this._element.getAttribute('type');

        switch(nodeName){
            case 'input':

                type = type.toLowerCase();

                switch(type){
                    case 'radio':
                        var name = this._element.getAttribute('name');
                        /*jshint -W109 */
                        this._inputs = document.querySelectorAll("[name='" + name + "']");
                        var l = this._inputs.length, i = 0;
                        for(;i<l;i++){
                            this._inputs[i].addEventListener('change', this._onChangeBind, false);
                        }
                        break;
                    case 'checkbox':
                        this._element.addEventListener('change', this._onChangeBind, false);
                        break;
                }

                break;
            default:
                this._element.addEventListener('mousedown', this._onMouseDownBind, false);
                this._element.addEventListener('keyup', this._onKeyUpBind, false);
                this._element.addEventListener('click', function(e){e.preventDefault();return false;}, false);
                break;
        }

    };

    /**
     * Triggers on change-event of an input-toggle (radio/checkbox)
     *
     * @memberof ToggleTrigger
     * @method _onChange
     * @param {Event} The change event.
     * @private
     */

    p._onChange = function(e){

        if(e.target === this._element && this._element.checked){
            this._activateTargetToggles();
        } else {
            this._deactivateTargetToggles();
        }

    };

    /**
     * Activate target toggle
     *
     * @memberof ToggleTrigger
     * @method _onChange
     * @return {Object}
     * @private
     */

    p._getToggles = function(){

        var toggles = this._element.getAttribute('data-toggle-target'),
            l;

        if(toggles){
            toggles = toggles.split(',');
            l = toggles.length;
        } else {
            return;
        }

        this._toggles = [];

        for(l > 0; l--;){
            var toggle = this._manager.getToggleById(toggles[l]);
            if(toggle){
                this._toggles.push(toggle);
            }
        }

        return this._toggles;

    };

    /**
     * Activate target toggle
     *
     * @memberof ToggleTrigger
     * @method _onKeyUp
     * @private
     */

    p._onKeyUp = function(e){
        if(e.keyCode == 13){
            this._toggleTargetToggles();
        }
    };

    /**
     * Activate target toggle
     *
     * @memberof ToggleTrigger
     * @method _onMouseDown
     * @param {Event} The mousedown event.
     * @private
     */

    p._onMouseDown = function(e){

        // test if is toggle
        _downTarget = ElementHelper.parent(e.target,'.toggle');
        if (!_downTarget) {
            return;
        }

        _downOrigin.x = e.pageX;
        _downOrigin.y = e.pageY;

        document.addEventListener('mousemove', this._onMouseMoveBind, false);
        this._element.addEventListener('mouseup', this._onMouseUpBind, false);

    };

    /**
     * Check if click is on target, or if click was actually part of a swipe/drag.
     *
     * @memberof ToggleTrigger
     * @method _onMouseUp
     * @param {Event} The mouseup event.
     * @private
     */

    p._onMouseUp = function(e){

        // cancel event
        e.preventDefault();
        e.stopPropagation();

        var upTarget = ElementHelper.parent(e.target,'.toggle');

        // is click?
        if (upTarget == _downTarget) {
            this._toggleTargetToggles();
        }

    };

    /**
     * Activate target toggle
     *
     * @memberof ToggleTrigger
     * @method _onMouseMove
     * @param {Event} The mousemove event.
     * @private
     */

    p._onMouseMove = function(e){

        // get pos
        var dist,pos = {
            x: e.pageX,
            y: e.pageY
        };

        // calculate if moved to far
        dist = Math.pow(_downOrigin.x - pos.x,2) + Math.pow(_downOrigin.y - pos.y,2);

        // if moved, reset
        if (dist > MAX_MOVE_DIST_SQUARED) {

            document.removeEventListener('mousemove', this._onMouseMoveBind, false);
            this._element.removeEventListener('mouseup', this._onMouseUpBind, false);

        }

    };

    /**
     * Activate target toggle
     *
     * @memberof ToggleTrigger
     * @method _activateTargetToggles
     * @private
     */

    p._activateTargetToggles = function () {

        if (!this._toggles) {
            this._getToggles();
        }

        if(this._toggles){
            var l = this._toggles.length;
            for(l > 0; l--; ){
                this._toggles[l].activate();
            }
        }

        this.activate();

    };

    /**
     * De-activate target toggles
     *
     * @memberof ToggleTrigger
     * @method _deactivateTargetToggles
     * @private
     */

    p._deactivateTargetToggles = function () {

        if (!this._toggles) {
            this._getToggles();
        }

        if(this._toggles){
            var l = this._toggles.length;
            for(l > 0; l--; ){
                this._toggles[l].deactivate();
            }
        }

        this.deactivate();

    };

    /**
     * Toggle target toggle
     *
     * @class ToggleTrigger
     * @method _toggleTargetToggles
     */

    p._toggleTargetToggles = function () {

        if (!this._toggles) {
            this._getToggles();
        }

        if(this._toggles){
            if(this._toggles){
                var l = this._toggles.length;
                for(l > 0; l--; ){
                    this._toggles[l].toggle();
                }
            }
        }

        this.toggle();

    };

    /**
     * Unload module.
     *
     * @class ToggleTrigger
     * @method unload
     * @public
     */

    p.unload = function(){

        // unload parent
        _parent.prototype.unload.call(this);

        if(this._inputs){
            var l = this._inputs.length, i = 0;
            for(;i<l;i++){
                this._inputs[i].removeEventListener('change', this._onChangeBind);
            }
        }

        // stop listening
        this._element.removeEventListener('mousedown', this._onMouseDownBind, false);
        this._element.removeEventListener('mouseup', this._onMouseUpBind, false);
        this._element.removeEventListener('mousemove', this._onMouseMoveBind, false);
        this._element.removeEventListener('keyup', this._onKeyUpBind, false);
        this._element.removeEventListener('change', this._onChangeBind, false);

    };

    return exports;

});