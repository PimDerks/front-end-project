define(["module","conditioner/Observer"],function(e,t){var n=function(e){this._index=0,this._id=e,this._togglers=[],this._closeAllExceptBind=this._closeAllExcept.bind(this)};return n.prototype={register:function(e){this._togglers.push(e),t.subscribe(e,"activate",this._closeAllExceptBind)},remove:function(e){var t=this._togglers.length;for(var n=0;n<t;n++)if(this._togglers[n]==e){this._togglers.splice(n,1);return}},_closeAllExcept:function(e){var n=this.getIndexForToggle(e),r=this.getIndex();if(n==r)return;n>r?this._togglers[r].deactivate("prev"):this._togglers[r].deactivate("next"),this._index=n,t.publish(this,"change",this._index)},_closeAllExceptIndex:function(e){var n=this.getIndex();this._togglers[n].deactivate(),this._index=e,t.publish(this,"change")},getIndexForToggle:function(e){var t=this._togglers.length,n=0,r;for(;n<t;n++){var i=this._togglers[n];i==e&&(r=n)}return r},getAmount:function(){return this._togglers.length},show:function(e){this._togglers[e].activate()},getIndex:function(){return this._index},unload:function(){this._togglers=[]}},n});