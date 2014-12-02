define(["module","conditioner/Observer","util/element"],function(e,t,n){var r=function(e,t){if(!e)return;this._options=t,this._scroller=e,this._items=this._scroller.getItems(),this._number=this._items.length,this._indexNode=null,this._currentIndexItem=null,this._buttons=[],this._initialize()};return r.prototype={_initialize:function(){this._indexNode||(this._indexNode=document.createElement("ul"),this._indexNode.className="reset-list scroller-paging paging-bullets paging-bullets-small"),this._buttons=[];var e,t,n,r,i=this._scroller.getVisibleAmount();for(e=0,t=this._number;e<t;e++)if(e%i===0&&!this._options.pagingPerItem||this._options.pagingPerItem)n=document.createElement("li"),r=document.createElement("button"),r.setAttribute("type","button"),r.innerHTML='<span class="screenreader">'+(e+1)+"</span>",r.className="scroller-paging-button",r.addEventListener("click",this._handleButtonClick.bind(this,e)),n.appendChild(r),this._indexNode.appendChild(n),this._buttons.push(r)},_handleButtonClick:function(e){t.publish(this,"click",e)},getIndex:function(){return this._indexNode},setIndex:function(e){this._currentIndexItem&&this._currentIndexItem.classList.remove("active"),this._options.pagingPerItem||(e=Math.floor(e/this._number*this._buttons.length));var t=this._buttons[e].parentNode;t.classList.add("active"),this._currentIndexItem=t,this._currentIndex=e},render:function(){var e=this._indexNode.querySelectorAll("li"),t=e.length;for(t>=0;t--;)n.remove(e[t]);var r=this;setTimeout(function(){r._initialize(),r.setIndex(r._currentIndex)},500)},unload:function(){var e=this._buttons.length,t=0;for(;t<e;t++)n.remove(this._buttons[t]);n.remove(this._indexNode)}},r});