import Ember from 'ember';

export default Ember.Route.extend({
    queue: Ember.inject.service('play-queue'),
    filter: Ember.inject.service(),
    actions : {
        clearFilter(link) {
            this.set("filter.filter", "");
        }
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        this.get('queue.playingIndex');
        this.addObserver('queue.playingIndex', function() {
            var index = this.get('queue.playingIndex');
            if (index !== null) {
                var container = Ember.$('.sidebar-body'),
                    scrollTo = Ember.$("#playlist-item-"+index.toString());
                if (scrollTo.offset()) {
                    container.scrollTop(
                        -container.offset().top + scrollTo.offset().top + container.scrollTop()
                    );
                }
            }
        });
    }
});
