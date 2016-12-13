import Ember from 'ember';
import Table from 'ember-light-table';

export default Ember.Controller.extend({
  columns: Ember.computed(function() {
    return [{
      label: '#',
      valuePath: 'track',
      width: '2em',
      sortable: false,
    }, {
      label: 'Title',
      valuePath: 'title',
      width: '150px'
    }, {
      label: 'Album',
      valuePath: 'album',
      width: '150px'
    }];
  }),
  table: Ember.computed('model', function() {
   return new Table(this.get('columns'), this.get('model'));
  })
});
