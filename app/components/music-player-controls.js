import Ember from 'ember';

export default Ember.Component.extend({
    actions : {
        play : function() {
            this.sendAction("musicControl", "play");
        },
        pause : function() {
            this.sendAction("musicControl", "pause");
        },
        skip : function() {
            this.sendAction("musicControl", "skip");
        }
    }
});
