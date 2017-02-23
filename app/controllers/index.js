import Ember from 'ember';
import SendQueueMixin from '../mixins/send-queue';

export default Ember.Controller.extend(SendQueueMixin, {
    showAlbum: false,
    selectedAlbum: null,
    actions : {
        toggleAlbum(id) {
            this.toggleProperty('showAlbum');
            this.set('selectedAlbum', id);
        }
    }
});
