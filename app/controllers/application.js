import Ember from 'ember';

export default Ember.Controller.extend({
    filter : Ember.inject.service(),
    actions : {
        clear() {
            this.set('filter.filter', '');
            window.scrollTo(0,0);
        }
    }
});
