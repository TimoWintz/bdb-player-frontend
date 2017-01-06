import Ember from 'ember';

export default Ember.Component.extend({
    duration: 0,
    position: 0,
    percent: Ember.computed('position', 'duration', function() {
        return 100*this.get('position')/this.get('duration');
    }),
    click(evt) {
        var posX = this.$().offset().left;
        var width = this.$().width(); 
        var relPos = (evt.pageX - posX)/width;
        var absPos = Math.round(relPos*this.get('duration'));
        this.set('position', absPos);
    }
});
