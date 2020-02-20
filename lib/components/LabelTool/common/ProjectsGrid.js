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

var ProjectsGrid = function (_Component) {
  _inherits(ProjectsGrid, _Component);

  function ProjectsGrid(props) {
    _classCallCheck(this, ProjectsGrid);

    var _this = _possibleConstructorReturn(this, (ProjectsGrid.__proto__ || Object.getPrototypeOf(ProjectsGrid)).call(this, props));

    _this.state = {
      error: null,
      isLoaded: false,
      projects: []
    };

    _this.onNewProject = _this.onNewProject.bind(_this);
    return _this;
  }

  _createClass(ProjectsGrid, [{
    key: 'componentDidMount',
    value: async function componentDidMount() {
      try {
        var r = await fetch('/api/projects/');
        if (!r.ok && r.status === 401) {
          window.location = '/admin/login/';
          return;
        }
        var projects = await r.json();
        this.setState({
          isLoaded: true,
          projects: projects
        });
      } catch (error) {
        this.setState({
          isLoaded: true,
          error: error
        });
      }
    }
  }, {
    key: 'onNewProject',
    value: async function onNewProject() {
      var newProjectRes = await fetch('/api/projects', { method: 'POST' });
      var newProject = await newProjectRes.json();
      this.setState({
        projects: this.state.projects.concat([newProject])
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          error = _state.error,
          isLoaded = _state.isLoaded,
          projects = _state.projects;
      var _props = this.props,
          linkPrefix = _props.linkPrefix,
          newButton = _props.newButton,
          title = _props.title;


      if (error) {
        return _react2.default.createElement(
          'div',
          null,
          'Error: ',
          error.message
        );
      } else if (!isLoaded) {
        return _react2.default.createElement(_semanticUiReact.Loader, { active: true, inline: 'centered' });
      }

      var renderProjectCard = function renderProjectCard(project) {
        var id = project.id,
            name = project.name,
            form = project.form,
            imagesCount = project.imagesCount,
            labelsCount = project.labelsCount;

        var info = imagesCount + ' images, ' + labelsCount + ' labeled';
        var desc = 'Tags: ' + form.formParts.map(function (part) {
          return part.name;
        }).join(', ');
        return _react2.default.createElement(
          _semanticUiReact.Grid.Column,
          { key: id },
          _react2.default.createElement(
            _reactRouterDom.Link,
            { to: '' + linkPrefix + id },
            _react2.default.createElement(_semanticUiReact.Card, { fluid: true, link: true, header: name, meta: info, description: desc })
          )
        );
      };

      var renderedButton = newButton ? _react2.default.createElement(
        _semanticUiReact.Button,
        { style: { padding: '1.5em' }, onClick: this.onNewProject },
        _react2.default.createElement(
          'span',
          { style: { fontSize: '4em' } },
          '+'
        ),
        _react2.default.createElement(
          'div',
          null,
          'Make a new project'
        )
      ) : null;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _semanticUiReact.Header,
          { as: 'h1' },
          title
        ),
        _react2.default.createElement(
          _semanticUiReact.Grid,
          { stackable: true, columns: 2 },
          projects.map(renderProjectCard),
          _react2.default.createElement(
            _semanticUiReact.Grid.Column,
            null,
            renderedButton
          )
        )
      );
    }
  }]);

  return ProjectsGrid;
}(_react.Component);

exports.default = ProjectsGrid;