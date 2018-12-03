// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
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
  return newRequire;
})({"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"assets/css/style.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"assets/js/main.js":[function(require,module,exports) {
"use strict";

require("../css/style.scss");

var inputText = document.querySelector('.input-text');
var displayImg = document.querySelector('.display-img');
var form = document.querySelector('.form');
var navBar = document.querySelector('.navbar-list');
var url = "http://api.giphy.com/v1/gifs/search?";
var query = "";
var key = "&api_key=4lhG2kbqPHauRqDVhRjW280Rjaznd9J6";
var img;
var fileSelector = document.querySelector('.file-selector');
var userFiles = document.querySelector('.user-files');
var srcEl;
var thirdEl;
var allList = document.querySelector('.all-list');
var uploadForm = document.querySelector('#upload');
var status = document.querySelector('#messages');
var imgArr = [];
var favArr = JSON.parse(localStorage.getItem("fav")) || [];

function displayEmoji() {
  var imgArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var xhr = fetch("".concat(url).concat(key).concat(query)).then(function (data) {
    return data.json();
  }).then(function (res) {
    userFiles.innerHTML = " ";

    for (var i = 0; i < 6; i++) {
      var htmlText = "";
      htmlText = "\n        <span class=\"img draggable\" draggable=\"true\">\n          <a data-id=\"".concat(i, "\" target=\"_blank\" href=\"").concat(res.data[i].images.fixed_height_downsampled.url, "\"><img class=\"gif\" data-id=\"").concat(i, "\" src=\"").concat(res.data[i].images.fixed_height_downsampled.url, "\"></a>\n          <div class=\"fav-btn\">\n            <button data-id=\"").concat(i, "\" class=\"fav\">Add To Fav</button>\n          </div>\n        </span>\n      ");
      displayImg.innerHTML += htmlText;
      drag();
      imgArray.push("".concat(res.data[i].images.fixed_height_downsampled.url));
    }
  });
  inputText.value = "";
} // Display Imoji


function displayInfo() {
  var text = inputText.value;

  if (inputText.value) {
    query = "&q=".concat(text);
    displayEmoji(imgArr);
  }

  inputText.value = "";
} // addFavorite


function dispFavorite() {
  var fav = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  displayImg.innerHTML = " ";
  favArr.forEach(function (v, i) {
    var favour = "\n      <span class=\"img draggable\" draggable=\"true\">\n        <a data-id=\"".concat(i, "\" target=\"_blank\" href=\"").concat(v, "\"><img class=\"gif\" data-id=\"").concat(i, "\" src=\"").concat(v, "\"></a>\n        <div class=\"fav-del\">\n          <button data-id=\"").concat(i, "\" class=\"del\">delete</button>\n        </div>\n      </span>\n      ");
    displayImg.innerHTML += favour;
    drag();
  });
} // Trending


function trending() {
  displayImg.innerHTML = " ";
  query = "&q=".concat(trending);
  displayEmoji(imgArr);
}

displayImg.addEventListener("click", function (e) {
  if (e.target.classList.contains('fav')) {
    var id = e.target.dataset.id;
    if (favArr.includes(imgArr[id])) return;
    favArr.push(imgArr[id]);
    localStorage.setItem('fav', JSON.stringify(favArr));
    JSON.parse(localStorage.getItem('fav'));
  }

  if (e.target.classList.contains('del')) {
    var id = e.target.dataset.id;
    console.log(id);
    favArr.splice(id, 1);
    localStorage.setItem('fav', JSON.stringify(favArr));
    dispFavorite();
  }
});
navBar.addEventListener("click", function (e) {
  if (e.target.classList.contains('trending-list')) {
    form.style.display = "none";
    uploadForm.style.display = "none";
    trending();
  }

  if (e.target.classList.contains('favorite-list')) {
    form.style.display = "none";
    uploadForm.style.display = "none";
    dispFavorite(favArr);
  }

  if (e.target.classList.contains('all-list')) {
    status.style.display = "none";
    uploadForm.style.display = "none";
    form.style.display = "block";
    displayEmoji(imgArr);
  }

  if (e.target.classList.contains('upload-list')) {
    form.style.display = "none";
    uploadForm.style.display = "block";
    status.style.display = "block";
  }
});
form.addEventListener("submit", function (e) {
  e.preventDefault();
  displayInfo();
}); // Drag and drop

function dragStart(e) {
  e.target.style.opacity = "0.5";
  srcEl = e.target;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function dragEnter(e) {
  e.target.classList.add('over');
}

function dragLeave(e) {
  e.stopPropagation();
  e.target.classList.remove('over');
}

function dragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  e.dataTransfer.dropEffect = 'move';
  return false;
}

function dragDrop(e) {
  console.log('drag drop');

  if (srcEl != e.target) {
    thirdEl = srcEl.src;
    srcEl.src = e.target.src;
    e.target.src = thirdEl;
  }

  return false;
}

function dragEnd(e) {
  var col = document.querySelectorAll('.draggable');
  col.forEach(function (element) {
    element.classList.remove('over');
  });
  e.target.style.opacity = '1';
}

function drag() {
  var drag1 = document.querySelectorAll('.draggable');
  drag1.forEach(function (item) {
    addEvent(item);
  });
}

function addEvent(el) {
  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragenter', dragEnter, false);
  el.addEventListener('dragover', dragOver, false);
  el.addEventListener('dragleave', dragLeave, false);
  el.addEventListener('drop', dragDrop, false);
  el.addEventListener('dragend', dragEnd, false);
}
},{"../css/style.scss":"assets/css/style.scss"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44271" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
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

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

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

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","assets/js/main.js"], null)
//# sourceMappingURL=/main.cea5deef.map