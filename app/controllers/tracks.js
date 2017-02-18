import Ember from 'ember';

export default Ember.Controller.extend({
	queue: Ember.inject.service('play-queue'),
    showAlbum: false,
    selectedAlbum: null,
    actions : {
        toggleAlbum(id) {
            this.toggleProperty('showAlbum');
            this.set('selectedAlbum', id);
        }
    }
});
