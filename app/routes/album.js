import Ember from 'ember';
import RSVP from 'rsvp';
import ResetScroll from '../mixins/resetscroll';

export default Ember.Route.extend(ResetScroll, {
    model(params) {
        return RSVP.hash({
            album: this.get('store').findRecord('album', params.album_id),
            tracks: this.get('store').query('item', {filter : { album_id : params.album_id}})
        });
    }
});
