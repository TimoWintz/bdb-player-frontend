import Ember from 'ember';

export default Ember.Component.extend({
    show : false,
    header: {isHeader: true},
    body:   {isBody: true},
    actions : {
        toggle : function() {
            this.toggleProperty('show');
        }
    }
});
