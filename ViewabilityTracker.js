(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BrowserHack;

BrowserHack = (function() {
  function BrowserHack() {}

  BrowserHack.exec = function() {
    var __nativeSI__, __nativeST__;
    if (document.all && !window.setTimeout.isPolyfill) {
      __nativeST__ = window.setTimeout;
      window.setTimeout = function(vCallback, nDelay) {
        var aArgs, f, ref;
        aArgs = Array.prototype.slice.call(arguments, 2);
        f = function() {
          return vCallback.apply(null, aArgs);
        };
        return __nativeST__((ref = vCallback instanceof Function) != null ? ref : {
          f: vCallback
        }, nDelay);
      };
      window.setTimeout.isPolyfill = true;
    }
    if (document.all && !window.setInterval.isPolyfill) {
      __nativeSI__ = window.setInterval;
      window.setInterval = function(vCallback, nDelay) {
        var aArgs, f, ref;
        aArgs = Array.prototype.slice.call(arguments, 2);
        f = function() {
          return vCallback.apply(null, aArgs);
        };
        return __nativeSI__((ref = vCallback instanceof Function) != null ? ref : {
          f: vCallback
        }, nDelay);
      };
      return window.setInterval.isPolyfill = true;
    }
  };

  return BrowserHack;

})();

module.exports = BrowserHack;


},{}],2:[function(require,module,exports){
var ElementUtil, Util;

Util = require('./Util.coffee');

ElementUtil = (function() {
  function ElementUtil() {}

  ElementUtil.getCurrentStyleByElement = function(el) {
    return el.currentStyle || document.defaultView.getComputedStyle(el, '');
  };

  ElementUtil.getComputedStyle = function(el) {
    return el.currentStyle || document.defaultView.getComputedStyle(el, '');
  };

  ElementUtil.getComputedStyleTransformMatrix = function(el) {
    var i, j, len, list, mat, ref, style, transform;
    style = this.getComputedStyle(el);
    list = ["transform", "webkitTransform", "MozTransform", "msTransform", "OTransform"];
    ref = [0, list.length];
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      if (style[list[i]] !== void 0) {
        transform = style[list[i]];
        mat = transform.match(/^matrix3d\((.+)\)$/) || transform.match(/^matrix\((.+)\)$/);
        if (mat) {
          return mat[1].split(', ');
        }
      }
    }
    return null;
  };

  ElementUtil.getComputedStyleTransformMatrixX = function(el) {
    var matrix;
    matrix = this.getComputedStyleTransformMatrix(el);
    if (matrix) {
      if (matrix.length === 16) {
        return parseFloat(matrix[12]);
      }
      if (matrix.length === 6) {
        return parseFloat(matrix[4]);
      }
    }
    return null;
  };

  ElementUtil.getComputedStyleTransformMatrixY = function(el) {
    var matrix;
    matrix = this.getComputedStyleTransformMatrix(el);
    if (matrix) {
      if (matrix.length === 16) {
        return parseFloat(matrix[13]);
      }
      if (matrix.length === 6) {
        return parseFloat(matrix[5]);
      }
    }
    return null;
  };

  ElementUtil.isHidden = function(el) {
    var s;
    s = this.getComputedStyle(el);
    return s.width === '0px' || s.height === '0px' || s.display === 'none' || s.visibility === 'hidden';
  };

  ElementUtil.findOffsetParent = function(el) {
    var op, p;
    op = el.offsetParent;
    p = el.parentElement;
    while (true) {
      if (op === p) {
        return op;
      }
      if (this.isOffsetElement(p)) {
        return p;
      }
      if (!p) {
        return null;
      }
      p = p.parentElement;
    }
  };

  ElementUtil.isOffsetElement = function(el) {
    var s;
    s = this.getComputedStyle(el);
    return s.position === 'relative' || s.position === 'absolute' || s.position === 'fixed';
  };

  ElementUtil.appendChildWithJS = function(parent, child) {
    var el, results, s, tmp;
    tmp = document.createElement('div');
    tmp.innerHTML = child;
    el = null;
    results = [];
    while (el = tmp.firstChild) {
      if (el.tagName === 'SCRIPT') {
        s = document.createElement('script');
        if (el.type) {
          s.type = el.type;
        }
        if (el.async) {
          s.async = el.async;
        }
        if (el.defer) {
          s.defer = el.defer;
        }
        if (el.src) {
          s.src = el.src;
        } else {
          s.text = el.text;
        }
        parent.appendChild(s);
        results.push(tmp.removeChild(el));
      } else {
        results.push(parent.appendChild(el));
      }
    }
    return results;
  };

  ElementUtil.appendChildWithFrame = function(parent, child, width, height) {
    var doc, f, scaling;
    f = document.createElement('iframe');
    f.src = 'javascript:void(0);';
    f.style.position = 'relative';
    f.style.width = width + 'px';
    f.style.height = height + 'px';
    f.style.marginLeft = 'auto';
    f.style.marginRight = 'auto';
    f.style.border = 'none';
    f.style.outline = 'none';
    f.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
    f.style.opacity = 1;
    f.style.zIndex = 1;
    f.scrolling = 'no';
    f.frameborder = 'no';
    parent.appendChild(f);
    doc = ElementUtil.getFrameDocument(f);
    doc.open();
    doc.write('<html><head></head><body style="margin:0;padding:0;">' + child + '</body></html>');
    doc.close();
    scaling = function() {
      return setTimeout(function() {
        var p, zoom;
        zoom = 1;
        p = parent;
        while (true) {
          if (p.style.zoom) {
            zoom = p.style.zoom;
          }
          p = p.parentNode;
          if (!p.parentNode) {
            break;
          }
        }
        f.style.webkitTransformOrigin = 'center top';
        return f.style.webkitTransform = 'scale(' + zoom + ')';
      }, 101);
    };
    scaling();
    return window.addEventListener('resize', scaling, true);
  };

  ElementUtil.getFrameDocument = function(f) {
    var doc;
    doc = f.document;
    if (f.contentDocument) {
      doc = f.contentDocument;
    } else if (f.contentWindow) {
      doc = f.contentWindow.document;
    }
    return doc;
  };

  return ElementUtil;

})();

module.exports = ElementUtil;


},{"./Util.coffee":5}],3:[function(require,module,exports){
var HttpUtil;

HttpUtil = (function() {
  function HttpUtil() {}

  HttpUtil.request = function(options) {
    var e, error, error1, xhr;
    if (!xhr) {
      xhr = (window.XDomainRequest ? new XDomainRequest() : new XMLHttpRequest());
    }
    if (options.withCredentials) {
      try {
        xhr.withCredentials = true;
      } catch (error) {
        e = error;
        APV.logger.error('XMLHttpRequest.withCredentials is deprecated.');
      }
    }
    xhr.onload = function(event) {
      if (xhr.status === 200) {
        if (options.callback) {
          return options.callback(xhr.responseText);
        }
      } else {
        if (options.error) {
          return options.error(xhr, event);
        }
      }
    };
    if (options.error) {
      xhr.onerror = options.error;
    }
    try {
      xhr.open("GET", options.url);
      return xhr.send(null);
    } catch (error1) {
      e = error1;
      return APV.logger.error(e);
    }
  };

  return HttpUtil;

})();

module.exports = HttpUtil;


},{}],4:[function(require,module,exports){
var Logger;

Logger = (function() {
  Logger.LogLevel = {
    EMERG: 0,
    ALERT: 1,
    CRIT: 2,
    ERROR: 3,
    WARN: 4,
    NOTICE: 5,
    INFO: 6,
    DEBUG: 7
  };

  function Logger(logLevel) {
    this.logLevel = logLevel;
  }

  Logger.prototype.debug = function(message) {
    if (this.logLevel >= Logger.LogLevel.DEBUG) {
      return this.output(message);
    }
  };

  Logger.prototype.error = function(e) {
    if (this.logLevel >= Logger.LogLevel.ERROR) {
      if (e.stack) {
        return this.output(e.stack, e);
      } else if (e.message) {
        return this.output(e.message, e);
      } else {
        return this.output(e);
      }
    }
  };

  Logger.prototype.output = function(message, object) {
    if (object) {
      return console.log("[APVAD]" + message, object);
    } else {
      return console.log("[APVAD]", message);
    }
  };

  return Logger;

})();

module.exports = Logger;


},{}],5:[function(require,module,exports){
var Util;

Util = (function() {
  function Util() {}

  Util.requestAnimationFrame = function(func) {
    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame(func);
    } else if (window.webkitRequestAnimationFrame) {
      return window.webkitRequestAnimationFrame(func);
    } else if (window.mozRequestAnimationFrame) {
      return window.mozRequestAnimationFrame(func);
    } else if (window.oRequestAnimationFrame) {
      return window.oRequestAnimationFrame(func);
    } else if (window.msRequestAnimationFrame) {
      return window.msRequestAnimationFrame(func);
    } else {
      return setTimeout(callback, 1000.0 / 60.0);
    }
  };

  Util.now = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);

  Util.getTime = function() {
    return (Util.now && Util.now.call(performance)) || (new Date().getTime());
  };

  Util.timeToFrame = function(time, fps, frames) {
    return Math.floor((time * 1000) / (1000 / fps) % frames);
  };

  Util.uuid = function() {
    var i, j, random, uuid;
    uuid = '';
    for (i = j = 0; j <= 31; i = ++j) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : i === 16 ? random & 3 | 8 : random).toString(16);
    }
    return uuid;
  };

  Util.documentIsReady = function() {
    return /interactive|loaded|complete/.test(document.readyState);
  };

  Util.round = function(val, precision) {
    var digit;
    digit = Math.pow(10, precision);
    val = val * digit;
    val = Math.round(val);
    val = val / digit;
    return val;
  };

  return Util;

})();

module.exports = Util;


},{}],6:[function(require,module,exports){
var ElementUtil, Util, Viewability, Worker;

ElementUtil = require('./ElementUtil.coffee');

Util = require('./Util.coffee');

Worker = require('./Worker.coffee');

Viewability = (function() {
  function Viewability(el, callback, visibleRate) {
    this.el = el;
    this.callback = callback;
    this.visibleRate = visibleRate != null ? visibleRate : 0.5;
    this.inFrame = window.top !== window;
    this.viewable = false;
    this.html = window.document.getElementsByTagName('HTML')[0];
    if (this.inFrame) {
      this.busterReady = false;
      this._frameViewable = false;
      window.addEventListener('message', (function(_this) {
        return function(event) {
          switch (event.data.type) {
            case 'apv-buster-visible':
              return _this._frameViewable = event.data.value;
            case 'apv-buster-ready':
              return _this.busterReady = true;
          }
        };
      })(this), false);
      this.initBuster();
    }
  }

  Viewability.prototype.isInView = function() {
    return this.viewable;
  };

  Viewability.prototype.watch = function() {
    this.worker = new Worker();
    this.worker.add((function(_this) {
      return function() {
        return _this.check();
      };
    })(this));
    return this.worker.start();
  };

  Viewability.prototype.check = function() {
    var viewable;
    viewable = this.inFrame ? this.checkViewabilityInFrame() : this.checkViewability();
    if (this.viewable !== viewable) {
      this.viewable = viewable;
      if (this.viewable) {
        return this.callback.onInView();
      } else {
        return this.callback.onOutView();
      }
    }
  };

  Viewability.prototype.checkViewabilityInFrame = function() {
    return this._frameViewable;
  };

  Viewability.prototype.checkViewability = function() {
    var html, isNotUseTranslate, oH, oW, ofL, ofT, tmp, tmpOffsetLeft, tmpOffsetTop, translateX, translateY, voH, voW, wH, wW, wX, wY, zoom, zoomRate;
    html = document.getElementsByTagName('HTML')[0];
    zoom = html.style.getPropertyValue('zoom');
    zoomRate = 1;
    if (zoom) {
      if (/^[\d\.]+%$/.test(zoom)) {
        zoomRate = parseFloat(zoom.replace('%', '')) / 100;
      } else if (/^[\d\.]+$/.test(zoom)) {
        zoomRate = parseFloat(zoom);
      }
    }
    wX = window.pageXOffset;
    wY = window.pageYOffset;
    wH = window.innerHeight;
    wW = window.innerWidth;
    oH = this.el.offsetHeight * zoomRate;
    oW = this.el.offsetWidth * zoomRate;
    voH = oH * this.visibleRate;
    voW = oW * this.visibleRate;
    ofT = 0;
    ofL = 0;
    tmp = this.el;
    while (true) {
      tmpOffsetTop = 0;
      tmpOffsetLeft = 0;
      tmpOffsetTop += tmp.offsetTop || 0;
      tmpOffsetLeft += tmp.offsetLeft || 0;
      if (tmp.tagName !== 'BODY') {
        tmpOffsetTop += tmp.scrollTop || 0;
        tmpOffsetLeft += tmp.scrollLeft || 0;
      }
      translateX = ElementUtil.getComputedStyleTransformMatrixX(tmp) || 0;
      translateY = ElementUtil.getComputedStyleTransformMatrixY(tmp) || 0;
      isNotUseTranslate = translateX === 0 && translateY === 0;
      ofT += tmpOffsetTop + translateY;
      ofL += tmpOffsetLeft + translateX;
      if (tmp && ElementUtil.isHidden(tmp) && isNotUseTranslate) {
        return false;
      }
      tmp = ElementUtil.findOffsetParent(tmp);
      if (!tmp) {
        break;
      }
    }
    ofT = ofT * zoomRate;
    ofL = ofL * zoomRate;
    if (this.visibleRate <= 0) {
      return true;
    } else if (ofL >= wX && ofT >= wY && oW + ofL <= wX + wW && oH + ofT <= wY + wH) {
      return true;
    } else if (((ofL <= wX && ofL + oW - voW > wX) || (ofL >= wX && ofL + voW <= wX + wW)) && ((ofT <= wY && ofT + oH - voH > wY) || (ofT >= wY && ofT + voH <= wY + wH))) {
      return true;
    } else {
      return false;
    }
  };

  Viewability.prototype.initBuster = function() {
    var busterIsExists, busterJS, e, error, i, len, ref, s, w;
    w = window.top;
    busterIsExists = false;
    try {
      ref = w.document.getElementsByTagName('SCRIPT');
      for (i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        if (/apv-ifbstr/i.test(s.getAttribute('src'))) {
          busterIsExists = true;
          break;
        }
      }
      if (!busterIsExists) {
        busterJS = document.createElement('script');
        busterJS.type = 'text/javascript';
        busterJS.src = 'https://cdn.apvdr.com/js/apv-ifbstr.min.js';
        w.document.body.appendChild(busterJS);
      }
    } catch (error) {
      e = error;
    }
    return this.callBuster();
  };

  Viewability.prototype.callBuster = function() {
    if (!this.busterReady) {
      window.top.postMessage({
        type: 'apv-buster-init',
        uid: Util.uuid()
      }, '*');
      return setTimeout(function(self) {
        return self.callBuster();
      }, 100, this);
    }
  };

  return Viewability;

})();

module.exports = Viewability;


},{"./ElementUtil.coffee":2,"./Util.coffee":5,"./Worker.coffee":8}],7:[function(require,module,exports){
var APV, BrowserHack, HttpUtil, Logger, Viewability, ViewabilityTracker;

BrowserHack = require('./BrowserHack.coffee');

Viewability = require('./Viewability.coffee');

HttpUtil = require('./HttpUtil.coffee');

Logger = require('./Logger.coffee');

APV = {};

APV.VERSION = '3.00';

APV.ENV = {
  PRODUCTION: 0,
  DEVELOPMENT: 1,
  TEST: 2
};

APV.AD_FORMAT = {
  NORMAL: 0,
  OVERLAY_BIG: 1,
  OVERLAY: 2
};

APV.AD_FORMAT_STATE = {
  NORMAL: 0,
  EXPANDED: 1
};

APV.CONST = {
  INVIEW_URL: 'inview',
  OUTVIEW_URL: 'outview'
};

APV.CONST_TEST = {
  INVIEW_URL: 'inview',
  OUTVIEW_URL: 'outview'
};

APV.CONST_DEV = {
  INVIEW_URL: 'inview',
  OUTVIEW_URL: 'outview'
};

ViewabilityTracker = (function() {
  function ViewabilityTracker(target, inViewURL) {
    this.target = target;
    this.inViewURL = inViewURL;
    APV.logger = new Logger(Logger.LogLevel.ERROR);
    this.viewability = new Viewability(this.target, this, 0.5);
  }

  ViewabilityTracker.prototype.start = function() {
    return this.viewability.watch();
  };

  ViewabilityTracker.prototype.onInView = function() {
    console.log(this.inViewURL);
    if (!this._tracked && this.inViewURL) {
      return HttpUtil.request({
        url: this.inViewURL
      });
    }
  };

  ViewabilityTracker.prototype.onOutView = function() {
    return console.log('outview');
  };

  return ViewabilityTracker;

})();

BrowserHack.exec();

APV.ViewabilityTracker = ViewabilityTracker;

window.APV = APV;


},{"./BrowserHack.coffee":1,"./HttpUtil.coffee":3,"./Logger.coffee":4,"./Viewability.coffee":6}],8:[function(require,module,exports){
var Worker;

Worker = (function() {
  function Worker(interval) {
    this.interval = interval != null ? interval : 50;
    this.queue = [];
  }

  Worker.prototype.start = function() {
    return this.loopId = setInterval((function(_this) {
      return function() {
        var error, error1, i, job, len, next, ref;
        next = [];
        ref = _this.queue;
        for (i = 0, len = ref.length; i < len; i++) {
          job = ref[i];
          try {
            job();
            next.push(job);
          } catch (error1) {
            error = error1;
            APV.logger.error(error);
          }
        }
        return _this.queue = next;
      };
    })(this), this.interval);
  };

  Worker.prototype.stop = function() {
    return this.loopId = null;
  };

  Worker.prototype.exec = function() {
    var job;
    if (this.queue.length > 0) {
      job = this.queue.pop();
      return this.queue.push(job);
    }
  };

  Worker.prototype.add = function(job) {
    return this.queue.push(job);
  };

  return Worker;

})();

module.exports = Worker;


},{}]},{},[7]);

