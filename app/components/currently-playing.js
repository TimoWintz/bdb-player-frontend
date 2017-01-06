import Ember from 'ember';

export default Ember.Component.extend({
    queue: Ember.inject.service('play-queue'),
    hifi: Ember.inject.service(),
    currentTrack: Ember.computed.alias('hifi.currentSound.currentTrack'),
    actions : {
		emptyQueue() {
            this.get('queue').empty();
		},
		toggle(prop) {
			this.get('queue').toggleProperty(prop);
		},
        switchTrack(num) {
            this.set('queue.playingIndex', num);
            this.get('queue').play();
        }
    }
});
