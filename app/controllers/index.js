import Ember from 'ember';

export default Ember.Controller.extend({
    showAlbum: false,
    actions : {
        toggleAlbum() {
            this.toggleProperty('showAlbum');
        }
    }
});
