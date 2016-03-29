/* Generated by Babel */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _tks = require('./tks');

var _tks2 = _interopRequireDefault(_tks);

var CheddarLexer = (function () {
    function CheddarLexer(Code, Index) {
        _classCallCheck(this, CheddarLexer);

        this.Code = Code;
        this.Index = Index;

        this._Tokens = [];
    }

    _createClass(CheddarLexer, [{
        key: "getChar",
        value: function getChar() {
            if (this.Code[this.Index]) return this.Code[this.Index++];else return false;
        }
    }, {
        key: "newToken",
        value: function newToken() {
            var fill = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
            this._Tokens[this._Tokens.push(fill) - 1];return this;
        }
    }, {
        key: "addToken",
        value: function addToken() {
            var char = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
            this._Tokens[this._Tokens.length - 1] += char;return this;
        }
    }, {
        key: "open",
        value: function open(forceNot) {
            if (this.Code === null || this.Index === null) throw new TypeError('CheddarLexer: uninitialized code, index.');else if (forceNot !== false) this.newToken();
        }
    }, {
        key: "close",
        value: function close() {
            delete this.Code;return this;
        }
    }, {
        key: "error",
        value: function error(id) {
            return id;
        }
    }, {
        key: "parse",
        value: function parse(parseClass) {
            if (parseClass.prototype instanceof CheddarLexer) {
                var _ref;

                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                var Parser = (_ref = new parseClass(this.Code, this.Index)).exec.apply(_ref, args);

                this.Tokens = Parser;
                this.Index = Parser.Index;

                return this;
            } else {
                throw new TypeError('CheddarParser: provided parser is not a CheddarLexer');
            }
        }
    }, {
        key: "jumpWhite",
        value: function jumpWhite() {
            var WHITESPACE_REGEX = /\s/;
            while (WHITESPACE_REGEX.test(this.Code[this.Index])) this.Index++;
            return this;
        }
    }, {
        key: "jumpLiteral",
        value: function jumpLiteral(l) {
            if (this.Code.indexOf(l) === this.Index) this.Index += l.length;else return false;
            return this;
        }
    }, {
        key: "last",
        get: function get() {
            return this._Tokens[this._Tokens.length - 1];
        }
    }, {
        key: "Tokens",
        get: function get() {
            return new _tks2["default"](this._Tokens);
        },
        set: function set(v) {
            this._Tokens.push(v);
        }
    }, {
        key: "isLast",
        get: function get() {
            return this.Index === this.Code.length;
        }
    }]);

    return CheddarLexer;
})();

exports["default"] = CheddarLexer;
module.exports = exports["default"];