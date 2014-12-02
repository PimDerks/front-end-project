define(["module","conditioner/Observer","util/element"],function(e,t,n){var r=function(e,t){if(!e)return;this._options=t,this._scroller=e,this._items=this._scroller.getItems(),this._number=this._items.length,this._element=null,this._initialize()};return r.prototype={_initialize:function(){this._element=document.createElement("div"),this._element.className="scroller-controls",n.insertAfter(this._element,this._scroller.getElement()),this._onPrevBind=this._onPrev.bind(this),this._onNextBind=this._onNext.bind(this),this._prev=this._createButton("Previous","button-transparent scroller-prev hide","icon-left-big"),this._prev.addEventListener("click",this._onPrevBind),this._element.appendChild(this._prev),this._next=this._createButton("Next","button-transparent scroller-next hide","icon-right-big"),this._next.addEventListener("click",this._onNextBind),this._element.appendChild(this._next)},_createButton:function(e,t,n){var r=document.createElement("button");r.setAttribute("type","button");var i=document.createElement("span");i.className="icon "+n,i.setAttribute("aria-hidden","true");var s=document.createElement("span");return s.className="screenreader",s.innerHTML=e,r.appendChild(i),r.appendChild(s),r.className=t,r},getElement:function(){return this._element},_onNext:function(){this._scroller.navigate("next")},_onPrev:function(){this._scroller.navigate("prev")},hidePrev:function(){this._prev.classList.add("hide")},hideNext:function(){this._next.classList.add("hide")},showPrev:function(){this._prev.classList.remove("hide")},showNext:function(){this._next.classList.remove("hide")},unload:function(){this._next.removeEventListener("click",this._onNextBind),this._prev.removeEventListener("click",this._onPrevBind),n.remove(this._next),n.remove(this._prev),n.remove(this._element)}},r});