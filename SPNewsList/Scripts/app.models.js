$(function () {
  function getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split('?')[1].split('&');
    var strParams = '';
    for (var i = 0; i < params.length; i = i + 1) {
      var singleParam = params[i].split('=');
      if (singleParam[0] == paramToRetrieve)
        return singleParam[1];
    }
  }

  App.News = Em.Object.extend({});
  App.News.reopenClass({
    siteGroups: null,

    findAll: function () {
      var hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl")),
          appWebUrl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl")),
          hashIndex = appWebUrl ? appWebUrl.indexOf('#') : -1;

      // cut hash part of the url, otherwise RequestExecutor throws error
      if (hashIndex >= 0) {
        appWebUrl = appWebUrl.substring(0, hashIndex);
      }

      var context = new SP.ClientContext(appWebUrl);
      var factory = new SP.ProxyWebRequestExecutorFactory(appWebUrl);
      context.set_webRequestExecutorFactory(factory);
      var appContextSite = new SP.AppContextSite(context, hostWebUrl);

      var query = new SP.CamlQuery();
      var newsQuery = appContextSite.get_web().get_lists().getByTitle('News').getItems(query);
      var news = context.loadQuery(newsQuery, 'Include(Id, Title, Body)');

      var deferred = new Em.RSVP.Promise(function (resolve, reject) {
        context.executeQueryAsync(
            Function.createDelegate(this, function () {
              var mappedNews = news.map(function (n) {
                return App.News.create({ title: n.get_item('Title'), body: n.get_item('Body') });
              });
              resolve(mappedNews);
            }),
            function (ctx, args) {
              reject(args.get_message());
            }
          );
      });

      return deferred;
    }

  });
});