import Ember from 'ember';

export default Ember.Component.extend({
    moving: false,
    mouseDown: function(event) {
        this.set('moving', true);
        var minX = this.$().offset().left,width = this.$().width();
        var percentX = Math.round(100 * (event.pageX - minX) / width);
        this.sendAction("action", percentX);
    },
    mouseUp: function() {
        this.set('moving' ,false);
    },
    mouseLeave: function() {
        this.set('moving' ,false);
    },
    mouseMove: function(event) {
        if(this.moving) {
            // Example on getting the position
            var minX = this.$().offset().left,width = this.$().width();
            var percentX = Math.round(100 * (event.pageX - minX) / width);
            this.sendAction("action", percentX);
        }
    }
});
