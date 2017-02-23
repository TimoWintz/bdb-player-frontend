import Ember from 'ember';
import SendQueueMixin from '../mixins/send-queue';

export default Ember.Component.extend(SendQueueMixin, {
    store: Ember.inject.service(),
    loading: true,
    cMenu: Ember.inject.service("context-menu-service"),
    albumId : null,
    album: Ember.computed('store', 'albumId', function() {
        return this.get('store').findRecord('album', this.get('albumId'));
    }),
    tracks: Ember.computed('store', 'albumId', function() {
        var items = this.get('store').query('item', {filter : { album_id : this.get('albumId')}});
        var that = this;
        items.then(function() {
            that.set('loading', false);
        });
        return items;
    }),
    contextMenu(ev) {
        this.get("cMenu").open(ev.clientX, ev.clientY);
        console.log(ev);
        return false;
    }
});
