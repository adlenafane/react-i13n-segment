var debug = require('debug')('SegmentI13nPlugin');
var DEFAULT_CATEGORY = 'all';
var DEFAULT_ACTION = 'click';
var DEFAULT_LABEL = '';

/**
 * @class ReactI13nSegment
 * @param {String} token
 * @param {Object} config
 * @param {String} config.token (mandatory)
 * @param {String} config.name (optional)
 * @constructor
 */
var ReactI13nSegment = function (config) {
  var _config = typeof config == 'object' ? config : {};
  var token = '';

  token = typeof config == 'object' ? config.token : config;

  if (!token) {
    debug('token is mandatory');
  }

  if (!analytics) {
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
      analytics.load(token);
    }}();
  } else {
    analytics.load(token);
  }
};

/**
 * get plugin object
 * @method getPlugin
 * @return {Object} plugin object
 */
ReactI13nSegment.prototype.getPlugin = function () {
  return {
    name: 'analytics',
    eventHandlers: {
      setUsername: function (properties) {
        analytics.identify(properties.userId);
      },
      setSuperProperties: function (properties) {
        analytics.identify(properties.userId, properties);
      },
      setUserProperties: function (properties) {
        analytics.identify(properties.userId, properties);
      },
      setUserPropertiesOnce: function (properties) {
        analytics.identify(properties.userId, properties);
      },
      click: function (payload, callback) {
        var i13nNode = payload.i13nNode;
        if (i13nNode) {
          var model = i13nNode.getMergedModel();

          model.action = model.action || DEFAULT_ACTION,
          model.category = model.category || DEFAULT_CATEGORY,
          model.label = model.label || i13nNode.getText(payload.target) || DEFAULT_LABEL,
          model.value = model.value || 0,
          model.nonInteraction = model.nonInteraction || false

          analytics.track(
            model.action,
            model,
            {},
            callback
          )
        } else {
          callback && callback();
        }
      }
    }
  };
}

module.exports = ReactI13nSegment;
