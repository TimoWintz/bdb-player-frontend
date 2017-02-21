import DS from 'ember-data';

export default DS.Model.extend({
    folder: DS.attr(),
    name: DS.attr('string')
});
