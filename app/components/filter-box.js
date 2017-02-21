import Ember from 'ember';

export default Ember.Component.extend({
    filter: Ember.inject.service(),
    path: null,
    actions : {
        clearFilter() {
            this.set("filter.filter", "");
        }
    }
});
