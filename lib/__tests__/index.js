"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable react/no-multi-comp, react/prop-types */

var _ava = require("ava");

var _ava2 = _interopRequireDefault(_ava);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _server = require("react-dom/server");

var _server2 = _interopRequireDefault(_server);

var _ = require("..");

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const result = ?
// => https://github.com/sindresorhus/ava/issues/274

(0, _ava2.default)("SVGInline: passes & merges className", function (t) {
  var result = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, { className: "TestSVG", svg: "<svg><g></g></svg>" }));
  t.is(result, "<span class=\"SVGInline TestSVG\"><svg class=\"SVGInline-svg " + "TestSVG-svg\"" + "><g></g></svg></span>");
});

(0, _ava2.default)("SVGInline: parent component can be chosen by tagName", function (t) {
  var result = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, {
    component: "div",
    className: "TestSVG",
    svg: "<svg><g></g></svg>"
  }));
  t.is(result, "<div class=\"SVGInline TestSVG\"><svg class=\"SVGInline-svg TestSVG-svg\"" + "><g></g></svg></div>");
});

(0, _ava2.default)("SVGInline: parent composite component can be chosen", function (t) {
  var TestComponent = function TestComponent(props) {
    return _react2.default.createElement("div", _extends({}, props, { className: "foo" }));
  };

  var result = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, {
    component: TestComponent,
    className: "TestSVG",
    svg: "<svg><g></g></svg>"
  }));
  t.is(result, "<div class=\"foo\"><svg class=\"SVGInline-svg TestSVG-svg\"><g></g></svg>" + "</div>");
});

var svgPiece = "width=\"24\" height=\"16px\"><g fill=\"none\"><path " + "fill=\"#ab234f\"></path></g></svg>";
var SVGInlineStart = "<span class=\"SVGInline\"><svg class=\"SVGInline-svg\"";
var SVGInlineCleanedStart = "<span class=\"SVGInline SVGInline--cleaned\">" + "<svg class=\"SVGInline-svg SVGInline--cleaned-svg\"";

(0, _ava2.default)("SVGInline: doesn't cleanup the svg by default", function (t) {

  var result = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, { svg: "<svg " + svgPiece }));
  t.is(result, SVGInlineStart + " " + svgPiece + "</span>");
});

(0, _ava2.default)("SVGInline: can cleanup the svg", function (t) {
  var result = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, { cleanup: true, svg: "<svg " + svgPiece }));
  t.is(result, SVGInlineCleanedStart + "><g><path></path></g></svg></span>");
});

(0, _ava2.default)("SVGInline: cleanup the svg with exceptions", function (t) {
  var result = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, { cleanupExceptions: ["fill"], svg: "<svg " + svgPiece }));
  t.is(result, SVGInlineCleanedStart + "><g fill=\"none\"><path fill=\"#ab234f\"></path>" + "</g></svg></span>");
});

(0, _ava2.default)("SVGInline: should add width (and height automatically)", function (t) {
  var result = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, { svg: "<svg><g></g></svg>", width: "1rem" }));
  t.is(result, SVGInlineStart + " style=\"width: 1rem;height: 1rem;\"><g></g></svg></span>");
});

(0, _ava2.default)("SVGInline: should add width & height", function (t) {
  var result = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, { svg: "<svg><g></g></svg>", width: "1rem", height: "auto" }));
  t.is(result, SVGInlineStart + " style=\"width: 1rem;height: auto;\"><g></g></svg></span>");
});

(0, _ava2.default)("SVGInline: should add height", function (t) {
  var result = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, { svg: "<svg><g></g></svg>", height: "1rem" }));
  t.is(result, SVGInlineStart + " style=\"height: 1rem;\"><g></g></svg></span>");
});

(0, _ava2.default)("SVGInline: does not pass internal props to component", function (t) {
  var TestComponent = function TestComponent(props) {
    t.not(props.className, undefined);
    t.is(props.component, undefined);
    t.is(props.classSuffix, undefined);
    t.is(props.fill, undefined);
    t.is(props.cleanup, undefined);
    t.is(props.cleanupExceptions, undefined);

    return _react2.default.createElement("div", { className: "foo" });
  };

  _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, {
    component: TestComponent,
    className: "TestSVG",
    classSuffix: "-test",
    fill: "#000000",
    svg: "<svg><g></g></svg>",
    cleanupExceptions: ["fake"],
    cleanup: true
  }));
});

(0, _ava2.default)("SVGInline: includes title element if accessibilityLabel is provided", function (t) {
  var result = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, { svg: "<svg><g></g></svg>", accessibilityLabel: "My test title" }));
  t.is(result, SVGInlineStart + " role=\"img\" aria-labelledby=\"SVGInline-0-title\"><title id=\"SVGInline-0-title\">My test title</title><g></g></svg></span>");
});

(0, _ava2.default)("SVGInline: accessibilityLabel IDs are not the same", function (t) {
  var result1 = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, { svg: "<svg><g></g></svg>", accessibilityLabel: "First test title" }));
  var result2 = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, { svg: "<svg><g></g></svg>", accessibilityLabel: "Second test title" }));
  t.is(result1, SVGInlineStart + " role=\"img\" aria-labelledby=\"SVGInline-1-title\"><title id=\"SVGInline-1-title\">First test title</title><g></g></svg></span>");
  t.is(result2, SVGInlineStart + " role=\"img\" aria-labelledby=\"SVGInline-2-title\"><title id=\"SVGInline-2-title\">Second test title</title><g></g></svg></span>");
});

(0, _ava2.default)("SVGInline: includes desc element if accessibilityDesc is provided", function (t) {
  var result = _server2.default.renderToStaticMarkup(_react2.default.createElement(_2.default, { svg: "<svg><g></g></svg>", accessibilityDesc: "Longer accessibility description of this svg image" }));
  t.is(result, SVGInlineStart + "><desc>Longer accessibility description of this svg image</desc><g></g></svg></span>");
});