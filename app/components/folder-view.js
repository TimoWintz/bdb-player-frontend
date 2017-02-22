import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    filter : Ember.inject.service(),
    loading: true,
    prefix: '',
    items: Ember.computed('store', 'prefix', function() {
        var items = this.get('store').query('folder', {filter: {prefix : this.get('prefix'),
                                                                search : this.get('filter.filter')}});
        var that = this;
        items.then(function() {
            that.set('loading', false);
        });
        return items;
    })
});
