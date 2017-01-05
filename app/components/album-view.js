import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    albumId : null,
    album: Ember.computed('store', 'albumId', function() {
        return this.get('store').findRecord('album', this.get('albumId'));
    }),
    tracks: Ember.computed('store', 'albumId', function() {
        return this.get('store').query('item', {filter : { album_id : this.get('albumId')}});
    }),
});
