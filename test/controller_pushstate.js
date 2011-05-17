$(document).ready(function() {

  module("Backbone.Controller");

  var Controller = Backbone.Controller.extend({

    routes: {
      "/help/:query":                "help",
      "/search/:query":              "search",
      "/search/:query/p:page":       "search",
      "/splat/*args/end":            "splat",
      "/*first/complex-:part/*rest": "complex",
      "/:entity?*args":              "query",
      "/*anything":                  "anything"
    },

    initialize : function(options) {
      this.testing = options.testing;
    },

    help : function(query, page) {
      this.helpQuery = query;
      this.helpPage = page;
    },
    
    search : function(query, page) {
      this.query = query;
      this.page = page;
    },

    splat : function(args) {
      this.args = args;
    },

    complex : function(first, part, rest) {
      this.first = first;
      this.part = part;
      this.rest = rest;
    },

    query : function(entity, args) {
      this.entity    = entity;
      this.queryArgs = args;
    },

    anything : function(whatever) {
      this.anything = whatever;
    }

  });
  
  Backbone.history = null;
  var originalUrl = window.location.pathname;
  var controller = new Controller({testing: 101, pushState: true});

  Backbone.history.interval = 9;
  Backbone.history.start(true);

  test("Controller: initialize", function() {
    equals(controller.testing, 101);
  });

  asyncTest("Controller: pushState routes simple", 2, function() {
    controller.saveLocation('/help/api');
    setTimeout(function() {
      equals(controller.helpQuery, 'api');
      equals(controller.helpPage, undefined);
      start();
      controller.saveLocation(originalUrl);
    }, 10);
  });
  
  asyncTest("Controller: pushState routes (two part)", 2, function() {
    controller.saveLocation('/search/nyc/p10');
    setTimeout(function() {
      equals(controller.query, 'nyc');
      equals(controller.page, '10');
      start();
      controller.saveLocation(originalUrl);
    }, 10);
  });
  
  asyncTest("Controller: pushState routes (splats)", function() {
    controller.saveLocation('/splat/long-list/of/splatted_99args/end');
    setTimeout(function() {
      equals(controller.args, 'long-list/of/splatted_99args');
      start();
      controller.saveLocation(originalUrl);
    }, 10);
  });
  
  asyncTest("Controller: pushState routes (complex)", 3, function() {
    controller.saveLocation('/one/two/three/complex-part/four/five/six/seven');
    setTimeout(function() {
      equals(controller.first, 'one/two/three');
      equals(controller.part, 'part');
      equals(controller.rest, 'four/five/six/seven');
      start();
      controller.saveLocation(originalUrl);
    }, 10);
  });
  
  asyncTest("Controller: pushState routes (query)", 2, function() {
    controller.saveLocation('/mandel?a=b&c=d');
    setTimeout(function() {
      equals(controller.entity, 'mandel');
      equals(controller.queryArgs, 'a=b&c=d');
      start();
      controller.saveLocation(originalUrl);
    }, 10);
  });
  
  asyncTest("Controller: pushState routes (anything)", 1, function() {
    controller.saveLocation('/doesnt-match-a-route');
    setTimeout(function() {
      equals(controller.anything, 'doesnt-match-a-route');
      start();
      controller.saveLocation(originalUrl);
    }, 10);
  });
  
  asyncTest("Controller: pushState routes (hashbang)", 2, function() {
    controller.saveLocation('/search/news');
    setTimeout(function() {
      equals(controller.query, 'news');
      equals(controller.page, undefined);
      start();
      controller.saveLocation(originalUrl);
    }, 10);
  });
});
