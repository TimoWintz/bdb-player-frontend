import Ember from 'ember';

export default Ember.Controller.extend({
	queue: Ember.inject.service('play-queue'),
    actions : {
        add(track) {
                this.get('queue').add(track);
        }
    }
});
