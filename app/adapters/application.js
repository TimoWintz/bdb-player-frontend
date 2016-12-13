import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    pathForType: function(type) { return Ember.String.underscore(type); },
    urlForQuery(query, modelName) {
        var url = modelName + '/query/' + query;
        return url;
    }
});
