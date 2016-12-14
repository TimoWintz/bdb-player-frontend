import DS from 'ember-data';

export default DS.Model.extend({
    album: DS.attr(),
    track: DS.attr(),
    title: DS.attr(),
    disc: DS.attr(),
    length: DS.attr(),
    artist: DS.attr(),
    format: DS.attr('string'),
    isPlaying: false
});
