import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['play'],
	queue: Ember.inject.service('play-queue'),
	hifi: Ember.inject.service(),
	play: null,
	init() {
		this.addObserver('model', function func() {
			console.log('hello');
			if(this.get('play')) {
				this.send('play', this.get('play'));
			}
            this.removeObserver('model', func);
		}.bind(this));
	},
	actions : {
        add(track) {
            if(track) {
                this.get('queue').add(track);
            }
            else {
                this.get('model.tracks').map(function(track) {
                    this.get('queue').add(track);
                }.bind(this));
            }
        },
		play(id) {
			var found = true;
			if (id) {
				this.set('play', id);
				found = false;
			} else {
                this.set('play', null);
            }
			var tracks = this.get('model.tracks');
			this.get('queue').stop();
			tracks.map(function(track) {
				if (found || track.id === id) {
					found = true;
					this.get('queue').add(track);
				}
			}.bind(this));
			this.get('queue').play();
		}
	}
});
