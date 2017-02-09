import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    cMenu: Ember.inject.service("context-menu-service"),
    albumId : null,
    album: Ember.computed('store', 'albumId', function() {
        return this.get('store').findRecord('album', this.get('albumId'));
    }),
    tracks: Ember.computed('store', 'albumId', function() {
        return this.get('store').query('item', {filter : { album_id : this.get('albumId')}});
    }),
    contextMenu(ev) {
        this.get("cMenu").open(ev.clientX, ev.clientY);
        console.log(ev);
        return false;
    }
});
