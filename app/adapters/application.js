import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    host: 'http://localhost:8337',
    pathForType: function(type) { return Ember.String.underscore(type); },
    urlForQuery(query, modelName) {
        var url = this.host + '/' + modelName + '/query/' + query;
        return url;
    }
});
