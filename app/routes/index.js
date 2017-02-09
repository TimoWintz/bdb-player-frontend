import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
 
export default Ember.Route.extend(InfinityRoute, {
    filter: Ember.inject.service(),
    perPageParam: "page[size]",              // instead of "per_page" 
    pageParam: "page[number]",                  // instead of "page" 
    totalPagesParam: "meta.total-pages",    // instead of "meta.total_pages" 
    model() {
        return this.get('store').query('album', {filter : {search : this.get('filter.filter')}});
            //return this.infinityModel("album", {
                //perPage: 30,
                //startingPage: 1,
                //'filter[search]' : this.get('filter.filter')
            //});
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        this.addObserver('filter.filter', function() {
            this.refresh();
        });
    }
});
