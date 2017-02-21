import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.get('store').query('folder', {filter : {search : this.get('filter.filter')}});
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        this.addObserver('filter.filter', function() {
            this.refresh();
        });
    }
});
