'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Menubar = function (_Component) {
  _inherits(Menubar, _Component);

  function Menubar() {
    _classCallCheck(this, Menubar);

    return _possibleConstructorReturn(this, (Menubar.__proto__ || Object.getPrototypeOf(Menubar)).apply(this, arguments));
  }

  _createClass(Menubar, [{
    key: 'render',
    value: function render() {
      var active = this.props.active;

      return _react2.default.createElement(
        'div',
        { style: { background: '#f7f7f7', minHeight: '100vh' } },
        _react2.default.createElement(
          _semanticUiReact.Menu,
          { inverted: true },
          _react2.default.createElement(
            _semanticUiReact.Container,
            null,
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { header: true },
              'Image Labeling'
            ),
            _react2.default.createElement(
              _reactRouterDom.Link,
              { to: '/' },
              _react2.default.createElement(
                _semanticUiReact.Menu.Item,
                { active: active === 'label' },
                _react2.default.createElement(_semanticUiReact.Icon, { name: 'tag', style: { marginRight: '5px' } }),
                'Label'
              )
            ),
            _react2.default.createElement(
              _reactRouterDom.Link,
              { to: '/admin/' },
              _react2.default.createElement(
                _semanticUiReact.Menu.Item,
                { active: active === 'admin' },
                _react2.default.createElement(_semanticUiReact.Icon, { name: 'pencil', style: { marginRight: '5px' } }),
                'Admin'
              )
            ),
            _react2.default.createElement(
              _reactRouterDom.Link,
              { to: '/help/' },
              _react2.default.createElement(
                _semanticUiReact.Menu.Item,
                { active: active === 'help' },
                _react2.default.createElement(_semanticUiReact.Icon, { name: 'help circle', style: { marginRight: '5px' } }),
                'Help'
              )
            )
          )
        ),
        _react2.default.createElement(
          _semanticUiReact.Container,
          null,
          this.props.children
        )
      );
    }
  }]);

  return Menubar;
}(_react.Component);

exports.default = Menubar;