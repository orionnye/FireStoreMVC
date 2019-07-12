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
})({"app.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Initialize Cloud Firestore through Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAG-ZzCxAPP8z1yOjNQC89bgHmn9YQgjPE",
  authDomain: "firetest-a48ba.firebaseapp.com",
  databaseURL: "https://firetest-a48ba.firebaseio.com",
  projectId: "firetest-a48ba",
  storageBucket: "firetest-a48ba.appspot.com",
  messagingSenderId: "297075847453",
  appId: "1:297075847453:web:566238cb4d52689b"
};
var app = firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();
var db = firebase.firestore(app); // KN: common sub expression -> probably convert to well named variable

var docRef = db.collection("list").orderBy("timeStamp");
var dones = db.collection("list").where("done", "==", true);
var todos = db.collection("list").where("done", "==", false);
var grid = document.getElementById("grid"); //user input

var dataEntry = document.getElementById("dataEntry"); //Button functions

var activeButton = document.getElementById("Active");
var completeButton = document.getElementById("Complete");
var allButton = document.getElementById("All");
var rightBar = document.getElementById("right");
var leftBar = document.getElementById("left");

activeButton.onclick = function () {
  // console.log("YOU CLICKED ACTIVE!!!")
  leftBar.style.width = "0%";
  rightBar.style.width = "66%";
  dataEntry.focus();
  activeButton.style.fontSize = "20px";
  completeButton.style.fontSize = "15px";
  allButton.style.fontSize = "15px";
  display(todos);
};

allButton.onclick = function () {
  // console.log("YOU CLICKED ALL!!!")
  leftBar.style.width = "33%";
  rightBar.style.width = "33%";
  activeButton.style.fontSize = "15px";
  completeButton.style.fontSize = "15px";
  allButton.style.fontSize = "20px";
  dataEntry.focus();
  displayAll();
};

completeButton.onclick = function () {
  // console.log("YOU CLICKED COMPLETE!!!")
  leftBar.style.width = "66%";
  rightBar.style.width = "0%";
  activeButton.style.fontSize = "15px";
  completeButton.style.fontSize = "20px";
  allButton.style.fontSize = "15px";
  dataEntry.focus();
  display(dones);
}; //initial display


displayAll(); //CLOUD FUNCTIONS

function cloudPush(taskName, completion) {
  var timeStamp = new Date().getTime(); //  KN: manual Promise handling -> learn also how to do this with async functions.

  db.collection("list").doc(taskName).set({
    done: completion,
    timeStamp: timeStamp
  }).then(function () {
    console.log(taskName, "successfully created!");
  }).catch(function (error) {
    console.error("Error writing document: ", error);
  });
}

function cloudPushAsync(_x, _x2) {
  return _cloudPushAsync.apply(this, arguments);
}

function _cloudPushAsync() {
  _cloudPushAsync = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(taskName, completion) {
    var timeStamp, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            timeStamp = new Date().getTime();
            _context.prev = 1;
            _context.next = 4;
            return db.collection("list").doc(taskName).set({
              done: completion,
              timeStamp: timeStamp
            });

          case 4:
            result = _context.sent;
            console.log(taskName, "successfully created!");
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);
            console.error("Error writing document: ", error);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 8]]);
  }));
  return _cloudPushAsync.apply(this, arguments);
}

function cloudUpdate(taskName, completion) {
  db.collection("list").doc(taskName).update({
    done: completion
  }).then(function () {
    console.log(taskName, "successfully modified!");
  }).catch(function (error) {
    console.error("Error writing document: ", error);
  });
}

function cloudRemove(taskName) {
  db.collection("list").doc(taskName).delete().then(function () {
    console.log(taskName, "successfully deleted!");
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });
} //Display functions


function createElement(name, properties) {
  var innerText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  var element = document.createElement(name);
  Object.assign(element, properties);
  element.innerText = innerText;
  return element;
}

function addRow(task, completion) {
  if (document.getElementById(task) <= "") {
    var row = createElement("div", {
      id: task.toString(),
      className: "row"
    }); // let checkSpace = createElement("div", {className: "checkBocks"})

    var container = createElement("label", {
      className: "container"
    });
    var checkbox = createElement("input", {
      type: "checkbox",
      id: "checkbox",
      checked: completion
    });

    checkbox.onclick = function () {
      dataEntry.focus();
      cloudUpdate(task, checkbox.checked);
    };

    var checkSpan = createElement("span", {
      className: "checkmark"
    }); //fix task reference

    var taskName = createElement("div", {
      className: "taskName"
    }, task);
    var removeSpace = createElement("div", {
      className: "removeSpace"
    });
    var removeButton = createElement("button", {
      className: "removeButton"
    });

    removeButton.onclick = function () {
      dataEntry.focus();
      cloudRemove(task);
    };

    grid.appendChild(row); // row.appendChild(checkSpace)
    // checkSpace.appendChild(container)

    row.appendChild(container);
    container.appendChild(checkbox);
    container.appendChild(checkSpan);
    row.appendChild(taskName);
    row.appendChild(removeSpace);
    removeSpace.appendChild(removeButton);
    removeButton.innerText = "X";
  }
} //  KN: task should be called taskId, and ideally we should use Typescript with a type on it. : string


function modifyRow(task, completion) {
  var docRow = document.getElementById(task);

  if (!docRow <= "") {
    var checkBox = docRow.getElementsByTagName("checkbox");
    checkBox.checked = completion;
  }
}

function removeRow(task) {
  var docRow = document.getElementById(task);

  if (docRow <= "") {
    console.log(task, "does not exist.");
  } else {
    grid.removeChild(docRow);
  }
}

function clearRows() {
  grid.innerHTML = "";
} //You can optimize this for speed if necessary


function display(list) {
  clearRows();
  list.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      addRow(doc.id, doc.data().done);
    });
  }).catch(function (error) {
    console.log("Got an error: ", error);
  });
}

function displayAll() {
  clearRows();
  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      addRow(doc.id, doc.data().done);
    });
  });
} //cloud listener and Update


docRef.onSnapshot(function (snapshot) {
  snapshot.docChanges().forEach(function (change) {
    //Add Row
    if (change.type === "added") {
      // console.log("New Task: ", change.doc.data())
      addRow(change.doc.id, change.doc.data().done);
    } //Changed Row


    if (change.type === "modified") {
      // console.log("Modified Task: ", change.doc.data())
      modifyRow(change.doc.id, change.doc.data().done);
    } //removed Row


    if (change.type === "removed") {
      // console.log("Removed Task: ", change.doc.data())
      removeRow(change.doc.id);
    }
  });
}); //text Bar User Input

dataEntry.addEventListener("keydown", function (event) {
  if (event.key == "Enter" && dataEntry.value !== "") {
    console.log("pushing");
    cloudPush(dataEntry.value, false);
    dataEntry.value = "";
  }
});
},{}],"../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44827" + '/');

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
      } else {
        window.location.reload();
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
},{}]},{},["../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map