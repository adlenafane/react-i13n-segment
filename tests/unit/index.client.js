var expect = require('chai').expect;
var jsdom = require('jsdom');
var I13nNode = require('react-i13n/dist/libs/I13nNode');
var ReactI13nSegment;
'use strict';

describe('segment plugin client', function () {
  beforeEach(function (done) {
    jsdom.env('<html><head><script src="foo"/></head><body></body></html>', [], function (err, window) {
      global.window = window;
      global.document = window.document;
      global.navigator = window.navigator;
      global.location = window.location;
      global.analytics = {};

      ReactI13nSegment = require('../../index.client.js');
      done();
    });
  });

  it('segment will be created once we create a plugin instance with default tracker ', function (done) {
    var mockToken = 'foo';
    global.analytics.load = function (token) {
      expect(token).to.eql(mockToken);
      done();
    };
    var reactI13nSegment = new ReactI13nSegment(mockToken);
  });

  it('segment will fire event beacon for click handler', function (done) {
    var mockToken = 'foo';
    global.analytics.load = function (token) {
      expect(token).to.eql(mockToken);
      done();
    };
    var reactI13nSegment = new ReactI13nSegment(mockToken);

    var i13nNode = new I13nNode(
      null,
      {
        category: 'foo',
        action: 'bar',
        label: 'baz',
        nonInteraction: true,
        value: 1
      }
    );
    global.analytics.track = function (eventName, properties, callback) {
        expect(eventName).to.eql('bar');
        expect(properties.category).to.eql('foo');
        expect(properties.action).to.eql('bar');
        expect(properties.label).to.eql('baz');
        expect(properties.value).to.eql(1);
        expect(properties.nonInteraction).to.eql(true);

        callback.hitCallback && callback.hitCallback();
    };
    reactI13nSegment.getPlugin().eventHandlers.click({
        i13nNode: i13nNode
    }, function beaconCallback () {
        done();
    });
  });

  it('segment will fire page beacon for page change', function (done) {
    function beaconCallback () {
      done();
    }
    var mockToken = 'foo';
    global.analytics.load = function (token) {
      expect(token).to.eql(mockToken);
    };
    var reactI13nSegment = new ReactI13nSegment(mockToken);

    global.analytics.page = function (name, properties, options, callback) {
      expect(name).to.eql('baz');
      expect(properties.title).to.eql('baz');
      expect(properties.url).to.eql('/bar');
      expect(properties.location).to.eql('/foo/foo');
      expect(options).to.eql({});

      callback && callback();
    };

    reactI13nSegment.getPlugin().eventHandlers.pageview({
      location: '/foo/foo',
      url: '/bar',
      title: 'baz'
    }, beaconCallback);

  });
});
