import Ember from 'ember';

export default Ember.Service.extend({
    isShown: false,
    type: null,
    objectId: null,
    openMenu: function(x, y) {
        this.set('isShown', true);
        Ember.$('#context-menu').offset({ top: y, left : x}); 
        Ember.run.next(this,function(){
            var _this = this;
            Ember.$(document).one('click',function hide(ev) {            
                if(ev.which === 3) {
                    Ember.$(document).one('click',hide);       
                } else {
                    _this.set('isShown', false);
                }
            });
        });
    }
});
