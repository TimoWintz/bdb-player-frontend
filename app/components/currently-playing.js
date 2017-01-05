import Ember from 'ember';

export default Ember.Component.extend({
            queue: Ember.inject.service('play-queue'),
            hifi: Ember.inject.service(),
            currentTrack: Ember.computed.alias('hifi.currentSound.currentTrack')
});
