import Ember from 'ember';

export default Ember.Controller.extend({
    needs: 'playQueue',
    playQueue: Ember.computed.alias('controllers.application.playQueue')
});
