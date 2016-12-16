import Ember from 'ember';

export default Ember.Component.extend({
    filter: Ember.inject.service(),
    filterText: '',
    path: null,
    onFilterTextChange: Ember.observer('filterText', function() {
        // wait 1/10 second before applying the filter
        Ember.run.debounce(this, this.applyFilter, 100);
    }),
    applyFilter: function() {
        this.set('filter.filter', this.get('filterText')); 
    },
});
