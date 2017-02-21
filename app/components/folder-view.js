import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    prefix: '',
    items: Ember.computed('store', 'prefix', function() {
        return this.get('store').query('folder', {filter: {prefix : this.get('prefix')}});
    })
});
