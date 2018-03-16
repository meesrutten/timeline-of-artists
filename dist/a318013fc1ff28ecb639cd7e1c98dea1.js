// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({14:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
function initialAnimation() {

	var timeline = new TimelineLite();

	var mySplitText = new SplitText("#title", { type: "words,chars" });
	var chars = mySplitText.chars; //an array of all the divs that wrap each character

	timeline.set(chars, { autoAlpha: 0 });
	timeline.set('#black_stripe', { transformOrigin: 'left', width: '1100', height: '300', skewX: '-10deg', x: 0, transform: 'none' });
	timeline.set('[data-type="timeline"], .vertical-timeline', { autoAlpha: 0 });

	timeline.staggerTo(chars, 0.8, { autoAlpha: 1 }, .1);

	timeline.to("#black_stripe", 1, { x: '100%' }, 2);

	timeline.to('[data-type="timeline"], .vertical-timeline', 1, { autoAlpha: 1 }, 3);

	timeline.play();
}

exports.default = initialAnimation;

// const io = new IntersectionObserver(
// 	entries => {
// 		console.log(entries);
// 	},
// 	{
// 		/* Using default options. Details below */
// 	}
// );


// // Start observing an element
// io.observe(document.querySelector('[data-type="timeline"]'));

// 	// Stop observing an element
// 	// io.unobserve(element);

// 	// Disable entire IntersectionObserver
// 	// io.disconnect();
},{}],12:[function(require,module,exports) {
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _animation = require('./animation');

var _animation2 = _interopRequireDefault(_animation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var creatorQuery = '\nPREFIX dc: <http://purl.org/dc/elements/1.1/>\nPREFIX foaf: <http://xmlns.com/foaf/0.1/>\nPREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>\nPREFIX schema: <http://schema.org/>\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nSELECT ?creatorName ?birthYear ?deathYear ?werkTitle ?werkYear ?werkImg ?age  WHERE {\n  ?werk dc:creator ?creator .\n  ?creator foaf:name ?creatorName .\n  ?creator schema:birthDate ?birthDate .\n  ?creator schema:deathDate ?deathDate .  \n  ?werk dc:title ?werkTitle .\n  ?werk sem:hasBeginTimeStamp ?werkDate .\n  ?werk foaf:depiction ?werkImg .\n  FILTER REGEX(?werkDate, "^[12][0-9]{3}$") .\n  BIND (year(xsd:gYear(?werkDate)) AS ?werkYear) .\n  FILTER REGEX(?birthDate, "^[12][0-9]{3}-[0-9]{2}-[0-9]{2}$") .\n  BIND (year(xsd:dateTime(?birthDate)) AS ?birthYear) .\n  FILTER REGEX(?deathDate, "^[12][0-9]{3}-[0-9]{2}-[0-9]{2}$") .\n  BIND (year(xsd:dateTime(?deathDate)) AS ?deathYear) .\n  BIND ((?werkYear - ?birthYear) AS ?age) .\n  FILTER (strlen(?werkTitle) < 50)\n}\nORDER BY ?birthYear\nLIMIT 1500\t\t\t\t\t';

function makeQueryURL(query) {
	var encodedquery = encodeURIComponent(query);
	return 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
}
var app = {
	pageNumber: 1,
	creators: [],
	onTimeline: true,
	checkPageAndFetch: function checkPageAndFetch() {
		var creatorInfo = makeQueryURL(creatorQuery);
		(0, _animation2.default)();

		fetch(creatorInfo).then(function (resp) {
			return resp.json();
		}) // transform the data into json
		.then(function (data) {

			if (data.results.bindings.length > 0) {
				var _goToPersonPage = function _goToPersonPage(event) {
					console.log(event.target);
					window.scrollTo(0, 0);
					document.querySelector('[data-view="person"]').style = "display: block;";
					document.querySelector('[data-view="timeline"]').style = "display: none;";
					app.onTimeline = false;
					var personData = result[Object.keys(result).find(function (key) {
						return key.includes(event.target.querySelector('h2').textContent);
					})];
					console.log(personData);
					_getPersonData(personData);
				};

				var _getPersonData = function _getPersonData(personData) {
					var creatorData = personData;
					var nameWithoutAlias = creatorData[0].creatorName.value.split(',');
					document.querySelector('#title').textContent = nameWithoutAlias[0];
					document.querySelector('#title').setAttribute('aria-label', creatorData[0].creatorName.value.split(','));
					document.querySelector('.birthDate').textContent = creatorData[0].birthYear.value;
					document.querySelector('.deathDate').textContent = creatorData[0].deathYear.value;

					var workDuringLifetime = creatorData.filter(checkLifetime);

					function checkLifetime(work) {
						return work.werkYear.value >= creatorData[0].birthYear.value && work.werkYear.value <= creatorData[0].deathYear.value;
					}

					var sortedByYear = workDuringLifetime.sort(function (a, b) {
						return Number(a.werkYear.value) - Number(b.werkYear.value);
					});

					sortedByYear.forEach(function (work, i) {
						if (work.werkTitle.value.length < 80) {
							var werkTitleCleaned = work.werkTitle.value.split('(');
							document.querySelector('[data-type="info"]').insertAdjacentHTML('beforeend', '   \n\t\t\t\t\t\t\t\t<div class="creatorWorkYear" aria-label="Year of work is ' + work.werkYear.value + '">\n\t\t\t\t\t\t\t\t\t<p>' + work.werkYear.value + '</p>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class="creatorWork">\n\t\t\t\t\t\t\t\t\t<h2 lang="nl">' + werkTitleCleaned[0] + '</h2>\n\t\t\t\t\t\t\t\t\t<img class="timeline-image" src="' + work.werkImg.value + '" alt="Image of the artists work">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t');
						}
					});

					(0, _animation2.default)();
					document.querySelector('[data-toggle="timeline"]').addEventListener('click', function () {
						event.preventDefault();
						var personView = document.querySelector('[data-view="person"]');
						personView.style = "display: none;";
						personView.querySelector('[data-type="timeline"]').remove();
						personView.insertAdjacentHTML('beforeend', '\n\t\t\t\t\t\t\t<section data-type="timeline" aria-label="Vertical timeline of artists with their birthyear">\n\t\t\t\t\t\t\t\t<article data-type="years">\n\t\t\t\t\t\t\t\t\t<p>year</p>\n\t\t\t\t\t\t\t\t</article>\n\t\t\t\t\t\t\t\t<div data-type="line">\n\t\t\t\t\t\t\t\t\t<div data-type="point"></div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<article data-type="info">\n\t\t\t\t\t\t\t\t</article>\n\t\t\t\t\t\t\t</section>\n\t\t\t\t\t\t\t');

						var timelineView = document.querySelector('[data-view="timeline"]');
						timelineView.style = "display: block;";
						console.log(window.location.hash);
						document.querySelector(window.location.hash).scrollIntoView();
						document.querySelector(window.location.hash).focus();
					});
				};

				var verticalTimeline = document.querySelector('.vertical-timeline [data-type="timeline-info"]');

				var result = data.results.bindings.reduce(function (acc, el) {
					return _extends({}, acc, _defineProperty({}, el.creatorName.value, Array.isArray(acc[el.creatorName.value]) ? [].concat(_toConsumableArray(acc[el.creatorName.value]), [el]) : [el]));
				}, {});

				var resultArray = Object.keys(result).map(function (key) {
					return result[key];
				});

				resultArray.forEach(function (creator) {
					// console.log(creator);
					if (creator.length > 8) {
						var nameWithoutAlias = creator[0].creatorName.value.split(',');
						var firstName = function firstName() {
							for (var i = 0; i < nameWithoutAlias.length; i++) {
								var codeLine = nameWithoutAlias[i];
								return codeLine.substr(0, codeLine.indexOf(" "));
							}
						};
						// console.log(firstName());
						verticalTimeline.insertAdjacentHTML('beforeend', '\n\t\t\t\t\t\t\t<a class="creatorWork" style="opacity: 0" href="#' + firstName() + '-' + creator[0].birthYear.value + '">\n\t\t\t\t\t\t\t\t<div class="creatorWorkYear">\n\t\t\t\t\t\t\t\t\t<p aria-label="Year of birth is ' + creator[0].birthYear.value + '">' + creator[0].birthYear.value + '</p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<h2 id="' + firstName() + '-' + creator[0].birthYear.value + '">' + nameWithoutAlias[0] + '</h2>\n\t\t\t\t\t\t\t\t<img class="timeline-image" src="' + creator[0].werkImg.value + '" alt="An image of ' + nameWithoutAlias[0] + '\'s work">\n\t\t\t\t\t\t\t</a> \n\t\t\t\t\t\t\t');
					}
				});
				TweenMax.staggerTo('.creatorWork', 2, { opacity: 1, delay: 1 }, 0.25);

				var TWO_PI = Math.PI * 2;

				var button = document.querySelectorAll('[data-type="timeline-info"] .creatorWork'),
				    label = document.querySelectorAll('[data-type="timeline-info"] .creatorWork h2');

				var mouseOutTween = void 0; // set on mouse-out

				TweenMax.set([button, label], { transformPerspective: 700 });
				button.forEach(function (el) {
					el.addEventListener('click', function (e) {
						var rect = el.getBoundingClientRect(),
						    x = e.clientX - rect.left,
						    y = e.clientY - rect.top,
						    hit = { x: x, y: y, radius: 1, alpha: 1 };

						TweenMax.to(hit, 0.5, { radius: 200, alpha: 0, ease: Power1.easeOut });
					});

					el.addEventListener('mousemove', function (e) {
						var rect = el.getBoundingClientRect(),
						    x = e.clientX - rect.left,
						    y = e.clientY - rect.top,
						    rx = -(y / rect.height) + 0.5,
						    ry = x / rect.width - 0.5,
						    rMax = 30;

						TweenMax.to(el, 0.1, { rotationX: rx * rMax, rotationY: ry * rMax });
					});

					el.addEventListener('mouseout', function (e) {
						if (mouseOutTween) mouseOutTween.kill();
						mouseOutTween = TweenMax.to(el, 0.25, { delay: 0.25, rotationX: 0, rotationY: 0 });
					});
				});

				document.querySelectorAll('[data-type="timeline-info"] .creatorWork').forEach(function (el) {
					el.addEventListener('click', _goToPersonPage);
				});
			}
		}).catch(function (error) {
			// if there is any error you will catch them here
			console.log(error);
		});
	}
};

app.checkPageAndFetch();
},{"./animation":14}],3:[function(require,module,exports) {
'use strict';

var _app = require('./app.js');

var _app2 = _interopRequireDefault(_app);

var _animation = require('./animation');

var _animation2 = _interopRequireDefault(_animation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./app.js":12,"./animation":14}],16:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '64407' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
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
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
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
        parents.push(+k);
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
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[16,3])
//# sourceMappingURL=/dist/a318013fc1ff28ecb639cd7e1c98dea1.map