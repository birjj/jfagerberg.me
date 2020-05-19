// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/background/shader-program.ts":[function(require,module,exports) {
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Runs a WebGL shader
 * Shaders are given the uniforms returned by `uniformsGetter`
 * Also given:
 *   attribute a_position:      the current pixel
 *   uniform float u_time:      the current timestamp
 *   uniform vec2 u_resolution: the size of the canvas
 */

var ShaderProgram = /*#__PURE__*/function () {
  function ShaderProgram(gl, vertex, fragment, uniformsGetter) {
    var _this = this;

    _classCallCheck(this, ShaderProgram);

    this.paused = false;
    this.draw = this.draw.bind(this);
    this.gl = gl;
    this.startTime = Date.now() - 6000; // generate the shaders

    this.vertex = this.createShader(vertex, gl.VERTEX_SHADER);
    this.fragment = this.createShader(fragment, gl.FRAGMENT_SHADER); // generate the program

    this.program = this.createProgram(this.vertex, this.fragment); // grab where we store the GLSL variables

    this.uniformsGetter = uniformsGetter;
    this.uniforms = this.getUniforms();
    this.positions = {
      a_position: gl.getAttribLocation(this.program, "a_position")
    };
    Object.keys(this.uniforms).forEach(function (key) {
      var location = gl.getUniformLocation(_this.program, key);

      if (location) {
        _this.positions[key] = location;
      }
    }); // create the plane we will draw onto

    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    var positions = [-1, 1, 1, 1, -1, -1, 1, -1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  }
  /** Gets the uniforms, including */


  _createClass(ShaderProgram, [{
    key: "getUniforms",
    value: function getUniforms() {
      return _objectSpread({
        u_time: Date.now() - this.startTime,
        u_resolution: [this.gl.canvas.width, this.gl.canvas.height]
      }, this.uniformsGetter(this.gl));
    }
    /** Creates a program object from two shaders */

  }, {
    key: "createProgram",
    value: function createProgram(vertex, fragment) {
      var gl = this.gl;
      var program = gl.createProgram();

      if (!program) {
        throw new Error("Couldn't create WebGL program");
      }

      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error("Failed when creating program\n".concat(gl.getProgramInfoLog(program)));
      }

      return program;
    }
    /** Creates a shader object from some source code */

  }, {
    key: "createShader",
    value: function createShader(source, type) {
      var gl = this.gl;
      var shader = gl.createShader(type);

      if (!shader) {
        throw new SyntaxError("Couldn't compile shader");
      }

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new SyntaxError("Failed to compile shader\n".concat(gl.getShaderInfoLog(shader)));
      }

      return shader;
    }
    /** Set whether we are paused */

  }, {
    key: "setPaused",
    value: function setPaused(paused) {
      this.paused = paused;
      this.draw();
    }
    /** Actually draws; executes itself after it has first been called */

  }, {
    key: "draw",
    value: function draw(t) {
      var _this2 = this;

      if (this._animTimeout !== undefined) {
        cancelAnimationFrame(this._animTimeout);
      }

      if (this.paused) {
        return console.warn("Stopping automatic draw due to pausing");
      }

      var gl = this.gl; // clear the canvas

      gl.clear(gl.COLOR_BUFFER_BIT); // tell webgl to use the program, and allow the position attribute

      gl.useProgram(this.program);
      gl.enableVertexAttribArray(this.positions.a_position); // bind this.positionBuffer to ARRAY_BUFFER as points

      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.vertexAttribPointer(this.positions.a_position, // variable to bind into
      2, // number of values to pull per point
      gl.FLOAT, // type of values to pull
      false, // no effect, since type = FLOAT
      0, // figure out stride from above values
      0 // no offset before values
      ); // set our uniforms

      this.uniforms = this.getUniforms();
      Object.keys(this.uniforms).forEach(function (key) {
        if (!_this2.positions[key]) {
          return;
        }

        var value = _this2.uniforms[key];

        if (typeof value === "number") {
          gl.uniform1f(_this2.positions[key], value);
        } else if (value instanceof Array && value.length === 2) {
          gl.uniform2f(_this2.positions[key], value[0], value[1]);
        }
      }); // finally draw

      gl.drawArrays(gl.TRIANGLE_STRIP, // type of geometry
      0, // no offset
      4 // 4 vertices
      ); // and call ourselves again

      this._animTimeout = requestAnimationFrame(this.draw);
    }
  }]);

  return ShaderProgram;
}();

exports.default = ShaderProgram;
},{}],"js/background/eased-vector.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Vec2 which can't change abruptly. When new values are set, they are eased.
 * Supports changing the duration temporarily
 */

var EasedVec2 = /*#__PURE__*/function () {
  function EasedVec2(x, y) {
    var t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

    _classCallCheck(this, EasedVec2);

    this.vec = [x, y];
    this.duration = t;
    this.animate = this.animate.bind(this);
  }

  _createClass(EasedVec2, [{
    key: "set",
    value: function set(x, y) {
      var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.duration;
      this.animation = {
        from: [this.vec[0], this.vec[1]],
        to: [x, y],
        startT: Date.now(),
        duration: duration
      };
      this.animate();
    }
  }, {
    key: "setX",
    value: function setX(x) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.duration;
      this.set(x, this.animation ? this.animation.to[1] : this.vec[1], duration);
    }
  }, {
    key: "setY",
    value: function setY(y) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.duration;
      this.set(this.animation ? this.animation.to[0] : this.vec[0], y, duration);
    }
  }, {
    key: "animate",
    value: function animate() {
      if (!this.animation) {
        return console.warn("Attempting to animate EasedVector without defined animation", this);
      }

      clearTimeout(this._animTimeout);
      var animation = this.animation; // update the time keeping variables

      var t = Date.now();
      var progress = Math.min((t - animation.startT) / animation.duration, 1); // update our value

      this.vec = [this.ease(animation.from[0], animation.to[0], progress), this.ease(animation.from[1], animation.to[1], progress)]; // and keep updating

      if (progress < 1) {
        this._animTimeout = setTimeout(this.animate, 0);
      }
    }
  }, {
    key: "ease",
    value: function ease(from, to, progress) {
      return from + (to - from) * this.easing(progress);
    }
  }, {
    key: "easing",
    value: function easing(t) {
      // easeOutQuint
      return 1 + --t * t * t * t * t;
    }
  }, {
    key: "x",
    get: function get() {
      return this.vec[0];
    }
  }, {
    key: "y",
    get: function get() {
      return this.vec[1];
    }
  }]);

  return EasedVec2;
}();

exports.default = EasedVec2;
},{}],"js/background/shaders/background.vert":[function(require,module,exports) {
module.exports = `#define GLSLIFY 1
attribute vec4 a_position;

void main() {
    gl_Position = a_position;
}`
},{}],"js/background/shaders/background.frag":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\nuniform float u_time;\nuniform vec2 u_resolution;\nuniform vec2 u_mousepos;\nuniform vec2 u_offset;\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v)\n  {\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289(i);\n  vec4 p = permute( permute( permute(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n  }\n\nvec3 c1 = vec3(30, 30, 35) / 255.0;\nvec3 c2 = vec3(34, 34, 39) / 255.0;\nvec3 c3 = vec3(36, 36, 42) / 255.0;\nvec3 c4 = vec3(40, 40, 45) / 255.0;\nvec3 c5 = vec3(43, 43, 48) / 255.0;\nvoid main() {    \n    vec2 normalized_pos = gl_FragCoord.xy / u_resolution;\n    normalized_pos.x *= u_resolution.x / u_resolution.y; // remove stretching\n    \n    float time = u_time / 75000.0;\n    vec2 offset = vec2(0, (u_offset.y - 0.5) * 3.0);\n    offset.x *= u_resolution.x / u_resolution.y;\n    normalized_pos *= 0.6; // make the blobs bigger\n    offset *= -0.5;\n    normalized_pos.x += u_offset.x * 0.2;\n\n    // TODO: replace with a single lookup texture so we don't compute noise 5 times\n    float c5scale = 1.0 - step(0.6, snoise(vec3(normalized_pos + offset * 0.4, time)));\n    float c4scale = 1.0 - step(0.2, snoise(vec3(normalized_pos + offset * 0.3, time))) - c5scale;\n    float c3scale = 1.0 - step(-0.2, snoise(vec3(normalized_pos + offset * 0.2, time))) - c4scale - c5scale;\n    float c2scale = 1.0 - step(-0.6, snoise(vec3(normalized_pos + offset * 0.1, time))) - c3scale - c4scale - c5scale;\n    float c1scale = 1.0 - c2scale - c3scale - c4scale - c5scale;\n    gl_FragColor = vec4(c1 * c1scale + c2 * c2scale + c3 * c3scale + c4 * c4scale + c5 * c5scale, 1.0);\n    return;\n}";
},{}],"js/background.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var shader_program_1 = __importDefault(require("./background/shader-program"));

var eased_vector_1 = __importDefault(require("./background/eased-vector"));

var background_vert_1 = __importDefault(require("./background/shaders/background.vert"));

var background_frag_1 = __importDefault(require("./background/shaders/background.frag")); // calculate the background offset based on scroll and URL


var easedOffset = new eased_vector_1.default(0, 0, 200); // x = url level, y = scroll position range [0,1]

var updateScrollOffset = function updateScrollOffset() {
  easedOffset.setY(window.scrollY / (document.body.offsetHeight - window.innerHeight));
}; // TODO: update on URL change


window.addEventListener("scroll", updateScrollOffset);
window.addEventListener("resize", updateScrollOffset);
/** Gets the uniforms we use for the shader */

var uniforms = {}; // we reuse a single object to avoid memory pollution

function getUniforms(gl) {
  uniforms.u_offset = easedOffset.vec;
  return uniforms;
} // create our canvas and insert it into the DOM


(function ($parent) {
  var $canvas = document.createElement("canvas");
  $canvas.id = "webgl-bg";
  var ctx = $canvas.getContext("webgl");

  if (!ctx) {
    return console.warn("Does not support WebGL");
  } // create our shader program that handles drawing the background


  var program = new shader_program_1.default($canvas.getContext("webgl"), background_vert_1.default, background_frag_1.default, getUniforms);
  program.draw(); // insert our canvas into DOM (and keep its size updated)

  var resizeCanvas = function resizeCanvas() {
    $canvas.width = window.innerWidth;
    $canvas.height = window.innerHeight;
    ctx.viewport(0, 0, $canvas.width, $canvas.height);
    ctx.clear(ctx.COLOR_BUFFER_BIT);
    program.draw();
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  $parent.insertBefore($canvas, $parent.firstChild);
})(document.body);
},{"./background/shader-program":"js/background/shader-program.ts","./background/eased-vector":"js/background/eased-vector.ts","./background/shaders/background.vert":"js/background/shaders/background.vert","./background/shaders/background.frag":"js/background/shaders/background.frag"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52484" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","js/background.ts"], null)
//# sourceMappingURL=/background.4fb25ae4.js.map