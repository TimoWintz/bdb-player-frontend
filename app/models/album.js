import DS from 'ember-data';

export default DS.Model.extend({
    albumartist: DS.attr(),
    album: DS.attr()
});
