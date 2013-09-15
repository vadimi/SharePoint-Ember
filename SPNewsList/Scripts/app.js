$(function () {
  App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    rootElement: '#main',
    ready: function () {
      // disable SP 2013 hashchange event handling
      _spBodyOnHashChange = function () { };
    }
  });

  App.Router.map(function () {
    this.route('news', { path: '/' });
    this.resource('news', { path: '/news' });
  });

  App.NewsRoute = Em.Route.extend({
    model: function (params) {
      return params;
    },

    setupController: function (controller) {
      controller.load();
    }
  });

  App.NewsController = Em.ArrayController.extend({
    load: function () {
      var controller = this;
      App.News.findAll().then(function (news) {
        controller.set('content', news);
      });
    }
  });

});