// node_modules/zone.js/fesm2015/zone.js
(function(global) {
  const performance = global["performance"];
  function mark(name) {
    performance && performance["mark"] && performance["mark"](name);
  }
  function performanceMeasure(name, label) {
    performance && performance["measure"] && performance["measure"](name, label);
  }
  mark("Zone");
  const symbolPrefix = global["__Zone_symbol_prefix"] || "__zone_symbol__";
  function __symbol__(name) {
    return symbolPrefix + name;
  }
  const checkDuplicate = global[__symbol__("forceDuplicateZoneCheck")] === true;
  if (global["Zone"]) {
    if (checkDuplicate || typeof global["Zone"].__symbol__ !== "function") {
      throw new Error("Zone already loaded.");
    } else {
      return global["Zone"];
    }
  }
  const _Zone = class _Zone {
    static assertZonePatched() {
      if (global["Promise"] !== patches["ZoneAwarePromise"]) {
        throw new Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)");
      }
    }
    static get root() {
      let zone = _Zone.current;
      while (zone.parent) {
        zone = zone.parent;
      }
      return zone;
    }
    static get current() {
      return _currentZoneFrame.zone;
    }
    static get currentTask() {
      return _currentTask;
    }
    // tslint:disable-next-line:require-internal-with-underscore
    static __load_patch(name, fn, ignoreDuplicate = false) {
      if (patches.hasOwnProperty(name)) {
        if (!ignoreDuplicate && checkDuplicate) {
          throw Error("Already loaded patch: " + name);
        }
      } else if (!global["__Zone_disable_" + name]) {
        const perfName = "Zone:" + name;
        mark(perfName);
        patches[name] = fn(global, _Zone, _api);
        performanceMeasure(perfName, perfName);
      }
    }
    get parent() {
      return this._parent;
    }
    get name() {
      return this._name;
    }
    constructor(parent, zoneSpec) {
      this._parent = parent;
      this._name = zoneSpec ? zoneSpec.name || "unnamed" : "<root>";
      this._properties = zoneSpec && zoneSpec.properties || {};
      this._zoneDelegate = new _ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
    }
    get(key) {
      const zone = this.getZoneWith(key);
      if (zone)
        return zone._properties[key];
    }
    getZoneWith(key) {
      let current = this;
      while (current) {
        if (current._properties.hasOwnProperty(key)) {
          return current;
        }
        current = current._parent;
      }
      return null;
    }
    fork(zoneSpec) {
      if (!zoneSpec)
        throw new Error("ZoneSpec required!");
      return this._zoneDelegate.fork(this, zoneSpec);
    }
    wrap(callback, source) {
      if (typeof callback !== "function") {
        throw new Error("Expecting function got: " + callback);
      }
      const _callback = this._zoneDelegate.intercept(this, callback, source);
      const zone = this;
      return function() {
        return zone.runGuarded(_callback, this, arguments, source);
      };
    }
    run(callback, applyThis, applyArgs, source) {
      _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
      try {
        return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent;
      }
    }
    runGuarded(callback, applyThis = null, applyArgs, source) {
      _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
      try {
        try {
          return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
        } catch (error) {
          if (this._zoneDelegate.handleError(this, error)) {
            throw error;
          }
        }
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent;
      }
    }
    runTask(task, applyThis, applyArgs) {
      if (task.zone != this) {
        throw new Error("A task can only be run in the zone of creation! (Creation: " + (task.zone || NO_ZONE).name + "; Execution: " + this.name + ")");
      }
      if (task.state === notScheduled && (task.type === eventTask || task.type === macroTask)) {
        return;
      }
      const reEntryGuard = task.state != running;
      reEntryGuard && task._transitionTo(running, scheduled);
      task.runCount++;
      const previousTask = _currentTask;
      _currentTask = task;
      _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
      try {
        if (task.type == macroTask && task.data && !task.data.isPeriodic) {
          task.cancelFn = void 0;
        }
        try {
          return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
        } catch (error) {
          if (this._zoneDelegate.handleError(this, error)) {
            throw error;
          }
        }
      } finally {
        if (task.state !== notScheduled && task.state !== unknown) {
          if (task.type == eventTask || task.data && task.data.isPeriodic) {
            reEntryGuard && task._transitionTo(scheduled, running);
          } else {
            task.runCount = 0;
            this._updateTaskCount(task, -1);
            reEntryGuard && task._transitionTo(notScheduled, running, notScheduled);
          }
        }
        _currentZoneFrame = _currentZoneFrame.parent;
        _currentTask = previousTask;
      }
    }
    scheduleTask(task) {
      if (task.zone && task.zone !== this) {
        let newZone = this;
        while (newZone) {
          if (newZone === task.zone) {
            throw Error(`can not reschedule task to ${this.name} which is descendants of the original zone ${task.zone.name}`);
          }
          newZone = newZone.parent;
        }
      }
      task._transitionTo(scheduling, notScheduled);
      const zoneDelegates = [];
      task._zoneDelegates = zoneDelegates;
      task._zone = this;
      try {
        task = this._zoneDelegate.scheduleTask(this, task);
      } catch (err) {
        task._transitionTo(unknown, scheduling, notScheduled);
        this._zoneDelegate.handleError(this, err);
        throw err;
      }
      if (task._zoneDelegates === zoneDelegates) {
        this._updateTaskCount(task, 1);
      }
      if (task.state == scheduling) {
        task._transitionTo(scheduled, scheduling);
      }
      return task;
    }
    scheduleMicroTask(source, callback, data, customSchedule) {
      return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, void 0));
    }
    scheduleMacroTask(source, callback, data, customSchedule, customCancel) {
      return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
    }
    scheduleEventTask(source, callback, data, customSchedule, customCancel) {
      return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
    }
    cancelTask(task) {
      if (task.zone != this)
        throw new Error("A task can only be cancelled in the zone of creation! (Creation: " + (task.zone || NO_ZONE).name + "; Execution: " + this.name + ")");
      if (task.state !== scheduled && task.state !== running) {
        return;
      }
      task._transitionTo(canceling, scheduled, running);
      try {
        this._zoneDelegate.cancelTask(this, task);
      } catch (err) {
        task._transitionTo(unknown, canceling);
        this._zoneDelegate.handleError(this, err);
        throw err;
      }
      this._updateTaskCount(task, -1);
      task._transitionTo(notScheduled, canceling);
      task.runCount = 0;
      return task;
    }
    _updateTaskCount(task, count) {
      const zoneDelegates = task._zoneDelegates;
      if (count == -1) {
        task._zoneDelegates = null;
      }
      for (let i = 0; i < zoneDelegates.length; i++) {
        zoneDelegates[i]._updateTaskCount(task.type, count);
      }
    }
  };
  _Zone.__symbol__ = __symbol__;
  let Zone2 = _Zone;
  const DELEGATE_ZS = {
    name: "",
    onHasTask: (delegate, _, target, hasTaskState) => delegate.hasTask(target, hasTaskState),
    onScheduleTask: (delegate, _, target, task) => delegate.scheduleTask(target, task),
    onInvokeTask: (delegate, _, target, task, applyThis, applyArgs) => delegate.invokeTask(target, task, applyThis, applyArgs),
    onCancelTask: (delegate, _, target, task) => delegate.cancelTask(target, task)
  };
  class _ZoneDelegate {
    constructor(zone, parentDelegate, zoneSpec) {
      this._taskCounts = { "microTask": 0, "macroTask": 0, "eventTask": 0 };
      this.zone = zone;
      this._parentDelegate = parentDelegate;
      this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
      this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
      this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate._forkCurrZone);
      this._interceptZS = zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
      this._interceptDlgt = zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
      this._interceptCurrZone = zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate._interceptCurrZone);
      this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
      this._invokeDlgt = zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
      this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate._invokeCurrZone);
      this._handleErrorZS = zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
      this._handleErrorDlgt = zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
      this._handleErrorCurrZone = zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate._handleErrorCurrZone);
      this._scheduleTaskZS = zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
      this._scheduleTaskDlgt = zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
      this._scheduleTaskCurrZone = zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate._scheduleTaskCurrZone);
      this._invokeTaskZS = zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
      this._invokeTaskDlgt = zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
      this._invokeTaskCurrZone = zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate._invokeTaskCurrZone);
      this._cancelTaskZS = zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
      this._cancelTaskDlgt = zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
      this._cancelTaskCurrZone = zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate._cancelTaskCurrZone);
      this._hasTaskZS = null;
      this._hasTaskDlgt = null;
      this._hasTaskDlgtOwner = null;
      this._hasTaskCurrZone = null;
      const zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
      const parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
      if (zoneSpecHasTask || parentHasTask) {
        this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
        this._hasTaskDlgt = parentDelegate;
        this._hasTaskDlgtOwner = this;
        this._hasTaskCurrZone = zone;
        if (!zoneSpec.onScheduleTask) {
          this._scheduleTaskZS = DELEGATE_ZS;
          this._scheduleTaskDlgt = parentDelegate;
          this._scheduleTaskCurrZone = this.zone;
        }
        if (!zoneSpec.onInvokeTask) {
          this._invokeTaskZS = DELEGATE_ZS;
          this._invokeTaskDlgt = parentDelegate;
          this._invokeTaskCurrZone = this.zone;
        }
        if (!zoneSpec.onCancelTask) {
          this._cancelTaskZS = DELEGATE_ZS;
          this._cancelTaskDlgt = parentDelegate;
          this._cancelTaskCurrZone = this.zone;
        }
      }
    }
    fork(targetZone, zoneSpec) {
      return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) : new Zone2(targetZone, zoneSpec);
    }
    intercept(targetZone, callback, source) {
      return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) : callback;
    }
    invoke(targetZone, callback, applyThis, applyArgs, source) {
      return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) : callback.apply(applyThis, applyArgs);
    }
    handleError(targetZone, error) {
      return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) : true;
    }
    scheduleTask(targetZone, task) {
      let returnTask = task;
      if (this._scheduleTaskZS) {
        if (this._hasTaskZS) {
          returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
        }
        returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
        if (!returnTask)
          returnTask = task;
      } else {
        if (task.scheduleFn) {
          task.scheduleFn(task);
        } else if (task.type == microTask) {
          scheduleMicroTask(task);
        } else {
          throw new Error("Task is missing scheduleFn.");
        }
      }
      return returnTask;
    }
    invokeTask(targetZone, task, applyThis, applyArgs) {
      return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) : task.callback.apply(applyThis, applyArgs);
    }
    cancelTask(targetZone, task) {
      let value;
      if (this._cancelTaskZS) {
        value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
      } else {
        if (!task.cancelFn) {
          throw Error("Task is not cancelable");
        }
        value = task.cancelFn(task);
      }
      return value;
    }
    hasTask(targetZone, isEmpty) {
      try {
        this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
      } catch (err) {
        this.handleError(targetZone, err);
      }
    }
    // tslint:disable-next-line:require-internal-with-underscore
    _updateTaskCount(type, count) {
      const counts = this._taskCounts;
      const prev = counts[type];
      const next = counts[type] = prev + count;
      if (next < 0) {
        throw new Error("More tasks executed then were scheduled.");
      }
      if (prev == 0 || next == 0) {
        const isEmpty = {
          microTask: counts["microTask"] > 0,
          macroTask: counts["macroTask"] > 0,
          eventTask: counts["eventTask"] > 0,
          change: type
        };
        this.hasTask(this.zone, isEmpty);
      }
    }
  }
  class ZoneTask {
    constructor(type, source, callback, options, scheduleFn, cancelFn) {
      this._zone = null;
      this.runCount = 0;
      this._zoneDelegates = null;
      this._state = "notScheduled";
      this.type = type;
      this.source = source;
      this.data = options;
      this.scheduleFn = scheduleFn;
      this.cancelFn = cancelFn;
      if (!callback) {
        throw new Error("callback is not defined");
      }
      this.callback = callback;
      const self2 = this;
      if (type === eventTask && options && options.useG) {
        this.invoke = ZoneTask.invokeTask;
      } else {
        this.invoke = function() {
          return ZoneTask.invokeTask.call(global, self2, this, arguments);
        };
      }
    }
    static invokeTask(task, target, args) {
      if (!task) {
        task = this;
      }
      _numberOfNestedTaskFrames++;
      try {
        task.runCount++;
        return task.zone.runTask(task, target, args);
      } finally {
        if (_numberOfNestedTaskFrames == 1) {
          drainMicroTaskQueue();
        }
        _numberOfNestedTaskFrames--;
      }
    }
    get zone() {
      return this._zone;
    }
    get state() {
      return this._state;
    }
    cancelScheduleRequest() {
      this._transitionTo(notScheduled, scheduling);
    }
    // tslint:disable-next-line:require-internal-with-underscore
    _transitionTo(toState, fromState1, fromState2) {
      if (this._state === fromState1 || this._state === fromState2) {
        this._state = toState;
        if (toState == notScheduled) {
          this._zoneDelegates = null;
        }
      } else {
        throw new Error(`${this.type} '${this.source}': can not transition to '${toState}', expecting state '${fromState1}'${fromState2 ? " or '" + fromState2 + "'" : ""}, was '${this._state}'.`);
      }
    }
    toString() {
      if (this.data && typeof this.data.handleId !== "undefined") {
        return this.data.handleId.toString();
      } else {
        return Object.prototype.toString.call(this);
      }
    }
    // add toJSON method to prevent cyclic error when
    // call JSON.stringify(zoneTask)
    toJSON() {
      return {
        type: this.type,
        state: this.state,
        source: this.source,
        zone: this.zone.name,
        runCount: this.runCount
      };
    }
  }
  const symbolSetTimeout = __symbol__("setTimeout");
  const symbolPromise = __symbol__("Promise");
  const symbolThen = __symbol__("then");
  let _microTaskQueue = [];
  let _isDrainingMicrotaskQueue = false;
  let nativeMicroTaskQueuePromise;
  function nativeScheduleMicroTask(func) {
    if (!nativeMicroTaskQueuePromise) {
      if (global[symbolPromise]) {
        nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
      }
    }
    if (nativeMicroTaskQueuePromise) {
      let nativeThen = nativeMicroTaskQueuePromise[symbolThen];
      if (!nativeThen) {
        nativeThen = nativeMicroTaskQueuePromise["then"];
      }
      nativeThen.call(nativeMicroTaskQueuePromise, func);
    } else {
      global[symbolSetTimeout](func, 0);
    }
  }
  function scheduleMicroTask(task) {
    if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
      nativeScheduleMicroTask(drainMicroTaskQueue);
    }
    task && _microTaskQueue.push(task);
  }
  function drainMicroTaskQueue() {
    if (!_isDrainingMicrotaskQueue) {
      _isDrainingMicrotaskQueue = true;
      while (_microTaskQueue.length) {
        const queue = _microTaskQueue;
        _microTaskQueue = [];
        for (let i = 0; i < queue.length; i++) {
          const task = queue[i];
          try {
            task.zone.runTask(task, null, null);
          } catch (error) {
            _api.onUnhandledError(error);
          }
        }
      }
      _api.microtaskDrainDone();
      _isDrainingMicrotaskQueue = false;
    }
  }
  const NO_ZONE = {
    name: "NO ZONE"
  };
  const notScheduled = "notScheduled", scheduling = "scheduling", scheduled = "scheduled", running = "running", canceling = "canceling", unknown = "unknown";
  const microTask = "microTask", macroTask = "macroTask", eventTask = "eventTask";
  const patches = {};
  const _api = {
    symbol: __symbol__,
    currentZoneFrame: () => _currentZoneFrame,
    onUnhandledError: noop,
    microtaskDrainDone: noop,
    scheduleMicroTask,
    showUncaughtError: () => !Zone2[__symbol__("ignoreConsoleErrorUncaughtError")],
    patchEventTarget: () => [],
    patchOnProperties: noop,
    patchMethod: () => noop,
    bindArguments: () => [],
    patchThen: () => noop,
    patchMacroTask: () => noop,
    patchEventPrototype: () => noop,
    isIEOrEdge: () => false,
    getGlobalObjects: () => void 0,
    ObjectDefineProperty: () => noop,
    ObjectGetOwnPropertyDescriptor: () => void 0,
    ObjectCreate: () => void 0,
    ArraySlice: () => [],
    patchClass: () => noop,
    wrapWithCurrentZone: () => noop,
    filterProperties: () => [],
    attachOriginToPatched: () => noop,
    _redefineProperty: () => noop,
    patchCallbacks: () => noop,
    nativeScheduleMicroTask
  };
  let _currentZoneFrame = { parent: null, zone: new Zone2(null, null) };
  let _currentTask = null;
  let _numberOfNestedTaskFrames = 0;
  function noop() {
  }
  performanceMeasure("Zone", "Zone");
  return global["Zone"] = Zone2;
})(globalThis);
var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ObjectDefineProperty = Object.defineProperty;
var ObjectGetPrototypeOf = Object.getPrototypeOf;
var ObjectCreate = Object.create;
var ArraySlice = Array.prototype.slice;
var ADD_EVENT_LISTENER_STR = "addEventListener";
var REMOVE_EVENT_LISTENER_STR = "removeEventListener";
var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
var TRUE_STR = "true";
var FALSE_STR = "false";
var ZONE_SYMBOL_PREFIX = Zone.__symbol__("");
function wrapWithCurrentZone(callback, source) {
  return Zone.current.wrap(callback, source);
}
function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
  return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
var zoneSymbol = Zone.__symbol__;
var isWindowExists = typeof window !== "undefined";
var internalWindow = isWindowExists ? window : void 0;
var _global = isWindowExists && internalWindow || globalThis;
var REMOVE_ATTRIBUTE = "removeAttribute";
function bindArguments(args, source) {
  for (let i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] === "function") {
      args[i] = wrapWithCurrentZone(args[i], source + "_" + i);
    }
  }
  return args;
}
function patchPrototype(prototype, fnNames) {
  const source = prototype.constructor["name"];
  for (let i = 0; i < fnNames.length; i++) {
    const name = fnNames[i];
    const delegate = prototype[name];
    if (delegate) {
      const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name);
      if (!isPropertyWritable(prototypeDesc)) {
        continue;
      }
      prototype[name] = ((delegate2) => {
        const patched = function() {
          return delegate2.apply(this, bindArguments(arguments, source + "." + name));
        };
        attachOriginToPatched(patched, delegate2);
        return patched;
      })(delegate);
    }
  }
}
function isPropertyWritable(propertyDesc) {
  if (!propertyDesc) {
    return true;
  }
  if (propertyDesc.writable === false) {
    return false;
  }
  return !(typeof propertyDesc.get === "function" && typeof propertyDesc.set === "undefined");
}
var isWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
var isNode = !("nw" in _global) && typeof _global.process !== "undefined" && {}.toString.call(_global.process) === "[object process]";
var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow["HTMLElement"]);
var isMix = typeof _global.process !== "undefined" && {}.toString.call(_global.process) === "[object process]" && !isWebWorker && !!(isWindowExists && internalWindow["HTMLElement"]);
var zoneSymbolEventNames$1 = {};
var wrapFn = function(event) {
  event = event || _global.event;
  if (!event) {
    return;
  }
  let eventNameSymbol = zoneSymbolEventNames$1[event.type];
  if (!eventNameSymbol) {
    eventNameSymbol = zoneSymbolEventNames$1[event.type] = zoneSymbol("ON_PROPERTY" + event.type);
  }
  const target = this || event.target || _global;
  const listener = target[eventNameSymbol];
  let result;
  if (isBrowser && target === internalWindow && event.type === "error") {
    const errorEvent = event;
    result = listener && listener.call(this, errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error);
    if (result === true) {
      event.preventDefault();
    }
  } else {
    result = listener && listener.apply(this, arguments);
    if (result != void 0 && !result) {
      event.preventDefault();
    }
  }
  return result;
};
function patchProperty(obj, prop, prototype) {
  let desc = ObjectGetOwnPropertyDescriptor(obj, prop);
  if (!desc && prototype) {
    const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
    if (prototypeDesc) {
      desc = { enumerable: true, configurable: true };
    }
  }
  if (!desc || !desc.configurable) {
    return;
  }
  const onPropPatchedSymbol = zoneSymbol("on" + prop + "patched");
  if (obj.hasOwnProperty(onPropPatchedSymbol) && obj[onPropPatchedSymbol]) {
    return;
  }
  delete desc.writable;
  delete desc.value;
  const originalDescGet = desc.get;
  const originalDescSet = desc.set;
  const eventName = prop.slice(2);
  let eventNameSymbol = zoneSymbolEventNames$1[eventName];
  if (!eventNameSymbol) {
    eventNameSymbol = zoneSymbolEventNames$1[eventName] = zoneSymbol("ON_PROPERTY" + eventName);
  }
  desc.set = function(newValue) {
    let target = this;
    if (!target && obj === _global) {
      target = _global;
    }
    if (!target) {
      return;
    }
    const previousValue = target[eventNameSymbol];
    if (typeof previousValue === "function") {
      target.removeEventListener(eventName, wrapFn);
    }
    originalDescSet && originalDescSet.call(target, null);
    target[eventNameSymbol] = newValue;
    if (typeof newValue === "function") {
      target.addEventListener(eventName, wrapFn, false);
    }
  };
  desc.get = function() {
    let target = this;
    if (!target && obj === _global) {
      target = _global;
    }
    if (!target) {
      return null;
    }
    const listener = target[eventNameSymbol];
    if (listener) {
      return listener;
    } else if (originalDescGet) {
      let value = originalDescGet.call(this);
      if (value) {
        desc.set.call(this, value);
        if (typeof target[REMOVE_ATTRIBUTE] === "function") {
          target.removeAttribute(prop);
        }
        return value;
      }
    }
    return null;
  };
  ObjectDefineProperty(obj, prop, desc);
  obj[onPropPatchedSymbol] = true;
}
function patchOnProperties(obj, properties, prototype) {
  if (properties) {
    for (let i = 0; i < properties.length; i++) {
      patchProperty(obj, "on" + properties[i], prototype);
    }
  } else {
    const onProperties = [];
    for (const prop in obj) {
      if (prop.slice(0, 2) == "on") {
        onProperties.push(prop);
      }
    }
    for (let j = 0; j < onProperties.length; j++) {
      patchProperty(obj, onProperties[j], prototype);
    }
  }
}
var originalInstanceKey = zoneSymbol("originalInstance");
function patchClass(className) {
  const OriginalClass = _global[className];
  if (!OriginalClass)
    return;
  _global[zoneSymbol(className)] = OriginalClass;
  _global[className] = function() {
    const a = bindArguments(arguments, className);
    switch (a.length) {
      case 0:
        this[originalInstanceKey] = new OriginalClass();
        break;
      case 1:
        this[originalInstanceKey] = new OriginalClass(a[0]);
        break;
      case 2:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
        break;
      case 3:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
        break;
      case 4:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
        break;
      default:
        throw new Error("Arg list too long.");
    }
  };
  attachOriginToPatched(_global[className], OriginalClass);
  const instance = new OriginalClass(function() {
  });
  let prop;
  for (prop in instance) {
    if (className === "XMLHttpRequest" && prop === "responseBlob")
      continue;
    (function(prop2) {
      if (typeof instance[prop2] === "function") {
        _global[className].prototype[prop2] = function() {
          return this[originalInstanceKey][prop2].apply(this[originalInstanceKey], arguments);
        };
      } else {
        ObjectDefineProperty(_global[className].prototype, prop2, {
          set: function(fn) {
            if (typeof fn === "function") {
              this[originalInstanceKey][prop2] = wrapWithCurrentZone(fn, className + "." + prop2);
              attachOriginToPatched(this[originalInstanceKey][prop2], fn);
            } else {
              this[originalInstanceKey][prop2] = fn;
            }
          },
          get: function() {
            return this[originalInstanceKey][prop2];
          }
        });
      }
    })(prop);
  }
  for (prop in OriginalClass) {
    if (prop !== "prototype" && OriginalClass.hasOwnProperty(prop)) {
      _global[className][prop] = OriginalClass[prop];
    }
  }
}
function patchMethod(target, name, patchFn) {
  let proto = target;
  while (proto && !proto.hasOwnProperty(name)) {
    proto = ObjectGetPrototypeOf(proto);
  }
  if (!proto && target[name]) {
    proto = target;
  }
  const delegateName = zoneSymbol(name);
  let delegate = null;
  if (proto && (!(delegate = proto[delegateName]) || !proto.hasOwnProperty(delegateName))) {
    delegate = proto[delegateName] = proto[name];
    const desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
    if (isPropertyWritable(desc)) {
      const patchDelegate = patchFn(delegate, delegateName, name);
      proto[name] = function() {
        return patchDelegate(this, arguments);
      };
      attachOriginToPatched(proto[name], delegate);
    }
  }
  return delegate;
}
function patchMacroTask(obj, funcName, metaCreator) {
  let setNative = null;
  function scheduleTask(task) {
    const data = task.data;
    data.args[data.cbIdx] = function() {
      task.invoke.apply(this, arguments);
    };
    setNative.apply(data.target, data.args);
    return task;
  }
  setNative = patchMethod(obj, funcName, (delegate) => function(self2, args) {
    const meta = metaCreator(self2, args);
    if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === "function") {
      return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask);
    } else {
      return delegate.apply(self2, args);
    }
  });
}
function attachOriginToPatched(patched, original) {
  patched[zoneSymbol("OriginalDelegate")] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIE() {
  try {
    const ua = internalWindow.navigator.userAgent;
    if (ua.indexOf("MSIE ") !== -1 || ua.indexOf("Trident/") !== -1) {
      return true;
    }
  } catch (error) {
  }
  return false;
}
function isIEOrEdge() {
  if (isDetectedIEOrEdge) {
    return ieOrEdge;
  }
  isDetectedIEOrEdge = true;
  try {
    const ua = internalWindow.navigator.userAgent;
    if (ua.indexOf("MSIE ") !== -1 || ua.indexOf("Trident/") !== -1 || ua.indexOf("Edge/") !== -1) {
      ieOrEdge = true;
    }
  } catch (error) {
  }
  return ieOrEdge;
}
Zone.__load_patch("ZoneAwarePromise", (global, Zone2, api) => {
  const ObjectGetOwnPropertyDescriptor2 = Object.getOwnPropertyDescriptor;
  const ObjectDefineProperty2 = Object.defineProperty;
  function readableObjectToString(obj) {
    if (obj && obj.toString === Object.prototype.toString) {
      const className = obj.constructor && obj.constructor.name;
      return (className ? className : "") + ": " + JSON.stringify(obj);
    }
    return obj ? obj.toString() : Object.prototype.toString.call(obj);
  }
  const __symbol__ = api.symbol;
  const _uncaughtPromiseErrors = [];
  const isDisableWrappingUncaughtPromiseRejection = global[__symbol__("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== false;
  const symbolPromise = __symbol__("Promise");
  const symbolThen = __symbol__("then");
  const creationTrace = "__creationTrace__";
  api.onUnhandledError = (e) => {
    if (api.showUncaughtError()) {
      const rejection = e && e.rejection;
      if (rejection) {
        console.error("Unhandled Promise rejection:", rejection instanceof Error ? rejection.message : rejection, "; Zone:", e.zone.name, "; Task:", e.task && e.task.source, "; Value:", rejection, rejection instanceof Error ? rejection.stack : void 0);
      } else {
        console.error(e);
      }
    }
  };
  api.microtaskDrainDone = () => {
    while (_uncaughtPromiseErrors.length) {
      const uncaughtPromiseError = _uncaughtPromiseErrors.shift();
      try {
        uncaughtPromiseError.zone.runGuarded(() => {
          if (uncaughtPromiseError.throwOriginal) {
            throw uncaughtPromiseError.rejection;
          }
          throw uncaughtPromiseError;
        });
      } catch (error) {
        handleUnhandledRejection(error);
      }
    }
  };
  const UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__("unhandledPromiseRejectionHandler");
  function handleUnhandledRejection(e) {
    api.onUnhandledError(e);
    try {
      const handler = Zone2[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
      if (typeof handler === "function") {
        handler.call(this, e);
      }
    } catch (err) {
    }
  }
  function isThenable(value) {
    return value && value.then;
  }
  function forwardResolution(value) {
    return value;
  }
  function forwardRejection(rejection) {
    return ZoneAwarePromise.reject(rejection);
  }
  const symbolState = __symbol__("state");
  const symbolValue = __symbol__("value");
  const symbolFinally = __symbol__("finally");
  const symbolParentPromiseValue = __symbol__("parentPromiseValue");
  const symbolParentPromiseState = __symbol__("parentPromiseState");
  const source = "Promise.then";
  const UNRESOLVED = null;
  const RESOLVED = true;
  const REJECTED = false;
  const REJECTED_NO_CATCH = 0;
  function makeResolver(promise, state) {
    return (v) => {
      try {
        resolvePromise(promise, state, v);
      } catch (err) {
        resolvePromise(promise, false, err);
      }
    };
  }
  const once = function() {
    let wasCalled = false;
    return function wrapper(wrappedFunction) {
      return function() {
        if (wasCalled) {
          return;
        }
        wasCalled = true;
        wrappedFunction.apply(null, arguments);
      };
    };
  };
  const TYPE_ERROR = "Promise resolved with itself";
  const CURRENT_TASK_TRACE_SYMBOL = __symbol__("currentTaskTrace");
  function resolvePromise(promise, state, value) {
    const onceWrapper = once();
    if (promise === value) {
      throw new TypeError(TYPE_ERROR);
    }
    if (promise[symbolState] === UNRESOLVED) {
      let then = null;
      try {
        if (typeof value === "object" || typeof value === "function") {
          then = value && value.then;
        }
      } catch (err) {
        onceWrapper(() => {
          resolvePromise(promise, false, err);
        })();
        return promise;
      }
      if (state !== REJECTED && value instanceof ZoneAwarePromise && value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) && value[symbolState] !== UNRESOLVED) {
        clearRejectedNoCatch(value);
        resolvePromise(promise, value[symbolState], value[symbolValue]);
      } else if (state !== REJECTED && typeof then === "function") {
        try {
          then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
        } catch (err) {
          onceWrapper(() => {
            resolvePromise(promise, false, err);
          })();
        }
      } else {
        promise[symbolState] = state;
        const queue = promise[symbolValue];
        promise[symbolValue] = value;
        if (promise[symbolFinally] === symbolFinally) {
          if (state === RESOLVED) {
            promise[symbolState] = promise[symbolParentPromiseState];
            promise[symbolValue] = promise[symbolParentPromiseValue];
          }
        }
        if (state === REJECTED && value instanceof Error) {
          const trace = Zone2.currentTask && Zone2.currentTask.data && Zone2.currentTask.data[creationTrace];
          if (trace) {
            ObjectDefineProperty2(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
          }
        }
        for (let i = 0; i < queue.length; ) {
          scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
        }
        if (queue.length == 0 && state == REJECTED) {
          promise[symbolState] = REJECTED_NO_CATCH;
          let uncaughtPromiseError = value;
          try {
            throw new Error("Uncaught (in promise): " + readableObjectToString(value) + (value && value.stack ? "\n" + value.stack : ""));
          } catch (err) {
            uncaughtPromiseError = err;
          }
          if (isDisableWrappingUncaughtPromiseRejection) {
            uncaughtPromiseError.throwOriginal = true;
          }
          uncaughtPromiseError.rejection = value;
          uncaughtPromiseError.promise = promise;
          uncaughtPromiseError.zone = Zone2.current;
          uncaughtPromiseError.task = Zone2.currentTask;
          _uncaughtPromiseErrors.push(uncaughtPromiseError);
          api.scheduleMicroTask();
        }
      }
    }
    return promise;
  }
  const REJECTION_HANDLED_HANDLER = __symbol__("rejectionHandledHandler");
  function clearRejectedNoCatch(promise) {
    if (promise[symbolState] === REJECTED_NO_CATCH) {
      try {
        const handler = Zone2[REJECTION_HANDLED_HANDLER];
        if (handler && typeof handler === "function") {
          handler.call(this, { rejection: promise[symbolValue], promise });
        }
      } catch (err) {
      }
      promise[symbolState] = REJECTED;
      for (let i = 0; i < _uncaughtPromiseErrors.length; i++) {
        if (promise === _uncaughtPromiseErrors[i].promise) {
          _uncaughtPromiseErrors.splice(i, 1);
        }
      }
    }
  }
  function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
    clearRejectedNoCatch(promise);
    const promiseState = promise[symbolState];
    const delegate = promiseState ? typeof onFulfilled === "function" ? onFulfilled : forwardResolution : typeof onRejected === "function" ? onRejected : forwardRejection;
    zone.scheduleMicroTask(source, () => {
      try {
        const parentPromiseValue = promise[symbolValue];
        const isFinallyPromise = !!chainPromise && symbolFinally === chainPromise[symbolFinally];
        if (isFinallyPromise) {
          chainPromise[symbolParentPromiseValue] = parentPromiseValue;
          chainPromise[symbolParentPromiseState] = promiseState;
        }
        const value = zone.run(delegate, void 0, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ? [] : [parentPromiseValue]);
        resolvePromise(chainPromise, true, value);
      } catch (error) {
        resolvePromise(chainPromise, false, error);
      }
    }, chainPromise);
  }
  const ZONE_AWARE_PROMISE_TO_STRING = "function ZoneAwarePromise() { [native code] }";
  const noop = function() {
  };
  const AggregateError = global.AggregateError;
  class ZoneAwarePromise {
    static toString() {
      return ZONE_AWARE_PROMISE_TO_STRING;
    }
    static resolve(value) {
      if (value instanceof ZoneAwarePromise) {
        return value;
      }
      return resolvePromise(new this(null), RESOLVED, value);
    }
    static reject(error) {
      return resolvePromise(new this(null), REJECTED, error);
    }
    static withResolvers() {
      const result = {};
      result.promise = new ZoneAwarePromise((res, rej) => {
        result.resolve = res;
        result.reject = rej;
      });
      return result;
    }
    static any(values) {
      if (!values || typeof values[Symbol.iterator] !== "function") {
        return Promise.reject(new AggregateError([], "All promises were rejected"));
      }
      const promises = [];
      let count = 0;
      try {
        for (let v of values) {
          count++;
          promises.push(ZoneAwarePromise.resolve(v));
        }
      } catch (err) {
        return Promise.reject(new AggregateError([], "All promises were rejected"));
      }
      if (count === 0) {
        return Promise.reject(new AggregateError([], "All promises were rejected"));
      }
      let finished = false;
      const errors = [];
      return new ZoneAwarePromise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
          promises[i].then((v) => {
            if (finished) {
              return;
            }
            finished = true;
            resolve(v);
          }, (err) => {
            errors.push(err);
            count--;
            if (count === 0) {
              finished = true;
              reject(new AggregateError(errors, "All promises were rejected"));
            }
          });
        }
      });
    }
    static race(values) {
      let resolve;
      let reject;
      let promise = new this((res, rej) => {
        resolve = res;
        reject = rej;
      });
      function onResolve(value) {
        resolve(value);
      }
      function onReject(error) {
        reject(error);
      }
      for (let value of values) {
        if (!isThenable(value)) {
          value = this.resolve(value);
        }
        value.then(onResolve, onReject);
      }
      return promise;
    }
    static all(values) {
      return ZoneAwarePromise.allWithCallback(values);
    }
    static allSettled(values) {
      const P = this && this.prototype instanceof ZoneAwarePromise ? this : ZoneAwarePromise;
      return P.allWithCallback(values, {
        thenCallback: (value) => ({ status: "fulfilled", value }),
        errorCallback: (err) => ({ status: "rejected", reason: err })
      });
    }
    static allWithCallback(values, callback) {
      let resolve;
      let reject;
      let promise = new this((res, rej) => {
        resolve = res;
        reject = rej;
      });
      let unresolvedCount = 2;
      let valueIndex = 0;
      const resolvedValues = [];
      for (let value of values) {
        if (!isThenable(value)) {
          value = this.resolve(value);
        }
        const curValueIndex = valueIndex;
        try {
          value.then((value2) => {
            resolvedValues[curValueIndex] = callback ? callback.thenCallback(value2) : value2;
            unresolvedCount--;
            if (unresolvedCount === 0) {
              resolve(resolvedValues);
            }
          }, (err) => {
            if (!callback) {
              reject(err);
            } else {
              resolvedValues[curValueIndex] = callback.errorCallback(err);
              unresolvedCount--;
              if (unresolvedCount === 0) {
                resolve(resolvedValues);
              }
            }
          });
        } catch (thenErr) {
          reject(thenErr);
        }
        unresolvedCount++;
        valueIndex++;
      }
      unresolvedCount -= 2;
      if (unresolvedCount === 0) {
        resolve(resolvedValues);
      }
      return promise;
    }
    constructor(executor) {
      const promise = this;
      if (!(promise instanceof ZoneAwarePromise)) {
        throw new Error("Must be an instanceof Promise.");
      }
      promise[symbolState] = UNRESOLVED;
      promise[symbolValue] = [];
      try {
        const onceWrapper = once();
        executor && executor(onceWrapper(makeResolver(promise, RESOLVED)), onceWrapper(makeResolver(promise, REJECTED)));
      } catch (error) {
        resolvePromise(promise, false, error);
      }
    }
    get [Symbol.toStringTag]() {
      return "Promise";
    }
    get [Symbol.species]() {
      return ZoneAwarePromise;
    }
    then(onFulfilled, onRejected) {
      let C = this.constructor?.[Symbol.species];
      if (!C || typeof C !== "function") {
        C = this.constructor || ZoneAwarePromise;
      }
      const chainPromise = new C(noop);
      const zone = Zone2.current;
      if (this[symbolState] == UNRESOLVED) {
        this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
      } else {
        scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
      }
      return chainPromise;
    }
    catch(onRejected) {
      return this.then(null, onRejected);
    }
    finally(onFinally) {
      let C = this.constructor?.[Symbol.species];
      if (!C || typeof C !== "function") {
        C = ZoneAwarePromise;
      }
      const chainPromise = new C(noop);
      chainPromise[symbolFinally] = symbolFinally;
      const zone = Zone2.current;
      if (this[symbolState] == UNRESOLVED) {
        this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
      } else {
        scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
      }
      return chainPromise;
    }
  }
  ZoneAwarePromise["resolve"] = ZoneAwarePromise.resolve;
  ZoneAwarePromise["reject"] = ZoneAwarePromise.reject;
  ZoneAwarePromise["race"] = ZoneAwarePromise.race;
  ZoneAwarePromise["all"] = ZoneAwarePromise.all;
  const NativePromise = global[symbolPromise] = global["Promise"];
  global["Promise"] = ZoneAwarePromise;
  const symbolThenPatched = __symbol__("thenPatched");
  function patchThen(Ctor) {
    const proto = Ctor.prototype;
    const prop = ObjectGetOwnPropertyDescriptor2(proto, "then");
    if (prop && (prop.writable === false || !prop.configurable)) {
      return;
    }
    const originalThen = proto.then;
    proto[symbolThen] = originalThen;
    Ctor.prototype.then = function(onResolve, onReject) {
      const wrapped = new ZoneAwarePromise((resolve, reject) => {
        originalThen.call(this, resolve, reject);
      });
      return wrapped.then(onResolve, onReject);
    };
    Ctor[symbolThenPatched] = true;
  }
  api.patchThen = patchThen;
  function zoneify(fn) {
    return function(self2, args) {
      let resultPromise = fn.apply(self2, args);
      if (resultPromise instanceof ZoneAwarePromise) {
        return resultPromise;
      }
      let ctor = resultPromise.constructor;
      if (!ctor[symbolThenPatched]) {
        patchThen(ctor);
      }
      return resultPromise;
    };
  }
  if (NativePromise) {
    patchThen(NativePromise);
    patchMethod(global, "fetch", (delegate) => zoneify(delegate));
  }
  Promise[Zone2.__symbol__("uncaughtPromiseErrors")] = _uncaughtPromiseErrors;
  return ZoneAwarePromise;
});
Zone.__load_patch("toString", (global) => {
  const originalFunctionToString = Function.prototype.toString;
  const ORIGINAL_DELEGATE_SYMBOL = zoneSymbol("OriginalDelegate");
  const PROMISE_SYMBOL = zoneSymbol("Promise");
  const ERROR_SYMBOL = zoneSymbol("Error");
  const newFunctionToString = function toString() {
    if (typeof this === "function") {
      const originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
      if (originalDelegate) {
        if (typeof originalDelegate === "function") {
          return originalFunctionToString.call(originalDelegate);
        } else {
          return Object.prototype.toString.call(originalDelegate);
        }
      }
      if (this === Promise) {
        const nativePromise = global[PROMISE_SYMBOL];
        if (nativePromise) {
          return originalFunctionToString.call(nativePromise);
        }
      }
      if (this === Error) {
        const nativeError = global[ERROR_SYMBOL];
        if (nativeError) {
          return originalFunctionToString.call(nativeError);
        }
      }
    }
    return originalFunctionToString.call(this);
  };
  newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
  Function.prototype.toString = newFunctionToString;
  const originalObjectToString = Object.prototype.toString;
  const PROMISE_OBJECT_TO_STRING = "[object Promise]";
  Object.prototype.toString = function() {
    if (typeof Promise === "function" && this instanceof Promise) {
      return PROMISE_OBJECT_TO_STRING;
    }
    return originalObjectToString.call(this);
  };
});
var passiveSupported = false;
if (typeof window !== "undefined") {
  try {
    const options = Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
      }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (err) {
    passiveSupported = false;
  }
}
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
  useG: true
};
var zoneSymbolEventNames = {};
var globalSources = {};
var EVENT_NAME_SYMBOL_REGX = new RegExp("^" + ZONE_SYMBOL_PREFIX + "(\\w+)(true|false)$");
var IMMEDIATE_PROPAGATION_SYMBOL = zoneSymbol("propagationStopped");
function prepareEventNames(eventName, eventNameToString) {
  const falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + FALSE_STR;
  const trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + TRUE_STR;
  const symbol = ZONE_SYMBOL_PREFIX + falseEventName;
  const symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
  zoneSymbolEventNames[eventName] = {};
  zoneSymbolEventNames[eventName][FALSE_STR] = symbol;
  zoneSymbolEventNames[eventName][TRUE_STR] = symbolCapture;
}
function patchEventTarget(_global2, api, apis, patchOptions) {
  const ADD_EVENT_LISTENER = patchOptions && patchOptions.add || ADD_EVENT_LISTENER_STR;
  const REMOVE_EVENT_LISTENER = patchOptions && patchOptions.rm || REMOVE_EVENT_LISTENER_STR;
  const LISTENERS_EVENT_LISTENER = patchOptions && patchOptions.listeners || "eventListeners";
  const REMOVE_ALL_LISTENERS_EVENT_LISTENER = patchOptions && patchOptions.rmAll || "removeAllListeners";
  const zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
  const ADD_EVENT_LISTENER_SOURCE = "." + ADD_EVENT_LISTENER + ":";
  const PREPEND_EVENT_LISTENER = "prependListener";
  const PREPEND_EVENT_LISTENER_SOURCE = "." + PREPEND_EVENT_LISTENER + ":";
  const invokeTask = function(task, target, event) {
    if (task.isRemoved) {
      return;
    }
    const delegate = task.callback;
    if (typeof delegate === "object" && delegate.handleEvent) {
      task.callback = (event2) => delegate.handleEvent(event2);
      task.originalDelegate = delegate;
    }
    let error;
    try {
      task.invoke(task, target, [event]);
    } catch (err) {
      error = err;
    }
    const options = task.options;
    if (options && typeof options === "object" && options.once) {
      const delegate2 = task.originalDelegate ? task.originalDelegate : task.callback;
      target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate2, options);
    }
    return error;
  };
  function globalCallback(context, event, isCapture) {
    event = event || _global2.event;
    if (!event) {
      return;
    }
    const target = context || event.target || _global2;
    const tasks = target[zoneSymbolEventNames[event.type][isCapture ? TRUE_STR : FALSE_STR]];
    if (tasks) {
      const errors = [];
      if (tasks.length === 1) {
        const err = invokeTask(tasks[0], target, event);
        err && errors.push(err);
      } else {
        const copyTasks = tasks.slice();
        for (let i = 0; i < copyTasks.length; i++) {
          if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
            break;
          }
          const err = invokeTask(copyTasks[i], target, event);
          err && errors.push(err);
        }
      }
      if (errors.length === 1) {
        throw errors[0];
      } else {
        for (let i = 0; i < errors.length; i++) {
          const err = errors[i];
          api.nativeScheduleMicroTask(() => {
            throw err;
          });
        }
      }
    }
  }
  const globalZoneAwareCallback = function(event) {
    return globalCallback(this, event, false);
  };
  const globalZoneAwareCaptureCallback = function(event) {
    return globalCallback(this, event, true);
  };
  function patchEventTargetMethods(obj, patchOptions2) {
    if (!obj) {
      return false;
    }
    let useGlobalCallback = true;
    if (patchOptions2 && patchOptions2.useG !== void 0) {
      useGlobalCallback = patchOptions2.useG;
    }
    const validateHandler = patchOptions2 && patchOptions2.vh;
    let checkDuplicate = true;
    if (patchOptions2 && patchOptions2.chkDup !== void 0) {
      checkDuplicate = patchOptions2.chkDup;
    }
    let returnTarget = false;
    if (patchOptions2 && patchOptions2.rt !== void 0) {
      returnTarget = patchOptions2.rt;
    }
    let proto = obj;
    while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
      proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && obj[ADD_EVENT_LISTENER]) {
      proto = obj;
    }
    if (!proto) {
      return false;
    }
    if (proto[zoneSymbolAddEventListener]) {
      return false;
    }
    const eventNameToString = patchOptions2 && patchOptions2.eventNameToString;
    const taskData = {};
    const nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
    const nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] = proto[REMOVE_EVENT_LISTENER];
    const nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] = proto[LISTENERS_EVENT_LISTENER];
    const nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] = proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
    let nativePrependEventListener;
    if (patchOptions2 && patchOptions2.prepend) {
      nativePrependEventListener = proto[zoneSymbol(patchOptions2.prepend)] = proto[patchOptions2.prepend];
    }
    function buildEventListenerOptions(options, passive) {
      if (!passiveSupported && typeof options === "object" && options) {
        return !!options.capture;
      }
      if (!passiveSupported || !passive) {
        return options;
      }
      if (typeof options === "boolean") {
        return { capture: options, passive: true };
      }
      if (!options) {
        return { passive: true };
      }
      if (typeof options === "object" && options.passive !== false) {
        return { ...options, passive: true };
      }
      return options;
    }
    const customScheduleGlobal = function(task) {
      if (taskData.isExisting) {
        return;
      }
      return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
    };
    const customCancelGlobal = function(task) {
      if (!task.isRemoved) {
        const symbolEventNames = zoneSymbolEventNames[task.eventName];
        let symbolEventName;
        if (symbolEventNames) {
          symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
        }
        const existingTasks = symbolEventName && task.target[symbolEventName];
        if (existingTasks) {
          for (let i = 0; i < existingTasks.length; i++) {
            const existingTask = existingTasks[i];
            if (existingTask === task) {
              existingTasks.splice(i, 1);
              task.isRemoved = true;
              if (existingTasks.length === 0) {
                task.allRemoved = true;
                task.target[symbolEventName] = null;
              }
              break;
            }
          }
        }
      }
      if (!task.allRemoved) {
        return;
      }
      return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
    };
    const customScheduleNonGlobal = function(task) {
      return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
    };
    const customSchedulePrepend = function(task) {
      return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
    };
    const customCancelNonGlobal = function(task) {
      return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
    };
    const customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
    const customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
    const compareTaskCallbackVsDelegate = function(task, delegate) {
      const typeOfDelegate = typeof delegate;
      return typeOfDelegate === "function" && task.callback === delegate || typeOfDelegate === "object" && task.originalDelegate === delegate;
    };
    const compare = patchOptions2 && patchOptions2.diff ? patchOptions2.diff : compareTaskCallbackVsDelegate;
    const unpatchedEvents = Zone[zoneSymbol("UNPATCHED_EVENTS")];
    const passiveEvents = _global2[zoneSymbol("PASSIVE_EVENTS")];
    const makeAddListener = function(nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget2 = false, prepend = false) {
      return function() {
        const target = this || _global2;
        let eventName = arguments[0];
        if (patchOptions2 && patchOptions2.transferEventName) {
          eventName = patchOptions2.transferEventName(eventName);
        }
        let delegate = arguments[1];
        if (!delegate) {
          return nativeListener.apply(this, arguments);
        }
        if (isNode && eventName === "uncaughtException") {
          return nativeListener.apply(this, arguments);
        }
        let isHandleEvent = false;
        if (typeof delegate !== "function") {
          if (!delegate.handleEvent) {
            return nativeListener.apply(this, arguments);
          }
          isHandleEvent = true;
        }
        if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
          return;
        }
        const passive = passiveSupported && !!passiveEvents && passiveEvents.indexOf(eventName) !== -1;
        const options = buildEventListenerOptions(arguments[2], passive);
        const signal = options && typeof options === "object" && options.signal && typeof options.signal === "object" ? options.signal : void 0;
        if (signal?.aborted) {
          return;
        }
        if (unpatchedEvents) {
          for (let i = 0; i < unpatchedEvents.length; i++) {
            if (eventName === unpatchedEvents[i]) {
              if (passive) {
                return nativeListener.call(target, eventName, delegate, options);
              } else {
                return nativeListener.apply(this, arguments);
              }
            }
          }
        }
        const capture = !options ? false : typeof options === "boolean" ? true : options.capture;
        const once = options && typeof options === "object" ? options.once : false;
        const zone = Zone.current;
        let symbolEventNames = zoneSymbolEventNames[eventName];
        if (!symbolEventNames) {
          prepareEventNames(eventName, eventNameToString);
          symbolEventNames = zoneSymbolEventNames[eventName];
        }
        const symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
        let existingTasks = target[symbolEventName];
        let isExisting = false;
        if (existingTasks) {
          isExisting = true;
          if (checkDuplicate) {
            for (let i = 0; i < existingTasks.length; i++) {
              if (compare(existingTasks[i], delegate)) {
                return;
              }
            }
          }
        } else {
          existingTasks = target[symbolEventName] = [];
        }
        let source;
        const constructorName = target.constructor["name"];
        const targetSource = globalSources[constructorName];
        if (targetSource) {
          source = targetSource[eventName];
        }
        if (!source) {
          source = constructorName + addSource + (eventNameToString ? eventNameToString(eventName) : eventName);
        }
        taskData.options = options;
        if (once) {
          taskData.options.once = false;
        }
        taskData.target = target;
        taskData.capture = capture;
        taskData.eventName = eventName;
        taskData.isExisting = isExisting;
        const data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : void 0;
        if (data) {
          data.taskData = taskData;
        }
        if (signal) {
          taskData.options.signal = void 0;
        }
        const task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
        if (signal) {
          taskData.options.signal = signal;
          nativeListener.call(signal, "abort", () => {
            task.zone.cancelTask(task);
          }, { once: true });
        }
        taskData.target = null;
        if (data) {
          data.taskData = null;
        }
        if (once) {
          options.once = true;
        }
        if (!(!passiveSupported && typeof task.options === "boolean")) {
          task.options = options;
        }
        task.target = target;
        task.capture = capture;
        task.eventName = eventName;
        if (isHandleEvent) {
          task.originalDelegate = delegate;
        }
        if (!prepend) {
          existingTasks.push(task);
        } else {
          existingTasks.unshift(task);
        }
        if (returnTarget2) {
          return target;
        }
      };
    };
    proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
    if (nativePrependEventListener) {
      proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
    }
    proto[REMOVE_EVENT_LISTENER] = function() {
      const target = this || _global2;
      let eventName = arguments[0];
      if (patchOptions2 && patchOptions2.transferEventName) {
        eventName = patchOptions2.transferEventName(eventName);
      }
      const options = arguments[2];
      const capture = !options ? false : typeof options === "boolean" ? true : options.capture;
      const delegate = arguments[1];
      if (!delegate) {
        return nativeRemoveEventListener.apply(this, arguments);
      }
      if (validateHandler && !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
        return;
      }
      const symbolEventNames = zoneSymbolEventNames[eventName];
      let symbolEventName;
      if (symbolEventNames) {
        symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
      }
      const existingTasks = symbolEventName && target[symbolEventName];
      if (existingTasks) {
        for (let i = 0; i < existingTasks.length; i++) {
          const existingTask = existingTasks[i];
          if (compare(existingTask, delegate)) {
            existingTasks.splice(i, 1);
            existingTask.isRemoved = true;
            if (existingTasks.length === 0) {
              existingTask.allRemoved = true;
              target[symbolEventName] = null;
              if (typeof eventName === "string") {
                const onPropertySymbol = ZONE_SYMBOL_PREFIX + "ON_PROPERTY" + eventName;
                target[onPropertySymbol] = null;
              }
            }
            existingTask.zone.cancelTask(existingTask);
            if (returnTarget) {
              return target;
            }
            return;
          }
        }
      }
      return nativeRemoveEventListener.apply(this, arguments);
    };
    proto[LISTENERS_EVENT_LISTENER] = function() {
      const target = this || _global2;
      let eventName = arguments[0];
      if (patchOptions2 && patchOptions2.transferEventName) {
        eventName = patchOptions2.transferEventName(eventName);
      }
      const listeners = [];
      const tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
        listeners.push(delegate);
      }
      return listeners;
    };
    proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function() {
      const target = this || _global2;
      let eventName = arguments[0];
      if (!eventName) {
        const keys = Object.keys(target);
        for (let i = 0; i < keys.length; i++) {
          const prop = keys[i];
          const match = EVENT_NAME_SYMBOL_REGX.exec(prop);
          let evtName = match && match[1];
          if (evtName && evtName !== "removeListener") {
            this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
          }
        }
        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, "removeListener");
      } else {
        if (patchOptions2 && patchOptions2.transferEventName) {
          eventName = patchOptions2.transferEventName(eventName);
        }
        const symbolEventNames = zoneSymbolEventNames[eventName];
        if (symbolEventNames) {
          const symbolEventName = symbolEventNames[FALSE_STR];
          const symbolCaptureEventName = symbolEventNames[TRUE_STR];
          const tasks = target[symbolEventName];
          const captureTasks = target[symbolCaptureEventName];
          if (tasks) {
            const removeTasks = tasks.slice();
            for (let i = 0; i < removeTasks.length; i++) {
              const task = removeTasks[i];
              let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
              this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
            }
          }
          if (captureTasks) {
            const removeTasks = captureTasks.slice();
            for (let i = 0; i < removeTasks.length; i++) {
              const task = removeTasks[i];
              let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
              this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
            }
          }
        }
      }
      if (returnTarget) {
        return this;
      }
    };
    attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
    attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
    if (nativeRemoveAllListeners) {
      attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
    }
    if (nativeListeners) {
      attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
    }
    return true;
  }
  let results = [];
  for (let i = 0; i < apis.length; i++) {
    results[i] = patchEventTargetMethods(apis[i], patchOptions);
  }
  return results;
}
function findEventTasks(target, eventName) {
  if (!eventName) {
    const foundTasks = [];
    for (let prop in target) {
      const match = EVENT_NAME_SYMBOL_REGX.exec(prop);
      let evtName = match && match[1];
      if (evtName && (!eventName || evtName === eventName)) {
        const tasks = target[prop];
        if (tasks) {
          for (let i = 0; i < tasks.length; i++) {
            foundTasks.push(tasks[i]);
          }
        }
      }
    }
    return foundTasks;
  }
  let symbolEventName = zoneSymbolEventNames[eventName];
  if (!symbolEventName) {
    prepareEventNames(eventName);
    symbolEventName = zoneSymbolEventNames[eventName];
  }
  const captureFalseTasks = target[symbolEventName[FALSE_STR]];
  const captureTrueTasks = target[symbolEventName[TRUE_STR]];
  if (!captureFalseTasks) {
    return captureTrueTasks ? captureTrueTasks.slice() : [];
  } else {
    return captureTrueTasks ? captureFalseTasks.concat(captureTrueTasks) : captureFalseTasks.slice();
  }
}
function patchEventPrototype(global, api) {
  const Event = global["Event"];
  if (Event && Event.prototype) {
    api.patchMethod(Event.prototype, "stopImmediatePropagation", (delegate) => function(self2, args) {
      self2[IMMEDIATE_PROPAGATION_SYMBOL] = true;
      delegate && delegate.apply(self2, args);
    });
  }
}
function patchCallbacks(api, target, targetName, method, callbacks) {
  const symbol = Zone.__symbol__(method);
  if (target[symbol]) {
    return;
  }
  const nativeDelegate = target[symbol] = target[method];
  target[method] = function(name, opts, options) {
    if (opts && opts.prototype) {
      callbacks.forEach(function(callback) {
        const source = `${targetName}.${method}::` + callback;
        const prototype = opts.prototype;
        try {
          if (prototype.hasOwnProperty(callback)) {
            const descriptor = api.ObjectGetOwnPropertyDescriptor(prototype, callback);
            if (descriptor && descriptor.value) {
              descriptor.value = api.wrapWithCurrentZone(descriptor.value, source);
              api._redefineProperty(opts.prototype, callback, descriptor);
            } else if (prototype[callback]) {
              prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
            }
          } else if (prototype[callback]) {
            prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
          }
        } catch {
        }
      });
    }
    return nativeDelegate.call(target, name, opts, options);
  };
  api.attachOriginToPatched(target[method], nativeDelegate);
}
function filterProperties(target, onProperties, ignoreProperties) {
  if (!ignoreProperties || ignoreProperties.length === 0) {
    return onProperties;
  }
  const tip = ignoreProperties.filter((ip) => ip.target === target);
  if (!tip || tip.length === 0) {
    return onProperties;
  }
  const targetIgnoreProperties = tip[0].ignoreProperties;
  return onProperties.filter((op) => targetIgnoreProperties.indexOf(op) === -1);
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
  if (!target) {
    return;
  }
  const filteredProperties = filterProperties(target, onProperties, ignoreProperties);
  patchOnProperties(target, filteredProperties, prototype);
}
function getOnEventNames(target) {
  return Object.getOwnPropertyNames(target).filter((name) => name.startsWith("on") && name.length > 2).map((name) => name.substring(2));
}
function propertyDescriptorPatch(api, _global2) {
  if (isNode && !isMix) {
    return;
  }
  if (Zone[api.symbol("patchEvents")]) {
    return;
  }
  const ignoreProperties = _global2["__Zone_ignore_on_properties"];
  let patchTargets = [];
  if (isBrowser) {
    const internalWindow2 = window;
    patchTargets = patchTargets.concat([
      "Document",
      "SVGElement",
      "Element",
      "HTMLElement",
      "HTMLBodyElement",
      "HTMLMediaElement",
      "HTMLFrameSetElement",
      "HTMLFrameElement",
      "HTMLIFrameElement",
      "HTMLMarqueeElement",
      "Worker"
    ]);
    const ignoreErrorProperties = isIE() ? [{ target: internalWindow2, ignoreProperties: ["error"] }] : [];
    patchFilteredProperties(internalWindow2, getOnEventNames(internalWindow2), ignoreProperties ? ignoreProperties.concat(ignoreErrorProperties) : ignoreProperties, ObjectGetPrototypeOf(internalWindow2));
  }
  patchTargets = patchTargets.concat([
    "XMLHttpRequest",
    "XMLHttpRequestEventTarget",
    "IDBIndex",
    "IDBRequest",
    "IDBOpenDBRequest",
    "IDBDatabase",
    "IDBTransaction",
    "IDBCursor",
    "WebSocket"
  ]);
  for (let i = 0; i < patchTargets.length; i++) {
    const target = _global2[patchTargets[i]];
    target && target.prototype && patchFilteredProperties(target.prototype, getOnEventNames(target.prototype), ignoreProperties);
  }
}
Zone.__load_patch("util", (global, Zone2, api) => {
  const eventNames = getOnEventNames(global);
  api.patchOnProperties = patchOnProperties;
  api.patchMethod = patchMethod;
  api.bindArguments = bindArguments;
  api.patchMacroTask = patchMacroTask;
  const SYMBOL_BLACK_LISTED_EVENTS = Zone2.__symbol__("BLACK_LISTED_EVENTS");
  const SYMBOL_UNPATCHED_EVENTS = Zone2.__symbol__("UNPATCHED_EVENTS");
  if (global[SYMBOL_UNPATCHED_EVENTS]) {
    global[SYMBOL_BLACK_LISTED_EVENTS] = global[SYMBOL_UNPATCHED_EVENTS];
  }
  if (global[SYMBOL_BLACK_LISTED_EVENTS]) {
    Zone2[SYMBOL_BLACK_LISTED_EVENTS] = Zone2[SYMBOL_UNPATCHED_EVENTS] = global[SYMBOL_BLACK_LISTED_EVENTS];
  }
  api.patchEventPrototype = patchEventPrototype;
  api.patchEventTarget = patchEventTarget;
  api.isIEOrEdge = isIEOrEdge;
  api.ObjectDefineProperty = ObjectDefineProperty;
  api.ObjectGetOwnPropertyDescriptor = ObjectGetOwnPropertyDescriptor;
  api.ObjectCreate = ObjectCreate;
  api.ArraySlice = ArraySlice;
  api.patchClass = patchClass;
  api.wrapWithCurrentZone = wrapWithCurrentZone;
  api.filterProperties = filterProperties;
  api.attachOriginToPatched = attachOriginToPatched;
  api._redefineProperty = Object.defineProperty;
  api.patchCallbacks = patchCallbacks;
  api.getGlobalObjects = () => ({
    globalSources,
    zoneSymbolEventNames,
    eventNames,
    isBrowser,
    isMix,
    isNode,
    TRUE_STR,
    FALSE_STR,
    ZONE_SYMBOL_PREFIX,
    ADD_EVENT_LISTENER_STR,
    REMOVE_EVENT_LISTENER_STR
  });
});
function patchQueueMicrotask(global, api) {
  api.patchMethod(global, "queueMicrotask", (delegate) => {
    return function(self2, args) {
      Zone.current.scheduleMicroTask("queueMicrotask", args[0]);
    };
  });
}
var taskSymbol = zoneSymbol("zoneTask");
function patchTimer(window2, setName, cancelName, nameSuffix) {
  let setNative = null;
  let clearNative = null;
  setName += nameSuffix;
  cancelName += nameSuffix;
  const tasksByHandleId = {};
  function scheduleTask(task) {
    const data = task.data;
    data.args[0] = function() {
      return task.invoke.apply(this, arguments);
    };
    data.handleId = setNative.apply(window2, data.args);
    return task;
  }
  function clearTask(task) {
    return clearNative.call(window2, task.data.handleId);
  }
  setNative = patchMethod(window2, setName, (delegate) => function(self2, args) {
    if (typeof args[0] === "function") {
      const options = {
        isPeriodic: nameSuffix === "Interval",
        delay: nameSuffix === "Timeout" || nameSuffix === "Interval" ? args[1] || 0 : void 0,
        args
      };
      const callback = args[0];
      args[0] = function timer() {
        try {
          return callback.apply(this, arguments);
        } finally {
          if (!options.isPeriodic) {
            if (typeof options.handleId === "number") {
              delete tasksByHandleId[options.handleId];
            } else if (options.handleId) {
              options.handleId[taskSymbol] = null;
            }
          }
        }
      };
      const task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
      if (!task) {
        return task;
      }
      const handle = task.data.handleId;
      if (typeof handle === "number") {
        tasksByHandleId[handle] = task;
      } else if (handle) {
        handle[taskSymbol] = task;
      }
      if (handle && handle.ref && handle.unref && typeof handle.ref === "function" && typeof handle.unref === "function") {
        task.ref = handle.ref.bind(handle);
        task.unref = handle.unref.bind(handle);
      }
      if (typeof handle === "number" || handle) {
        return handle;
      }
      return task;
    } else {
      return delegate.apply(window2, args);
    }
  });
  clearNative = patchMethod(window2, cancelName, (delegate) => function(self2, args) {
    const id = args[0];
    let task;
    if (typeof id === "number") {
      task = tasksByHandleId[id];
    } else {
      task = id && id[taskSymbol];
      if (!task) {
        task = id;
      }
    }
    if (task && typeof task.type === "string") {
      if (task.state !== "notScheduled" && (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
        if (typeof id === "number") {
          delete tasksByHandleId[id];
        } else if (id) {
          id[taskSymbol] = null;
        }
        task.zone.cancelTask(task);
      }
    } else {
      delegate.apply(window2, args);
    }
  });
}
function patchCustomElements(_global2, api) {
  const { isBrowser: isBrowser2, isMix: isMix2 } = api.getGlobalObjects();
  if (!isBrowser2 && !isMix2 || !_global2["customElements"] || !("customElements" in _global2)) {
    return;
  }
  const callbacks = [
    "connectedCallback",
    "disconnectedCallback",
    "adoptedCallback",
    "attributeChangedCallback",
    "formAssociatedCallback",
    "formDisabledCallback",
    "formResetCallback",
    "formStateRestoreCallback"
  ];
  api.patchCallbacks(api, _global2.customElements, "customElements", "define", callbacks);
}
function eventTargetPatch(_global2, api) {
  if (Zone[api.symbol("patchEventTarget")]) {
    return;
  }
  const { eventNames, zoneSymbolEventNames: zoneSymbolEventNames2, TRUE_STR: TRUE_STR2, FALSE_STR: FALSE_STR2, ZONE_SYMBOL_PREFIX: ZONE_SYMBOL_PREFIX2 } = api.getGlobalObjects();
  for (let i = 0; i < eventNames.length; i++) {
    const eventName = eventNames[i];
    const falseEventName = eventName + FALSE_STR2;
    const trueEventName = eventName + TRUE_STR2;
    const symbol = ZONE_SYMBOL_PREFIX2 + falseEventName;
    const symbolCapture = ZONE_SYMBOL_PREFIX2 + trueEventName;
    zoneSymbolEventNames2[eventName] = {};
    zoneSymbolEventNames2[eventName][FALSE_STR2] = symbol;
    zoneSymbolEventNames2[eventName][TRUE_STR2] = symbolCapture;
  }
  const EVENT_TARGET = _global2["EventTarget"];
  if (!EVENT_TARGET || !EVENT_TARGET.prototype) {
    return;
  }
  api.patchEventTarget(_global2, api, [EVENT_TARGET && EVENT_TARGET.prototype]);
  return true;
}
function patchEvent(global, api) {
  api.patchEventPrototype(global, api);
}
Zone.__load_patch("legacy", (global) => {
  const legacyPatch = global[Zone.__symbol__("legacyPatch")];
  if (legacyPatch) {
    legacyPatch();
  }
});
Zone.__load_patch("timers", (global) => {
  const set = "set";
  const clear = "clear";
  patchTimer(global, set, clear, "Timeout");
  patchTimer(global, set, clear, "Interval");
  patchTimer(global, set, clear, "Immediate");
});
Zone.__load_patch("requestAnimationFrame", (global) => {
  patchTimer(global, "request", "cancel", "AnimationFrame");
  patchTimer(global, "mozRequest", "mozCancel", "AnimationFrame");
  patchTimer(global, "webkitRequest", "webkitCancel", "AnimationFrame");
});
Zone.__load_patch("blocking", (global, Zone2) => {
  const blockingMethods = ["alert", "prompt", "confirm"];
  for (let i = 0; i < blockingMethods.length; i++) {
    const name = blockingMethods[i];
    patchMethod(global, name, (delegate, symbol, name2) => {
      return function(s, args) {
        return Zone2.current.run(delegate, global, args, name2);
      };
    });
  }
});
Zone.__load_patch("EventTarget", (global, Zone2, api) => {
  patchEvent(global, api);
  eventTargetPatch(global, api);
  const XMLHttpRequestEventTarget = global["XMLHttpRequestEventTarget"];
  if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
    api.patchEventTarget(global, api, [XMLHttpRequestEventTarget.prototype]);
  }
});
Zone.__load_patch("MutationObserver", (global, Zone2, api) => {
  patchClass("MutationObserver");
  patchClass("WebKitMutationObserver");
});
Zone.__load_patch("IntersectionObserver", (global, Zone2, api) => {
  patchClass("IntersectionObserver");
});
Zone.__load_patch("FileReader", (global, Zone2, api) => {
  patchClass("FileReader");
});
Zone.__load_patch("on_property", (global, Zone2, api) => {
  propertyDescriptorPatch(api, global);
});
Zone.__load_patch("customElements", (global, Zone2, api) => {
  patchCustomElements(global, api);
});
Zone.__load_patch("XHR", (global, Zone2) => {
  patchXHR(global);
  const XHR_TASK = zoneSymbol("xhrTask");
  const XHR_SYNC = zoneSymbol("xhrSync");
  const XHR_LISTENER = zoneSymbol("xhrListener");
  const XHR_SCHEDULED = zoneSymbol("xhrScheduled");
  const XHR_URL = zoneSymbol("xhrURL");
  const XHR_ERROR_BEFORE_SCHEDULED = zoneSymbol("xhrErrorBeforeScheduled");
  function patchXHR(window2) {
    const XMLHttpRequest = window2["XMLHttpRequest"];
    if (!XMLHttpRequest) {
      return;
    }
    const XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    function findPendingTask(target) {
      return target[XHR_TASK];
    }
    let oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
    let oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
    if (!oriAddListener) {
      const XMLHttpRequestEventTarget = window2["XMLHttpRequestEventTarget"];
      if (XMLHttpRequestEventTarget) {
        const XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget.prototype;
        oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
      }
    }
    const READY_STATE_CHANGE = "readystatechange";
    const SCHEDULED = "scheduled";
    function scheduleTask(task) {
      const data = task.data;
      const target = data.target;
      target[XHR_SCHEDULED] = false;
      target[XHR_ERROR_BEFORE_SCHEDULED] = false;
      const listener = target[XHR_LISTENER];
      if (!oriAddListener) {
        oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
      }
      if (listener) {
        oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
      }
      const newListener = target[XHR_LISTENER] = () => {
        if (target.readyState === target.DONE) {
          if (!data.aborted && target[XHR_SCHEDULED] && task.state === SCHEDULED) {
            const loadTasks = target[Zone2.__symbol__("loadfalse")];
            if (target.status !== 0 && loadTasks && loadTasks.length > 0) {
              const oriInvoke = task.invoke;
              task.invoke = function() {
                const loadTasks2 = target[Zone2.__symbol__("loadfalse")];
                for (let i = 0; i < loadTasks2.length; i++) {
                  if (loadTasks2[i] === task) {
                    loadTasks2.splice(i, 1);
                  }
                }
                if (!data.aborted && task.state === SCHEDULED) {
                  oriInvoke.call(task);
                }
              };
              loadTasks.push(task);
            } else {
              task.invoke();
            }
          } else if (!data.aborted && target[XHR_SCHEDULED] === false) {
            target[XHR_ERROR_BEFORE_SCHEDULED] = true;
          }
        }
      };
      oriAddListener.call(target, READY_STATE_CHANGE, newListener);
      const storedTask = target[XHR_TASK];
      if (!storedTask) {
        target[XHR_TASK] = task;
      }
      sendNative.apply(target, data.args);
      target[XHR_SCHEDULED] = true;
      return task;
    }
    function placeholderCallback() {
    }
    function clearTask(task) {
      const data = task.data;
      data.aborted = true;
      return abortNative.apply(data.target, data.args);
    }
    const openNative = patchMethod(XMLHttpRequestPrototype, "open", () => function(self2, args) {
      self2[XHR_SYNC] = args[2] == false;
      self2[XHR_URL] = args[1];
      return openNative.apply(self2, args);
    });
    const XMLHTTPREQUEST_SOURCE = "XMLHttpRequest.send";
    const fetchTaskAborting = zoneSymbol("fetchTaskAborting");
    const fetchTaskScheduling = zoneSymbol("fetchTaskScheduling");
    const sendNative = patchMethod(XMLHttpRequestPrototype, "send", () => function(self2, args) {
      if (Zone2.current[fetchTaskScheduling] === true) {
        return sendNative.apply(self2, args);
      }
      if (self2[XHR_SYNC]) {
        return sendNative.apply(self2, args);
      } else {
        const options = { target: self2, url: self2[XHR_URL], isPeriodic: false, args, aborted: false };
        const task = scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
        if (self2 && self2[XHR_ERROR_BEFORE_SCHEDULED] === true && !options.aborted && task.state === SCHEDULED) {
          task.invoke();
        }
      }
    });
    const abortNative = patchMethod(XMLHttpRequestPrototype, "abort", () => function(self2, args) {
      const task = findPendingTask(self2);
      if (task && typeof task.type == "string") {
        if (task.cancelFn == null || task.data && task.data.aborted) {
          return;
        }
        task.zone.cancelTask(task);
      } else if (Zone2.current[fetchTaskAborting] === true) {
        return abortNative.apply(self2, args);
      }
    });
  }
});
Zone.__load_patch("geolocation", (global) => {
  if (global["navigator"] && global["navigator"].geolocation) {
    patchPrototype(global["navigator"].geolocation, ["getCurrentPosition", "watchPosition"]);
  }
});
Zone.__load_patch("PromiseRejectionEvent", (global, Zone2) => {
  function findPromiseRejectionHandler(evtName) {
    return function(e) {
      const eventTasks = findEventTasks(global, evtName);
      eventTasks.forEach((eventTask) => {
        const PromiseRejectionEvent = global["PromiseRejectionEvent"];
        if (PromiseRejectionEvent) {
          const evt = new PromiseRejectionEvent(evtName, { promise: e.promise, reason: e.rejection });
          eventTask.invoke(evt);
        }
      });
    };
  }
  if (global["PromiseRejectionEvent"]) {
    Zone2[zoneSymbol("unhandledPromiseRejectionHandler")] = findPromiseRejectionHandler("unhandledrejection");
    Zone2[zoneSymbol("rejectionHandledHandler")] = findPromiseRejectionHandler("rejectionhandled");
  }
});
Zone.__load_patch("queueMicrotask", (global, Zone2, api) => {
  patchQueueMicrotask(global, api);
});

// node_modules/@angular/localize/fesm2022/localize.mjs
var BLOCK_MARKER$1 = ":";
var _SerializerVisitor = class {
  visitText(text, context) {
    return text.value;
  }
  visitContainer(container, context) {
    return `[${container.children.map((child) => child.visit(this)).join(", ")}]`;
  }
  visitIcu(icu, context) {
    const strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
    return `{${icu.expression}, ${icu.type}, ${strCases.join(", ")}}`;
  }
  visitTagPlaceholder(ph, context) {
    return ph.isVoid ? `<ph tag name="${ph.startName}"/>` : `<ph tag name="${ph.startName}">${ph.children.map((child) => child.visit(this)).join(", ")}</ph name="${ph.closeName}">`;
  }
  visitPlaceholder(ph, context) {
    return ph.value ? `<ph name="${ph.name}">${ph.value}</ph>` : `<ph name="${ph.name}"/>`;
  }
  visitIcuPlaceholder(ph, context) {
    return `<ph icu name="${ph.name}">${ph.value.visit(this)}</ph>`;
  }
  visitBlockPlaceholder(ph, context) {
    return `<ph block name="${ph.startName}">${ph.children.map((child) => child.visit(this)).join(", ")}</ph name="${ph.closeName}">`;
  }
};
var serializerVisitor = new _SerializerVisitor();
var Endian;
(function(Endian2) {
  Endian2[Endian2["Little"] = 0] = "Little";
  Endian2[Endian2["Big"] = 1] = "Big";
})(Endian || (Endian = {}));
function findEndOfBlock(cooked, raw) {
  for (let cookedIndex = 1, rawIndex = 1; cookedIndex < cooked.length; cookedIndex++, rawIndex++) {
    if (raw[rawIndex] === "\\") {
      rawIndex++;
    } else if (cooked[cookedIndex] === BLOCK_MARKER$1) {
      return cookedIndex;
    }
  }
  throw new Error(`Unterminated $localize metadata block in "${raw}".`);
}
var $localize$1 = function(messageParts, ...expressions) {
  if ($localize$1.translate) {
    const translation = $localize$1.translate(messageParts, expressions);
    messageParts = translation[0];
    expressions = translation[1];
  }
  let message = stripBlock(messageParts[0], messageParts.raw[0]);
  for (let i = 1; i < messageParts.length; i++) {
    message += expressions[i - 1] + stripBlock(messageParts[i], messageParts.raw[i]);
  }
  return message;
};
var BLOCK_MARKER = ":";
function stripBlock(messagePart, rawMessagePart) {
  return rawMessagePart.charAt(0) === BLOCK_MARKER ? messagePart.substring(findEndOfBlock(messagePart, rawMessagePart) + 1) : messagePart;
}

// node_modules/@angular/localize/fesm2022/init.mjs
globalThis.$localize = $localize$1;
/*! Bundled license information:

zone.js/fesm2015/zone.js:
  (**
   * @license Angular v<unknown>
   * (c) 2010-2022 Google LLC. https://angular.io/
   * License: MIT
   *)

@angular/localize/fesm2022/localize.mjs:
  (**
   * @license Angular v17.3.4
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   *)

@angular/localize/fesm2022/init.mjs:
  (**
   * @license Angular v17.3.4
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   *)
*/


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy96b25lLmpzL2Zlc20yMDE1L3pvbmUuanMiLCIuLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdXRpbHMvc3JjL2NvbnN0YW50cy50cyIsIi4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pMThuL2RpZ2VzdC50cyIsIi4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy91dGlscy9zcmMvbWVzc2FnZXMudHMiLCIuLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdXRpbHMvc3JjL3RyYW5zbGF0aW9ucy50cyIsIi4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90cmFuc2xhdGUudHMiLCIuLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvbG9jYWxpemUvc3JjL2xvY2FsaXplLnRzIiwiLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvcHJpdmF0ZS50cyIsIi4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL2xvY2FsaXplLnRzIiwiLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvaW5kZXgudHMiLCIuLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9pbml0L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQGxpY2Vuc2UgQW5ndWxhciB2PHVua25vd24+XG4gKiAoYykgMjAxMC0yMDIyIEdvb2dsZSBMTEMuIGh0dHBzOi8vYW5ndWxhci5pby9cbiAqIExpY2Vuc2U6IE1JVFxuICovXG4vLyBJbml0aWFsaXplIGdsb2JhbCBgWm9uZWAgY29uc3RhbnQuXG4oZnVuY3Rpb24gKGdsb2JhbCkge1xuICAgIGNvbnN0IHBlcmZvcm1hbmNlID0gZ2xvYmFsWydwZXJmb3JtYW5jZSddO1xuICAgIGZ1bmN0aW9uIG1hcmsobmFtZSkge1xuICAgICAgICBwZXJmb3JtYW5jZSAmJiBwZXJmb3JtYW5jZVsnbWFyayddICYmIHBlcmZvcm1hbmNlWydtYXJrJ10obmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBlcmZvcm1hbmNlTWVhc3VyZShuYW1lLCBsYWJlbCkge1xuICAgICAgICBwZXJmb3JtYW5jZSAmJiBwZXJmb3JtYW5jZVsnbWVhc3VyZSddICYmIHBlcmZvcm1hbmNlWydtZWFzdXJlJ10obmFtZSwgbGFiZWwpO1xuICAgIH1cbiAgICBtYXJrKCdab25lJyk7XG4gICAgLy8gSW5pdGlhbGl6ZSBiZWZvcmUgaXQncyBhY2Nlc3NlZCBiZWxvdy5cbiAgICAvLyBfX1pvbmVfc3ltYm9sX3ByZWZpeCBnbG9iYWwgY2FuIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgem9uZVxuICAgIC8vIHN5bWJvbCBwcmVmaXggd2l0aCBhIGN1c3RvbSBvbmUgaWYgbmVlZGVkLlxuICAgIGNvbnN0IHN5bWJvbFByZWZpeCA9IGdsb2JhbFsnX19ab25lX3N5bWJvbF9wcmVmaXgnXSB8fCAnX196b25lX3N5bWJvbF9fJztcbiAgICBmdW5jdGlvbiBfX3N5bWJvbF9fKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHN5bWJvbFByZWZpeCArIG5hbWU7XG4gICAgfVxuICAgIGNvbnN0IGNoZWNrRHVwbGljYXRlID0gZ2xvYmFsW19fc3ltYm9sX18oJ2ZvcmNlRHVwbGljYXRlWm9uZUNoZWNrJyldID09PSB0cnVlO1xuICAgIGlmIChnbG9iYWxbJ1pvbmUnXSkge1xuICAgICAgICAvLyBpZiBnbG9iYWxbJ1pvbmUnXSBhbHJlYWR5IGV4aXN0cyAobWF5YmUgem9uZS5qcyB3YXMgYWxyZWFkeSBsb2FkZWQgb3JcbiAgICAgICAgLy8gc29tZSBvdGhlciBsaWIgYWxzbyByZWdpc3RlcmVkIGEgZ2xvYmFsIG9iamVjdCBuYW1lZCBab25lKSwgd2UgbWF5IG5lZWRcbiAgICAgICAgLy8gdG8gdGhyb3cgYW4gZXJyb3IsIGJ1dCBzb21ldGltZXMgdXNlciBtYXkgbm90IHdhbnQgdGhpcyBlcnJvci5cbiAgICAgICAgLy8gRm9yIGV4YW1wbGUsXG4gICAgICAgIC8vIHdlIGhhdmUgdHdvIHdlYiBwYWdlcywgcGFnZTEgaW5jbHVkZXMgem9uZS5qcywgcGFnZTIgZG9lc24ndC5cbiAgICAgICAgLy8gYW5kIHRoZSAxc3QgdGltZSB1c2VyIGxvYWQgcGFnZTEgYW5kIHBhZ2UyLCBldmVyeXRoaW5nIHdvcmsgZmluZSxcbiAgICAgICAgLy8gYnV0IHdoZW4gdXNlciBsb2FkIHBhZ2UyIGFnYWluLCBlcnJvciBvY2N1cnMgYmVjYXVzZSBnbG9iYWxbJ1pvbmUnXSBhbHJlYWR5IGV4aXN0cy5cbiAgICAgICAgLy8gc28gd2UgYWRkIGEgZmxhZyB0byBsZXQgdXNlciBjaG9vc2Ugd2hldGhlciB0byB0aHJvdyB0aGlzIGVycm9yIG9yIG5vdC5cbiAgICAgICAgLy8gQnkgZGVmYXVsdCwgaWYgZXhpc3RpbmcgWm9uZSBpcyBmcm9tIHpvbmUuanMsIHdlIHdpbGwgbm90IHRocm93IHRoZSBlcnJvci5cbiAgICAgICAgaWYgKGNoZWNrRHVwbGljYXRlIHx8IHR5cGVvZiBnbG9iYWxbJ1pvbmUnXS5fX3N5bWJvbF9fICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1pvbmUgYWxyZWFkeSBsb2FkZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsWydab25lJ107XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xhc3MgWm9uZSB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpyZXF1aXJlLWludGVybmFsLXdpdGgtdW5kZXJzY29yZVxuICAgICAgICBzdGF0aWMgeyB0aGlzLl9fc3ltYm9sX18gPSBfX3N5bWJvbF9fOyB9XG4gICAgICAgIHN0YXRpYyBhc3NlcnRab25lUGF0Y2hlZCgpIHtcbiAgICAgICAgICAgIGlmIChnbG9iYWxbJ1Byb21pc2UnXSAhPT0gcGF0Y2hlc1snWm9uZUF3YXJlUHJvbWlzZSddKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdab25lLmpzIGhhcyBkZXRlY3RlZCB0aGF0IFpvbmVBd2FyZVByb21pc2UgYCh3aW5kb3d8Z2xvYmFsKS5Qcm9taXNlYCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2hhcyBiZWVuIG92ZXJ3cml0dGVuLlxcbicgK1xuICAgICAgICAgICAgICAgICAgICAnTW9zdCBsaWtlbHkgY2F1c2UgaXMgdGhhdCBhIFByb21pc2UgcG9seWZpbGwgaGFzIGJlZW4gbG9hZGVkICcgK1xuICAgICAgICAgICAgICAgICAgICAnYWZ0ZXIgWm9uZS5qcyAoUG9seWZpbGxpbmcgUHJvbWlzZSBhcGkgaXMgbm90IG5lY2Vzc2FyeSB3aGVuIHpvbmUuanMgaXMgbG9hZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ0lmIHlvdSBtdXN0IGxvYWQgb25lLCBkbyBzbyBiZWZvcmUgbG9hZGluZyB6b25lLmpzLiknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdGF0aWMgZ2V0IHJvb3QoKSB7XG4gICAgICAgICAgICBsZXQgem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAgIHdoaWxlICh6b25lLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIHpvbmUgPSB6b25lLnBhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB6b25lO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgY3VycmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiBfY3VycmVudFpvbmVGcmFtZS56b25lO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgY3VycmVudFRhc2soKSB7XG4gICAgICAgICAgICByZXR1cm4gX2N1cnJlbnRUYXNrO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpyZXF1aXJlLWludGVybmFsLXdpdGgtdW5kZXJzY29yZVxuICAgICAgICBzdGF0aWMgX19sb2FkX3BhdGNoKG5hbWUsIGZuLCBpZ25vcmVEdXBsaWNhdGUgPSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKHBhdGNoZXMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBgY2hlY2tEdXBsaWNhdGVgIG9wdGlvbiBpcyBkZWZpbmVkIGZyb20gZ2xvYmFsIHZhcmlhYmxlXG4gICAgICAgICAgICAgICAgLy8gc28gaXQgd29ya3MgZm9yIGFsbCBtb2R1bGVzLlxuICAgICAgICAgICAgICAgIC8vIGBpZ25vcmVEdXBsaWNhdGVgIGNhbiB3b3JrIGZvciB0aGUgc3BlY2lmaWVkIG1vZHVsZVxuICAgICAgICAgICAgICAgIGlmICghaWdub3JlRHVwbGljYXRlICYmIGNoZWNrRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCdBbHJlYWR5IGxvYWRlZCBwYXRjaDogJyArIG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFnbG9iYWxbJ19fWm9uZV9kaXNhYmxlXycgKyBuYW1lXSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBlcmZOYW1lID0gJ1pvbmU6JyArIG5hbWU7XG4gICAgICAgICAgICAgICAgbWFyayhwZXJmTmFtZSk7XG4gICAgICAgICAgICAgICAgcGF0Y2hlc1tuYW1lXSA9IGZuKGdsb2JhbCwgWm9uZSwgX2FwaSk7XG4gICAgICAgICAgICAgICAgcGVyZm9ybWFuY2VNZWFzdXJlKHBlcmZOYW1lLCBwZXJmTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHBhcmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIHpvbmVTcGVjKSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgICAgICB0aGlzLl9uYW1lID0gem9uZVNwZWMgPyB6b25lU3BlYy5uYW1lIHx8ICd1bm5hbWVkJyA6ICc8cm9vdD4nO1xuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHpvbmVTcGVjICYmIHpvbmVTcGVjLnByb3BlcnRpZXMgfHwge307XG4gICAgICAgICAgICB0aGlzLl96b25lRGVsZWdhdGUgPVxuICAgICAgICAgICAgICAgIG5ldyBfWm9uZURlbGVnYXRlKHRoaXMsIHRoaXMuX3BhcmVudCAmJiB0aGlzLl9wYXJlbnQuX3pvbmVEZWxlZ2F0ZSwgem9uZVNwZWMpO1xuICAgICAgICB9XG4gICAgICAgIGdldChrZXkpIHtcbiAgICAgICAgICAgIGNvbnN0IHpvbmUgPSB0aGlzLmdldFpvbmVXaXRoKGtleSk7XG4gICAgICAgICAgICBpZiAoem9uZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gem9uZS5fcHJvcGVydGllc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGdldFpvbmVXaXRoKGtleSkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudC5fcHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5fcGFyZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZm9yayh6b25lU3BlYykge1xuICAgICAgICAgICAgaWYgKCF6b25lU3BlYylcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1pvbmVTcGVjIHJlcXVpcmVkIScpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3pvbmVEZWxlZ2F0ZS5mb3JrKHRoaXMsIHpvbmVTcGVjKTtcbiAgICAgICAgfVxuICAgICAgICB3cmFwKGNhbGxiYWNrLCBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGluZyBmdW5jdGlvbiBnb3Q6ICcgKyBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBfY2FsbGJhY2sgPSB0aGlzLl96b25lRGVsZWdhdGUuaW50ZXJjZXB0KHRoaXMsIGNhbGxiYWNrLCBzb3VyY2UpO1xuICAgICAgICAgICAgY29uc3Qgem9uZSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB6b25lLnJ1bkd1YXJkZWQoX2NhbGxiYWNrLCB0aGlzLCBhcmd1bWVudHMsIHNvdXJjZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJ1bihjYWxsYmFjaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MsIHNvdXJjZSkge1xuICAgICAgICAgICAgX2N1cnJlbnRab25lRnJhbWUgPSB7IHBhcmVudDogX2N1cnJlbnRab25lRnJhbWUsIHpvbmU6IHRoaXMgfTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3pvbmVEZWxlZ2F0ZS5pbnZva2UodGhpcywgY2FsbGJhY2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgX2N1cnJlbnRab25lRnJhbWUgPSBfY3VycmVudFpvbmVGcmFtZS5wYXJlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcnVuR3VhcmRlZChjYWxsYmFjaywgYXBwbHlUaGlzID0gbnVsbCwgYXBwbHlBcmdzLCBzb3VyY2UpIHtcbiAgICAgICAgICAgIF9jdXJyZW50Wm9uZUZyYW1lID0geyBwYXJlbnQ6IF9jdXJyZW50Wm9uZUZyYW1lLCB6b25lOiB0aGlzIH07XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lRGVsZWdhdGUuaW52b2tlKHRoaXMsIGNhbGxiYWNrLCBhcHBseVRoaXMsIGFwcGx5QXJncywgc291cmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl96b25lRGVsZWdhdGUuaGFuZGxlRXJyb3IodGhpcywgZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIF9jdXJyZW50Wm9uZUZyYW1lID0gX2N1cnJlbnRab25lRnJhbWUucGFyZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJ1blRhc2sodGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpIHtcbiAgICAgICAgICAgIGlmICh0YXNrLnpvbmUgIT0gdGhpcykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQSB0YXNrIGNhbiBvbmx5IGJlIHJ1biBpbiB0aGUgem9uZSBvZiBjcmVhdGlvbiEgKENyZWF0aW9uOiAnICtcbiAgICAgICAgICAgICAgICAgICAgKHRhc2suem9uZSB8fCBOT19aT05FKS5uYW1lICsgJzsgRXhlY3V0aW9uOiAnICsgdGhpcy5uYW1lICsgJyknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzc3OCwgc29tZXRpbWVzIGV2ZW50VGFza1xuICAgICAgICAgICAgLy8gd2lsbCBydW4gaW4gbm90U2NoZWR1bGVkKGNhbmNlbGVkKSBzdGF0ZSwgd2Ugc2hvdWxkIG5vdCB0cnkgdG9cbiAgICAgICAgICAgIC8vIHJ1biBzdWNoIGtpbmQgb2YgdGFzayBidXQganVzdCByZXR1cm5cbiAgICAgICAgICAgIGlmICh0YXNrLnN0YXRlID09PSBub3RTY2hlZHVsZWQgJiYgKHRhc2sudHlwZSA9PT0gZXZlbnRUYXNrIHx8IHRhc2sudHlwZSA9PT0gbWFjcm9UYXNrKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlRW50cnlHdWFyZCA9IHRhc2suc3RhdGUgIT0gcnVubmluZztcbiAgICAgICAgICAgIHJlRW50cnlHdWFyZCAmJiB0YXNrLl90cmFuc2l0aW9uVG8ocnVubmluZywgc2NoZWR1bGVkKTtcbiAgICAgICAgICAgIHRhc2sucnVuQ291bnQrKztcbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzVGFzayA9IF9jdXJyZW50VGFzaztcbiAgICAgICAgICAgIF9jdXJyZW50VGFzayA9IHRhc2s7XG4gICAgICAgICAgICBfY3VycmVudFpvbmVGcmFtZSA9IHsgcGFyZW50OiBfY3VycmVudFpvbmVGcmFtZSwgem9uZTogdGhpcyB9O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAodGFzay50eXBlID09IG1hY3JvVGFzayAmJiB0YXNrLmRhdGEgJiYgIXRhc2suZGF0YS5pc1BlcmlvZGljKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2suY2FuY2VsRm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lRGVsZWdhdGUuaW52b2tlVGFzayh0aGlzLCB0YXNrLCBhcHBseVRoaXMsIGFwcGx5QXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fem9uZURlbGVnYXRlLmhhbmRsZUVycm9yKHRoaXMsIGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgdGFzaydzIHN0YXRlIGlzIG5vdFNjaGVkdWxlZCBvciB1bmtub3duLCB0aGVuIGl0IGhhcyBhbHJlYWR5IGJlZW4gY2FuY2VsbGVkXG4gICAgICAgICAgICAgICAgLy8gd2Ugc2hvdWxkIG5vdCByZXNldCB0aGUgc3RhdGUgdG8gc2NoZWR1bGVkXG4gICAgICAgICAgICAgICAgaWYgKHRhc2suc3RhdGUgIT09IG5vdFNjaGVkdWxlZCAmJiB0YXNrLnN0YXRlICE9PSB1bmtub3duKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXNrLnR5cGUgPT0gZXZlbnRUYXNrIHx8ICh0YXNrLmRhdGEgJiYgdGFzay5kYXRhLmlzUGVyaW9kaWMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZUVudHJ5R3VhcmQgJiYgdGFzay5fdHJhbnNpdGlvblRvKHNjaGVkdWxlZCwgcnVubmluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnJ1bkNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRhc2tDb3VudCh0YXNrLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZUVudHJ5R3VhcmQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLl90cmFuc2l0aW9uVG8obm90U2NoZWR1bGVkLCBydW5uaW5nLCBub3RTY2hlZHVsZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9jdXJyZW50Wm9uZUZyYW1lID0gX2N1cnJlbnRab25lRnJhbWUucGFyZW50O1xuICAgICAgICAgICAgICAgIF9jdXJyZW50VGFzayA9IHByZXZpb3VzVGFzaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzY2hlZHVsZVRhc2sodGFzaykge1xuICAgICAgICAgICAgaWYgKHRhc2suem9uZSAmJiB0YXNrLnpvbmUgIT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgdGFzayB3YXMgcmVzY2hlZHVsZWQsIHRoZSBuZXdab25lXG4gICAgICAgICAgICAgICAgLy8gc2hvdWxkIG5vdCBiZSB0aGUgY2hpbGRyZW4gb2YgdGhlIG9yaWdpbmFsIHpvbmVcbiAgICAgICAgICAgICAgICBsZXQgbmV3Wm9uZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgd2hpbGUgKG5ld1pvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1pvbmUgPT09IHRhc2suem9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoYGNhbiBub3QgcmVzY2hlZHVsZSB0YXNrIHRvICR7dGhpcy5uYW1lfSB3aGljaCBpcyBkZXNjZW5kYW50cyBvZiB0aGUgb3JpZ2luYWwgem9uZSAke3Rhc2suem9uZS5uYW1lfWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld1pvbmUgPSBuZXdab25lLnBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXNrLl90cmFuc2l0aW9uVG8oc2NoZWR1bGluZywgbm90U2NoZWR1bGVkKTtcbiAgICAgICAgICAgIGNvbnN0IHpvbmVEZWxlZ2F0ZXMgPSBbXTtcbiAgICAgICAgICAgIHRhc2suX3pvbmVEZWxlZ2F0ZXMgPSB6b25lRGVsZWdhdGVzO1xuICAgICAgICAgICAgdGFzay5fem9uZSA9IHRoaXM7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRhc2sgPSB0aGlzLl96b25lRGVsZWdhdGUuc2NoZWR1bGVUYXNrKHRoaXMsIHRhc2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIC8vIHNob3VsZCBzZXQgdGFzaydzIHN0YXRlIHRvIHVua25vd24gd2hlbiBzY2hlZHVsZVRhc2sgdGhyb3cgZXJyb3JcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIHRoZSBlcnIgbWF5IGZyb20gcmVzY2hlZHVsZSwgc28gdGhlIGZyb21TdGF0ZSBtYXliZSBub3RTY2hlZHVsZWRcbiAgICAgICAgICAgICAgICB0YXNrLl90cmFuc2l0aW9uVG8odW5rbm93biwgc2NoZWR1bGluZywgbm90U2NoZWR1bGVkKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBASmlhTGlQYXNzaW9uLCBzaG91bGQgd2UgY2hlY2sgdGhlIHJlc3VsdCBmcm9tIGhhbmRsZUVycm9yP1xuICAgICAgICAgICAgICAgIHRoaXMuX3pvbmVEZWxlZ2F0ZS5oYW5kbGVFcnJvcih0aGlzLCBlcnIpO1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0YXNrLl96b25lRGVsZWdhdGVzID09PSB6b25lRGVsZWdhdGVzKSB7XG4gICAgICAgICAgICAgICAgLy8gd2UgaGF2ZSB0byBjaGVjayBiZWNhdXNlIGludGVybmFsbHkgdGhlIGRlbGVnYXRlIGNhbiByZXNjaGVkdWxlIHRoZSB0YXNrLlxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRhc2tDb3VudCh0YXNrLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0YXNrLnN0YXRlID09IHNjaGVkdWxpbmcpIHtcbiAgICAgICAgICAgICAgICB0YXNrLl90cmFuc2l0aW9uVG8oc2NoZWR1bGVkLCBzY2hlZHVsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xuICAgICAgICB9XG4gICAgICAgIHNjaGVkdWxlTWljcm9UYXNrKHNvdXJjZSwgY2FsbGJhY2ssIGRhdGEsIGN1c3RvbVNjaGVkdWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY2hlZHVsZVRhc2sobmV3IFpvbmVUYXNrKG1pY3JvVGFzaywgc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUsIHVuZGVmaW5lZCkpO1xuICAgICAgICB9XG4gICAgICAgIHNjaGVkdWxlTWFjcm9UYXNrKHNvdXJjZSwgY2FsbGJhY2ssIGRhdGEsIGN1c3RvbVNjaGVkdWxlLCBjdXN0b21DYW5jZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlVGFzayhuZXcgWm9uZVRhc2sobWFjcm9UYXNrLCBzb3VyY2UsIGNhbGxiYWNrLCBkYXRhLCBjdXN0b21TY2hlZHVsZSwgY3VzdG9tQ2FuY2VsKSk7XG4gICAgICAgIH1cbiAgICAgICAgc2NoZWR1bGVFdmVudFRhc2soc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVUYXNrKG5ldyBab25lVGFzayhldmVudFRhc2ssIHNvdXJjZSwgY2FsbGJhY2ssIGRhdGEsIGN1c3RvbVNjaGVkdWxlLCBjdXN0b21DYW5jZWwpKTtcbiAgICAgICAgfVxuICAgICAgICBjYW5jZWxUYXNrKHRhc2spIHtcbiAgICAgICAgICAgIGlmICh0YXNrLnpvbmUgIT0gdGhpcylcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgdGFzayBjYW4gb25seSBiZSBjYW5jZWxsZWQgaW4gdGhlIHpvbmUgb2YgY3JlYXRpb24hIChDcmVhdGlvbjogJyArXG4gICAgICAgICAgICAgICAgICAgICh0YXNrLnpvbmUgfHwgTk9fWk9ORSkubmFtZSArICc7IEV4ZWN1dGlvbjogJyArIHRoaXMubmFtZSArICcpJyk7XG4gICAgICAgICAgICBpZiAodGFzay5zdGF0ZSAhPT0gc2NoZWR1bGVkICYmIHRhc2suc3RhdGUgIT09IHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXNrLl90cmFuc2l0aW9uVG8oY2FuY2VsaW5nLCBzY2hlZHVsZWQsIHJ1bm5pbmcpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLl96b25lRGVsZWdhdGUuY2FuY2VsVGFzayh0aGlzLCB0YXNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBlcnJvciBvY2N1cnMgd2hlbiBjYW5jZWxUYXNrLCB0cmFuc2l0IHRoZSBzdGF0ZSB0byB1bmtub3duXG4gICAgICAgICAgICAgICAgdGFzay5fdHJhbnNpdGlvblRvKHVua25vd24sIGNhbmNlbGluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fem9uZURlbGVnYXRlLmhhbmRsZUVycm9yKHRoaXMsIGVycik7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVGFza0NvdW50KHRhc2ssIC0xKTtcbiAgICAgICAgICAgIHRhc2suX3RyYW5zaXRpb25Ubyhub3RTY2hlZHVsZWQsIGNhbmNlbGluZyk7XG4gICAgICAgICAgICB0YXNrLnJ1bkNvdW50ID0gMDtcbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xuICAgICAgICB9XG4gICAgICAgIF91cGRhdGVUYXNrQ291bnQodGFzaywgY291bnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHpvbmVEZWxlZ2F0ZXMgPSB0YXNrLl96b25lRGVsZWdhdGVzO1xuICAgICAgICAgICAgaWYgKGNvdW50ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGFzay5fem9uZURlbGVnYXRlcyA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHpvbmVEZWxlZ2F0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB6b25lRGVsZWdhdGVzW2ldLl91cGRhdGVUYXNrQ291bnQodGFzay50eXBlLCBjb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgREVMRUdBVEVfWlMgPSB7XG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBvbkhhc1Rhc2s6IChkZWxlZ2F0ZSwgXywgdGFyZ2V0LCBoYXNUYXNrU3RhdGUpID0+IGRlbGVnYXRlLmhhc1Rhc2sodGFyZ2V0LCBoYXNUYXNrU3RhdGUpLFxuICAgICAgICBvblNjaGVkdWxlVGFzazogKGRlbGVnYXRlLCBfLCB0YXJnZXQsIHRhc2spID0+IGRlbGVnYXRlLnNjaGVkdWxlVGFzayh0YXJnZXQsIHRhc2spLFxuICAgICAgICBvbkludm9rZVRhc2s6IChkZWxlZ2F0ZSwgXywgdGFyZ2V0LCB0YXNrLCBhcHBseVRoaXMsIGFwcGx5QXJncykgPT4gZGVsZWdhdGUuaW52b2tlVGFzayh0YXJnZXQsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKSxcbiAgICAgICAgb25DYW5jZWxUYXNrOiAoZGVsZWdhdGUsIF8sIHRhcmdldCwgdGFzaykgPT4gZGVsZWdhdGUuY2FuY2VsVGFzayh0YXJnZXQsIHRhc2spXG4gICAgfTtcbiAgICBjbGFzcyBfWm9uZURlbGVnYXRlIHtcbiAgICAgICAgY29uc3RydWN0b3Ioem9uZSwgcGFyZW50RGVsZWdhdGUsIHpvbmVTcGVjKSB7XG4gICAgICAgICAgICB0aGlzLl90YXNrQ291bnRzID0geyAnbWljcm9UYXNrJzogMCwgJ21hY3JvVGFzayc6IDAsICdldmVudFRhc2snOiAwIH07XG4gICAgICAgICAgICB0aGlzLnpvbmUgPSB6b25lO1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50RGVsZWdhdGUgPSBwYXJlbnREZWxlZ2F0ZTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmtaUyA9IHpvbmVTcGVjICYmICh6b25lU3BlYyAmJiB6b25lU3BlYy5vbkZvcmsgPyB6b25lU3BlYyA6IHBhcmVudERlbGVnYXRlLl9mb3JrWlMpO1xuICAgICAgICAgICAgdGhpcy5fZm9ya0RsZ3QgPSB6b25lU3BlYyAmJiAoem9uZVNwZWMub25Gb3JrID8gcGFyZW50RGVsZWdhdGUgOiBwYXJlbnREZWxlZ2F0ZS5fZm9ya0RsZ3QpO1xuICAgICAgICAgICAgdGhpcy5fZm9ya0N1cnJab25lID0gem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uRm9yayA/IHRoaXMuem9uZSA6IHBhcmVudERlbGVnYXRlLl9mb3JrQ3VyclpvbmUpO1xuICAgICAgICAgICAgdGhpcy5faW50ZXJjZXB0WlMgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludGVyY2VwdCA/IHpvbmVTcGVjIDogcGFyZW50RGVsZWdhdGUuX2ludGVyY2VwdFpTKTtcbiAgICAgICAgICAgIHRoaXMuX2ludGVyY2VwdERsZ3QgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludGVyY2VwdCA/IHBhcmVudERlbGVnYXRlIDogcGFyZW50RGVsZWdhdGUuX2ludGVyY2VwdERsZ3QpO1xuICAgICAgICAgICAgdGhpcy5faW50ZXJjZXB0Q3VyclpvbmUgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludGVyY2VwdCA/IHRoaXMuem9uZSA6IHBhcmVudERlbGVnYXRlLl9pbnRlcmNlcHRDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2VaUyA9IHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludm9rZSA/IHpvbmVTcGVjIDogcGFyZW50RGVsZWdhdGUuX2ludm9rZVpTKTtcbiAgICAgICAgICAgIHRoaXMuX2ludm9rZURsZ3QgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludm9rZSA/IHBhcmVudERlbGVnYXRlIDogcGFyZW50RGVsZWdhdGUuX2ludm9rZURsZ3QpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlQ3VyclpvbmUgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludm9rZSA/IHRoaXMuem9uZSA6IHBhcmVudERlbGVnYXRlLl9pbnZva2VDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvclpTID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25IYW5kbGVFcnJvciA/IHpvbmVTcGVjIDogcGFyZW50RGVsZWdhdGUuX2hhbmRsZUVycm9yWlMpO1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3JEbGd0ID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25IYW5kbGVFcnJvciA/IHBhcmVudERlbGVnYXRlIDogcGFyZW50RGVsZWdhdGUuX2hhbmRsZUVycm9yRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvckN1cnJab25lID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25IYW5kbGVFcnJvciA/IHRoaXMuem9uZSA6IHBhcmVudERlbGVnYXRlLl9oYW5kbGVFcnJvckN1cnJab25lKTtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlVGFza1pTID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25TY2hlZHVsZVRhc2sgPyB6b25lU3BlYyA6IHBhcmVudERlbGVnYXRlLl9zY2hlZHVsZVRhc2taUyk7XG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZVRhc2tEbGd0ID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25TY2hlZHVsZVRhc2sgPyBwYXJlbnREZWxlZ2F0ZSA6IHBhcmVudERlbGVnYXRlLl9zY2hlZHVsZVRhc2tEbGd0KTtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlVGFza0N1cnJab25lID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25TY2hlZHVsZVRhc2sgPyB0aGlzLnpvbmUgOiBwYXJlbnREZWxlZ2F0ZS5fc2NoZWR1bGVUYXNrQ3VyclpvbmUpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlVGFza1pTID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25JbnZva2VUYXNrID8gem9uZVNwZWMgOiBwYXJlbnREZWxlZ2F0ZS5faW52b2tlVGFza1pTKTtcbiAgICAgICAgICAgIHRoaXMuX2ludm9rZVRhc2tEbGd0ID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25JbnZva2VUYXNrID8gcGFyZW50RGVsZWdhdGUgOiBwYXJlbnREZWxlZ2F0ZS5faW52b2tlVGFza0RsZ3QpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlVGFza0N1cnJab25lID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25JbnZva2VUYXNrID8gdGhpcy56b25lIDogcGFyZW50RGVsZWdhdGUuX2ludm9rZVRhc2tDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxUYXNrWlMgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkNhbmNlbFRhc2sgPyB6b25lU3BlYyA6IHBhcmVudERlbGVnYXRlLl9jYW5jZWxUYXNrWlMpO1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsVGFza0RsZ3QgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkNhbmNlbFRhc2sgPyBwYXJlbnREZWxlZ2F0ZSA6IHBhcmVudERlbGVnYXRlLl9jYW5jZWxUYXNrRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxUYXNrQ3VyclpvbmUgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkNhbmNlbFRhc2sgPyB0aGlzLnpvbmUgOiBwYXJlbnREZWxlZ2F0ZS5fY2FuY2VsVGFza0N1cnJab25lKTtcbiAgICAgICAgICAgIHRoaXMuX2hhc1Rhc2taUyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9oYXNUYXNrRGxndCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9oYXNUYXNrRGxndE93bmVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2hhc1Rhc2tDdXJyWm9uZSA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCB6b25lU3BlY0hhc1Rhc2sgPSB6b25lU3BlYyAmJiB6b25lU3BlYy5vbkhhc1Rhc2s7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRIYXNUYXNrID0gcGFyZW50RGVsZWdhdGUgJiYgcGFyZW50RGVsZWdhdGUuX2hhc1Rhc2taUztcbiAgICAgICAgICAgIGlmICh6b25lU3BlY0hhc1Rhc2sgfHwgcGFyZW50SGFzVGFzaykge1xuICAgICAgICAgICAgICAgIC8vIElmIHdlIG5lZWQgdG8gcmVwb3J0IGhhc1Rhc2ssIHRoYW4gdGhpcyBaUyBuZWVkcyB0byBkbyByZWYgY291bnRpbmcgb24gdGFza3MuIEluIHN1Y2hcbiAgICAgICAgICAgICAgICAvLyBhIGNhc2UgYWxsIHRhc2sgcmVsYXRlZCBpbnRlcmNlcHRvcnMgbXVzdCBnbyB0aHJvdWdoIHRoaXMgWkQuIFdlIGNhbid0IHNob3J0IGNpcmN1aXQgaXQuXG4gICAgICAgICAgICAgICAgdGhpcy5faGFzVGFza1pTID0gem9uZVNwZWNIYXNUYXNrID8gem9uZVNwZWMgOiBERUxFR0FURV9aUztcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNUYXNrRGxndCA9IHBhcmVudERlbGVnYXRlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhc1Rhc2tEbGd0T3duZXIgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhc1Rhc2tDdXJyWm9uZSA9IHpvbmU7XG4gICAgICAgICAgICAgICAgaWYgKCF6b25lU3BlYy5vblNjaGVkdWxlVGFzaykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2hlZHVsZVRhc2taUyA9IERFTEVHQVRFX1pTO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2hlZHVsZVRhc2tEbGd0ID0gcGFyZW50RGVsZWdhdGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlVGFza0N1cnJab25lID0gdGhpcy56b25lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXpvbmVTcGVjLm9uSW52b2tlVGFzaykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrWlMgPSBERUxFR0FURV9aUztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW52b2tlVGFza0RsZ3QgPSBwYXJlbnREZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW52b2tlVGFza0N1cnJab25lID0gdGhpcy56b25lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXpvbmVTcGVjLm9uQ2FuY2VsVGFzaykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYW5jZWxUYXNrWlMgPSBERUxFR0FURV9aUztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FuY2VsVGFza0RsZ3QgPSBwYXJlbnREZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FuY2VsVGFza0N1cnJab25lID0gdGhpcy56b25lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3JrKHRhcmdldFpvbmUsIHpvbmVTcGVjKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9ya1pTID8gdGhpcy5fZm9ya1pTLm9uRm9yayh0aGlzLl9mb3JrRGxndCwgdGhpcy56b25lLCB0YXJnZXRab25lLCB6b25lU3BlYykgOlxuICAgICAgICAgICAgICAgIG5ldyBab25lKHRhcmdldFpvbmUsIHpvbmVTcGVjKTtcbiAgICAgICAgfVxuICAgICAgICBpbnRlcmNlcHQodGFyZ2V0Wm9uZSwgY2FsbGJhY2ssIHNvdXJjZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ludGVyY2VwdFpTID9cbiAgICAgICAgICAgICAgICB0aGlzLl9pbnRlcmNlcHRaUy5vbkludGVyY2VwdCh0aGlzLl9pbnRlcmNlcHREbGd0LCB0aGlzLl9pbnRlcmNlcHRDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgY2FsbGJhY2ssIHNvdXJjZSkgOlxuICAgICAgICAgICAgICAgIGNhbGxiYWNrO1xuICAgICAgICB9XG4gICAgICAgIGludm9rZSh0YXJnZXRab25lLCBjYWxsYmFjaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MsIHNvdXJjZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZVpTID8gdGhpcy5faW52b2tlWlMub25JbnZva2UodGhpcy5faW52b2tlRGxndCwgdGhpcy5faW52b2tlQ3VyclpvbmUsIHRhcmdldFpvbmUsIGNhbGxiYWNrLCBhcHBseVRoaXMsIGFwcGx5QXJncywgc291cmNlKSA6XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoYXBwbHlUaGlzLCBhcHBseUFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGhhbmRsZUVycm9yKHRhcmdldFpvbmUsIGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlRXJyb3JaUyA/XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3JaUy5vbkhhbmRsZUVycm9yKHRoaXMuX2hhbmRsZUVycm9yRGxndCwgdGhpcy5faGFuZGxlRXJyb3JDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgZXJyb3IpIDpcbiAgICAgICAgICAgICAgICB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHNjaGVkdWxlVGFzayh0YXJnZXRab25lLCB0YXNrKSB7XG4gICAgICAgICAgICBsZXQgcmV0dXJuVGFzayA9IHRhc2s7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2NoZWR1bGVUYXNrWlMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faGFzVGFza1pTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblRhc2suX3pvbmVEZWxlZ2F0ZXMucHVzaCh0aGlzLl9oYXNUYXNrRGxndE93bmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY2xhbmctZm9ybWF0IG9mZlxuICAgICAgICAgICAgICAgIHJldHVyblRhc2sgPSB0aGlzLl9zY2hlZHVsZVRhc2taUy5vblNjaGVkdWxlVGFzayh0aGlzLl9zY2hlZHVsZVRhc2tEbGd0LCB0aGlzLl9zY2hlZHVsZVRhc2tDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgdGFzayk7XG4gICAgICAgICAgICAgICAgLy8gY2xhbmctZm9ybWF0IG9uXG4gICAgICAgICAgICAgICAgaWYgKCFyZXR1cm5UYXNrKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5UYXNrID0gdGFzaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0YXNrLnNjaGVkdWxlRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5zY2hlZHVsZUZuKHRhc2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0YXNrLnR5cGUgPT0gbWljcm9UYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlTWljcm9UYXNrKHRhc2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYXNrIGlzIG1pc3Npbmcgc2NoZWR1bGVGbi4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0dXJuVGFzaztcbiAgICAgICAgfVxuICAgICAgICBpbnZva2VUYXNrKHRhcmdldFpvbmUsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlVGFza1pTID9cbiAgICAgICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrWlMub25JbnZva2VUYXNrKHRoaXMuX2ludm9rZVRhc2tEbGd0LCB0aGlzLl9pbnZva2VUYXNrQ3VyclpvbmUsIHRhcmdldFpvbmUsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKSA6XG4gICAgICAgICAgICAgICAgdGFzay5jYWxsYmFjay5hcHBseShhcHBseVRoaXMsIGFwcGx5QXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgY2FuY2VsVGFzayh0YXJnZXRab25lLCB0YXNrKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgICAgICBpZiAodGhpcy5fY2FuY2VsVGFza1pTKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9jYW5jZWxUYXNrWlMub25DYW5jZWxUYXNrKHRoaXMuX2NhbmNlbFRhc2tEbGd0LCB0aGlzLl9jYW5jZWxUYXNrQ3VyclpvbmUsIHRhcmdldFpvbmUsIHRhc2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0YXNrLmNhbmNlbEZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCdUYXNrIGlzIG5vdCBjYW5jZWxhYmxlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhbHVlID0gdGFzay5jYW5jZWxGbih0YXNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBoYXNUYXNrKHRhcmdldFpvbmUsIGlzRW1wdHkpIHtcbiAgICAgICAgICAgIC8vIGhhc1Rhc2sgc2hvdWxkIG5vdCB0aHJvdyBlcnJvciBzbyBvdGhlciBab25lRGVsZWdhdGVcbiAgICAgICAgICAgIC8vIGNhbiBzdGlsbCB0cmlnZ2VyIGhhc1Rhc2sgY2FsbGJhY2tcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFzVGFza1pTICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhc1Rhc2taUy5vbkhhc1Rhc2sodGhpcy5faGFzVGFza0RsZ3QsIHRoaXMuX2hhc1Rhc2tDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgaXNFbXB0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFcnJvcih0YXJnZXRab25lLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpyZXF1aXJlLWludGVybmFsLXdpdGgtdW5kZXJzY29yZVxuICAgICAgICBfdXBkYXRlVGFza0NvdW50KHR5cGUsIGNvdW50KSB7XG4gICAgICAgICAgICBjb25zdCBjb3VudHMgPSB0aGlzLl90YXNrQ291bnRzO1xuICAgICAgICAgICAgY29uc3QgcHJldiA9IGNvdW50c1t0eXBlXTtcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSBjb3VudHNbdHlwZV0gPSBwcmV2ICsgY291bnQ7XG4gICAgICAgICAgICBpZiAobmV4dCA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01vcmUgdGFza3MgZXhlY3V0ZWQgdGhlbiB3ZXJlIHNjaGVkdWxlZC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcmV2ID09IDAgfHwgbmV4dCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNFbXB0eSA9IHtcbiAgICAgICAgICAgICAgICAgICAgbWljcm9UYXNrOiBjb3VudHNbJ21pY3JvVGFzayddID4gMCxcbiAgICAgICAgICAgICAgICAgICAgbWFjcm9UYXNrOiBjb3VudHNbJ21hY3JvVGFzayddID4gMCxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUYXNrOiBjb3VudHNbJ2V2ZW50VGFzayddID4gMCxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiB0eXBlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc1Rhc2sodGhpcy56b25lLCBpc0VtcHR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjbGFzcyBab25lVGFzayB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHR5cGUsIHNvdXJjZSwgY2FsbGJhY2ssIG9wdGlvbnMsIHNjaGVkdWxlRm4sIGNhbmNlbEZuKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgICAgICAgICAgIHRoaXMuX3pvbmUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5ydW5Db3VudCA9IDA7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgICAgICAgICAgIHRoaXMuX3pvbmVEZWxlZ2F0ZXMgPSBudWxsO1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnJlcXVpcmUtaW50ZXJuYWwtd2l0aC11bmRlcnNjb3JlXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9ICdub3RTY2hlZHVsZWQnO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gb3B0aW9ucztcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVGbiA9IHNjaGVkdWxlRm47XG4gICAgICAgICAgICB0aGlzLmNhbmNlbEZuID0gY2FuY2VsRm47XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYWxsYmFjayBpcyBub3QgZGVmaW5lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAvLyBUT0RPOiBASmlhTGlQYXNzaW9uIG9wdGlvbnMgc2hvdWxkIGhhdmUgaW50ZXJmYWNlXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gZXZlbnRUYXNrICYmIG9wdGlvbnMgJiYgb3B0aW9ucy51c2VHKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnZva2UgPSBab25lVGFzay5pbnZva2VUYXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnZva2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBab25lVGFzay5pbnZva2VUYXNrLmNhbGwoZ2xvYmFsLCBzZWxmLCB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIGludm9rZVRhc2sodGFzaywgdGFyZ2V0LCBhcmdzKSB7XG4gICAgICAgICAgICBpZiAoIXRhc2spIHtcbiAgICAgICAgICAgICAgICB0YXNrID0gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9udW1iZXJPZk5lc3RlZFRhc2tGcmFtZXMrKztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGFzay5ydW5Db3VudCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrLnpvbmUucnVuVGFzayh0YXNrLCB0YXJnZXQsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgaWYgKF9udW1iZXJPZk5lc3RlZFRhc2tGcmFtZXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkcmFpbk1pY3JvVGFza1F1ZXVlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9udW1iZXJPZk5lc3RlZFRhc2tGcmFtZXMtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBnZXQgem9uZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lO1xuICAgICAgICB9XG4gICAgICAgIGdldCBzdGF0ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBjYW5jZWxTY2hlZHVsZVJlcXVlc3QoKSB7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2l0aW9uVG8obm90U2NoZWR1bGVkLCBzY2hlZHVsaW5nKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgICAgICAgX3RyYW5zaXRpb25Ubyh0b1N0YXRlLCBmcm9tU3RhdGUxLCBmcm9tU3RhdGUyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc3RhdGUgPT09IGZyb21TdGF0ZTEgfHwgdGhpcy5fc3RhdGUgPT09IGZyb21TdGF0ZTIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHRvU3RhdGU7XG4gICAgICAgICAgICAgICAgaWYgKHRvU3RhdGUgPT0gbm90U2NoZWR1bGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3pvbmVEZWxlZ2F0ZXMgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLnR5cGV9ICcke3RoaXMuc291cmNlfSc6IGNhbiBub3QgdHJhbnNpdGlvbiB0byAnJHt0b1N0YXRlfScsIGV4cGVjdGluZyBzdGF0ZSAnJHtmcm9tU3RhdGUxfScke2Zyb21TdGF0ZTIgPyAnIG9yIFxcJycgKyBmcm9tU3RhdGUyICsgJ1xcJycgOiAnJ30sIHdhcyAnJHt0aGlzLl9zdGF0ZX0nLmApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAmJiB0eXBlb2YgdGhpcy5kYXRhLmhhbmRsZUlkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuaGFuZGxlSWQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gYWRkIHRvSlNPTiBtZXRob2QgdG8gcHJldmVudCBjeWNsaWMgZXJyb3Igd2hlblxuICAgICAgICAvLyBjYWxsIEpTT04uc3RyaW5naWZ5KHpvbmVUYXNrKVxuICAgICAgICB0b0pTT04oKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgICAgICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgIHpvbmU6IHRoaXMuem9uZS5uYW1lLFxuICAgICAgICAgICAgICAgIHJ1bkNvdW50OiB0aGlzLnJ1bkNvdW50XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vLyAgTUlDUk9UQVNLIFFVRVVFXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgY29uc3Qgc3ltYm9sU2V0VGltZW91dCA9IF9fc3ltYm9sX18oJ3NldFRpbWVvdXQnKTtcbiAgICBjb25zdCBzeW1ib2xQcm9taXNlID0gX19zeW1ib2xfXygnUHJvbWlzZScpO1xuICAgIGNvbnN0IHN5bWJvbFRoZW4gPSBfX3N5bWJvbF9fKCd0aGVuJyk7XG4gICAgbGV0IF9taWNyb1Rhc2tRdWV1ZSA9IFtdO1xuICAgIGxldCBfaXNEcmFpbmluZ01pY3JvdGFza1F1ZXVlID0gZmFsc2U7XG4gICAgbGV0IG5hdGl2ZU1pY3JvVGFza1F1ZXVlUHJvbWlzZTtcbiAgICBmdW5jdGlvbiBuYXRpdmVTY2hlZHVsZU1pY3JvVGFzayhmdW5jKSB7XG4gICAgICAgIGlmICghbmF0aXZlTWljcm9UYXNrUXVldWVQcm9taXNlKSB7XG4gICAgICAgICAgICBpZiAoZ2xvYmFsW3N5bWJvbFByb21pc2VdKSB7XG4gICAgICAgICAgICAgICAgbmF0aXZlTWljcm9UYXNrUXVldWVQcm9taXNlID0gZ2xvYmFsW3N5bWJvbFByb21pc2VdLnJlc29sdmUoMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hdGl2ZU1pY3JvVGFza1F1ZXVlUHJvbWlzZSkge1xuICAgICAgICAgICAgbGV0IG5hdGl2ZVRoZW4gPSBuYXRpdmVNaWNyb1Rhc2tRdWV1ZVByb21pc2Vbc3ltYm9sVGhlbl07XG4gICAgICAgICAgICBpZiAoIW5hdGl2ZVRoZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBuYXRpdmUgUHJvbWlzZSBpcyBub3QgcGF0Y2hhYmxlLCB3ZSBuZWVkIHRvIHVzZSBgdGhlbmAgZGlyZWN0bHlcbiAgICAgICAgICAgICAgICAvLyBpc3N1ZSAxMDc4XG4gICAgICAgICAgICAgICAgbmF0aXZlVGhlbiA9IG5hdGl2ZU1pY3JvVGFza1F1ZXVlUHJvbWlzZVsndGhlbiddO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmF0aXZlVGhlbi5jYWxsKG5hdGl2ZU1pY3JvVGFza1F1ZXVlUHJvbWlzZSwgZnVuYyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWxbc3ltYm9sU2V0VGltZW91dF0oZnVuYywgMCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc2NoZWR1bGVNaWNyb1Rhc2sodGFzaykge1xuICAgICAgICAvLyBpZiB3ZSBhcmUgbm90IHJ1bm5pbmcgaW4gYW55IHRhc2ssIGFuZCB0aGVyZSBoYXMgbm90IGJlZW4gYW55dGhpbmcgc2NoZWR1bGVkXG4gICAgICAgIC8vIHdlIG11c3QgYm9vdHN0cmFwIHRoZSBpbml0aWFsIHRhc2sgY3JlYXRpb24gYnkgbWFudWFsbHkgc2NoZWR1bGluZyB0aGUgZHJhaW5cbiAgICAgICAgaWYgKF9udW1iZXJPZk5lc3RlZFRhc2tGcmFtZXMgPT09IDAgJiYgX21pY3JvVGFza1F1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gV2UgYXJlIG5vdCBydW5uaW5nIGluIFRhc2ssIHNvIHdlIG5lZWQgdG8ga2lja3N0YXJ0IHRoZSBtaWNyb3Rhc2sgcXVldWUuXG4gICAgICAgICAgICBuYXRpdmVTY2hlZHVsZU1pY3JvVGFzayhkcmFpbk1pY3JvVGFza1F1ZXVlKTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrICYmIF9taWNyb1Rhc2tRdWV1ZS5wdXNoKHRhc2spO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkcmFpbk1pY3JvVGFza1F1ZXVlKCkge1xuICAgICAgICBpZiAoIV9pc0RyYWluaW5nTWljcm90YXNrUXVldWUpIHtcbiAgICAgICAgICAgIF9pc0RyYWluaW5nTWljcm90YXNrUXVldWUgPSB0cnVlO1xuICAgICAgICAgICAgd2hpbGUgKF9taWNyb1Rhc2tRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBxdWV1ZSA9IF9taWNyb1Rhc2tRdWV1ZTtcbiAgICAgICAgICAgICAgICBfbWljcm9UYXNrUXVldWUgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSBxdWV1ZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suem9uZS5ydW5UYXNrKHRhc2ssIG51bGwsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2FwaS5vblVuaGFuZGxlZEVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9hcGkubWljcm90YXNrRHJhaW5Eb25lKCk7XG4gICAgICAgICAgICBfaXNEcmFpbmluZ01pY3JvdGFza1F1ZXVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8vICBCT09UU1RSQVBcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBjb25zdCBOT19aT05FID0ge1xuICAgICAgICBuYW1lOiAnTk8gWk9ORSdcbiAgICB9O1xuICAgIGNvbnN0IG5vdFNjaGVkdWxlZCA9ICdub3RTY2hlZHVsZWQnLCBzY2hlZHVsaW5nID0gJ3NjaGVkdWxpbmcnLCBzY2hlZHVsZWQgPSAnc2NoZWR1bGVkJywgcnVubmluZyA9ICdydW5uaW5nJywgY2FuY2VsaW5nID0gJ2NhbmNlbGluZycsIHVua25vd24gPSAndW5rbm93bic7XG4gICAgY29uc3QgbWljcm9UYXNrID0gJ21pY3JvVGFzaycsIG1hY3JvVGFzayA9ICdtYWNyb1Rhc2snLCBldmVudFRhc2sgPSAnZXZlbnRUYXNrJztcbiAgICBjb25zdCBwYXRjaGVzID0ge307XG4gICAgY29uc3QgX2FwaSA9IHtcbiAgICAgICAgc3ltYm9sOiBfX3N5bWJvbF9fLFxuICAgICAgICBjdXJyZW50Wm9uZUZyYW1lOiAoKSA9PiBfY3VycmVudFpvbmVGcmFtZSxcbiAgICAgICAgb25VbmhhbmRsZWRFcnJvcjogbm9vcCxcbiAgICAgICAgbWljcm90YXNrRHJhaW5Eb25lOiBub29wLFxuICAgICAgICBzY2hlZHVsZU1pY3JvVGFzazogc2NoZWR1bGVNaWNyb1Rhc2ssXG4gICAgICAgIHNob3dVbmNhdWdodEVycm9yOiAoKSA9PiAhWm9uZVtfX3N5bWJvbF9fKCdpZ25vcmVDb25zb2xlRXJyb3JVbmNhdWdodEVycm9yJyldLFxuICAgICAgICBwYXRjaEV2ZW50VGFyZ2V0OiAoKSA9PiBbXSxcbiAgICAgICAgcGF0Y2hPblByb3BlcnRpZXM6IG5vb3AsXG4gICAgICAgIHBhdGNoTWV0aG9kOiAoKSA9PiBub29wLFxuICAgICAgICBiaW5kQXJndW1lbnRzOiAoKSA9PiBbXSxcbiAgICAgICAgcGF0Y2hUaGVuOiAoKSA9PiBub29wLFxuICAgICAgICBwYXRjaE1hY3JvVGFzazogKCkgPT4gbm9vcCxcbiAgICAgICAgcGF0Y2hFdmVudFByb3RvdHlwZTogKCkgPT4gbm9vcCxcbiAgICAgICAgaXNJRU9yRWRnZTogKCkgPT4gZmFsc2UsXG4gICAgICAgIGdldEdsb2JhbE9iamVjdHM6ICgpID0+IHVuZGVmaW5lZCxcbiAgICAgICAgT2JqZWN0RGVmaW5lUHJvcGVydHk6ICgpID0+IG5vb3AsXG4gICAgICAgIE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcjogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgICBPYmplY3RDcmVhdGU6ICgpID0+IHVuZGVmaW5lZCxcbiAgICAgICAgQXJyYXlTbGljZTogKCkgPT4gW10sXG4gICAgICAgIHBhdGNoQ2xhc3M6ICgpID0+IG5vb3AsXG4gICAgICAgIHdyYXBXaXRoQ3VycmVudFpvbmU6ICgpID0+IG5vb3AsXG4gICAgICAgIGZpbHRlclByb3BlcnRpZXM6ICgpID0+IFtdLFxuICAgICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQ6ICgpID0+IG5vb3AsXG4gICAgICAgIF9yZWRlZmluZVByb3BlcnR5OiAoKSA9PiBub29wLFxuICAgICAgICBwYXRjaENhbGxiYWNrczogKCkgPT4gbm9vcCxcbiAgICAgICAgbmF0aXZlU2NoZWR1bGVNaWNyb1Rhc2s6IG5hdGl2ZVNjaGVkdWxlTWljcm9UYXNrXG4gICAgfTtcbiAgICBsZXQgX2N1cnJlbnRab25lRnJhbWUgPSB7IHBhcmVudDogbnVsbCwgem9uZTogbmV3IFpvbmUobnVsbCwgbnVsbCkgfTtcbiAgICBsZXQgX2N1cnJlbnRUYXNrID0gbnVsbDtcbiAgICBsZXQgX251bWJlck9mTmVzdGVkVGFza0ZyYW1lcyA9IDA7XG4gICAgZnVuY3Rpb24gbm9vcCgpIHsgfVxuICAgIHBlcmZvcm1hbmNlTWVhc3VyZSgnWm9uZScsICdab25lJyk7XG4gICAgcmV0dXJuIGdsb2JhbFsnWm9uZSddID0gWm9uZTtcbn0pKGdsb2JhbFRoaXMpO1xuXG4vKipcbiAqIFN1cHByZXNzIGNsb3N1cmUgY29tcGlsZXIgZXJyb3JzIGFib3V0IHVua25vd24gJ1pvbmUnIHZhcmlhYmxlXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBAc3VwcHJlc3Mge3VuZGVmaW5lZFZhcnMsZ2xvYmFsVGhpcyxtaXNzaW5nUmVxdWlyZX1cbiAqL1xuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJub2RlXCIvPlxuLy8gaXNzdWUgIzk4OSwgdG8gcmVkdWNlIGJ1bmRsZSBzaXplLCB1c2Ugc2hvcnQgbmFtZVxuLyoqIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgKi9cbmNvbnN0IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4vKiogT2JqZWN0LmRlZmluZVByb3BlcnR5ICovXG5jb25zdCBPYmplY3REZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbi8qKiBPYmplY3QuZ2V0UHJvdG90eXBlT2YgKi9cbmNvbnN0IE9iamVjdEdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuLyoqIE9iamVjdC5jcmVhdGUgKi9cbmNvbnN0IE9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG4vKiogQXJyYXkucHJvdG90eXBlLnNsaWNlICovXG5jb25zdCBBcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuLyoqIGFkZEV2ZW50TGlzdGVuZXIgc3RyaW5nIGNvbnN0ICovXG5jb25zdCBBRERfRVZFTlRfTElTVEVORVJfU1RSID0gJ2FkZEV2ZW50TGlzdGVuZXInO1xuLyoqIHJlbW92ZUV2ZW50TGlzdGVuZXIgc3RyaW5nIGNvbnN0ICovXG5jb25zdCBSRU1PVkVfRVZFTlRfTElTVEVORVJfU1RSID0gJ3JlbW92ZUV2ZW50TGlzdGVuZXInO1xuLyoqIHpvbmVTeW1ib2wgYWRkRXZlbnRMaXN0ZW5lciAqL1xuY29uc3QgWk9ORV9TWU1CT0xfQUREX0VWRU5UX0xJU1RFTkVSID0gWm9uZS5fX3N5bWJvbF9fKEFERF9FVkVOVF9MSVNURU5FUl9TVFIpO1xuLyoqIHpvbmVTeW1ib2wgcmVtb3ZlRXZlbnRMaXN0ZW5lciAqL1xuY29uc3QgWk9ORV9TWU1CT0xfUkVNT1ZFX0VWRU5UX0xJU1RFTkVSID0gWm9uZS5fX3N5bWJvbF9fKFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIpO1xuLyoqIHRydWUgc3RyaW5nIGNvbnN0ICovXG5jb25zdCBUUlVFX1NUUiA9ICd0cnVlJztcbi8qKiBmYWxzZSBzdHJpbmcgY29uc3QgKi9cbmNvbnN0IEZBTFNFX1NUUiA9ICdmYWxzZSc7XG4vKiogWm9uZSBzeW1ib2wgcHJlZml4IHN0cmluZyBjb25zdC4gKi9cbmNvbnN0IFpPTkVfU1lNQk9MX1BSRUZJWCA9IFpvbmUuX19zeW1ib2xfXygnJyk7XG5mdW5jdGlvbiB3cmFwV2l0aEN1cnJlbnRab25lKGNhbGxiYWNrLCBzb3VyY2UpIHtcbiAgICByZXR1cm4gWm9uZS5jdXJyZW50LndyYXAoY2FsbGJhY2ssIHNvdXJjZSk7XG59XG5mdW5jdGlvbiBzY2hlZHVsZU1hY3JvVGFza1dpdGhDdXJyZW50Wm9uZShzb3VyY2UsIGNhbGxiYWNrLCBkYXRhLCBjdXN0b21TY2hlZHVsZSwgY3VzdG9tQ2FuY2VsKSB7XG4gICAgcmV0dXJuIFpvbmUuY3VycmVudC5zY2hlZHVsZU1hY3JvVGFzayhzb3VyY2UsIGNhbGxiYWNrLCBkYXRhLCBjdXN0b21TY2hlZHVsZSwgY3VzdG9tQ2FuY2VsKTtcbn1cbmNvbnN0IHpvbmVTeW1ib2wgPSBab25lLl9fc3ltYm9sX187XG5jb25zdCBpc1dpbmRvd0V4aXN0cyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xuY29uc3QgaW50ZXJuYWxXaW5kb3cgPSBpc1dpbmRvd0V4aXN0cyA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcbmNvbnN0IF9nbG9iYWwgPSBpc1dpbmRvd0V4aXN0cyAmJiBpbnRlcm5hbFdpbmRvdyB8fCBnbG9iYWxUaGlzO1xuY29uc3QgUkVNT1ZFX0FUVFJJQlVURSA9ICdyZW1vdmVBdHRyaWJ1dGUnO1xuZnVuY3Rpb24gYmluZEFyZ3VtZW50cyhhcmdzLCBzb3VyY2UpIHtcbiAgICBmb3IgKGxldCBpID0gYXJncy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAodHlwZW9mIGFyZ3NbaV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGFyZ3NbaV0gPSB3cmFwV2l0aEN1cnJlbnRab25lKGFyZ3NbaV0sIHNvdXJjZSArICdfJyArIGkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcmdzO1xufVxuZnVuY3Rpb24gcGF0Y2hQcm90b3R5cGUocHJvdG90eXBlLCBmbk5hbWVzKSB7XG4gICAgY29uc3Qgc291cmNlID0gcHJvdG90eXBlLmNvbnN0cnVjdG9yWyduYW1lJ107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmbk5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBmbk5hbWVzW2ldO1xuICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IHByb3RvdHlwZVtuYW1lXTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgICBjb25zdCBwcm90b3R5cGVEZXNjID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG4gICAgICAgICAgICBpZiAoIWlzUHJvcGVydHlXcml0YWJsZShwcm90b3R5cGVEZXNjKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvdG90eXBlW25hbWVdID0gKChkZWxlZ2F0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGNoZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseSh0aGlzLCBiaW5kQXJndW1lbnRzKGFyZ3VtZW50cywgc291cmNlICsgJy4nICsgbmFtZSkpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHBhdGNoZWQsIGRlbGVnYXRlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0Y2hlZDtcbiAgICAgICAgICAgIH0pKGRlbGVnYXRlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGlzUHJvcGVydHlXcml0YWJsZShwcm9wZXJ0eURlc2MpIHtcbiAgICBpZiAoIXByb3BlcnR5RGVzYykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHByb3BlcnR5RGVzYy53cml0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gISh0eXBlb2YgcHJvcGVydHlEZXNjLmdldCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgcHJvcGVydHlEZXNjLnNldCA9PT0gJ3VuZGVmaW5lZCcpO1xufVxuY29uc3QgaXNXZWJXb3JrZXIgPSAodHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUpO1xuLy8gTWFrZSBzdXJlIHRvIGFjY2VzcyBgcHJvY2Vzc2AgdGhyb3VnaCBgX2dsb2JhbGAgc28gdGhhdCBXZWJQYWNrIGRvZXMgbm90IGFjY2lkZW50YWxseSBicm93c2VyaWZ5XG4vLyB0aGlzIGNvZGUuXG5jb25zdCBpc05vZGUgPSAoISgnbncnIGluIF9nbG9iYWwpICYmIHR5cGVvZiBfZ2xvYmFsLnByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmXG4gICAge30udG9TdHJpbmcuY2FsbChfZ2xvYmFsLnByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpO1xuY29uc3QgaXNCcm93c2VyID0gIWlzTm9kZSAmJiAhaXNXZWJXb3JrZXIgJiYgISEoaXNXaW5kb3dFeGlzdHMgJiYgaW50ZXJuYWxXaW5kb3dbJ0hUTUxFbGVtZW50J10pO1xuLy8gd2UgYXJlIGluIGVsZWN0cm9uIG9mIG53LCBzbyB3ZSBhcmUgYm90aCBicm93c2VyIGFuZCBub2RlanNcbi8vIE1ha2Ugc3VyZSB0byBhY2Nlc3MgYHByb2Nlc3NgIHRocm91Z2ggYF9nbG9iYWxgIHNvIHRoYXQgV2ViUGFjayBkb2VzIG5vdCBhY2NpZGVudGFsbHkgYnJvd3NlcmlmeVxuLy8gdGhpcyBjb2RlLlxuY29uc3QgaXNNaXggPSB0eXBlb2YgX2dsb2JhbC5wcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHt9LnRvU3RyaW5nLmNhbGwoX2dsb2JhbC5wcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nICYmICFpc1dlYldvcmtlciAmJlxuICAgICEhKGlzV2luZG93RXhpc3RzICYmIGludGVybmFsV2luZG93WydIVE1MRWxlbWVudCddKTtcbmNvbnN0IHpvbmVTeW1ib2xFdmVudE5hbWVzJDEgPSB7fTtcbmNvbnN0IHdyYXBGbiA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzkxMSwgaW4gSUUsIHNvbWV0aW1lc1xuICAgIC8vIGV2ZW50IHdpbGwgYmUgdW5kZWZpbmVkLCBzbyB3ZSBuZWVkIHRvIHVzZSB3aW5kb3cuZXZlbnRcbiAgICBldmVudCA9IGV2ZW50IHx8IF9nbG9iYWwuZXZlbnQ7XG4gICAgaWYgKCFldmVudCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBldmVudE5hbWVTeW1ib2wgPSB6b25lU3ltYm9sRXZlbnROYW1lcyQxW2V2ZW50LnR5cGVdO1xuICAgIGlmICghZXZlbnROYW1lU3ltYm9sKSB7XG4gICAgICAgIGV2ZW50TmFtZVN5bWJvbCA9IHpvbmVTeW1ib2xFdmVudE5hbWVzJDFbZXZlbnQudHlwZV0gPSB6b25lU3ltYm9sKCdPTl9QUk9QRVJUWScgKyBldmVudC50eXBlKTtcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcyB8fCBldmVudC50YXJnZXQgfHwgX2dsb2JhbDtcbiAgICBjb25zdCBsaXN0ZW5lciA9IHRhcmdldFtldmVudE5hbWVTeW1ib2xdO1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKGlzQnJvd3NlciAmJiB0YXJnZXQgPT09IGludGVybmFsV2luZG93ICYmIGV2ZW50LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgLy8gd2luZG93Lm9uZXJyb3IgaGF2ZSBkaWZmZXJlbnQgc2lnbmF0dXJlXG4gICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9HbG9iYWxFdmVudEhhbmRsZXJzL29uZXJyb3Ijd2luZG93Lm9uZXJyb3JcbiAgICAgICAgLy8gYW5kIG9uZXJyb3IgY2FsbGJhY2sgd2lsbCBwcmV2ZW50IGRlZmF1bHQgd2hlbiBjYWxsYmFjayByZXR1cm4gdHJ1ZVxuICAgICAgICBjb25zdCBlcnJvckV2ZW50ID0gZXZlbnQ7XG4gICAgICAgIHJlc3VsdCA9IGxpc3RlbmVyICYmXG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIGVycm9yRXZlbnQubWVzc2FnZSwgZXJyb3JFdmVudC5maWxlbmFtZSwgZXJyb3JFdmVudC5saW5lbm8sIGVycm9yRXZlbnQuY29sbm8sIGVycm9yRXZlbnQuZXJyb3IpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBsaXN0ZW5lciAmJiBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBpZiAocmVzdWx0ICE9IHVuZGVmaW5lZCAmJiAhcmVzdWx0KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuZnVuY3Rpb24gcGF0Y2hQcm9wZXJ0eShvYmosIHByb3AsIHByb3RvdHlwZSkge1xuICAgIGxldCBkZXNjID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcCk7XG4gICAgaWYgKCFkZXNjICYmIHByb3RvdHlwZSkge1xuICAgICAgICAvLyB3aGVuIHBhdGNoIHdpbmRvdyBvYmplY3QsIHVzZSBwcm90b3R5cGUgdG8gY2hlY2sgcHJvcCBleGlzdCBvciBub3RcbiAgICAgICAgY29uc3QgcHJvdG90eXBlRGVzYyA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIHByb3ApO1xuICAgICAgICBpZiAocHJvdG90eXBlRGVzYykge1xuICAgICAgICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gaWYgdGhlIGRlc2NyaXB0b3Igbm90IGV4aXN0cyBvciBpcyBub3QgY29uZmlndXJhYmxlXG4gICAgLy8ganVzdCByZXR1cm5cbiAgICBpZiAoIWRlc2MgfHwgIWRlc2MuY29uZmlndXJhYmxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgb25Qcm9wUGF0Y2hlZFN5bWJvbCA9IHpvbmVTeW1ib2woJ29uJyArIHByb3AgKyAncGF0Y2hlZCcpO1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkob25Qcm9wUGF0Y2hlZFN5bWJvbCkgJiYgb2JqW29uUHJvcFBhdGNoZWRTeW1ib2xdKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gQSBwcm9wZXJ0eSBkZXNjcmlwdG9yIGNhbm5vdCBoYXZlIGdldHRlci9zZXR0ZXIgYW5kIGJlIHdyaXRhYmxlXG4gICAgLy8gZGVsZXRpbmcgdGhlIHdyaXRhYmxlIGFuZCB2YWx1ZSBwcm9wZXJ0aWVzIGF2b2lkcyB0aGlzIGVycm9yOlxuICAgIC8vXG4gICAgLy8gVHlwZUVycm9yOiBwcm9wZXJ0eSBkZXNjcmlwdG9ycyBtdXN0IG5vdCBzcGVjaWZ5IGEgdmFsdWUgb3IgYmUgd3JpdGFibGUgd2hlbiBhXG4gICAgLy8gZ2V0dGVyIG9yIHNldHRlciBoYXMgYmVlbiBzcGVjaWZpZWRcbiAgICBkZWxldGUgZGVzYy53cml0YWJsZTtcbiAgICBkZWxldGUgZGVzYy52YWx1ZTtcbiAgICBjb25zdCBvcmlnaW5hbERlc2NHZXQgPSBkZXNjLmdldDtcbiAgICBjb25zdCBvcmlnaW5hbERlc2NTZXQgPSBkZXNjLnNldDtcbiAgICAvLyBzbGljZSgyKSBjdXogJ29uY2xpY2snIC0+ICdjbGljaycsIGV0Y1xuICAgIGNvbnN0IGV2ZW50TmFtZSA9IHByb3Auc2xpY2UoMik7XG4gICAgbGV0IGV2ZW50TmFtZVN5bWJvbCA9IHpvbmVTeW1ib2xFdmVudE5hbWVzJDFbZXZlbnROYW1lXTtcbiAgICBpZiAoIWV2ZW50TmFtZVN5bWJvbCkge1xuICAgICAgICBldmVudE5hbWVTeW1ib2wgPSB6b25lU3ltYm9sRXZlbnROYW1lcyQxW2V2ZW50TmFtZV0gPSB6b25lU3ltYm9sKCdPTl9QUk9QRVJUWScgKyBldmVudE5hbWUpO1xuICAgIH1cbiAgICBkZXNjLnNldCA9IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAvLyBpbiBzb21lIG9mIHdpbmRvd3MncyBvbnByb3BlcnR5IGNhbGxiYWNrLCB0aGlzIGlzIHVuZGVmaW5lZFxuICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIGNoZWNrIGl0XG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzO1xuICAgICAgICBpZiAoIXRhcmdldCAmJiBvYmogPT09IF9nbG9iYWwpIHtcbiAgICAgICAgICAgIHRhcmdldCA9IF9nbG9iYWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gdGFyZ2V0W2V2ZW50TmFtZVN5bWJvbF07XG4gICAgICAgIGlmICh0eXBlb2YgcHJldmlvdXNWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB3cmFwRm4pO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlzc3VlICM5NzgsIHdoZW4gb25sb2FkIGhhbmRsZXIgd2FzIGFkZGVkIGJlZm9yZSBsb2FkaW5nIHpvbmUuanNcbiAgICAgICAgLy8gd2Ugc2hvdWxkIHJlbW92ZSBpdCB3aXRoIG9yaWdpbmFsRGVzY1NldFxuICAgICAgICBvcmlnaW5hbERlc2NTZXQgJiYgb3JpZ2luYWxEZXNjU2V0LmNhbGwodGFyZ2V0LCBudWxsKTtcbiAgICAgICAgdGFyZ2V0W2V2ZW50TmFtZVN5bWJvbF0gPSBuZXdWYWx1ZTtcbiAgICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB3cmFwRm4sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gVGhlIGdldHRlciB3b3VsZCByZXR1cm4gdW5kZWZpbmVkIGZvciB1bmFzc2lnbmVkIHByb3BlcnRpZXMgYnV0IHRoZSBkZWZhdWx0IHZhbHVlIG9mIGFuXG4gICAgLy8gdW5hc3NpZ25lZCBwcm9wZXJ0eSBpcyBudWxsXG4gICAgZGVzYy5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGluIHNvbWUgb2Ygd2luZG93cydzIG9ucHJvcGVydHkgY2FsbGJhY2ssIHRoaXMgaXMgdW5kZWZpbmVkXG4gICAgICAgIC8vIHNvIHdlIG5lZWQgdG8gY2hlY2sgaXRcbiAgICAgICAgbGV0IHRhcmdldCA9IHRoaXM7XG4gICAgICAgIGlmICghdGFyZ2V0ICYmIG9iaiA9PT0gX2dsb2JhbCkge1xuICAgICAgICAgICAgdGFyZ2V0ID0gX2dsb2JhbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSB0YXJnZXRbZXZlbnROYW1lU3ltYm9sXTtcbiAgICAgICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3JpZ2luYWxEZXNjR2V0KSB7XG4gICAgICAgICAgICAvLyByZXN1bHQgd2lsbCBiZSBudWxsIHdoZW4gdXNlIGlubGluZSBldmVudCBhdHRyaWJ1dGUsXG4gICAgICAgICAgICAvLyBzdWNoIGFzIDxidXR0b24gb25jbGljaz1cImZ1bmMoKTtcIj5PSzwvYnV0dG9uPlxuICAgICAgICAgICAgLy8gYmVjYXVzZSB0aGUgb25jbGljayBmdW5jdGlvbiBpcyBpbnRlcm5hbCByYXcgdW5jb21waWxlZCBoYW5kbGVyXG4gICAgICAgICAgICAvLyB0aGUgb25jbGljayB3aWxsIGJlIGV2YWx1YXRlZCB3aGVuIGZpcnN0IHRpbWUgZXZlbnQgd2FzIHRyaWdnZXJlZCBvclxuICAgICAgICAgICAgLy8gdGhlIHByb3BlcnR5IGlzIGFjY2Vzc2VkLCBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy81MjVcbiAgICAgICAgICAgIC8vIHNvIHdlIHNob3VsZCB1c2Ugb3JpZ2luYWwgbmF0aXZlIGdldCB0byByZXRyaWV2ZSB0aGUgaGFuZGxlclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gb3JpZ2luYWxEZXNjR2V0LmNhbGwodGhpcyk7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBkZXNjLnNldC5jYWxsKHRoaXMsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldFtSRU1PVkVfQVRUUklCVVRFXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKHByb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBPYmplY3REZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2MpO1xuICAgIG9ialtvblByb3BQYXRjaGVkU3ltYm9sXSA9IHRydWU7XG59XG5mdW5jdGlvbiBwYXRjaE9uUHJvcGVydGllcyhvYmosIHByb3BlcnRpZXMsIHByb3RvdHlwZSkge1xuICAgIGlmIChwcm9wZXJ0aWVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcGF0Y2hQcm9wZXJ0eShvYmosICdvbicgKyBwcm9wZXJ0aWVzW2ldLCBwcm90b3R5cGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBvblByb3BlcnRpZXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKHByb3Auc2xpY2UoMCwgMikgPT0gJ29uJykge1xuICAgICAgICAgICAgICAgIG9uUHJvcGVydGllcy5wdXNoKHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgb25Qcm9wZXJ0aWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBwYXRjaFByb3BlcnR5KG9iaiwgb25Qcm9wZXJ0aWVzW2pdLCBwcm90b3R5cGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuY29uc3Qgb3JpZ2luYWxJbnN0YW5jZUtleSA9IHpvbmVTeW1ib2woJ29yaWdpbmFsSW5zdGFuY2UnKTtcbi8vIHdyYXAgc29tZSBuYXRpdmUgQVBJIG9uIGB3aW5kb3dgXG5mdW5jdGlvbiBwYXRjaENsYXNzKGNsYXNzTmFtZSkge1xuICAgIGNvbnN0IE9yaWdpbmFsQ2xhc3MgPSBfZ2xvYmFsW2NsYXNzTmFtZV07XG4gICAgaWYgKCFPcmlnaW5hbENsYXNzKVxuICAgICAgICByZXR1cm47XG4gICAgLy8ga2VlcCBvcmlnaW5hbCBjbGFzcyBpbiBnbG9iYWxcbiAgICBfZ2xvYmFsW3pvbmVTeW1ib2woY2xhc3NOYW1lKV0gPSBPcmlnaW5hbENsYXNzO1xuICAgIF9nbG9iYWxbY2xhc3NOYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgYSA9IGJpbmRBcmd1bWVudHMoYXJndW1lbnRzLCBjbGFzc05hbWUpO1xuICAgICAgICBzd2l0Y2ggKGEubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XSA9IG5ldyBPcmlnaW5hbENsYXNzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XSA9IG5ldyBPcmlnaW5hbENsYXNzKGFbMF0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdLCBhWzFdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldID0gbmV3IE9yaWdpbmFsQ2xhc3MoYVswXSwgYVsxXSwgYVsyXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XSA9IG5ldyBPcmlnaW5hbENsYXNzKGFbMF0sIGFbMV0sIGFbMl0sIGFbM10pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FyZyBsaXN0IHRvbyBsb25nLicpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvLyBhdHRhY2ggb3JpZ2luYWwgZGVsZWdhdGUgdG8gcGF0Y2hlZCBmdW5jdGlvblxuICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChfZ2xvYmFsW2NsYXNzTmFtZV0sIE9yaWdpbmFsQ2xhc3MpO1xuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IE9yaWdpbmFsQ2xhc3MoZnVuY3Rpb24gKCkgeyB9KTtcbiAgICBsZXQgcHJvcDtcbiAgICBmb3IgKHByb3AgaW4gaW5zdGFuY2UpIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTQ0NzIxXG4gICAgICAgIGlmIChjbGFzc05hbWUgPT09ICdYTUxIdHRwUmVxdWVzdCcgJiYgcHJvcCA9PT0gJ3Jlc3BvbnNlQmxvYicpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGluc3RhbmNlW3Byb3BdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgX2dsb2JhbFtjbGFzc05hbWVdLnByb3RvdHlwZVtwcm9wXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV1bcHJvcF0uYXBwbHkodGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0RGVmaW5lUHJvcGVydHkoX2dsb2JhbFtjbGFzc05hbWVdLnByb3RvdHlwZSwgcHJvcCwge1xuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV1bcHJvcF0gPSB3cmFwV2l0aEN1cnJlbnRab25lKGZuLCBjbGFzc05hbWUgKyAnLicgKyBwcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBrZWVwIGNhbGxiYWNrIGluIHdyYXBwZWQgZnVuY3Rpb24gc28gd2UgY2FuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlIGl0IGluIEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyB0byByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgbmF0aXZlIG9uZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQodGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XVtwcm9wXSwgZm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XVtwcm9wXSA9IGZuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0ocHJvcCkpO1xuICAgIH1cbiAgICBmb3IgKHByb3AgaW4gT3JpZ2luYWxDbGFzcykge1xuICAgICAgICBpZiAocHJvcCAhPT0gJ3Byb3RvdHlwZScgJiYgT3JpZ2luYWxDbGFzcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgX2dsb2JhbFtjbGFzc05hbWVdW3Byb3BdID0gT3JpZ2luYWxDbGFzc1twcm9wXTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHBhdGNoTWV0aG9kKHRhcmdldCwgbmFtZSwgcGF0Y2hGbikge1xuICAgIGxldCBwcm90byA9IHRhcmdldDtcbiAgICB3aGlsZSAocHJvdG8gJiYgIXByb3RvLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIHByb3RvID0gT2JqZWN0R2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIH1cbiAgICBpZiAoIXByb3RvICYmIHRhcmdldFtuYW1lXSkge1xuICAgICAgICAvLyBzb21laG93IHdlIGRpZCBub3QgZmluZCBpdCwgYnV0IHdlIGNhbiBzZWUgaXQuIFRoaXMgaGFwcGVucyBvbiBJRSBmb3IgV2luZG93IHByb3BlcnRpZXMuXG4gICAgICAgIHByb3RvID0gdGFyZ2V0O1xuICAgIH1cbiAgICBjb25zdCBkZWxlZ2F0ZU5hbWUgPSB6b25lU3ltYm9sKG5hbWUpO1xuICAgIGxldCBkZWxlZ2F0ZSA9IG51bGw7XG4gICAgaWYgKHByb3RvICYmICghKGRlbGVnYXRlID0gcHJvdG9bZGVsZWdhdGVOYW1lXSkgfHwgIXByb3RvLmhhc093blByb3BlcnR5KGRlbGVnYXRlTmFtZSkpKSB7XG4gICAgICAgIGRlbGVnYXRlID0gcHJvdG9bZGVsZWdhdGVOYW1lXSA9IHByb3RvW25hbWVdO1xuICAgICAgICAvLyBjaGVjayB3aGV0aGVyIHByb3RvW25hbWVdIGlzIHdyaXRhYmxlXG4gICAgICAgIC8vIHNvbWUgcHJvcGVydHkgaXMgcmVhZG9ubHkgaW4gc2FmYXJpLCBzdWNoIGFzIEh0bWxDYW52YXNFbGVtZW50LnByb3RvdHlwZS50b0Jsb2JcbiAgICAgICAgY29uc3QgZGVzYyA9IHByb3RvICYmIE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSk7XG4gICAgICAgIGlmIChpc1Byb3BlcnR5V3JpdGFibGUoZGVzYykpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGNoRGVsZWdhdGUgPSBwYXRjaEZuKGRlbGVnYXRlLCBkZWxlZ2F0ZU5hbWUsIG5hbWUpO1xuICAgICAgICAgICAgcHJvdG9bbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGNoRGVsZWdhdGUodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bbmFtZV0sIGRlbGVnYXRlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGVsZWdhdGU7XG59XG4vLyBUT0RPOiBASmlhTGlQYXNzaW9uLCBzdXBwb3J0IGNhbmNlbCB0YXNrIGxhdGVyIGlmIG5lY2Vzc2FyeVxuZnVuY3Rpb24gcGF0Y2hNYWNyb1Rhc2sob2JqLCBmdW5jTmFtZSwgbWV0YUNyZWF0b3IpIHtcbiAgICBsZXQgc2V0TmF0aXZlID0gbnVsbDtcbiAgICBmdW5jdGlvbiBzY2hlZHVsZVRhc2sodGFzaykge1xuICAgICAgICBjb25zdCBkYXRhID0gdGFzay5kYXRhO1xuICAgICAgICBkYXRhLmFyZ3NbZGF0YS5jYklkeF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0YXNrLmludm9rZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgICBzZXROYXRpdmUuYXBwbHkoZGF0YS50YXJnZXQsIGRhdGEuYXJncyk7XG4gICAgICAgIHJldHVybiB0YXNrO1xuICAgIH1cbiAgICBzZXROYXRpdmUgPSBwYXRjaE1ldGhvZChvYmosIGZ1bmNOYW1lLCAoZGVsZWdhdGUpID0+IGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgIGNvbnN0IG1ldGEgPSBtZXRhQ3JlYXRvcihzZWxmLCBhcmdzKTtcbiAgICAgICAgaWYgKG1ldGEuY2JJZHggPj0gMCAmJiB0eXBlb2YgYXJnc1ttZXRhLmNiSWR4XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIHNjaGVkdWxlTWFjcm9UYXNrV2l0aEN1cnJlbnRab25lKG1ldGEubmFtZSwgYXJnc1ttZXRhLmNiSWR4XSwgbWV0YSwgc2NoZWR1bGVUYXNrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNhdXNlIGFuIGVycm9yIGJ5IGNhbGxpbmcgaXQgZGlyZWN0bHkuXG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwYXRjaGVkLCBvcmlnaW5hbCkge1xuICAgIHBhdGNoZWRbem9uZVN5bWJvbCgnT3JpZ2luYWxEZWxlZ2F0ZScpXSA9IG9yaWdpbmFsO1xufVxubGV0IGlzRGV0ZWN0ZWRJRU9yRWRnZSA9IGZhbHNlO1xubGV0IGllT3JFZGdlID0gZmFsc2U7XG5mdW5jdGlvbiBpc0lFKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVhID0gaW50ZXJuYWxXaW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAgICAgaWYgKHVhLmluZGV4T2YoJ01TSUUgJykgIT09IC0xIHx8IHVhLmluZGV4T2YoJ1RyaWRlbnQvJykgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNJRU9yRWRnZSgpIHtcbiAgICBpZiAoaXNEZXRlY3RlZElFT3JFZGdlKSB7XG4gICAgICAgIHJldHVybiBpZU9yRWRnZTtcbiAgICB9XG4gICAgaXNEZXRlY3RlZElFT3JFZGdlID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB1YSA9IGludGVybmFsV2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICAgIGlmICh1YS5pbmRleE9mKCdNU0lFICcpICE9PSAtMSB8fCB1YS5pbmRleE9mKCdUcmlkZW50LycpICE9PSAtMSB8fCB1YS5pbmRleE9mKCdFZGdlLycpICE9PSAtMSkge1xuICAgICAgICAgICAgaWVPckVkZ2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgIH1cbiAgICByZXR1cm4gaWVPckVkZ2U7XG59XG5cblpvbmUuX19sb2FkX3BhdGNoKCdab25lQXdhcmVQcm9taXNlJywgKGdsb2JhbCwgWm9uZSwgYXBpKSA9PiB7XG4gICAgY29uc3QgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgICBjb25zdCBPYmplY3REZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbiAgICBmdW5jdGlvbiByZWFkYWJsZU9iamVjdFRvU3RyaW5nKG9iaikge1xuICAgICAgICBpZiAob2JqICYmIG9iai50b1N0cmluZyA9PT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZykge1xuICAgICAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAgICAgcmV0dXJuIChjbGFzc05hbWUgPyBjbGFzc05hbWUgOiAnJykgKyAnOiAnICsgSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqID8gb2JqLnRvU3RyaW5nKCkgOiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbiAgICB9XG4gICAgY29uc3QgX19zeW1ib2xfXyA9IGFwaS5zeW1ib2w7XG4gICAgY29uc3QgX3VuY2F1Z2h0UHJvbWlzZUVycm9ycyA9IFtdO1xuICAgIGNvbnN0IGlzRGlzYWJsZVdyYXBwaW5nVW5jYXVnaHRQcm9taXNlUmVqZWN0aW9uID0gZ2xvYmFsW19fc3ltYm9sX18oJ0RJU0FCTEVfV1JBUFBJTkdfVU5DQVVHSFRfUFJPTUlTRV9SRUpFQ1RJT04nKV0gIT09IGZhbHNlO1xuICAgIGNvbnN0IHN5bWJvbFByb21pc2UgPSBfX3N5bWJvbF9fKCdQcm9taXNlJyk7XG4gICAgY29uc3Qgc3ltYm9sVGhlbiA9IF9fc3ltYm9sX18oJ3RoZW4nKTtcbiAgICBjb25zdCBjcmVhdGlvblRyYWNlID0gJ19fY3JlYXRpb25UcmFjZV9fJztcbiAgICBhcGkub25VbmhhbmRsZWRFcnJvciA9IChlKSA9PiB7XG4gICAgICAgIGlmIChhcGkuc2hvd1VuY2F1Z2h0RXJyb3IoKSkge1xuICAgICAgICAgICAgY29uc3QgcmVqZWN0aW9uID0gZSAmJiBlLnJlamVjdGlvbjtcbiAgICAgICAgICAgIGlmIChyZWplY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgUHJvbWlzZSByZWplY3Rpb246JywgcmVqZWN0aW9uIGluc3RhbmNlb2YgRXJyb3IgPyByZWplY3Rpb24ubWVzc2FnZSA6IHJlamVjdGlvbiwgJzsgWm9uZTonLCBlLnpvbmUubmFtZSwgJzsgVGFzazonLCBlLnRhc2sgJiYgZS50YXNrLnNvdXJjZSwgJzsgVmFsdWU6JywgcmVqZWN0aW9uLCByZWplY3Rpb24gaW5zdGFuY2VvZiBFcnJvciA/IHJlamVjdGlvbi5zdGFjayA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBhcGkubWljcm90YXNrRHJhaW5Eb25lID0gKCkgPT4ge1xuICAgICAgICB3aGlsZSAoX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHVuY2F1Z2h0UHJvbWlzZUVycm9yID0gX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5zaGlmdCgpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB1bmNhdWdodFByb21pc2VFcnJvci56b25lLnJ1bkd1YXJkZWQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodW5jYXVnaHRQcm9taXNlRXJyb3IudGhyb3dPcmlnaW5hbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgdW5jYXVnaHRQcm9taXNlRXJyb3IucmVqZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRocm93IHVuY2F1Z2h0UHJvbWlzZUVycm9yO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlVW5oYW5kbGVkUmVqZWN0aW9uKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgVU5IQU5ETEVEX1BST01JU0VfUkVKRUNUSU9OX0hBTkRMRVJfU1lNQk9MID0gX19zeW1ib2xfXygndW5oYW5kbGVkUHJvbWlzZVJlamVjdGlvbkhhbmRsZXInKTtcbiAgICBmdW5jdGlvbiBoYW5kbGVVbmhhbmRsZWRSZWplY3Rpb24oZSkge1xuICAgICAgICBhcGkub25VbmhhbmRsZWRFcnJvcihlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBab25lW1VOSEFORExFRF9QUk9NSVNFX1JFSkVDVElPTl9IQU5ETEVSX1NZTUJPTF07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzVGhlbmFibGUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnRoZW47XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZvcndhcmRSZXNvbHV0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZm9yd2FyZFJlamVjdGlvbihyZWplY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIFpvbmVBd2FyZVByb21pc2UucmVqZWN0KHJlamVjdGlvbik7XG4gICAgfVxuICAgIGNvbnN0IHN5bWJvbFN0YXRlID0gX19zeW1ib2xfXygnc3RhdGUnKTtcbiAgICBjb25zdCBzeW1ib2xWYWx1ZSA9IF9fc3ltYm9sX18oJ3ZhbHVlJyk7XG4gICAgY29uc3Qgc3ltYm9sRmluYWxseSA9IF9fc3ltYm9sX18oJ2ZpbmFsbHknKTtcbiAgICBjb25zdCBzeW1ib2xQYXJlbnRQcm9taXNlVmFsdWUgPSBfX3N5bWJvbF9fKCdwYXJlbnRQcm9taXNlVmFsdWUnKTtcbiAgICBjb25zdCBzeW1ib2xQYXJlbnRQcm9taXNlU3RhdGUgPSBfX3N5bWJvbF9fKCdwYXJlbnRQcm9taXNlU3RhdGUnKTtcbiAgICBjb25zdCBzb3VyY2UgPSAnUHJvbWlzZS50aGVuJztcbiAgICBjb25zdCBVTlJFU09MVkVEID0gbnVsbDtcbiAgICBjb25zdCBSRVNPTFZFRCA9IHRydWU7XG4gICAgY29uc3QgUkVKRUNURUQgPSBmYWxzZTtcbiAgICBjb25zdCBSRUpFQ1RFRF9OT19DQVRDSCA9IDA7XG4gICAgZnVuY3Rpb24gbWFrZVJlc29sdmVyKHByb21pc2UsIHN0YXRlKSB7XG4gICAgICAgIHJldHVybiAodikgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBzdGF0ZSwgdik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgZmFsc2UsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBEbyBub3QgcmV0dXJuIHZhbHVlIG9yIHlvdSB3aWxsIGJyZWFrIHRoZSBQcm9taXNlIHNwZWMuXG4gICAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IG9uY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCB3YXNDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZXIod3JhcHBlZEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh3YXNDYWxsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3YXNDYWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHdyYXBwZWRGdW5jdGlvbi5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGNvbnN0IFRZUEVfRVJST1IgPSAnUHJvbWlzZSByZXNvbHZlZCB3aXRoIGl0c2VsZic7XG4gICAgY29uc3QgQ1VSUkVOVF9UQVNLX1RSQUNFX1NZTUJPTCA9IF9fc3ltYm9sX18oJ2N1cnJlbnRUYXNrVHJhY2UnKTtcbiAgICAvLyBQcm9taXNlIFJlc29sdXRpb25cbiAgICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBzdGF0ZSwgdmFsdWUpIHtcbiAgICAgICAgY29uc3Qgb25jZVdyYXBwZXIgPSBvbmNlKCk7XG4gICAgICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihUWVBFX0VSUk9SKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvbWlzZVtzeW1ib2xTdGF0ZV0gPT09IFVOUkVTT0xWRUQpIHtcbiAgICAgICAgICAgIC8vIHNob3VsZCBvbmx5IGdldCB2YWx1ZS50aGVuIG9uY2UgYmFzZWQgb24gcHJvbWlzZSBzcGVjLlxuICAgICAgICAgICAgbGV0IHRoZW4gPSBudWxsO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhlbiA9IHZhbHVlICYmIHZhbHVlLnRoZW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIG9uY2VXcmFwcGVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgZmFsc2UsIGVycik7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpIHtcbiAgICAgICAgICAgIGlmIChzdGF0ZSAhPT0gUkVKRUNURUQgJiYgdmFsdWUgaW5zdGFuY2VvZiBab25lQXdhcmVQcm9taXNlICYmXG4gICAgICAgICAgICAgICAgdmFsdWUuaGFzT3duUHJvcGVydHkoc3ltYm9sU3RhdGUpICYmIHZhbHVlLmhhc093blByb3BlcnR5KHN5bWJvbFZhbHVlKSAmJlxuICAgICAgICAgICAgICAgIHZhbHVlW3N5bWJvbFN0YXRlXSAhPT0gVU5SRVNPTFZFRCkge1xuICAgICAgICAgICAgICAgIGNsZWFyUmVqZWN0ZWROb0NhdGNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCB2YWx1ZVtzeW1ib2xTdGF0ZV0sIHZhbHVlW3N5bWJvbFZhbHVlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzdGF0ZSAhPT0gUkVKRUNURUQgJiYgdHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIG9uY2VXcmFwcGVyKG1ha2VSZXNvbHZlcihwcm9taXNlLCBzdGF0ZSkpLCBvbmNlV3JhcHBlcihtYWtlUmVzb2x2ZXIocHJvbWlzZSwgZmFsc2UpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgb25jZVdyYXBwZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgZmFsc2UsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvbWlzZVtzeW1ib2xTdGF0ZV0gPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBxdWV1ZSA9IHByb21pc2Vbc3ltYm9sVmFsdWVdO1xuICAgICAgICAgICAgICAgIHByb21pc2Vbc3ltYm9sVmFsdWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHByb21pc2Vbc3ltYm9sRmluYWxseV0gPT09IHN5bWJvbEZpbmFsbHkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHByb21pc2UgaXMgZ2VuZXJhdGVkIGJ5IFByb21pc2UucHJvdG90eXBlLmZpbmFsbHlcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlID09PSBSRVNPTFZFRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHN0YXRlIGlzIHJlc29sdmVkLCBzaG91bGQgaWdub3JlIHRoZSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHVzZSBwYXJlbnQgcHJvbWlzZSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZVtzeW1ib2xTdGF0ZV0gPSBwcm9taXNlW3N5bWJvbFBhcmVudFByb21pc2VTdGF0ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlW3N5bWJvbFZhbHVlXSA9IHByb21pc2Vbc3ltYm9sUGFyZW50UHJvbWlzZVZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyByZWNvcmQgdGFzayBpbmZvcm1hdGlvbiBpbiB2YWx1ZSB3aGVuIGVycm9yIG9jY3Vycywgc28gd2UgY2FuXG4gICAgICAgICAgICAgICAgLy8gZG8gc29tZSBhZGRpdGlvbmFsIHdvcmsgc3VjaCBhcyByZW5kZXIgbG9uZ1N0YWNrVHJhY2VcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT09IFJFSkVDVEVEICYmIHZhbHVlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgbG9uZ1N0YWNrVHJhY2Vab25lIGlzIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJhY2UgPSBab25lLmN1cnJlbnRUYXNrICYmIFpvbmUuY3VycmVudFRhc2suZGF0YSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgWm9uZS5jdXJyZW50VGFzay5kYXRhW2NyZWF0aW9uVHJhY2VdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHJhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9ubHkga2VlcCB0aGUgbG9uZyBzdGFjayB0cmFjZSBpbnRvIGVycm9yIHdoZW4gaW4gbG9uZ1N0YWNrVHJhY2Vab25lXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3REZWZpbmVQcm9wZXJ0eSh2YWx1ZSwgQ1VSUkVOVF9UQVNLX1RSQUNFX1NZTUJPTCwgeyBjb25maWd1cmFibGU6IHRydWUsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgdmFsdWU6IHRyYWNlIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOykge1xuICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZVJlc29sdmVPclJlamVjdChwcm9taXNlLCBxdWV1ZVtpKytdLCBxdWV1ZVtpKytdLCBxdWV1ZVtpKytdLCBxdWV1ZVtpKytdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA9PSAwICYmIHN0YXRlID09IFJFSkVDVEVEKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Vbc3ltYm9sU3RhdGVdID0gUkVKRUNURURfTk9fQ0FUQ0g7XG4gICAgICAgICAgICAgICAgICAgIGxldCB1bmNhdWdodFByb21pc2VFcnJvciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGVyZSB3ZSB0aHJvd3MgYSBuZXcgRXJyb3IgdG8gcHJpbnQgbW9yZSByZWFkYWJsZSBlcnJvciBsb2dcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCBpZiB0aGUgdmFsdWUgaXMgbm90IGFuIGVycm9yLCB6b25lLmpzIGJ1aWxkcyBhbiBgRXJyb3JgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPYmplY3QgaGVyZSB0byBhdHRhY2ggdGhlIHN0YWNrIGluZm9ybWF0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmNhdWdodCAoaW4gcHJvbWlzZSk6ICcgKyByZWFkYWJsZU9iamVjdFRvU3RyaW5nKHZhbHVlKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHVlICYmIHZhbHVlLnN0YWNrID8gJ1xcbicgKyB2YWx1ZS5zdGFjayA6ICcnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5jYXVnaHRQcm9taXNlRXJyb3IgPSBlcnI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRGlzYWJsZVdyYXBwaW5nVW5jYXVnaHRQcm9taXNlUmVqZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBkaXNhYmxlIHdyYXBwaW5nIHVuY2F1Z2h0IHByb21pc2UgcmVqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIHZhbHVlIGluc3RlYWQgb2Ygd3JhcHBpbmcgaXQuXG4gICAgICAgICAgICAgICAgICAgICAgICB1bmNhdWdodFByb21pc2VFcnJvci50aHJvd09yaWdpbmFsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB1bmNhdWdodFByb21pc2VFcnJvci5yZWplY3Rpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdW5jYXVnaHRQcm9taXNlRXJyb3IucHJvbWlzZSA9IHByb21pc2U7XG4gICAgICAgICAgICAgICAgICAgIHVuY2F1Z2h0UHJvbWlzZUVycm9yLnpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHVuY2F1Z2h0UHJvbWlzZUVycm9yLnRhc2sgPSBab25lLmN1cnJlbnRUYXNrO1xuICAgICAgICAgICAgICAgICAgICBfdW5jYXVnaHRQcm9taXNlRXJyb3JzLnB1c2godW5jYXVnaHRQcm9taXNlRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBhcGkuc2NoZWR1bGVNaWNyb1Rhc2soKTsgLy8gdG8gbWFrZSBzdXJlIHRoYXQgaXQgaXMgcnVubmluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBSZXNvbHZpbmcgYW4gYWxyZWFkeSByZXNvbHZlZCBwcm9taXNlIGlzIGEgbm9vcC5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIGNvbnN0IFJFSkVDVElPTl9IQU5ETEVEX0hBTkRMRVIgPSBfX3N5bWJvbF9fKCdyZWplY3Rpb25IYW5kbGVkSGFuZGxlcicpO1xuICAgIGZ1bmN0aW9uIGNsZWFyUmVqZWN0ZWROb0NhdGNoKHByb21pc2UpIHtcbiAgICAgICAgaWYgKHByb21pc2Vbc3ltYm9sU3RhdGVdID09PSBSRUpFQ1RFRF9OT19DQVRDSCkge1xuICAgICAgICAgICAgLy8gaWYgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQgbm8gY2F0Y2ggc3RhdHVzXG4gICAgICAgICAgICAvLyBhbmQgcXVldWUubGVuZ3RoID4gMCwgbWVhbnMgdGhlcmUgaXMgYSBlcnJvciBoYW5kbGVyXG4gICAgICAgICAgICAvLyBoZXJlIHRvIGhhbmRsZSB0aGUgcmVqZWN0ZWQgcHJvbWlzZSwgd2Ugc2hvdWxkIHRyaWdnZXJcbiAgICAgICAgICAgIC8vIHdpbmRvd3MucmVqZWN0aW9uaGFuZGxlZCBldmVudEhhbmRsZXIgb3Igbm9kZWpzIHJlamVjdGlvbkhhbmRsZWRcbiAgICAgICAgICAgIC8vIGV2ZW50SGFuZGxlclxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gWm9uZVtSRUpFQ1RJT05fSEFORExFRF9IQU5ETEVSXTtcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlciAmJiB0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgeyByZWplY3Rpb246IHByb21pc2Vbc3ltYm9sVmFsdWVdLCBwcm9taXNlOiBwcm9taXNlIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb21pc2Vbc3ltYm9sU3RhdGVdID0gUkVKRUNURUQ7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF91bmNhdWdodFByb21pc2VFcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvbWlzZSA9PT0gX3VuY2F1Z2h0UHJvbWlzZUVycm9yc1tpXS5wcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIF91bmNhdWdodFByb21pc2VFcnJvcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzY2hlZHVsZVJlc29sdmVPclJlamVjdChwcm9taXNlLCB6b25lLCBjaGFpblByb21pc2UsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICAgIGNsZWFyUmVqZWN0ZWROb0NhdGNoKHByb21pc2UpO1xuICAgICAgICBjb25zdCBwcm9taXNlU3RhdGUgPSBwcm9taXNlW3N5bWJvbFN0YXRlXTtcbiAgICAgICAgY29uc3QgZGVsZWdhdGUgPSBwcm9taXNlU3RhdGUgP1xuICAgICAgICAgICAgKHR5cGVvZiBvbkZ1bGZpbGxlZCA9PT0gJ2Z1bmN0aW9uJykgPyBvbkZ1bGZpbGxlZCA6IGZvcndhcmRSZXNvbHV0aW9uIDpcbiAgICAgICAgICAgICh0eXBlb2Ygb25SZWplY3RlZCA9PT0gJ2Z1bmN0aW9uJykgPyBvblJlamVjdGVkIDpcbiAgICAgICAgICAgICAgICBmb3J3YXJkUmVqZWN0aW9uO1xuICAgICAgICB6b25lLnNjaGVkdWxlTWljcm9UYXNrKHNvdXJjZSwgKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRQcm9taXNlVmFsdWUgPSBwcm9taXNlW3N5bWJvbFZhbHVlXTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0ZpbmFsbHlQcm9taXNlID0gISFjaGFpblByb21pc2UgJiYgc3ltYm9sRmluYWxseSA9PT0gY2hhaW5Qcm9taXNlW3N5bWJvbEZpbmFsbHldO1xuICAgICAgICAgICAgICAgIGlmIChpc0ZpbmFsbHlQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwcm9taXNlIGlzIGdlbmVyYXRlZCBmcm9tIGZpbmFsbHkgY2FsbCwga2VlcCBwYXJlbnQgcHJvbWlzZSdzIHN0YXRlIGFuZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICBjaGFpblByb21pc2Vbc3ltYm9sUGFyZW50UHJvbWlzZVZhbHVlXSA9IHBhcmVudFByb21pc2VWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW5Qcm9taXNlW3N5bWJvbFBhcmVudFByb21pc2VTdGF0ZV0gPSBwcm9taXNlU3RhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHNob3VsZCBub3QgcGFzcyB2YWx1ZSB0byBmaW5hbGx5IGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB6b25lLnJ1bihkZWxlZ2F0ZSwgdW5kZWZpbmVkLCBpc0ZpbmFsbHlQcm9taXNlICYmIGRlbGVnYXRlICE9PSBmb3J3YXJkUmVqZWN0aW9uICYmIGRlbGVnYXRlICE9PSBmb3J3YXJkUmVzb2x1dGlvbiA/XG4gICAgICAgICAgICAgICAgICAgIFtdIDpcbiAgICAgICAgICAgICAgICAgICAgW3BhcmVudFByb21pc2VWYWx1ZV0pO1xuICAgICAgICAgICAgICAgIHJlc29sdmVQcm9taXNlKGNoYWluUHJvbWlzZSwgdHJ1ZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgZXJyb3Igb2NjdXJzLCBzaG91bGQgYWx3YXlzIHJldHVybiB0aGlzIGVycm9yXG4gICAgICAgICAgICAgICAgcmVzb2x2ZVByb21pc2UoY2hhaW5Qcm9taXNlLCBmYWxzZSwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBjaGFpblByb21pc2UpO1xuICAgIH1cbiAgICBjb25zdCBaT05FX0FXQVJFX1BST01JU0VfVE9fU1RSSU5HID0gJ2Z1bmN0aW9uIFpvbmVBd2FyZVByb21pc2UoKSB7IFtuYXRpdmUgY29kZV0gfSc7XG4gICAgY29uc3Qgbm9vcCA9IGZ1bmN0aW9uICgpIHsgfTtcbiAgICBjb25zdCBBZ2dyZWdhdGVFcnJvciA9IGdsb2JhbC5BZ2dyZWdhdGVFcnJvcjtcbiAgICBjbGFzcyBab25lQXdhcmVQcm9taXNlIHtcbiAgICAgICAgc3RhdGljIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIFpPTkVfQVdBUkVfUFJPTUlTRV9UT19TVFJJTkc7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIHJlc29sdmUodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZVByb21pc2UobmV3IHRoaXMobnVsbCksIFJFU09MVkVELCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIHJlamVjdChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVQcm9taXNlKG5ldyB0aGlzKG51bGwpLCBSRUpFQ1RFRCwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyB3aXRoUmVzb2x2ZXJzKCkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgICAgICByZXN1bHQucHJvbWlzZSA9IG5ldyBab25lQXdhcmVQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5yZXNvbHZlID0gcmVzO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5yZWplY3QgPSByZWo7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIGFueSh2YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmICghdmFsdWVzIHx8IHR5cGVvZiB2YWx1ZXNbU3ltYm9sLml0ZXJhdG9yXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQWdncmVnYXRlRXJyb3IoW10sICdBbGwgcHJvbWlzZXMgd2VyZSByZWplY3RlZCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB2IG9mIHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKFpvbmVBd2FyZVByb21pc2UucmVzb2x2ZSh2KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQWdncmVnYXRlRXJyb3IoW10sICdBbGwgcHJvbWlzZXMgd2VyZSByZWplY3RlZCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQWdncmVnYXRlRXJyb3IoW10sICdBbGwgcHJvbWlzZXMgd2VyZSByZWplY3RlZCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBmaW5pc2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgZXJyb3JzID0gW107XG4gICAgICAgICAgICByZXR1cm4gbmV3IFpvbmVBd2FyZVByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvbWlzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZXNbaV0udGhlbih2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaW5pc2hlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodik7XG4gICAgICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEFnZ3JlZ2F0ZUVycm9yKGVycm9ycywgJ0FsbCBwcm9taXNlcyB3ZXJlIHJlamVjdGVkJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIHN0YXRpYyByYWNlKHZhbHVlcykge1xuICAgICAgICAgICAgbGV0IHJlc29sdmU7XG4gICAgICAgICAgICBsZXQgcmVqZWN0O1xuICAgICAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgdGhpcygocmVzLCByZWopID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlID0gcmVzO1xuICAgICAgICAgICAgICAgIHJlamVjdCA9IHJlajtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZnVuY3Rpb24gb25SZXNvbHZlKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBvblJlamVjdChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVGhlbmFibGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5yZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsdWUudGhlbihvblJlc29sdmUsIG9uUmVqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBhbGwodmFsdWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gWm9uZUF3YXJlUHJvbWlzZS5hbGxXaXRoQ2FsbGJhY2sodmFsdWVzKTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0aWMgYWxsU2V0dGxlZCh2YWx1ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IFAgPSB0aGlzICYmIHRoaXMucHJvdG90eXBlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSA/IHRoaXMgOiBab25lQXdhcmVQcm9taXNlO1xuICAgICAgICAgICAgcmV0dXJuIFAuYWxsV2l0aENhbGxiYWNrKHZhbHVlcywge1xuICAgICAgICAgICAgICAgIHRoZW5DYWxsYmFjazogKHZhbHVlKSA9PiAoeyBzdGF0dXM6ICdmdWxmaWxsZWQnLCB2YWx1ZSB9KSxcbiAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrOiAoZXJyKSA9PiAoeyBzdGF0dXM6ICdyZWplY3RlZCcsIHJlYXNvbjogZXJyIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0aWMgYWxsV2l0aENhbGxiYWNrKHZhbHVlcywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGxldCByZXNvbHZlO1xuICAgICAgICAgICAgbGV0IHJlamVjdDtcbiAgICAgICAgICAgIGxldCBwcm9taXNlID0gbmV3IHRoaXMoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSA9IHJlcztcbiAgICAgICAgICAgICAgICByZWplY3QgPSByZWo7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIFN0YXJ0IGF0IDIgdG8gcHJldmVudCBwcmVtYXR1cmVseSByZXNvbHZpbmcgaWYgLnRoZW4gaXMgY2FsbGVkIGltbWVkaWF0ZWx5LlxuICAgICAgICAgICAgbGV0IHVucmVzb2x2ZWRDb3VudCA9IDI7XG4gICAgICAgICAgICBsZXQgdmFsdWVJbmRleCA9IDA7XG4gICAgICAgICAgICBjb25zdCByZXNvbHZlZFZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1RoZW5hYmxlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMucmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGN1clZhbHVlSW5kZXggPSB2YWx1ZUluZGV4O1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnRoZW4oKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFZhbHVlc1tjdXJWYWx1ZUluZGV4XSA9IGNhbGxiYWNrID8gY2FsbGJhY2sudGhlbkNhbGxiYWNrKHZhbHVlKSA6IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5yZXNvbHZlZENvdW50LS07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5yZXNvbHZlZENvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNvbHZlZFZhbHVlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVkVmFsdWVzW2N1clZhbHVlSW5kZXhdID0gY2FsbGJhY2suZXJyb3JDYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVucmVzb2x2ZWRDb3VudC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1bnJlc29sdmVkQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNvbHZlZFZhbHVlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKHRoZW5FcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRoZW5FcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1bnJlc29sdmVkQ291bnQrKztcbiAgICAgICAgICAgICAgICB2YWx1ZUluZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNYWtlIHRoZSB1bnJlc29sdmVkQ291bnQgemVyby1iYXNlZCBhZ2Fpbi5cbiAgICAgICAgICAgIHVucmVzb2x2ZWRDb3VudCAtPSAyO1xuICAgICAgICAgICAgaWYgKHVucmVzb2x2ZWRDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzb2x2ZWRWYWx1ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3RydWN0b3IoZXhlY3V0b3IpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCEocHJvbWlzZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IGJlIGFuIGluc3RhbmNlb2YgUHJvbWlzZS4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb21pc2Vbc3ltYm9sU3RhdGVdID0gVU5SRVNPTFZFRDtcbiAgICAgICAgICAgIHByb21pc2Vbc3ltYm9sVmFsdWVdID0gW107IC8vIHF1ZXVlO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvbmNlV3JhcHBlciA9IG9uY2UoKTtcbiAgICAgICAgICAgICAgICBleGVjdXRvciAmJlxuICAgICAgICAgICAgICAgICAgICBleGVjdXRvcihvbmNlV3JhcHBlcihtYWtlUmVzb2x2ZXIocHJvbWlzZSwgUkVTT0xWRUQpKSwgb25jZVdyYXBwZXIobWFrZVJlc29sdmVyKHByb21pc2UsIFJFSkVDVEVEKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgZmFsc2UsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1Byb21pc2UnO1xuICAgICAgICB9XG4gICAgICAgIGdldCBbU3ltYm9sLnNwZWNpZXNdKCkge1xuICAgICAgICAgICAgcmV0dXJuIFpvbmVBd2FyZVByb21pc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgICAgICAgICAgLy8gV2UgbXVzdCByZWFkIGBTeW1ib2wuc3BlY2llc2Agc2FmZWx5IGJlY2F1c2UgYHRoaXNgIG1heSBiZSBhbnl0aGluZy4gRm9yIGluc3RhbmNlLCBgdGhpc2BcbiAgICAgICAgICAgIC8vIG1heSBiZSBhbiBvYmplY3Qgd2l0aG91dCBhIHByb3RvdHlwZSAoY3JlYXRlZCB0aHJvdWdoIGBPYmplY3QuY3JlYXRlKG51bGwpYCk7IHRodXNcbiAgICAgICAgICAgIC8vIGB0aGlzLmNvbnN0cnVjdG9yYCB3aWxsIGJlIHVuZGVmaW5lZC4gT25lIG9mIHRoZSB1c2UgY2FzZXMgaXMgU3lzdGVtSlMgY3JlYXRpbmdcbiAgICAgICAgICAgIC8vIHByb3RvdHlwZS1sZXNzIG9iamVjdHMgKG1vZHVsZXMpIHZpYSBgT2JqZWN0LmNyZWF0ZShudWxsKWAuIFRoZSBTeXN0ZW1KUyBjcmVhdGVzIGFuIGVtcHR5XG4gICAgICAgICAgICAvLyBvYmplY3QgYW5kIGNvcGllcyBwcm9taXNlIHByb3BlcnRpZXMgaW50byB0aGF0IG9iamVjdCAod2l0aGluIHRoZSBgZ2V0T3JDcmVhdGVMb2FkYFxuICAgICAgICAgICAgLy8gZnVuY3Rpb24pLiBUaGUgem9uZS5qcyB0aGVuIGNoZWNrcyBpZiB0aGUgcmVzb2x2ZWQgdmFsdWUgaGFzIHRoZSBgdGhlbmAgbWV0aG9kIGFuZCBpbnZva2VzXG4gICAgICAgICAgICAvLyBpdCB3aXRoIHRoZSBgdmFsdWVgIGNvbnRleHQuIE90aGVyd2lzZSwgdGhpcyB3aWxsIHRocm93IGFuIGVycm9yOiBgVHlwZUVycm9yOiBDYW5ub3QgcmVhZFxuICAgICAgICAgICAgLy8gcHJvcGVydGllcyBvZiB1bmRlZmluZWQgKHJlYWRpbmcgJ1N5bWJvbChTeW1ib2wuc3BlY2llcyknKWAuXG4gICAgICAgICAgICBsZXQgQyA9IHRoaXMuY29uc3RydWN0b3I/LltTeW1ib2wuc3BlY2llc107XG4gICAgICAgICAgICBpZiAoIUMgfHwgdHlwZW9mIEMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBDID0gdGhpcy5jb25zdHJ1Y3RvciB8fCBab25lQXdhcmVQcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2hhaW5Qcm9taXNlID0gbmV3IEMobm9vcCk7XG4gICAgICAgICAgICBjb25zdCB6b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICAgICAgaWYgKHRoaXNbc3ltYm9sU3RhdGVdID09IFVOUkVTT0xWRUQpIHtcbiAgICAgICAgICAgICAgICB0aGlzW3N5bWJvbFZhbHVlXS5wdXNoKHpvbmUsIGNoYWluUHJvbWlzZSwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NoZWR1bGVSZXNvbHZlT3JSZWplY3QodGhpcywgem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2hhaW5Qcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseShvbkZpbmFsbHkpIHtcbiAgICAgICAgICAgIC8vIFNlZSBjb21tZW50IG9uIHRoZSBjYWxsIHRvIGB0aGVuYCBhYm91dCB3aHkgdGhlZSBgU3ltYm9sLnNwZWNpZXNgIGlzIHNhZmVseSBhY2Nlc3NlZC5cbiAgICAgICAgICAgIGxldCBDID0gdGhpcy5jb25zdHJ1Y3Rvcj8uW1N5bWJvbC5zcGVjaWVzXTtcbiAgICAgICAgICAgIGlmICghQyB8fCB0eXBlb2YgQyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIEMgPSBab25lQXdhcmVQcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2hhaW5Qcm9taXNlID0gbmV3IEMobm9vcCk7XG4gICAgICAgICAgICBjaGFpblByb21pc2Vbc3ltYm9sRmluYWxseV0gPSBzeW1ib2xGaW5hbGx5O1xuICAgICAgICAgICAgY29uc3Qgem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAgIGlmICh0aGlzW3N5bWJvbFN0YXRlXSA9PSBVTlJFU09MVkVEKSB7XG4gICAgICAgICAgICAgICAgdGhpc1tzeW1ib2xWYWx1ZV0ucHVzaCh6b25lLCBjaGFpblByb21pc2UsIG9uRmluYWxseSwgb25GaW5hbGx5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjaGVkdWxlUmVzb2x2ZU9yUmVqZWN0KHRoaXMsIHpvbmUsIGNoYWluUHJvbWlzZSwgb25GaW5hbGx5LCBvbkZpbmFsbHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNoYWluUHJvbWlzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBQcm90ZWN0IGFnYWluc3QgYWdncmVzc2l2ZSBvcHRpbWl6ZXJzIGRyb3BwaW5nIHNlZW1pbmdseSB1bnVzZWQgcHJvcGVydGllcy5cbiAgICAvLyBFLmcuIENsb3N1cmUgQ29tcGlsZXIgaW4gYWR2YW5jZWQgbW9kZS5cbiAgICBab25lQXdhcmVQcm9taXNlWydyZXNvbHZlJ10gPSBab25lQXdhcmVQcm9taXNlLnJlc29sdmU7XG4gICAgWm9uZUF3YXJlUHJvbWlzZVsncmVqZWN0J10gPSBab25lQXdhcmVQcm9taXNlLnJlamVjdDtcbiAgICBab25lQXdhcmVQcm9taXNlWydyYWNlJ10gPSBab25lQXdhcmVQcm9taXNlLnJhY2U7XG4gICAgWm9uZUF3YXJlUHJvbWlzZVsnYWxsJ10gPSBab25lQXdhcmVQcm9taXNlLmFsbDtcbiAgICBjb25zdCBOYXRpdmVQcm9taXNlID0gZ2xvYmFsW3N5bWJvbFByb21pc2VdID0gZ2xvYmFsWydQcm9taXNlJ107XG4gICAgZ2xvYmFsWydQcm9taXNlJ10gPSBab25lQXdhcmVQcm9taXNlO1xuICAgIGNvbnN0IHN5bWJvbFRoZW5QYXRjaGVkID0gX19zeW1ib2xfXygndGhlblBhdGNoZWQnKTtcbiAgICBmdW5jdGlvbiBwYXRjaFRoZW4oQ3Rvcikge1xuICAgICAgICBjb25zdCBwcm90byA9IEN0b3IucHJvdG90eXBlO1xuICAgICAgICBjb25zdCBwcm9wID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCAndGhlbicpO1xuICAgICAgICBpZiAocHJvcCAmJiAocHJvcC53cml0YWJsZSA9PT0gZmFsc2UgfHwgIXByb3AuY29uZmlndXJhYmxlKSkge1xuICAgICAgICAgICAgLy8gY2hlY2sgQ3Rvci5wcm90b3R5cGUudGhlbiBwcm9wZXJ0eURlc2NyaXB0b3IgaXMgd3JpdGFibGUgb3Igbm90XG4gICAgICAgICAgICAvLyBpbiBtZXRlb3IgZW52LCB3cml0YWJsZSBpcyBmYWxzZSwgd2Ugc2hvdWxkIGlnbm9yZSBzdWNoIGNhc2VcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvcmlnaW5hbFRoZW4gPSBwcm90by50aGVuO1xuICAgICAgICAvLyBLZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gICAgICAgIHByb3RvW3N5bWJvbFRoZW5dID0gb3JpZ2luYWxUaGVuO1xuICAgICAgICBDdG9yLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24gKG9uUmVzb2x2ZSwgb25SZWplY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSBuZXcgWm9uZUF3YXJlUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxUaGVuLmNhbGwodGhpcywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHdyYXBwZWQudGhlbihvblJlc29sdmUsIG9uUmVqZWN0KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ3RvcltzeW1ib2xUaGVuUGF0Y2hlZF0gPSB0cnVlO1xuICAgIH1cbiAgICBhcGkucGF0Y2hUaGVuID0gcGF0Y2hUaGVuO1xuICAgIGZ1bmN0aW9uIHpvbmVpZnkoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0UHJvbWlzZSA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdFByb21pc2UgaW5zdGFuY2VvZiBab25lQXdhcmVQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFByb21pc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgY3RvciA9IHJlc3VsdFByb21pc2UuY29uc3RydWN0b3I7XG4gICAgICAgICAgICBpZiAoIWN0b3Jbc3ltYm9sVGhlblBhdGNoZWRdKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2hUaGVuKGN0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFByb21pc2U7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmIChOYXRpdmVQcm9taXNlKSB7XG4gICAgICAgIHBhdGNoVGhlbihOYXRpdmVQcm9taXNlKTtcbiAgICAgICAgcGF0Y2hNZXRob2QoZ2xvYmFsLCAnZmV0Y2gnLCBkZWxlZ2F0ZSA9PiB6b25laWZ5KGRlbGVnYXRlKSk7XG4gICAgfVxuICAgIC8vIFRoaXMgaXMgbm90IHBhcnQgb2YgcHVibGljIEFQSSwgYnV0IGl0IGlzIHVzZWZ1bCBmb3IgdGVzdHMsIHNvIHdlIGV4cG9zZSBpdC5cbiAgICBQcm9taXNlW1pvbmUuX19zeW1ib2xfXygndW5jYXVnaHRQcm9taXNlRXJyb3JzJyldID0gX3VuY2F1Z2h0UHJvbWlzZUVycm9ycztcbiAgICByZXR1cm4gWm9uZUF3YXJlUHJvbWlzZTtcbn0pO1xuXG4vLyBvdmVycmlkZSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgdG8gbWFrZSB6b25lLmpzIHBhdGNoZWQgZnVuY3Rpb25cbi8vIGxvb2sgbGlrZSBuYXRpdmUgZnVuY3Rpb25cblpvbmUuX19sb2FkX3BhdGNoKCd0b1N0cmluZycsIChnbG9iYWwpID0+IHtcbiAgICAvLyBwYXRjaCBGdW5jLnByb3RvdHlwZS50b1N0cmluZyB0byBsZXQgdGhlbSBsb29rIGxpa2UgbmF0aXZlXG4gICAgY29uc3Qgb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuICAgIGNvbnN0IE9SSUdJTkFMX0RFTEVHQVRFX1NZTUJPTCA9IHpvbmVTeW1ib2woJ09yaWdpbmFsRGVsZWdhdGUnKTtcbiAgICBjb25zdCBQUk9NSVNFX1NZTUJPTCA9IHpvbmVTeW1ib2woJ1Byb21pc2UnKTtcbiAgICBjb25zdCBFUlJPUl9TWU1CT0wgPSB6b25lU3ltYm9sKCdFcnJvcicpO1xuICAgIGNvbnN0IG5ld0Z1bmN0aW9uVG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbERlbGVnYXRlID0gdGhpc1tPUklHSU5BTF9ERUxFR0FURV9TWU1CT0xdO1xuICAgICAgICAgICAgaWYgKG9yaWdpbmFsRGVsZWdhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9yaWdpbmFsRGVsZWdhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb25Ub1N0cmluZy5jYWxsKG9yaWdpbmFsRGVsZWdhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvcmlnaW5hbERlbGVnYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcyA9PT0gUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hdGl2ZVByb21pc2UgPSBnbG9iYWxbUFJPTUlTRV9TWU1CT0xdO1xuICAgICAgICAgICAgICAgIGlmIChuYXRpdmVQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcuY2FsbChuYXRpdmVQcm9taXNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcyA9PT0gRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuYXRpdmVFcnJvciA9IGdsb2JhbFtFUlJPUl9TWU1CT0xdO1xuICAgICAgICAgICAgICAgIGlmIChuYXRpdmVFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nLmNhbGwobmF0aXZlRXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nLmNhbGwodGhpcyk7XG4gICAgfTtcbiAgICBuZXdGdW5jdGlvblRvU3RyaW5nW09SSUdJTkFMX0RFTEVHQVRFX1NZTUJPTF0gPSBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmc7XG4gICAgRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nID0gbmV3RnVuY3Rpb25Ub1N0cmluZztcbiAgICAvLyBwYXRjaCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nIHRvIGxldCB0aGVtIGxvb2sgbGlrZSBuYXRpdmVcbiAgICBjb25zdCBvcmlnaW5hbE9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgICBjb25zdCBQUk9NSVNFX09CSkVDVF9UT19TVFJJTkcgPSAnW29iamVjdCBQcm9taXNlXSc7XG4gICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBQcm9taXNlID09PSAnZnVuY3Rpb24nICYmIHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gUFJPTUlTRV9PQkpFQ1RfVE9fU1RSSU5HO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcmlnaW5hbE9iamVjdFRvU3RyaW5nLmNhbGwodGhpcyk7XG4gICAgfTtcbn0pO1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7bWlzc2luZ1JlcXVpcmV9XG4gKi9cbmxldCBwYXNzaXZlU3VwcG9ydGVkID0gZmFsc2U7XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAncGFzc2l2ZScsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHBhc3NpdmVTdXBwb3J0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gTm90ZTogV2UgcGFzcyB0aGUgYG9wdGlvbnNgIG9iamVjdCBhcyB0aGUgZXZlbnQgaGFuZGxlciB0b28uIFRoaXMgaXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGVcbiAgICAgICAgLy8gc2lnbmF0dXJlIG9mIGBhZGRFdmVudExpc3RlbmVyYCBvciBgcmVtb3ZlRXZlbnRMaXN0ZW5lcmAgYnV0IGVuYWJsZXMgdXMgdG8gcmVtb3ZlIHRoZSBoYW5kbGVyXG4gICAgICAgIC8vIHdpdGhvdXQgYW4gYWN0dWFsIGhhbmRsZXIuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0Jywgb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0ZXN0Jywgb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgcGFzc2l2ZVN1cHBvcnRlZCA9IGZhbHNlO1xuICAgIH1cbn1cbi8vIGFuIGlkZW50aWZpZXIgdG8gdGVsbCBab25lVGFzayBkbyBub3QgY3JlYXRlIGEgbmV3IGludm9rZSBjbG9zdXJlXG5jb25zdCBPUFRJTUlaRURfWk9ORV9FVkVOVF9UQVNLX0RBVEEgPSB7XG4gICAgdXNlRzogdHJ1ZVxufTtcbmNvbnN0IHpvbmVTeW1ib2xFdmVudE5hbWVzID0ge307XG5jb25zdCBnbG9iYWxTb3VyY2VzID0ge307XG5jb25zdCBFVkVOVF9OQU1FX1NZTUJPTF9SRUdYID0gbmV3IFJlZ0V4cCgnXicgKyBaT05FX1NZTUJPTF9QUkVGSVggKyAnKFxcXFx3KykodHJ1ZXxmYWxzZSkkJyk7XG5jb25zdCBJTU1FRElBVEVfUFJPUEFHQVRJT05fU1lNQk9MID0gem9uZVN5bWJvbCgncHJvcGFnYXRpb25TdG9wcGVkJyk7XG5mdW5jdGlvbiBwcmVwYXJlRXZlbnROYW1lcyhldmVudE5hbWUsIGV2ZW50TmFtZVRvU3RyaW5nKSB7XG4gICAgY29uc3QgZmFsc2VFdmVudE5hbWUgPSAoZXZlbnROYW1lVG9TdHJpbmcgPyBldmVudE5hbWVUb1N0cmluZyhldmVudE5hbWUpIDogZXZlbnROYW1lKSArIEZBTFNFX1NUUjtcbiAgICBjb25zdCB0cnVlRXZlbnROYW1lID0gKGV2ZW50TmFtZVRvU3RyaW5nID8gZXZlbnROYW1lVG9TdHJpbmcoZXZlbnROYW1lKSA6IGV2ZW50TmFtZSkgKyBUUlVFX1NUUjtcbiAgICBjb25zdCBzeW1ib2wgPSBaT05FX1NZTUJPTF9QUkVGSVggKyBmYWxzZUV2ZW50TmFtZTtcbiAgICBjb25zdCBzeW1ib2xDYXB0dXJlID0gWk9ORV9TWU1CT0xfUFJFRklYICsgdHJ1ZUV2ZW50TmFtZTtcbiAgICB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdID0ge307XG4gICAgem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXVtGQUxTRV9TVFJdID0gc3ltYm9sO1xuICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV1bVFJVRV9TVFJdID0gc3ltYm9sQ2FwdHVyZTtcbn1cbmZ1bmN0aW9uIHBhdGNoRXZlbnRUYXJnZXQoX2dsb2JhbCwgYXBpLCBhcGlzLCBwYXRjaE9wdGlvbnMpIHtcbiAgICBjb25zdCBBRERfRVZFTlRfTElTVEVORVIgPSAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5hZGQpIHx8IEFERF9FVkVOVF9MSVNURU5FUl9TVFI7XG4gICAgY29uc3QgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSID0gKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMucm0pIHx8IFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFI7XG4gICAgY29uc3QgTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSID0gKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMubGlzdGVuZXJzKSB8fCAnZXZlbnRMaXN0ZW5lcnMnO1xuICAgIGNvbnN0IFJFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSID0gKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMucm1BbGwpIHx8ICdyZW1vdmVBbGxMaXN0ZW5lcnMnO1xuICAgIGNvbnN0IHpvbmVTeW1ib2xBZGRFdmVudExpc3RlbmVyID0gem9uZVN5bWJvbChBRERfRVZFTlRfTElTVEVORVIpO1xuICAgIGNvbnN0IEFERF9FVkVOVF9MSVNURU5FUl9TT1VSQ0UgPSAnLicgKyBBRERfRVZFTlRfTElTVEVORVIgKyAnOic7XG4gICAgY29uc3QgUFJFUEVORF9FVkVOVF9MSVNURU5FUiA9ICdwcmVwZW5kTGlzdGVuZXInO1xuICAgIGNvbnN0IFBSRVBFTkRfRVZFTlRfTElTVEVORVJfU09VUkNFID0gJy4nICsgUFJFUEVORF9FVkVOVF9MSVNURU5FUiArICc6JztcbiAgICBjb25zdCBpbnZva2VUYXNrID0gZnVuY3Rpb24gKHRhc2ssIHRhcmdldCwgZXZlbnQpIHtcbiAgICAgICAgLy8gZm9yIGJldHRlciBwZXJmb3JtYW5jZSwgY2hlY2sgaXNSZW1vdmVkIHdoaWNoIGlzIHNldFxuICAgICAgICAvLyBieSByZW1vdmVFdmVudExpc3RlbmVyXG4gICAgICAgIGlmICh0YXNrLmlzUmVtb3ZlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbGVnYXRlID0gdGFzay5jYWxsYmFjaztcbiAgICAgICAgaWYgKHR5cGVvZiBkZWxlZ2F0ZSA9PT0gJ29iamVjdCcgJiYgZGVsZWdhdGUuaGFuZGxlRXZlbnQpIHtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgYmluZCB2ZXJzaW9uIG9mIGhhbmRsZUV2ZW50IHdoZW4gaW52b2tlXG4gICAgICAgICAgICB0YXNrLmNhbGxiYWNrID0gKGV2ZW50KSA9PiBkZWxlZ2F0ZS5oYW5kbGVFdmVudChldmVudCk7XG4gICAgICAgICAgICB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPSBkZWxlZ2F0ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpbnZva2Ugc3RhdGljIHRhc2suaW52b2tlXG4gICAgICAgIC8vIG5lZWQgdG8gdHJ5L2NhdGNoIGVycm9yIGhlcmUsIG90aGVyd2lzZSwgdGhlIGVycm9yIGluIG9uZSBldmVudCBsaXN0ZW5lclxuICAgICAgICAvLyB3aWxsIGJyZWFrIHRoZSBleGVjdXRpb25zIG9mIHRoZSBvdGhlciBldmVudCBsaXN0ZW5lcnMuIEFsc28gZXJyb3Igd2lsbFxuICAgICAgICAvLyBub3QgcmVtb3ZlIHRoZSBldmVudCBsaXN0ZW5lciB3aGVuIGBvbmNlYCBvcHRpb25zIGlzIHRydWUuXG4gICAgICAgIGxldCBlcnJvcjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRhc2suaW52b2tlKHRhc2ssIHRhcmdldCwgW2V2ZW50XSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZXJyb3IgPSBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRhc2sub3B0aW9ucztcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmIG9wdGlvbnMub25jZSkge1xuICAgICAgICAgICAgLy8gaWYgb3B0aW9ucy5vbmNlIGlzIHRydWUsIGFmdGVyIGludm9rZSBvbmNlIHJlbW92ZSBsaXN0ZW5lciBoZXJlXG4gICAgICAgICAgICAvLyBvbmx5IGJyb3dzZXIgbmVlZCB0byBkbyB0aGlzLCBub2RlanMgZXZlbnRFbWl0dGVyIHdpbGwgY2FsIHJlbW92ZUxpc3RlbmVyXG4gICAgICAgICAgICAvLyBpbnNpZGUgRXZlbnRFbWl0dGVyLm9uY2VcbiAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlID0gdGFzay5vcmlnaW5hbERlbGVnYXRlID8gdGFzay5vcmlnaW5hbERlbGVnYXRlIDogdGFzay5jYWxsYmFjaztcbiAgICAgICAgICAgIHRhcmdldFtSRU1PVkVfRVZFTlRfTElTVEVORVJdLmNhbGwodGFyZ2V0LCBldmVudC50eXBlLCBkZWxlZ2F0ZSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH07XG4gICAgZnVuY3Rpb24gZ2xvYmFsQ2FsbGJhY2soY29udGV4dCwgZXZlbnQsIGlzQ2FwdHVyZSkge1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy85MTEsIGluIElFLCBzb21ldGltZXNcbiAgICAgICAgLy8gZXZlbnQgd2lsbCBiZSB1bmRlZmluZWQsIHNvIHdlIG5lZWQgdG8gdXNlIHdpbmRvdy5ldmVudFxuICAgICAgICBldmVudCA9IGV2ZW50IHx8IF9nbG9iYWwuZXZlbnQ7XG4gICAgICAgIGlmICghZXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBldmVudC50YXJnZXQgaXMgbmVlZGVkIGZvciBTYW1zdW5nIFRWIGFuZCBTb3VyY2VCdWZmZXJcbiAgICAgICAgLy8gfHwgZ2xvYmFsIGlzIG5lZWRlZCBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy8xOTBcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gY29udGV4dCB8fCBldmVudC50YXJnZXQgfHwgX2dsb2JhbDtcbiAgICAgICAgY29uc3QgdGFza3MgPSB0YXJnZXRbem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnQudHlwZV1baXNDYXB0dXJlID8gVFJVRV9TVFIgOiBGQUxTRV9TVFJdXTtcbiAgICAgICAgaWYgKHRhc2tzKSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvcnMgPSBbXTtcbiAgICAgICAgICAgIC8vIGludm9rZSBhbGwgdGFza3Mgd2hpY2ggYXR0YWNoZWQgdG8gY3VycmVudCB0YXJnZXQgd2l0aCBnaXZlbiBldmVudC50eXBlIGFuZCBjYXB0dXJlID0gZmFsc2VcbiAgICAgICAgICAgIC8vIGZvciBwZXJmb3JtYW5jZSBjb25jZXJuLCBpZiB0YXNrLmxlbmd0aCA9PT0gMSwganVzdCBpbnZva2VcbiAgICAgICAgICAgIGlmICh0YXNrcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBpbnZva2VUYXNrKHRhc2tzWzBdLCB0YXJnZXQsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICBlcnIgJiYgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzgzNlxuICAgICAgICAgICAgICAgIC8vIGNvcHkgdGhlIHRhc2tzIGFycmF5IGJlZm9yZSBpbnZva2UsIHRvIGF2b2lkXG4gICAgICAgICAgICAgICAgLy8gdGhlIGNhbGxiYWNrIHdpbGwgcmVtb3ZlIGl0c2VsZiBvciBvdGhlciBsaXN0ZW5lclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvcHlUYXNrcyA9IHRhc2tzLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3B5VGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50W0lNTUVESUFURV9QUk9QQUdBVElPTl9TWU1CT0xdID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBpbnZva2VUYXNrKGNvcHlUYXNrc1tpXSwgdGFyZ2V0LCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGVyciAmJiBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNpbmNlIHRoZXJlIGlzIG9ubHkgb25lIGVycm9yLCB3ZSBkb24ndCBuZWVkIHRvIHNjaGVkdWxlIG1pY3JvVGFza1xuICAgICAgICAgICAgLy8gdG8gdGhyb3cgdGhlIGVycm9yLlxuICAgICAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcnNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBlcnJvcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGFwaS5uYXRpdmVTY2hlZHVsZU1pY3JvVGFzaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBnbG9iYWwgc2hhcmVkIHpvbmVBd2FyZUNhbGxiYWNrIHRvIGhhbmRsZSBhbGwgZXZlbnQgY2FsbGJhY2sgd2l0aCBjYXB0dXJlID0gZmFsc2VcbiAgICBjb25zdCBnbG9iYWxab25lQXdhcmVDYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICByZXR1cm4gZ2xvYmFsQ2FsbGJhY2sodGhpcywgZXZlbnQsIGZhbHNlKTtcbiAgICB9O1xuICAgIC8vIGdsb2JhbCBzaGFyZWQgem9uZUF3YXJlQ2FsbGJhY2sgdG8gaGFuZGxlIGFsbCBldmVudCBjYWxsYmFjayB3aXRoIGNhcHR1cmUgPSB0cnVlXG4gICAgY29uc3QgZ2xvYmFsWm9uZUF3YXJlQ2FwdHVyZUNhbGxiYWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBnbG9iYWxDYWxsYmFjayh0aGlzLCBldmVudCwgdHJ1ZSk7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBwYXRjaEV2ZW50VGFyZ2V0TWV0aG9kcyhvYmosIHBhdGNoT3B0aW9ucykge1xuICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCB1c2VHbG9iYWxDYWxsYmFjayA9IHRydWU7XG4gICAgICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnVzZUcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdXNlR2xvYmFsQ2FsbGJhY2sgPSBwYXRjaE9wdGlvbnMudXNlRztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2YWxpZGF0ZUhhbmRsZXIgPSBwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnZoO1xuICAgICAgICBsZXQgY2hlY2tEdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICBpZiAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5jaGtEdXAgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2hlY2tEdXBsaWNhdGUgPSBwYXRjaE9wdGlvbnMuY2hrRHVwO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXR1cm5UYXJnZXQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMucnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuVGFyZ2V0ID0gcGF0Y2hPcHRpb25zLnJ0O1xuICAgICAgICB9XG4gICAgICAgIGxldCBwcm90byA9IG9iajtcbiAgICAgICAgd2hpbGUgKHByb3RvICYmICFwcm90by5oYXNPd25Qcm9wZXJ0eShBRERfRVZFTlRfTElTVEVORVIpKSB7XG4gICAgICAgICAgICBwcm90byA9IE9iamVjdEdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByb3RvICYmIG9ialtBRERfRVZFTlRfTElTVEVORVJdKSB7XG4gICAgICAgICAgICAvLyBzb21laG93IHdlIGRpZCBub3QgZmluZCBpdCwgYnV0IHdlIGNhbiBzZWUgaXQuIFRoaXMgaGFwcGVucyBvbiBJRSBmb3IgV2luZG93IHByb3BlcnRpZXMuXG4gICAgICAgICAgICBwcm90byA9IG9iajtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByb3RvKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3RvW3pvbmVTeW1ib2xBZGRFdmVudExpc3RlbmVyXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGV2ZW50TmFtZVRvU3RyaW5nID0gcGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5ldmVudE5hbWVUb1N0cmluZztcbiAgICAgICAgLy8gYSBzaGFyZWQgZ2xvYmFsIHRhc2tEYXRhIHRvIHBhc3MgZGF0YSBmb3Igc2NoZWR1bGVFdmVudFRhc2tcbiAgICAgICAgLy8gc28gd2UgZG8gbm90IG5lZWQgdG8gY3JlYXRlIGEgbmV3IG9iamVjdCBqdXN0IGZvciBwYXNzIHNvbWUgZGF0YVxuICAgICAgICBjb25zdCB0YXNrRGF0YSA9IHt9O1xuICAgICAgICBjb25zdCBuYXRpdmVBZGRFdmVudExpc3RlbmVyID0gcHJvdG9bem9uZVN5bWJvbEFkZEV2ZW50TGlzdGVuZXJdID0gcHJvdG9bQUREX0VWRU5UX0xJU1RFTkVSXTtcbiAgICAgICAgY29uc3QgbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lciA9IHByb3RvW3pvbmVTeW1ib2woUkVNT1ZFX0VWRU5UX0xJU1RFTkVSKV0gPVxuICAgICAgICAgICAgcHJvdG9bUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXTtcbiAgICAgICAgY29uc3QgbmF0aXZlTGlzdGVuZXJzID0gcHJvdG9bem9uZVN5bWJvbChMSVNURU5FUlNfRVZFTlRfTElTVEVORVIpXSA9XG4gICAgICAgICAgICBwcm90b1tMSVNURU5FUlNfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICBjb25zdCBuYXRpdmVSZW1vdmVBbGxMaXN0ZW5lcnMgPSBwcm90b1t6b25lU3ltYm9sKFJFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSKV0gPVxuICAgICAgICAgICAgcHJvdG9bUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICBsZXQgbmF0aXZlUHJlcGVuZEV2ZW50TGlzdGVuZXI7XG4gICAgICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnByZXBlbmQpIHtcbiAgICAgICAgICAgIG5hdGl2ZVByZXBlbmRFdmVudExpc3RlbmVyID0gcHJvdG9bem9uZVN5bWJvbChwYXRjaE9wdGlvbnMucHJlcGVuZCldID1cbiAgICAgICAgICAgICAgICBwcm90b1twYXRjaE9wdGlvbnMucHJlcGVuZF07XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoaXMgdXRpbCBmdW5jdGlvbiB3aWxsIGJ1aWxkIGFuIG9wdGlvbiBvYmplY3Qgd2l0aCBwYXNzaXZlIG9wdGlvblxuICAgICAgICAgKiB0byBoYW5kbGUgYWxsIHBvc3NpYmxlIGlucHV0IGZyb20gdGhlIHVzZXIuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBidWlsZEV2ZW50TGlzdGVuZXJPcHRpb25zKG9wdGlvbnMsIHBhc3NpdmUpIHtcbiAgICAgICAgICAgIGlmICghcGFzc2l2ZVN1cHBvcnRlZCAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIC8vIGRvZXNuJ3Qgc3VwcG9ydCBwYXNzaXZlIGJ1dCB1c2VyIHdhbnQgdG8gcGFzcyBhbiBvYmplY3QgYXMgb3B0aW9ucy5cbiAgICAgICAgICAgICAgICAvLyB0aGlzIHdpbGwgbm90IHdvcmsgb24gc29tZSBvbGQgYnJvd3Nlciwgc28gd2UganVzdCBwYXNzIGEgYm9vbGVhblxuICAgICAgICAgICAgICAgIC8vIGFzIHVzZUNhcHR1cmUgcGFyYW1ldGVyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhb3B0aW9ucy5jYXB0dXJlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFwYXNzaXZlU3VwcG9ydGVkIHx8ICFwYXNzaXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGNhcHR1cmU6IG9wdGlvbnMsIHBhc3NpdmU6IHRydWUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHBhc3NpdmU6IHRydWUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgb3B0aW9ucy5wYXNzaXZlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLm9wdGlvbnMsIHBhc3NpdmU6IHRydWUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN1c3RvbVNjaGVkdWxlR2xvYmFsID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFscmVhZHkgYSB0YXNrIGZvciB0aGUgZXZlbnROYW1lICsgY2FwdHVyZSxcbiAgICAgICAgICAgIC8vIGp1c3QgcmV0dXJuLCBiZWNhdXNlIHdlIHVzZSB0aGUgc2hhcmVkIGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrIGhlcmUuXG4gICAgICAgICAgICBpZiAodGFza0RhdGEuaXNFeGlzdGluZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuYXRpdmVBZGRFdmVudExpc3RlbmVyLmNhbGwodGFza0RhdGEudGFyZ2V0LCB0YXNrRGF0YS5ldmVudE5hbWUsIHRhc2tEYXRhLmNhcHR1cmUgPyBnbG9iYWxab25lQXdhcmVDYXB0dXJlQ2FsbGJhY2sgOiBnbG9iYWxab25lQXdhcmVDYWxsYmFjaywgdGFza0RhdGEub3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGN1c3RvbUNhbmNlbEdsb2JhbCA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgICAgICAvLyBpZiB0YXNrIGlzIG5vdCBtYXJrZWQgYXMgaXNSZW1vdmVkLCB0aGlzIGNhbGwgaXMgZGlyZWN0bHlcbiAgICAgICAgICAgIC8vIGZyb20gWm9uZS5wcm90b3R5cGUuY2FuY2VsVGFzaywgd2Ugc2hvdWxkIHJlbW92ZSB0aGUgdGFza1xuICAgICAgICAgICAgLy8gZnJvbSB0YXNrc0xpc3Qgb2YgdGFyZ2V0IGZpcnN0XG4gICAgICAgICAgICBpZiAoIXRhc2suaXNSZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3ltYm9sRXZlbnROYW1lcyA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW3Rhc2suZXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICBsZXQgc3ltYm9sRXZlbnROYW1lO1xuICAgICAgICAgICAgICAgIGlmIChzeW1ib2xFdmVudE5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbEV2ZW50TmFtZSA9IHN5bWJvbEV2ZW50TmFtZXNbdGFzay5jYXB0dXJlID8gVFJVRV9TVFIgOiBGQUxTRV9TVFJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZ1Rhc2tzID0gc3ltYm9sRXZlbnROYW1lICYmIHRhc2sudGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nVGFza3MpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleGlzdGluZ1Rhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZ1Rhc2sgPSBleGlzdGluZ1Rhc2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nVGFzayA9PT0gdGFzaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFza3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldCBpc1JlbW92ZWQgdG8gZGF0YSBmb3IgZmFzdGVyIGludm9rZVRhc2sgY2hlY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLmlzUmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nVGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbCB0YXNrcyBmb3IgdGhlIGV2ZW50TmFtZSArIGNhcHR1cmUgaGF2ZSBnb25lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2sgYW5kIHJlbW92ZSB0aGUgdGFzayBjYWNoZSBmcm9tIHRhcmdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLmFsbFJlbW92ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnRhcmdldFtzeW1ib2xFdmVudE5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBhbGwgdGFza3MgZm9yIHRoZSBldmVudE5hbWUgKyBjYXB0dXJlIGhhdmUgZ29uZSxcbiAgICAgICAgICAgIC8vIHdlIHdpbGwgcmVhbGx5IHJlbW92ZSB0aGUgZ2xvYmFsIGV2ZW50IGNhbGxiYWNrLFxuICAgICAgICAgICAgLy8gaWYgbm90LCByZXR1cm5cbiAgICAgICAgICAgIGlmICghdGFzay5hbGxSZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIuY2FsbCh0YXNrLnRhcmdldCwgdGFzay5ldmVudE5hbWUsIHRhc2suY2FwdHVyZSA/IGdsb2JhbFpvbmVBd2FyZUNhcHR1cmVDYWxsYmFjayA6IGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrLCB0YXNrLm9wdGlvbnMpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjdXN0b21TY2hlZHVsZU5vbkdsb2JhbCA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgICAgICByZXR1cm4gbmF0aXZlQWRkRXZlbnRMaXN0ZW5lci5jYWxsKHRhc2tEYXRhLnRhcmdldCwgdGFza0RhdGEuZXZlbnROYW1lLCB0YXNrLmludm9rZSwgdGFza0RhdGEub3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGN1c3RvbVNjaGVkdWxlUHJlcGVuZCA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgICAgICByZXR1cm4gbmF0aXZlUHJlcGVuZEV2ZW50TGlzdGVuZXIuY2FsbCh0YXNrRGF0YS50YXJnZXQsIHRhc2tEYXRhLmV2ZW50TmFtZSwgdGFzay5pbnZva2UsIHRhc2tEYXRhLm9wdGlvbnMpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjdXN0b21DYW5jZWxOb25HbG9iYWwgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIuY2FsbCh0YXNrLnRhcmdldCwgdGFzay5ldmVudE5hbWUsIHRhc2suaW52b2tlLCB0YXNrLm9wdGlvbnMpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjdXN0b21TY2hlZHVsZSA9IHVzZUdsb2JhbENhbGxiYWNrID8gY3VzdG9tU2NoZWR1bGVHbG9iYWwgOiBjdXN0b21TY2hlZHVsZU5vbkdsb2JhbDtcbiAgICAgICAgY29uc3QgY3VzdG9tQ2FuY2VsID0gdXNlR2xvYmFsQ2FsbGJhY2sgPyBjdXN0b21DYW5jZWxHbG9iYWwgOiBjdXN0b21DYW5jZWxOb25HbG9iYWw7XG4gICAgICAgIGNvbnN0IGNvbXBhcmVUYXNrQ2FsbGJhY2tWc0RlbGVnYXRlID0gZnVuY3Rpb24gKHRhc2ssIGRlbGVnYXRlKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlT2ZEZWxlZ2F0ZSA9IHR5cGVvZiBkZWxlZ2F0ZTtcbiAgICAgICAgICAgIHJldHVybiAodHlwZU9mRGVsZWdhdGUgPT09ICdmdW5jdGlvbicgJiYgdGFzay5jYWxsYmFjayA9PT0gZGVsZWdhdGUpIHx8XG4gICAgICAgICAgICAgICAgKHR5cGVPZkRlbGVnYXRlID09PSAnb2JqZWN0JyAmJiB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPT09IGRlbGVnYXRlKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY29tcGFyZSA9IChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmRpZmYpID8gcGF0Y2hPcHRpb25zLmRpZmYgOiBjb21wYXJlVGFza0NhbGxiYWNrVnNEZWxlZ2F0ZTtcbiAgICAgICAgY29uc3QgdW5wYXRjaGVkRXZlbnRzID0gWm9uZVt6b25lU3ltYm9sKCdVTlBBVENIRURfRVZFTlRTJyldO1xuICAgICAgICBjb25zdCBwYXNzaXZlRXZlbnRzID0gX2dsb2JhbFt6b25lU3ltYm9sKCdQQVNTSVZFX0VWRU5UUycpXTtcbiAgICAgICAgY29uc3QgbWFrZUFkZExpc3RlbmVyID0gZnVuY3Rpb24gKG5hdGl2ZUxpc3RlbmVyLCBhZGRTb3VyY2UsIGN1c3RvbVNjaGVkdWxlRm4sIGN1c3RvbUNhbmNlbEZuLCByZXR1cm5UYXJnZXQgPSBmYWxzZSwgcHJlcGVuZCA9IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMgfHwgX2dsb2JhbDtcbiAgICAgICAgICAgICAgICBsZXQgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnRyYW5zZmVyRXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IHBhdGNoT3B0aW9ucy50cmFuc2ZlckV2ZW50TmFtZShldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgZGVsZWdhdGUgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICAgICAgaWYgKCFkZWxlZ2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmF0aXZlTGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGlzTm9kZSAmJiBldmVudE5hbWUgPT09ICd1bmNhdWdodEV4Y2VwdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG9uJ3QgcGF0Y2ggdW5jYXVnaHRFeGNlcHRpb24gb2Ygbm9kZWpzIHRvIHByZXZlbnQgZW5kbGVzcyBsb29wXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYXRpdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBkb24ndCBjcmVhdGUgdGhlIGJpbmQgZGVsZWdhdGUgZnVuY3Rpb24gZm9yIGhhbmRsZUV2ZW50XG4gICAgICAgICAgICAgICAgLy8gY2FzZSBoZXJlIHRvIGltcHJvdmUgYWRkRXZlbnRMaXN0ZW5lciBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICAgIC8vIHdlIHdpbGwgY3JlYXRlIHRoZSBiaW5kIGRlbGVnYXRlIHdoZW4gaW52b2tlXG4gICAgICAgICAgICAgICAgbGV0IGlzSGFuZGxlRXZlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRlbGVnYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGVsZWdhdGUuaGFuZGxlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuYXRpdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlzSGFuZGxlRXZlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodmFsaWRhdGVIYW5kbGVyICYmICF2YWxpZGF0ZUhhbmRsZXIobmF0aXZlTGlzdGVuZXIsIGRlbGVnYXRlLCB0YXJnZXQsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBwYXNzaXZlID0gcGFzc2l2ZVN1cHBvcnRlZCAmJiAhIXBhc3NpdmVFdmVudHMgJiYgcGFzc2l2ZUV2ZW50cy5pbmRleE9mKGV2ZW50TmFtZSkgIT09IC0xO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBidWlsZEV2ZW50TGlzdGVuZXJPcHRpb25zKGFyZ3VtZW50c1syXSwgcGFzc2l2ZSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2lnbmFsID0gb3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgb3B0aW9ucy5zaWduYWwgJiZcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9wdGlvbnMuc2lnbmFsID09PSAnb2JqZWN0JyA/XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2lnbmFsIDpcbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGlmIChzaWduYWw/LmFib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHNpZ25hbCBpcyBhbiBhYm9ydGVkIG9uZSwganVzdCByZXR1cm4gd2l0aG91dCBhdHRhY2hpbmcgdGhlIGV2ZW50IGxpc3RlbmVyLlxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh1bnBhdGNoZWRFdmVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgdW5wYXRjaGVkIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1bnBhdGNoZWRFdmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudE5hbWUgPT09IHVucGF0Y2hlZEV2ZW50c1tpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXNzaXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuYXRpdmVMaXN0ZW5lci5jYWxsKHRhcmdldCwgZXZlbnROYW1lLCBkZWxlZ2F0ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmF0aXZlTGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgY2FwdHVyZSA9ICFvcHRpb25zID8gZmFsc2UgOiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Jvb2xlYW4nID8gdHJ1ZSA6IG9wdGlvbnMuY2FwdHVyZTtcbiAgICAgICAgICAgICAgICBjb25zdCBvbmNlID0gb3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgPyBvcHRpb25zLm9uY2UgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCB6b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICAgICAgICAgIGxldCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoIXN5bWJvbEV2ZW50TmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlcGFyZUV2ZW50TmFtZXMoZXZlbnROYW1lLCBldmVudE5hbWVUb1N0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbEV2ZW50TmFtZXMgPSB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWUgPSBzeW1ib2xFdmVudE5hbWVzW2NhcHR1cmUgPyBUUlVFX1NUUiA6IEZBTFNFX1NUUl07XG4gICAgICAgICAgICAgICAgbGV0IGV4aXN0aW5nVGFza3MgPSB0YXJnZXRbc3ltYm9sRXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICBsZXQgaXNFeGlzdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdGluZ1Rhc2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFscmVhZHkgaGF2ZSB0YXNrIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgICAgICAgICAgaXNFeGlzdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleGlzdGluZ1Rhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUoZXhpc3RpbmdUYXNrc1tpXSwgZGVsZWdhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhbWUgY2FsbGJhY2ssIHNhbWUgY2FwdHVyZSwgc2FtZSBldmVudCBuYW1lLCBqdXN0IHJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBleGlzdGluZ1Rhc2tzID0gdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHNvdXJjZTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb25zdHJ1Y3Rvck5hbWUgPSB0YXJnZXQuY29uc3RydWN0b3JbJ25hbWUnXTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRTb3VyY2UgPSBnbG9iYWxTb3VyY2VzW2NvbnN0cnVjdG9yTmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldFNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2UgPSB0YXJnZXRTb3VyY2VbZXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlID0gY29uc3RydWN0b3JOYW1lICsgYWRkU291cmNlICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChldmVudE5hbWVUb1N0cmluZyA/IGV2ZW50TmFtZVRvU3RyaW5nKGV2ZW50TmFtZSkgOiBldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBkbyBub3QgY3JlYXRlIGEgbmV3IG9iamVjdCBhcyB0YXNrLmRhdGEgdG8gcGFzcyB0aG9zZSB0aGluZ3NcbiAgICAgICAgICAgICAgICAvLyBqdXN0IHVzZSB0aGUgZ2xvYmFsIHNoYXJlZCBvbmVcbiAgICAgICAgICAgICAgICB0YXNrRGF0YS5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBhZGRFdmVudExpc3RlbmVyIHdpdGggb25jZSBvcHRpb25zLCB3ZSBkb24ndCBwYXNzIGl0IHRvXG4gICAgICAgICAgICAgICAgICAgIC8vIG5hdGl2ZSBhZGRFdmVudExpc3RlbmVyLCBpbnN0ZWFkIHdlIGtlZXAgdGhlIG9uY2Ugc2V0dGluZ1xuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgaGFuZGxlIG91cnNlbHZlcy5cbiAgICAgICAgICAgICAgICAgICAgdGFza0RhdGEub3B0aW9ucy5vbmNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRhc2tEYXRhLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgICAgICAgICB0YXNrRGF0YS5jYXB0dXJlID0gY2FwdHVyZTtcbiAgICAgICAgICAgICAgICB0YXNrRGF0YS5ldmVudE5hbWUgPSBldmVudE5hbWU7XG4gICAgICAgICAgICAgICAgdGFza0RhdGEuaXNFeGlzdGluZyA9IGlzRXhpc3Rpbmc7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHVzZUdsb2JhbENhbGxiYWNrID8gT1BUSU1JWkVEX1pPTkVfRVZFTlRfVEFTS19EQVRBIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIC8vIGtlZXAgdGFza0RhdGEgaW50byBkYXRhIHRvIGFsbG93IG9uU2NoZWR1bGVFdmVudFRhc2sgdG8gYWNjZXNzIHRoZSB0YXNrIGluZm9ybWF0aW9uXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS50YXNrRGF0YSA9IHRhc2tEYXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2lnbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGFkZEV2ZW50TGlzdGVuZXIgd2l0aCBzaWduYWwgb3B0aW9ucywgd2UgZG9uJ3QgcGFzcyBpdCB0b1xuICAgICAgICAgICAgICAgICAgICAvLyBuYXRpdmUgYWRkRXZlbnRMaXN0ZW5lciwgaW5zdGVhZCB3ZSBrZWVwIHRoZSBzaWduYWwgc2V0dGluZ1xuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgaGFuZGxlIG91cnNlbHZlcy5cbiAgICAgICAgICAgICAgICAgICAgdGFza0RhdGEub3B0aW9ucy5zaWduYWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSB6b25lLnNjaGVkdWxlRXZlbnRUYXNrKHNvdXJjZSwgZGVsZWdhdGUsIGRhdGEsIGN1c3RvbVNjaGVkdWxlRm4sIGN1c3RvbUNhbmNlbEZuKTtcbiAgICAgICAgICAgICAgICBpZiAoc2lnbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIHRhc2sgaXMgc2NoZWR1bGVkLCB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBzaWduYWwgYmFjayB0byB0YXNrLm9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgdGFza0RhdGEub3B0aW9ucy5zaWduYWwgPSBzaWduYWw7XG4gICAgICAgICAgICAgICAgICAgIG5hdGl2ZUxpc3RlbmVyLmNhbGwoc2lnbmFsLCAnYWJvcnQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnpvbmUuY2FuY2VsVGFzayh0YXNrKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBzaG91bGQgY2xlYXIgdGFza0RhdGEudGFyZ2V0IHRvIGF2b2lkIG1lbW9yeSBsZWFrXG4gICAgICAgICAgICAgICAgLy8gaXNzdWUsIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIwNDQyXG4gICAgICAgICAgICAgICAgdGFza0RhdGEudGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAvLyBuZWVkIHRvIGNsZWFyIHVwIHRhc2tEYXRhIGJlY2F1c2UgaXQgaXMgYSBnbG9iYWwgb2JqZWN0XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS50YXNrRGF0YSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGhhdmUgdG8gc2F2ZSB0aG9zZSBpbmZvcm1hdGlvbiB0byB0YXNrIGluIGNhc2VcbiAgICAgICAgICAgICAgICAvLyBhcHBsaWNhdGlvbiBtYXkgY2FsbCB0YXNrLnpvbmUuY2FuY2VsVGFzaygpIGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vbmNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEoIXBhc3NpdmVTdXBwb3J0ZWQgJiYgdHlwZW9mIHRhc2sub3B0aW9ucyA9PT0gJ2Jvb2xlYW4nKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBub3Qgc3VwcG9ydCBwYXNzaXZlLCBhbmQgd2UgcGFzcyBhbiBvcHRpb24gb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGFkZEV2ZW50TGlzdGVuZXIsIHdlIHNob3VsZCBzYXZlIHRoZSBvcHRpb25zIHRvIHRhc2tcbiAgICAgICAgICAgICAgICAgICAgdGFzay5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGFzay50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgdGFzay5jYXB0dXJlID0gY2FwdHVyZTtcbiAgICAgICAgICAgICAgICB0YXNrLmV2ZW50TmFtZSA9IGV2ZW50TmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoaXNIYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIG9yaWdpbmFsIGRlbGVnYXRlIGZvciBjb21wYXJlIHRvIGNoZWNrIGR1cGxpY2F0ZVxuICAgICAgICAgICAgICAgICAgICB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPSBkZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFwcmVwZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFza3MucHVzaCh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFza3MudW5zaGlmdCh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJldHVyblRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHByb3RvW0FERF9FVkVOVF9MSVNURU5FUl0gPSBtYWtlQWRkTGlzdGVuZXIobmF0aXZlQWRkRXZlbnRMaXN0ZW5lciwgQUREX0VWRU5UX0xJU1RFTkVSX1NPVVJDRSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCwgcmV0dXJuVGFyZ2V0KTtcbiAgICAgICAgaWYgKG5hdGl2ZVByZXBlbmRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBwcm90b1tQUkVQRU5EX0VWRU5UX0xJU1RFTkVSXSA9IG1ha2VBZGRMaXN0ZW5lcihuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lciwgUFJFUEVORF9FVkVOVF9MSVNURU5FUl9TT1VSQ0UsIGN1c3RvbVNjaGVkdWxlUHJlcGVuZCwgY3VzdG9tQ2FuY2VsLCByZXR1cm5UYXJnZXQsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RvW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IF9nbG9iYWw7XG4gICAgICAgICAgICBsZXQgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBldmVudE5hbWUgPSBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBhcmd1bWVudHNbMl07XG4gICAgICAgICAgICBjb25zdCBjYXB0dXJlID0gIW9wdGlvbnMgPyBmYWxzZSA6IHR5cGVvZiBvcHRpb25zID09PSAnYm9vbGVhbicgPyB0cnVlIDogb3B0aW9ucy5jYXB0dXJlO1xuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGUgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICBpZiAoIWRlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2YWxpZGF0ZUhhbmRsZXIgJiZcbiAgICAgICAgICAgICAgICAhdmFsaWRhdGVIYW5kbGVyKG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIsIGRlbGVnYXRlLCB0YXJnZXQsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICAgICAgICAgIGxldCBzeW1ib2xFdmVudE5hbWU7XG4gICAgICAgICAgICBpZiAoc3ltYm9sRXZlbnROYW1lcykge1xuICAgICAgICAgICAgICAgIHN5bWJvbEV2ZW50TmFtZSA9IHN5bWJvbEV2ZW50TmFtZXNbY2FwdHVyZSA/IFRSVUVfU1RSIDogRkFMU0VfU1RSXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFza3MgPSBzeW1ib2xFdmVudE5hbWUgJiYgdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV07XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhpc3RpbmdUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZ1Rhc2sgPSBleGlzdGluZ1Rhc2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGFyZShleGlzdGluZ1Rhc2ssIGRlbGVnYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXQgaXNSZW1vdmVkIHRvIGRhdGEgZm9yIGZhc3RlciBpbnZva2VUYXNrIGNoZWNrXG4gICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZ1Rhc2suaXNSZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdGluZ1Rhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbCB0YXNrcyBmb3IgdGhlIGV2ZW50TmFtZSArIGNhcHR1cmUgaGF2ZSBnb25lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBnbG9iYWxab25lQXdhcmVDYWxsYmFjayBhbmQgcmVtb3ZlIHRoZSB0YXNrIGNhY2hlIGZyb20gdGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrLmFsbFJlbW92ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtzeW1ib2xFdmVudE5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbiB0aGUgdGFyZ2V0LCB3ZSBoYXZlIGFuIGV2ZW50IGxpc3RlbmVyIHdoaWNoIGlzIGFkZGVkIGJ5IG9uX3Byb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3VjaCBhcyB0YXJnZXQub25jbGljayA9IGZ1bmN0aW9uKCkge30sIHNvIHdlIG5lZWQgdG8gY2xlYXIgdGhpcyBpbnRlcm5hbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb3BlcnR5IHRvbyBpZiBhbGwgZGVsZWdhdGVzIGFsbCByZW1vdmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudE5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9uUHJvcGVydHlTeW1ib2wgPSBaT05FX1NZTUJPTF9QUkVGSVggKyAnT05fUFJPUEVSVFknICsgZXZlbnROYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbb25Qcm9wZXJ0eVN5bWJvbF0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFzay56b25lLmNhbmNlbFRhc2soZXhpc3RpbmdUYXNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXR1cm5UYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaXNzdWUgOTMwLCBkaWRuJ3QgZmluZCB0aGUgZXZlbnQgbmFtZSBvciBjYWxsYmFja1xuICAgICAgICAgICAgLy8gZnJvbSB6b25lIGtlcHQgZXhpc3RpbmdUYXNrcywgdGhlIGNhbGxiYWNrIG1heWJlXG4gICAgICAgICAgICAvLyBhZGRlZCBvdXRzaWRlIG9mIHpvbmUsIHdlIG5lZWQgdG8gY2FsbCBuYXRpdmUgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICAgICAgICAgICAgLy8gdG8gdHJ5IHRvIHJlbW92ZSBpdC5cbiAgICAgICAgICAgIHJldHVybiBuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICAgIHByb3RvW0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IF9nbG9iYWw7XG4gICAgICAgICAgICBsZXQgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBldmVudE5hbWUgPSBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IFtdO1xuICAgICAgICAgICAgY29uc3QgdGFza3MgPSBmaW5kRXZlbnRUYXNrcyh0YXJnZXQsIGV2ZW50TmFtZVRvU3RyaW5nID8gZXZlbnROYW1lVG9TdHJpbmcoZXZlbnROYW1lKSA6IGV2ZW50TmFtZSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFzayA9IHRhc2tzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBkZWxlZ2F0ZSA9IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA/IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA6IHRhc2suY2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzLnB1c2goZGVsZWdhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGxpc3RlbmVycztcbiAgICAgICAgfTtcbiAgICAgICAgcHJvdG9bUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVJdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcyB8fCBfZ2xvYmFsO1xuICAgICAgICAgICAgbGV0IGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIGlmICghZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRhcmdldCk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb3AgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IEVWRU5UX05BTUVfU1lNQk9MX1JFR1guZXhlYyhwcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGV2dE5hbWUgPSBtYXRjaCAmJiBtYXRjaFsxXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaW4gbm9kZWpzIEV2ZW50RW1pdHRlciwgcmVtb3ZlTGlzdGVuZXIgZXZlbnQgaXNcbiAgICAgICAgICAgICAgICAgICAgLy8gdXNlZCBmb3IgbW9uaXRvcmluZyB0aGUgcmVtb3ZlTGlzdGVuZXIgY2FsbCxcbiAgICAgICAgICAgICAgICAgICAgLy8gc28ganVzdCBrZWVwIHJlbW92ZUxpc3RlbmVyIGV2ZW50TGlzdGVuZXIgdW50aWxcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxsIG90aGVyIGV2ZW50TGlzdGVuZXJzIGFyZSByZW1vdmVkXG4gICAgICAgICAgICAgICAgICAgIGlmIChldnROYW1lICYmIGV2dE5hbWUgIT09ICdyZW1vdmVMaXN0ZW5lcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVJdLmNhbGwodGhpcywgZXZ0TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHJlbW92ZUxpc3RlbmVyIGxpc3RlbmVyIGZpbmFsbHlcbiAgICAgICAgICAgICAgICB0aGlzW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXS5jYWxsKHRoaXMsICdyZW1vdmVMaXN0ZW5lcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lID0gcGF0Y2hPcHRpb25zLnRyYW5zZmVyRXZlbnROYW1lKGV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHN5bWJvbEV2ZW50TmFtZXMgPSB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIGlmIChzeW1ib2xFdmVudE5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN5bWJvbEV2ZW50TmFtZSA9IHN5bWJvbEV2ZW50TmFtZXNbRkFMU0VfU1RSXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3ltYm9sQ2FwdHVyZUV2ZW50TmFtZSA9IHN5bWJvbEV2ZW50TmFtZXNbVFJVRV9TVFJdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXNrcyA9IHRhcmdldFtzeW1ib2xFdmVudE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXB0dXJlVGFza3MgPSB0YXJnZXRbc3ltYm9sQ2FwdHVyZUV2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXNrcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVtb3ZlVGFza3MgPSB0YXNrcy5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW1vdmVUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSByZW1vdmVUYXNrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVsZWdhdGUgPSB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPyB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgOiB0YXNrLmNhbGxiYWNrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXS5jYWxsKHRoaXMsIGV2ZW50TmFtZSwgZGVsZWdhdGUsIHRhc2sub3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhcHR1cmVUYXNrcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVtb3ZlVGFza3MgPSBjYXB0dXJlVGFza3Muc2xpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVtb3ZlVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXNrID0gcmVtb3ZlVGFza3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRlbGVnYXRlID0gdGFzay5vcmlnaW5hbERlbGVnYXRlID8gdGFzay5vcmlnaW5hbERlbGVnYXRlIDogdGFzay5jYWxsYmFjaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0uY2FsbCh0aGlzLCBldmVudE5hbWUsIGRlbGVnYXRlLCB0YXNrLm9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJldHVyblRhcmdldCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyBmb3IgbmF0aXZlIHRvU3RyaW5nIHBhdGNoXG4gICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tBRERfRVZFTlRfTElTVEVORVJdLCBuYXRpdmVBZGRFdmVudExpc3RlbmVyKTtcbiAgICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHByb3RvW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0sIG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICBpZiAobmF0aXZlUmVtb3ZlQWxsTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVJdLCBuYXRpdmVSZW1vdmVBbGxMaXN0ZW5lcnMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYXRpdmVMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tMSVNURU5FUlNfRVZFTlRfTElTVEVORVJdLCBuYXRpdmVMaXN0ZW5lcnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXBpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHRzW2ldID0gcGF0Y2hFdmVudFRhcmdldE1ldGhvZHMoYXBpc1tpXSwgcGF0Y2hPcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG59XG5mdW5jdGlvbiBmaW5kRXZlbnRUYXNrcyh0YXJnZXQsIGV2ZW50TmFtZSkge1xuICAgIGlmICghZXZlbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGZvdW5kVGFza3MgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgcHJvcCBpbiB0YXJnZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gRVZFTlRfTkFNRV9TWU1CT0xfUkVHWC5leGVjKHByb3ApO1xuICAgICAgICAgICAgbGV0IGV2dE5hbWUgPSBtYXRjaCAmJiBtYXRjaFsxXTtcbiAgICAgICAgICAgIGlmIChldnROYW1lICYmICghZXZlbnROYW1lIHx8IGV2dE5hbWUgPT09IGV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXNrcyA9IHRhcmdldFtwcm9wXTtcbiAgICAgICAgICAgICAgICBpZiAodGFza3MpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRUYXNrcy5wdXNoKHRhc2tzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm91bmRUYXNrcztcbiAgICB9XG4gICAgbGV0IHN5bWJvbEV2ZW50TmFtZSA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV07XG4gICAgaWYgKCFzeW1ib2xFdmVudE5hbWUpIHtcbiAgICAgICAgcHJlcGFyZUV2ZW50TmFtZXMoZXZlbnROYW1lKTtcbiAgICAgICAgc3ltYm9sRXZlbnROYW1lID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICB9XG4gICAgY29uc3QgY2FwdHVyZUZhbHNlVGFza3MgPSB0YXJnZXRbc3ltYm9sRXZlbnROYW1lW0ZBTFNFX1NUUl1dO1xuICAgIGNvbnN0IGNhcHR1cmVUcnVlVGFza3MgPSB0YXJnZXRbc3ltYm9sRXZlbnROYW1lW1RSVUVfU1RSXV07XG4gICAgaWYgKCFjYXB0dXJlRmFsc2VUYXNrcykge1xuICAgICAgICByZXR1cm4gY2FwdHVyZVRydWVUYXNrcyA/IGNhcHR1cmVUcnVlVGFza3Muc2xpY2UoKSA6IFtdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNhcHR1cmVUcnVlVGFza3MgPyBjYXB0dXJlRmFsc2VUYXNrcy5jb25jYXQoY2FwdHVyZVRydWVUYXNrcykgOlxuICAgICAgICAgICAgY2FwdHVyZUZhbHNlVGFza3Muc2xpY2UoKTtcbiAgICB9XG59XG5mdW5jdGlvbiBwYXRjaEV2ZW50UHJvdG90eXBlKGdsb2JhbCwgYXBpKSB7XG4gICAgY29uc3QgRXZlbnQgPSBnbG9iYWxbJ0V2ZW50J107XG4gICAgaWYgKEV2ZW50ICYmIEV2ZW50LnByb3RvdHlwZSkge1xuICAgICAgICBhcGkucGF0Y2hNZXRob2QoRXZlbnQucHJvdG90eXBlLCAnc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uJywgKGRlbGVnYXRlKSA9PiBmdW5jdGlvbiAoc2VsZiwgYXJncykge1xuICAgICAgICAgICAgc2VsZltJTU1FRElBVEVfUFJPUEFHQVRJT05fU1lNQk9MXSA9IHRydWU7XG4gICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIGNhbGwgdGhlIG5hdGl2ZSBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25cbiAgICAgICAgICAgIC8vIGluIGNhc2UgaW4gc29tZSBoeWJyaWQgYXBwbGljYXRpb24sIHNvbWUgcGFydCBvZlxuICAgICAgICAgICAgLy8gYXBwbGljYXRpb24gd2lsbCBiZSBjb250cm9sbGVkIGJ5IHpvbmUsIHNvbWUgYXJlIG5vdFxuICAgICAgICAgICAgZGVsZWdhdGUgJiYgZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcGF0Y2hDYWxsYmFja3MoYXBpLCB0YXJnZXQsIHRhcmdldE5hbWUsIG1ldGhvZCwgY2FsbGJhY2tzKSB7XG4gICAgY29uc3Qgc3ltYm9sID0gWm9uZS5fX3N5bWJvbF9fKG1ldGhvZCk7XG4gICAgaWYgKHRhcmdldFtzeW1ib2xdKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmF0aXZlRGVsZWdhdGUgPSB0YXJnZXRbc3ltYm9sXSA9IHRhcmdldFttZXRob2RdO1xuICAgIHRhcmdldFttZXRob2RdID0gZnVuY3Rpb24gKG5hbWUsIG9wdHMsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdHMgJiYgb3B0cy5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IGAke3RhcmdldE5hbWV9LiR7bWV0aG9kfTo6YCArIGNhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb3RvdHlwZSA9IG9wdHMucHJvdG90eXBlO1xuICAgICAgICAgICAgICAgIC8vIE5vdGU6IHRoZSBgcGF0Y2hDYWxsYmFja3NgIGlzIHVzZWQgZm9yIHBhdGNoaW5nIHRoZSBgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50YCBhbmRcbiAgICAgICAgICAgICAgICAvLyBgY3VzdG9tRWxlbWVudHMuZGVmaW5lYC4gV2UgZXhwbGljaXRseSB3cmFwIHRoZSBwYXRjaGluZyBjb2RlIGludG8gdHJ5LWNhdGNoIHNpbmNlXG4gICAgICAgICAgICAgICAgLy8gY2FsbGJhY2tzIG1heSBiZSBhbHJlYWR5IHBhdGNoZWQgYnkgb3RoZXIgd2ViIGNvbXBvbmVudHMgZnJhbWV3b3JrcyAoZS5nLiBMV0MpLCBhbmQgdGhleVxuICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhvc2UgcHJvcGVydGllcyBub24td3JpdGFibGUuIFRoaXMgbWVhbnMgdGhhdCBwYXRjaGluZyBjYWxsYmFjayB3aWxsIHRocm93IGFuIGVycm9yXG4gICAgICAgICAgICAgICAgLy8gYGNhbm5vdCBhc3NpZ24gdG8gcmVhZC1vbmx5IHByb3BlcnR5YC4gU2VlIHRoaXMgY29kZSBhcyBhbiBleGFtcGxlOlxuICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zYWxlc2ZvcmNlL2x3Yy9ibG9iL21hc3Rlci9wYWNrYWdlcy9AbHdjL2VuZ2luZS1jb3JlL3NyYy9mcmFtZXdvcmsvYmFzZS1icmlkZ2UtZWxlbWVudC50cyNMMTgwLUwxODZcbiAgICAgICAgICAgICAgICAvLyBXZSBkb24ndCB3YW50IHRvIHN0b3AgdGhlIGFwcGxpY2F0aW9uIHJlbmRlcmluZyBpZiB3ZSBjb3VsZG4ndCBwYXRjaCBzb21lXG4gICAgICAgICAgICAgICAgLy8gY2FsbGJhY2ssIGUuZy4gYGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja2AuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBhcGkuT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBhcGkud3JhcFdpdGhDdXJyZW50Wm9uZShkZXNjcmlwdG9yLnZhbHVlLCBzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5fcmVkZWZpbmVQcm9wZXJ0eShvcHRzLnByb3RvdHlwZSwgY2FsbGJhY2ssIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocHJvdG90eXBlW2NhbGxiYWNrXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3RvdHlwZVtjYWxsYmFja10gPSBhcGkud3JhcFdpdGhDdXJyZW50Wm9uZShwcm90b3R5cGVbY2FsbGJhY2tdLCBzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3RvdHlwZVtjYWxsYmFja10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3RvdHlwZVtjYWxsYmFja10gPSBhcGkud3JhcFdpdGhDdXJyZW50Wm9uZShwcm90b3R5cGVbY2FsbGJhY2tdLCBzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90ZTogd2UgbGVhdmUgdGhlIGNhdGNoIGJsb2NrIGVtcHR5IHNpbmNlIHRoZXJlJ3Mgbm8gd2F5IHRvIGhhbmRsZSB0aGUgZXJyb3IgcmVsYXRlZFxuICAgICAgICAgICAgICAgICAgICAvLyB0byBub24td3JpdGFibGUgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hdGl2ZURlbGVnYXRlLmNhbGwodGFyZ2V0LCBuYW1lLCBvcHRzLCBvcHRpb25zKTtcbiAgICB9O1xuICAgIGFwaS5hdHRhY2hPcmlnaW5Ub1BhdGNoZWQodGFyZ2V0W21ldGhvZF0sIG5hdGl2ZURlbGVnYXRlKTtcbn1cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBAc3VwcHJlc3Mge2dsb2JhbFRoaXN9XG4gKi9cbmZ1bmN0aW9uIGZpbHRlclByb3BlcnRpZXModGFyZ2V0LCBvblByb3BlcnRpZXMsIGlnbm9yZVByb3BlcnRpZXMpIHtcbiAgICBpZiAoIWlnbm9yZVByb3BlcnRpZXMgfHwgaWdub3JlUHJvcGVydGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9uUHJvcGVydGllcztcbiAgICB9XG4gICAgY29uc3QgdGlwID0gaWdub3JlUHJvcGVydGllcy5maWx0ZXIoaXAgPT4gaXAudGFyZ2V0ID09PSB0YXJnZXQpO1xuICAgIGlmICghdGlwIHx8IHRpcC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9uUHJvcGVydGllcztcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0SWdub3JlUHJvcGVydGllcyA9IHRpcFswXS5pZ25vcmVQcm9wZXJ0aWVzO1xuICAgIHJldHVybiBvblByb3BlcnRpZXMuZmlsdGVyKG9wID0+IHRhcmdldElnbm9yZVByb3BlcnRpZXMuaW5kZXhPZihvcCkgPT09IC0xKTtcbn1cbmZ1bmN0aW9uIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKHRhcmdldCwgb25Qcm9wZXJ0aWVzLCBpZ25vcmVQcm9wZXJ0aWVzLCBwcm90b3R5cGUpIHtcbiAgICAvLyBjaGVjayB3aGV0aGVyIHRhcmdldCBpcyBhdmFpbGFibGUsIHNvbWV0aW1lcyB0YXJnZXQgd2lsbCBiZSB1bmRlZmluZWRcbiAgICAvLyBiZWNhdXNlIGRpZmZlcmVudCBicm93c2VyIG9yIHNvbWUgM3JkIHBhcnR5IHBsdWdpbi5cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGZpbHRlcmVkUHJvcGVydGllcyA9IGZpbHRlclByb3BlcnRpZXModGFyZ2V0LCBvblByb3BlcnRpZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgIHBhdGNoT25Qcm9wZXJ0aWVzKHRhcmdldCwgZmlsdGVyZWRQcm9wZXJ0aWVzLCBwcm90b3R5cGUpO1xufVxuLyoqXG4gKiBHZXQgYWxsIGV2ZW50IG5hbWUgcHJvcGVydGllcyB3aGljaCB0aGUgZXZlbnQgbmFtZSBzdGFydHNXaXRoIGBvbmBcbiAqIGZyb20gdGhlIHRhcmdldCBvYmplY3QgaXRzZWxmLCBpbmhlcml0ZWQgcHJvcGVydGllcyBhcmUgbm90IGNvbnNpZGVyZWQuXG4gKi9cbmZ1bmN0aW9uIGdldE9uRXZlbnROYW1lcyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KVxuICAgICAgICAuZmlsdGVyKG5hbWUgPT4gbmFtZS5zdGFydHNXaXRoKCdvbicpICYmIG5hbWUubGVuZ3RoID4gMilcbiAgICAgICAgLm1hcChuYW1lID0+IG5hbWUuc3Vic3RyaW5nKDIpKTtcbn1cbmZ1bmN0aW9uIHByb3BlcnR5RGVzY3JpcHRvclBhdGNoKGFwaSwgX2dsb2JhbCkge1xuICAgIGlmIChpc05vZGUgJiYgIWlzTWl4KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKFpvbmVbYXBpLnN5bWJvbCgncGF0Y2hFdmVudHMnKV0pIHtcbiAgICAgICAgLy8gZXZlbnRzIGFyZSBhbHJlYWR5IGJlZW4gcGF0Y2hlZCBieSBsZWdhY3kgcGF0Y2guXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaWdub3JlUHJvcGVydGllcyA9IF9nbG9iYWxbJ19fWm9uZV9pZ25vcmVfb25fcHJvcGVydGllcyddO1xuICAgIC8vIGZvciBicm93c2VycyB0aGF0IHdlIGNhbiBwYXRjaCB0aGUgZGVzY3JpcHRvcjogIENocm9tZSAmIEZpcmVmb3hcbiAgICBsZXQgcGF0Y2hUYXJnZXRzID0gW107XG4gICAgaWYgKGlzQnJvd3Nlcikge1xuICAgICAgICBjb25zdCBpbnRlcm5hbFdpbmRvdyA9IHdpbmRvdztcbiAgICAgICAgcGF0Y2hUYXJnZXRzID0gcGF0Y2hUYXJnZXRzLmNvbmNhdChbXG4gICAgICAgICAgICAnRG9jdW1lbnQnLCAnU1ZHRWxlbWVudCcsICdFbGVtZW50JywgJ0hUTUxFbGVtZW50JywgJ0hUTUxCb2R5RWxlbWVudCcsICdIVE1MTWVkaWFFbGVtZW50JyxcbiAgICAgICAgICAgICdIVE1MRnJhbWVTZXRFbGVtZW50JywgJ0hUTUxGcmFtZUVsZW1lbnQnLCAnSFRNTElGcmFtZUVsZW1lbnQnLCAnSFRNTE1hcnF1ZWVFbGVtZW50JywgJ1dvcmtlcidcbiAgICAgICAgXSk7XG4gICAgICAgIGNvbnN0IGlnbm9yZUVycm9yUHJvcGVydGllcyA9IGlzSUUoKSA/IFt7IHRhcmdldDogaW50ZXJuYWxXaW5kb3csIGlnbm9yZVByb3BlcnRpZXM6IFsnZXJyb3InXSB9XSA6IFtdO1xuICAgICAgICAvLyBpbiBJRS9FZGdlLCBvblByb3Agbm90IGV4aXN0IGluIHdpbmRvdyBvYmplY3QsIGJ1dCBpbiBXaW5kb3dQcm90b3R5cGVcbiAgICAgICAgLy8gc28gd2UgbmVlZCB0byBwYXNzIFdpbmRvd1Byb3RvdHlwZSB0byBjaGVjayBvblByb3AgZXhpc3Qgb3Igbm90XG4gICAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKGludGVybmFsV2luZG93LCBnZXRPbkV2ZW50TmFtZXMoaW50ZXJuYWxXaW5kb3cpLCBpZ25vcmVQcm9wZXJ0aWVzID8gaWdub3JlUHJvcGVydGllcy5jb25jYXQoaWdub3JlRXJyb3JQcm9wZXJ0aWVzKSA6IGlnbm9yZVByb3BlcnRpZXMsIE9iamVjdEdldFByb3RvdHlwZU9mKGludGVybmFsV2luZG93KSk7XG4gICAgfVxuICAgIHBhdGNoVGFyZ2V0cyA9IHBhdGNoVGFyZ2V0cy5jb25jYXQoW1xuICAgICAgICAnWE1MSHR0cFJlcXVlc3QnLCAnWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCcsICdJREJJbmRleCcsICdJREJSZXF1ZXN0JywgJ0lEQk9wZW5EQlJlcXVlc3QnLFxuICAgICAgICAnSURCRGF0YWJhc2UnLCAnSURCVHJhbnNhY3Rpb24nLCAnSURCQ3Vyc29yJywgJ1dlYlNvY2tldCdcbiAgICBdKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGNoVGFyZ2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBfZ2xvYmFsW3BhdGNoVGFyZ2V0c1tpXV07XG4gICAgICAgIHRhcmdldCAmJiB0YXJnZXQucHJvdG90eXBlICYmXG4gICAgICAgICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyh0YXJnZXQucHJvdG90eXBlLCBnZXRPbkV2ZW50TmFtZXModGFyZ2V0LnByb3RvdHlwZSksIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgIH1cbn1cblxuWm9uZS5fX2xvYWRfcGF0Y2goJ3V0aWwnLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICAvLyBDb2xsZWN0IG5hdGl2ZSBldmVudCBuYW1lcyBieSBsb29raW5nIGF0IHByb3BlcnRpZXNcbiAgICAvLyBvbiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSwgZS5nLiAnb25jbGljaycuXG4gICAgY29uc3QgZXZlbnROYW1lcyA9IGdldE9uRXZlbnROYW1lcyhnbG9iYWwpO1xuICAgIGFwaS5wYXRjaE9uUHJvcGVydGllcyA9IHBhdGNoT25Qcm9wZXJ0aWVzO1xuICAgIGFwaS5wYXRjaE1ldGhvZCA9IHBhdGNoTWV0aG9kO1xuICAgIGFwaS5iaW5kQXJndW1lbnRzID0gYmluZEFyZ3VtZW50cztcbiAgICBhcGkucGF0Y2hNYWNyb1Rhc2sgPSBwYXRjaE1hY3JvVGFzaztcbiAgICAvLyBJbiBlYXJsaWVyIHZlcnNpb24gb2Ygem9uZS5qcyAoPDAuOS4wKSwgd2UgdXNlIGVudiBuYW1lIGBfX3pvbmVfc3ltYm9sX19CTEFDS19MSVNURURfRVZFTlRTYCB0b1xuICAgIC8vIGRlZmluZSB3aGljaCBldmVudHMgd2lsbCBub3QgYmUgcGF0Y2hlZCBieSBgWm9uZS5qc2AuXG4gICAgLy8gSW4gbmV3ZXIgdmVyc2lvbiAoPj0wLjkuMCksIHdlIGNoYW5nZSB0aGUgZW52IG5hbWUgdG8gYF9fem9uZV9zeW1ib2xfX1VOUEFUQ0hFRF9FVkVOVFNgIHRvIGtlZXBcbiAgICAvLyB0aGUgbmFtZSBjb25zaXN0ZW50IHdpdGggYW5ndWxhciByZXBvLlxuICAgIC8vIFRoZSAgYF9fem9uZV9zeW1ib2xfX0JMQUNLX0xJU1RFRF9FVkVOVFNgIGlzIGRlcHJlY2F0ZWQsIGJ1dCBpdCBpcyBzdGlsbCBiZSBzdXBwb3J0ZWQgZm9yXG4gICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gICAgY29uc3QgU1lNQk9MX0JMQUNLX0xJU1RFRF9FVkVOVFMgPSBab25lLl9fc3ltYm9sX18oJ0JMQUNLX0xJU1RFRF9FVkVOVFMnKTtcbiAgICBjb25zdCBTWU1CT0xfVU5QQVRDSEVEX0VWRU5UUyA9IFpvbmUuX19zeW1ib2xfXygnVU5QQVRDSEVEX0VWRU5UUycpO1xuICAgIGlmIChnbG9iYWxbU1lNQk9MX1VOUEFUQ0hFRF9FVkVOVFNdKSB7XG4gICAgICAgIGdsb2JhbFtTWU1CT0xfQkxBQ0tfTElTVEVEX0VWRU5UU10gPSBnbG9iYWxbU1lNQk9MX1VOUEFUQ0hFRF9FVkVOVFNdO1xuICAgIH1cbiAgICBpZiAoZ2xvYmFsW1NZTUJPTF9CTEFDS19MSVNURURfRVZFTlRTXSkge1xuICAgICAgICBab25lW1NZTUJPTF9CTEFDS19MSVNURURfRVZFTlRTXSA9IFpvbmVbU1lNQk9MX1VOUEFUQ0hFRF9FVkVOVFNdID1cbiAgICAgICAgICAgIGdsb2JhbFtTWU1CT0xfQkxBQ0tfTElTVEVEX0VWRU5UU107XG4gICAgfVxuICAgIGFwaS5wYXRjaEV2ZW50UHJvdG90eXBlID0gcGF0Y2hFdmVudFByb3RvdHlwZTtcbiAgICBhcGkucGF0Y2hFdmVudFRhcmdldCA9IHBhdGNoRXZlbnRUYXJnZXQ7XG4gICAgYXBpLmlzSUVPckVkZ2UgPSBpc0lFT3JFZGdlO1xuICAgIGFwaS5PYmplY3REZWZpbmVQcm9wZXJ0eSA9IE9iamVjdERlZmluZVByb3BlcnR5O1xuICAgIGFwaS5PYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICAgYXBpLk9iamVjdENyZWF0ZSA9IE9iamVjdENyZWF0ZTtcbiAgICBhcGkuQXJyYXlTbGljZSA9IEFycmF5U2xpY2U7XG4gICAgYXBpLnBhdGNoQ2xhc3MgPSBwYXRjaENsYXNzO1xuICAgIGFwaS53cmFwV2l0aEN1cnJlbnRab25lID0gd3JhcFdpdGhDdXJyZW50Wm9uZTtcbiAgICBhcGkuZmlsdGVyUHJvcGVydGllcyA9IGZpbHRlclByb3BlcnRpZXM7XG4gICAgYXBpLmF0dGFjaE9yaWdpblRvUGF0Y2hlZCA9IGF0dGFjaE9yaWdpblRvUGF0Y2hlZDtcbiAgICBhcGkuX3JlZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4gICAgYXBpLnBhdGNoQ2FsbGJhY2tzID0gcGF0Y2hDYWxsYmFja3M7XG4gICAgYXBpLmdldEdsb2JhbE9iamVjdHMgPSAoKSA9PiAoe1xuICAgICAgICBnbG9iYWxTb3VyY2VzLFxuICAgICAgICB6b25lU3ltYm9sRXZlbnROYW1lcyxcbiAgICAgICAgZXZlbnROYW1lcyxcbiAgICAgICAgaXNCcm93c2VyLFxuICAgICAgICBpc01peCxcbiAgICAgICAgaXNOb2RlLFxuICAgICAgICBUUlVFX1NUUixcbiAgICAgICAgRkFMU0VfU1RSLFxuICAgICAgICBaT05FX1NZTUJPTF9QUkVGSVgsXG4gICAgICAgIEFERF9FVkVOVF9MSVNURU5FUl9TVFIsXG4gICAgICAgIFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFJcbiAgICB9KTtcbn0pO1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7bWlzc2luZ1JlcXVpcmV9XG4gKi9cbmZ1bmN0aW9uIHBhdGNoUXVldWVNaWNyb3Rhc2soZ2xvYmFsLCBhcGkpIHtcbiAgICBhcGkucGF0Y2hNZXRob2QoZ2xvYmFsLCAncXVldWVNaWNyb3Rhc2snLCAoZGVsZWdhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICBab25lLmN1cnJlbnQuc2NoZWR1bGVNaWNyb1Rhc2soJ3F1ZXVlTWljcm90YXNrJywgYXJnc1swXSk7XG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHttaXNzaW5nUmVxdWlyZX1cbiAqL1xuY29uc3QgdGFza1N5bWJvbCA9IHpvbmVTeW1ib2woJ3pvbmVUYXNrJyk7XG5mdW5jdGlvbiBwYXRjaFRpbWVyKHdpbmRvdywgc2V0TmFtZSwgY2FuY2VsTmFtZSwgbmFtZVN1ZmZpeCkge1xuICAgIGxldCBzZXROYXRpdmUgPSBudWxsO1xuICAgIGxldCBjbGVhck5hdGl2ZSA9IG51bGw7XG4gICAgc2V0TmFtZSArPSBuYW1lU3VmZml4O1xuICAgIGNhbmNlbE5hbWUgKz0gbmFtZVN1ZmZpeDtcbiAgICBjb25zdCB0YXNrc0J5SGFuZGxlSWQgPSB7fTtcbiAgICBmdW5jdGlvbiBzY2hlZHVsZVRhc2sodGFzaykge1xuICAgICAgICBjb25zdCBkYXRhID0gdGFzay5kYXRhO1xuICAgICAgICBkYXRhLmFyZ3NbMF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFzay5pbnZva2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgICAgZGF0YS5oYW5kbGVJZCA9IHNldE5hdGl2ZS5hcHBseSh3aW5kb3csIGRhdGEuYXJncyk7XG4gICAgICAgIHJldHVybiB0YXNrO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbGVhclRhc2sodGFzaykge1xuICAgICAgICByZXR1cm4gY2xlYXJOYXRpdmUuY2FsbCh3aW5kb3csIHRhc2suZGF0YS5oYW5kbGVJZCk7XG4gICAgfVxuICAgIHNldE5hdGl2ZSA9XG4gICAgICAgIHBhdGNoTWV0aG9kKHdpbmRvdywgc2V0TmFtZSwgKGRlbGVnYXRlKSA9PiBmdW5jdGlvbiAoc2VsZiwgYXJncykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgaXNQZXJpb2RpYzogbmFtZVN1ZmZpeCA9PT0gJ0ludGVydmFsJyxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6IChuYW1lU3VmZml4ID09PSAnVGltZW91dCcgfHwgbmFtZVN1ZmZpeCA9PT0gJ0ludGVydmFsJykgPyBhcmdzWzFdIHx8IDAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBhcmdzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgYXJnc1swXSA9IGZ1bmN0aW9uIHRpbWVyKCkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpc3N1ZS05MzQsIHRhc2sgd2lsbCBiZSBjYW5jZWxsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGV2ZW4gaXQgaXMgYSBwZXJpb2RpYyB0YXNrIHN1Y2ggYXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEludGVydmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy80MDM4N1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2xlYW51cCB0YXNrc0J5SGFuZGxlSWQgc2hvdWxkIGJlIGhhbmRsZWQgYmVmb3JlIHNjaGVkdWxlVGFza1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2luY2Ugc29tZSB6b25lU3BlYyBtYXkgaW50ZXJjZXB0IGFuZCBkb2Vzbid0IHRyaWdnZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNjaGVkdWxlRm4oc2NoZWR1bGVUYXNrKSBwcm92aWRlZCBoZXJlLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEob3B0aW9ucy5pc1BlcmlvZGljKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5oYW5kbGVJZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW4gbm9uLW5vZGVqcyBlbnYsIHdlIHJlbW92ZSB0aW1lcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZyb20gbG9jYWwgY2FjaGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVJZFtvcHRpb25zLmhhbmRsZUlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAob3B0aW9ucy5oYW5kbGVJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb2RlIHJldHVybnMgY29tcGxleCBvYmplY3RzIGFzIGhhbmRsZUlkc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSByZW1vdmUgdGFzayByZWZlcmVuY2UgZnJvbSB0aW1lciBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5oYW5kbGVJZFt0YXNrU3ltYm9sXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXNrID0gc2NoZWR1bGVNYWNyb1Rhc2tXaXRoQ3VycmVudFpvbmUoc2V0TmFtZSwgYXJnc1swXSwgb3B0aW9ucywgc2NoZWR1bGVUYXNrLCBjbGVhclRhc2spO1xuICAgICAgICAgICAgICAgIGlmICghdGFzaykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFzaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gTm9kZS5qcyBtdXN0IGFkZGl0aW9uYWxseSBzdXBwb3J0IHRoZSByZWYgYW5kIHVucmVmIGZ1bmN0aW9ucy5cbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGUgPSB0YXNrLmRhdGEuaGFuZGxlSWQ7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZvciBub24gbm9kZWpzIGVudiwgd2Ugc2F2ZSBoYW5kbGVJZDogdGFza1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXBwaW5nIGluIGxvY2FsIGNhY2hlIGZvciBjbGVhclRpbWVvdXRcbiAgICAgICAgICAgICAgICAgICAgdGFza3NCeUhhbmRsZUlkW2hhbmRsZV0gPSB0YXNrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChoYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9yIG5vZGVqcyBlbnYsIHdlIHNhdmUgdGFza1xuICAgICAgICAgICAgICAgICAgICAvLyByZWZlcmVuY2UgaW4gdGltZXJJZCBPYmplY3QgZm9yIGNsZWFyVGltZW91dFxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVbdGFza1N5bWJvbF0gPSB0YXNrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjaGVjayB3aGV0aGVyIGhhbmRsZSBpcyBudWxsLCBiZWNhdXNlIHNvbWUgcG9seWZpbGwgb3IgYnJvd3NlclxuICAgICAgICAgICAgICAgIC8vIG1heSByZXR1cm4gdW5kZWZpbmVkIGZyb20gc2V0VGltZW91dC9zZXRJbnRlcnZhbC9zZXRJbW1lZGlhdGUvcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZSAmJiBoYW5kbGUucmVmICYmIGhhbmRsZS51bnJlZiAmJiB0eXBlb2YgaGFuZGxlLnJlZiA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgaGFuZGxlLnVucmVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2sucmVmID0gaGFuZGxlLnJlZi5iaW5kKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIHRhc2sudW5yZWYgPSBoYW5kbGUudW5yZWYuYmluZChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZSA9PT0gJ251bWJlcicgfHwgaGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2F1c2UgYW4gZXJyb3IgYnkgY2FsbGluZyBpdCBkaXJlY3RseS5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkod2luZG93LCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgY2xlYXJOYXRpdmUgPVxuICAgICAgICBwYXRjaE1ldGhvZCh3aW5kb3csIGNhbmNlbE5hbWUsIChkZWxlZ2F0ZSkgPT4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gYXJnc1swXTtcbiAgICAgICAgICAgIGxldCB0YXNrO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAvLyBub24gbm9kZWpzIGVudi5cbiAgICAgICAgICAgICAgICB0YXNrID0gdGFza3NCeUhhbmRsZUlkW2lkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vZGVqcyBlbnYuXG4gICAgICAgICAgICAgICAgdGFzayA9IGlkICYmIGlkW3Rhc2tTeW1ib2xdO1xuICAgICAgICAgICAgICAgIC8vIG90aGVyIGVudmlyb25tZW50cy5cbiAgICAgICAgICAgICAgICBpZiAoIXRhc2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGFzayA9IGlkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0YXNrICYmIHR5cGVvZiB0YXNrLnR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suc3RhdGUgIT09ICdub3RTY2hlZHVsZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICh0YXNrLmNhbmNlbEZuICYmIHRhc2suZGF0YS5pc1BlcmlvZGljIHx8IHRhc2sucnVuQ291bnQgPT09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaWQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZUlkW2lkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRbdGFza1N5bWJvbF0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIERvIG5vdCBjYW5jZWwgYWxyZWFkeSBjYW5jZWxlZCBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgdGFzay56b25lLmNhbmNlbFRhc2sodGFzayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2F1c2UgYW4gZXJyb3IgYnkgY2FsbGluZyBpdCBkaXJlY3RseS5cbiAgICAgICAgICAgICAgICBkZWxlZ2F0ZS5hcHBseSh3aW5kb3csIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gcGF0Y2hDdXN0b21FbGVtZW50cyhfZ2xvYmFsLCBhcGkpIHtcbiAgICBjb25zdCB7IGlzQnJvd3NlciwgaXNNaXggfSA9IGFwaS5nZXRHbG9iYWxPYmplY3RzKCk7XG4gICAgaWYgKCghaXNCcm93c2VyICYmICFpc01peCkgfHwgIV9nbG9iYWxbJ2N1c3RvbUVsZW1lbnRzJ10gfHwgISgnY3VzdG9tRWxlbWVudHMnIGluIF9nbG9iYWwpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvY3VzdG9tLWVsZW1lbnRzLmh0bWwjY29uY2VwdC1jdXN0b20tZWxlbWVudC1kZWZpbml0aW9uLWxpZmVjeWNsZS1jYWxsYmFja3NcbiAgICBjb25zdCBjYWxsYmFja3MgPSBbXG4gICAgICAgICdjb25uZWN0ZWRDYWxsYmFjaycsICdkaXNjb25uZWN0ZWRDYWxsYmFjaycsICdhZG9wdGVkQ2FsbGJhY2snLCAnYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJyxcbiAgICAgICAgJ2Zvcm1Bc3NvY2lhdGVkQ2FsbGJhY2snLCAnZm9ybURpc2FibGVkQ2FsbGJhY2snLCAnZm9ybVJlc2V0Q2FsbGJhY2snLFxuICAgICAgICAnZm9ybVN0YXRlUmVzdG9yZUNhbGxiYWNrJ1xuICAgIF07XG4gICAgYXBpLnBhdGNoQ2FsbGJhY2tzKGFwaSwgX2dsb2JhbC5jdXN0b21FbGVtZW50cywgJ2N1c3RvbUVsZW1lbnRzJywgJ2RlZmluZScsIGNhbGxiYWNrcyk7XG59XG5cbmZ1bmN0aW9uIGV2ZW50VGFyZ2V0UGF0Y2goX2dsb2JhbCwgYXBpKSB7XG4gICAgaWYgKFpvbmVbYXBpLnN5bWJvbCgncGF0Y2hFdmVudFRhcmdldCcpXSkge1xuICAgICAgICAvLyBFdmVudFRhcmdldCBpcyBhbHJlYWR5IHBhdGNoZWQuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgeyBldmVudE5hbWVzLCB6b25lU3ltYm9sRXZlbnROYW1lcywgVFJVRV9TVFIsIEZBTFNFX1NUUiwgWk9ORV9TWU1CT0xfUFJFRklYIH0gPSBhcGkuZ2V0R2xvYmFsT2JqZWN0cygpO1xuICAgIC8vICBwcmVkZWZpbmUgYWxsIF9fem9uZV9zeW1ib2xfXyArIGV2ZW50TmFtZSArIHRydWUvZmFsc2Ugc3RyaW5nXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGV2ZW50TmFtZXNbaV07XG4gICAgICAgIGNvbnN0IGZhbHNlRXZlbnROYW1lID0gZXZlbnROYW1lICsgRkFMU0VfU1RSO1xuICAgICAgICBjb25zdCB0cnVlRXZlbnROYW1lID0gZXZlbnROYW1lICsgVFJVRV9TVFI7XG4gICAgICAgIGNvbnN0IHN5bWJvbCA9IFpPTkVfU1lNQk9MX1BSRUZJWCArIGZhbHNlRXZlbnROYW1lO1xuICAgICAgICBjb25zdCBzeW1ib2xDYXB0dXJlID0gWk9ORV9TWU1CT0xfUFJFRklYICsgdHJ1ZUV2ZW50TmFtZTtcbiAgICAgICAgem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXSA9IHt9O1xuICAgICAgICB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdW0ZBTFNFX1NUUl0gPSBzeW1ib2w7XG4gICAgICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV1bVFJVRV9TVFJdID0gc3ltYm9sQ2FwdHVyZTtcbiAgICB9XG4gICAgY29uc3QgRVZFTlRfVEFSR0VUID0gX2dsb2JhbFsnRXZlbnRUYXJnZXQnXTtcbiAgICBpZiAoIUVWRU5UX1RBUkdFVCB8fCAhRVZFTlRfVEFSR0VULnByb3RvdHlwZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFwaS5wYXRjaEV2ZW50VGFyZ2V0KF9nbG9iYWwsIGFwaSwgW0VWRU5UX1RBUkdFVCAmJiBFVkVOVF9UQVJHRVQucHJvdG90eXBlXSk7XG4gICAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBwYXRjaEV2ZW50KGdsb2JhbCwgYXBpKSB7XG4gICAgYXBpLnBhdGNoRXZlbnRQcm90b3R5cGUoZ2xvYmFsLCBhcGkpO1xufVxuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7bWlzc2luZ1JlcXVpcmV9XG4gKi9cblpvbmUuX19sb2FkX3BhdGNoKCdsZWdhY3knLCAoZ2xvYmFsKSA9PiB7XG4gICAgY29uc3QgbGVnYWN5UGF0Y2ggPSBnbG9iYWxbWm9uZS5fX3N5bWJvbF9fKCdsZWdhY3lQYXRjaCcpXTtcbiAgICBpZiAobGVnYWN5UGF0Y2gpIHtcbiAgICAgICAgbGVnYWN5UGF0Y2goKTtcbiAgICB9XG59KTtcblpvbmUuX19sb2FkX3BhdGNoKCd0aW1lcnMnLCAoZ2xvYmFsKSA9PiB7XG4gICAgY29uc3Qgc2V0ID0gJ3NldCc7XG4gICAgY29uc3QgY2xlYXIgPSAnY2xlYXInO1xuICAgIHBhdGNoVGltZXIoZ2xvYmFsLCBzZXQsIGNsZWFyLCAnVGltZW91dCcpO1xuICAgIHBhdGNoVGltZXIoZ2xvYmFsLCBzZXQsIGNsZWFyLCAnSW50ZXJ2YWwnKTtcbiAgICBwYXRjaFRpbWVyKGdsb2JhbCwgc2V0LCBjbGVhciwgJ0ltbWVkaWF0ZScpO1xufSk7XG5ab25lLl9fbG9hZF9wYXRjaCgncmVxdWVzdEFuaW1hdGlvbkZyYW1lJywgKGdsb2JhbCkgPT4ge1xuICAgIHBhdGNoVGltZXIoZ2xvYmFsLCAncmVxdWVzdCcsICdjYW5jZWwnLCAnQW5pbWF0aW9uRnJhbWUnKTtcbiAgICBwYXRjaFRpbWVyKGdsb2JhbCwgJ21velJlcXVlc3QnLCAnbW96Q2FuY2VsJywgJ0FuaW1hdGlvbkZyYW1lJyk7XG4gICAgcGF0Y2hUaW1lcihnbG9iYWwsICd3ZWJraXRSZXF1ZXN0JywgJ3dlYmtpdENhbmNlbCcsICdBbmltYXRpb25GcmFtZScpO1xufSk7XG5ab25lLl9fbG9hZF9wYXRjaCgnYmxvY2tpbmcnLCAoZ2xvYmFsLCBab25lKSA9PiB7XG4gICAgY29uc3QgYmxvY2tpbmdNZXRob2RzID0gWydhbGVydCcsICdwcm9tcHQnLCAnY29uZmlybSddO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tpbmdNZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBibG9ja2luZ01ldGhvZHNbaV07XG4gICAgICAgIHBhdGNoTWV0aG9kKGdsb2JhbCwgbmFtZSwgKGRlbGVnYXRlLCBzeW1ib2wsIG5hbWUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAocywgYXJncykge1xuICAgICAgICAgICAgICAgIHJldHVybiBab25lLmN1cnJlbnQucnVuKGRlbGVnYXRlLCBnbG9iYWwsIGFyZ3MsIG5hbWUpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5ab25lLl9fbG9hZF9wYXRjaCgnRXZlbnRUYXJnZXQnLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICBwYXRjaEV2ZW50KGdsb2JhbCwgYXBpKTtcbiAgICBldmVudFRhcmdldFBhdGNoKGdsb2JhbCwgYXBpKTtcbiAgICAvLyBwYXRjaCBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0J3MgYWRkRXZlbnRMaXN0ZW5lci9yZW1vdmVFdmVudExpc3RlbmVyXG4gICAgY29uc3QgWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCA9IGdsb2JhbFsnWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCddO1xuICAgIGlmIChYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0ICYmIFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQucHJvdG90eXBlKSB7XG4gICAgICAgIGFwaS5wYXRjaEV2ZW50VGFyZ2V0KGdsb2JhbCwgYXBpLCBbWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldC5wcm90b3R5cGVdKTtcbiAgICB9XG59KTtcblpvbmUuX19sb2FkX3BhdGNoKCdNdXRhdGlvbk9ic2VydmVyJywgKGdsb2JhbCwgWm9uZSwgYXBpKSA9PiB7XG4gICAgcGF0Y2hDbGFzcygnTXV0YXRpb25PYnNlcnZlcicpO1xuICAgIHBhdGNoQ2xhc3MoJ1dlYktpdE11dGF0aW9uT2JzZXJ2ZXInKTtcbn0pO1xuWm9uZS5fX2xvYWRfcGF0Y2goJ0ludGVyc2VjdGlvbk9ic2VydmVyJywgKGdsb2JhbCwgWm9uZSwgYXBpKSA9PiB7XG4gICAgcGF0Y2hDbGFzcygnSW50ZXJzZWN0aW9uT2JzZXJ2ZXInKTtcbn0pO1xuWm9uZS5fX2xvYWRfcGF0Y2goJ0ZpbGVSZWFkZXInLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICBwYXRjaENsYXNzKCdGaWxlUmVhZGVyJyk7XG59KTtcblpvbmUuX19sb2FkX3BhdGNoKCdvbl9wcm9wZXJ0eScsIChnbG9iYWwsIFpvbmUsIGFwaSkgPT4ge1xuICAgIHByb3BlcnR5RGVzY3JpcHRvclBhdGNoKGFwaSwgZ2xvYmFsKTtcbn0pO1xuWm9uZS5fX2xvYWRfcGF0Y2goJ2N1c3RvbUVsZW1lbnRzJywgKGdsb2JhbCwgWm9uZSwgYXBpKSA9PiB7XG4gICAgcGF0Y2hDdXN0b21FbGVtZW50cyhnbG9iYWwsIGFwaSk7XG59KTtcblpvbmUuX19sb2FkX3BhdGNoKCdYSFInLCAoZ2xvYmFsLCBab25lKSA9PiB7XG4gICAgLy8gVHJlYXQgWE1MSHR0cFJlcXVlc3QgYXMgYSBtYWNyb3Rhc2suXG4gICAgcGF0Y2hYSFIoZ2xvYmFsKTtcbiAgICBjb25zdCBYSFJfVEFTSyA9IHpvbmVTeW1ib2woJ3hoclRhc2snKTtcbiAgICBjb25zdCBYSFJfU1lOQyA9IHpvbmVTeW1ib2woJ3hoclN5bmMnKTtcbiAgICBjb25zdCBYSFJfTElTVEVORVIgPSB6b25lU3ltYm9sKCd4aHJMaXN0ZW5lcicpO1xuICAgIGNvbnN0IFhIUl9TQ0hFRFVMRUQgPSB6b25lU3ltYm9sKCd4aHJTY2hlZHVsZWQnKTtcbiAgICBjb25zdCBYSFJfVVJMID0gem9uZVN5bWJvbCgneGhyVVJMJyk7XG4gICAgY29uc3QgWEhSX0VSUk9SX0JFRk9SRV9TQ0hFRFVMRUQgPSB6b25lU3ltYm9sKCd4aHJFcnJvckJlZm9yZVNjaGVkdWxlZCcpO1xuICAgIGZ1bmN0aW9uIHBhdGNoWEhSKHdpbmRvdykge1xuICAgICAgICBjb25zdCBYTUxIdHRwUmVxdWVzdCA9IHdpbmRvd1snWE1MSHR0cFJlcXVlc3QnXTtcbiAgICAgICAgaWYgKCFYTUxIdHRwUmVxdWVzdCkge1xuICAgICAgICAgICAgLy8gWE1MSHR0cFJlcXVlc3QgaXMgbm90IGF2YWlsYWJsZSBpbiBzZXJ2aWNlIHdvcmtlclxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlID0gWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlO1xuICAgICAgICBmdW5jdGlvbiBmaW5kUGVuZGluZ1Rhc2sodGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W1hIUl9UQVNLXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb3JpQWRkTGlzdGVuZXIgPSBYTUxIdHRwUmVxdWVzdFByb3RvdHlwZVtaT05FX1NZTUJPTF9BRERfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICBsZXQgb3JpUmVtb3ZlTGlzdGVuZXIgPSBYTUxIdHRwUmVxdWVzdFByb3RvdHlwZVtaT05FX1NZTUJPTF9SRU1PVkVfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICBpZiAoIW9yaUFkZExpc3RlbmVyKSB7XG4gICAgICAgICAgICBjb25zdCBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0ID0gd2luZG93WydYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0J107XG4gICAgICAgICAgICBpZiAoWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXRQcm90b3R5cGUgPSBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0LnByb3RvdHlwZTtcbiAgICAgICAgICAgICAgICBvcmlBZGRMaXN0ZW5lciA9IFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXRQcm90b3R5cGVbWk9ORV9TWU1CT0xfQUREX0VWRU5UX0xJU1RFTkVSXTtcbiAgICAgICAgICAgICAgICBvcmlSZW1vdmVMaXN0ZW5lciA9IFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXRQcm90b3R5cGVbWk9ORV9TWU1CT0xfUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBSRUFEWV9TVEFURV9DSEFOR0UgPSAncmVhZHlzdGF0ZWNoYW5nZSc7XG4gICAgICAgIGNvbnN0IFNDSEVEVUxFRCA9ICdzY2hlZHVsZWQnO1xuICAgICAgICBmdW5jdGlvbiBzY2hlZHVsZVRhc2sodGFzaykge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHRhc2suZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGRhdGEudGFyZ2V0O1xuICAgICAgICAgICAgdGFyZ2V0W1hIUl9TQ0hFRFVMRURdID0gZmFsc2U7XG4gICAgICAgICAgICB0YXJnZXRbWEhSX0VSUk9SX0JFRk9SRV9TQ0hFRFVMRURdID0gZmFsc2U7XG4gICAgICAgICAgICAvLyByZW1vdmUgZXhpc3RpbmcgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGFyZ2V0W1hIUl9MSVNURU5FUl07XG4gICAgICAgICAgICBpZiAoIW9yaUFkZExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgb3JpQWRkTGlzdGVuZXIgPSB0YXJnZXRbWk9ORV9TWU1CT0xfQUREX0VWRU5UX0xJU1RFTkVSXTtcbiAgICAgICAgICAgICAgICBvcmlSZW1vdmVMaXN0ZW5lciA9IHRhcmdldFtaT05FX1NZTUJPTF9SRU1PVkVfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgb3JpUmVtb3ZlTGlzdGVuZXIuY2FsbCh0YXJnZXQsIFJFQURZX1NUQVRFX0NIQU5HRSwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV3TGlzdGVuZXIgPSB0YXJnZXRbWEhSX0xJU1RFTkVSXSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LnJlYWR5U3RhdGUgPT09IHRhcmdldC5ET05FKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNvbWV0aW1lcyBvbiBzb21lIGJyb3dzZXJzIFhNTEh0dHBSZXF1ZXN0IHdpbGwgZmlyZSBvbnJlYWR5c3RhdGVjaGFuZ2Ugd2l0aFxuICAgICAgICAgICAgICAgICAgICAvLyByZWFkeVN0YXRlPTQgbXVsdGlwbGUgdGltZXMsIHNvIHdlIG5lZWQgdG8gY2hlY2sgdGFzayBzdGF0ZSBoZXJlXG4gICAgICAgICAgICAgICAgICAgIGlmICghZGF0YS5hYm9ydGVkICYmIHRhcmdldFtYSFJfU0NIRURVTEVEXSAmJiB0YXNrLnN0YXRlID09PSBTQ0hFRFVMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgdGhlIHhociBoYXMgcmVnaXN0ZXJlZCBvbmxvYWQgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoYXQgaXMgdGhlIGNhc2UsIHRoZSB0YXNrIHNob3VsZCBpbnZva2UgYWZ0ZXIgYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBvbmxvYWQgbGlzdGVuZXJzIGZpbmlzaC5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFsc28gaWYgdGhlIHJlcXVlc3QgZmFpbGVkIHdpdGhvdXQgcmVzcG9uc2UgKHN0YXR1cyA9IDApLCB0aGUgbG9hZCBldmVudCBoYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3aWxsIG5vdCBiZSB0cmlnZ2VyZWQsIGluIHRoYXQgY2FzZSwgd2Ugc2hvdWxkIGFsc28gaW52b2tlIHRoZSBwbGFjZWhvbGRlciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gY2xvc2UgdGhlIFhNTEh0dHBSZXF1ZXN0OjpzZW5kIG1hY3JvVGFzay5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzM4Nzk1XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2FkVGFza3MgPSB0YXJnZXRbWm9uZS5fX3N5bWJvbF9fKCdsb2FkZmFsc2UnKV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LnN0YXR1cyAhPT0gMCAmJiBsb2FkVGFza3MgJiYgbG9hZFRhc2tzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmlJbnZva2UgPSB0YXNrLmludm9rZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLmludm9rZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmVlZCB0byBsb2FkIHRoZSB0YXNrcyBhZ2FpbiwgYmVjYXVzZSBpbiBvdGhlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsb2FkIGxpc3RlbmVyLCB0aGV5IG1heSByZW1vdmUgdGhlbXNlbHZlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2FkVGFza3MgPSB0YXJnZXRbWm9uZS5fX3N5bWJvbF9fKCdsb2FkZmFsc2UnKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9hZFRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9hZFRhc2tzW2ldID09PSB0YXNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZFRhc2tzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWRhdGEuYWJvcnRlZCAmJiB0YXNrLnN0YXRlID09PSBTQ0hFRFVMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaUludm9rZS5jYWxsKHRhc2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkVGFza3MucHVzaCh0YXNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suaW52b2tlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIWRhdGEuYWJvcnRlZCAmJiB0YXJnZXRbWEhSX1NDSEVEVUxFRF0gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBvY2N1cnMgd2hlbiB4aHIuc2VuZCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbWEhSX0VSUk9SX0JFRk9SRV9TQ0hFRFVMRURdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBvcmlBZGRMaXN0ZW5lci5jYWxsKHRhcmdldCwgUkVBRFlfU1RBVEVfQ0hBTkdFLCBuZXdMaXN0ZW5lcik7XG4gICAgICAgICAgICBjb25zdCBzdG9yZWRUYXNrID0gdGFyZ2V0W1hIUl9UQVNLXTtcbiAgICAgICAgICAgIGlmICghc3RvcmVkVGFzaykge1xuICAgICAgICAgICAgICAgIHRhcmdldFtYSFJfVEFTS10gPSB0YXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VuZE5hdGl2ZS5hcHBseSh0YXJnZXQsIGRhdGEuYXJncyk7XG4gICAgICAgICAgICB0YXJnZXRbWEhSX1NDSEVEVUxFRF0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcGxhY2Vob2xkZXJDYWxsYmFjaygpIHsgfVxuICAgICAgICBmdW5jdGlvbiBjbGVhclRhc2sodGFzaykge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHRhc2suZGF0YTtcbiAgICAgICAgICAgIC8vIE5vdGUgLSBpZGVhbGx5LCB3ZSB3b3VsZCBjYWxsIGRhdGEudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIgaGVyZSwgYnV0IGl0J3MgdG9vIGxhdGVcbiAgICAgICAgICAgIC8vIHRvIHByZXZlbnQgaXQgZnJvbSBmaXJpbmcuIFNvIGluc3RlYWQsIHdlIHN0b3JlIGluZm8gZm9yIHRoZSBldmVudCBsaXN0ZW5lci5cbiAgICAgICAgICAgIGRhdGEuYWJvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gYWJvcnROYXRpdmUuYXBwbHkoZGF0YS50YXJnZXQsIGRhdGEuYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3Blbk5hdGl2ZSA9IHBhdGNoTWV0aG9kKFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCAnb3BlbicsICgpID0+IGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICBzZWxmW1hIUl9TWU5DXSA9IGFyZ3NbMl0gPT0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmW1hIUl9VUkxdID0gYXJnc1sxXTtcbiAgICAgICAgICAgIHJldHVybiBvcGVuTmF0aXZlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgWE1MSFRUUFJFUVVFU1RfU09VUkNFID0gJ1hNTEh0dHBSZXF1ZXN0LnNlbmQnO1xuICAgICAgICBjb25zdCBmZXRjaFRhc2tBYm9ydGluZyA9IHpvbmVTeW1ib2woJ2ZldGNoVGFza0Fib3J0aW5nJyk7XG4gICAgICAgIGNvbnN0IGZldGNoVGFza1NjaGVkdWxpbmcgPSB6b25lU3ltYm9sKCdmZXRjaFRhc2tTY2hlZHVsaW5nJyk7XG4gICAgICAgIGNvbnN0IHNlbmROYXRpdmUgPSBwYXRjaE1ldGhvZChYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSwgJ3NlbmQnLCAoKSA9PiBmdW5jdGlvbiAoc2VsZiwgYXJncykge1xuICAgICAgICAgICAgaWYgKFpvbmUuY3VycmVudFtmZXRjaFRhc2tTY2hlZHVsaW5nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIC8vIGEgZmV0Y2ggaXMgc2NoZWR1bGluZywgc28gd2UgYXJlIHVzaW5nIHhociB0byBwb2x5ZmlsbCBmZXRjaFxuICAgICAgICAgICAgICAgIC8vIGFuZCBiZWNhdXNlIHdlIGFscmVhZHkgc2NoZWR1bGUgbWFjcm9UYXNrIGZvciBmZXRjaCwgd2Ugc2hvdWxkXG4gICAgICAgICAgICAgICAgLy8gbm90IHNjaGVkdWxlIGEgbWFjcm9UYXNrIGZvciB4aHIgYWdhaW5cbiAgICAgICAgICAgICAgICByZXR1cm4gc2VuZE5hdGl2ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmW1hIUl9TWU5DXSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBYSFIgaXMgc3luYyB0aGVyZSBpcyBubyB0YXNrIHRvIHNjaGVkdWxlLCBqdXN0IGV4ZWN1dGUgdGhlIGNvZGUuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbmROYXRpdmUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0geyB0YXJnZXQ6IHNlbGYsIHVybDogc2VsZltYSFJfVVJMXSwgaXNQZXJpb2RpYzogZmFsc2UsIGFyZ3M6IGFyZ3MsIGFib3J0ZWQ6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY29uc3QgdGFzayA9IHNjaGVkdWxlTWFjcm9UYXNrV2l0aEN1cnJlbnRab25lKFhNTEhUVFBSRVFVRVNUX1NPVVJDRSwgcGxhY2Vob2xkZXJDYWxsYmFjaywgb3B0aW9ucywgc2NoZWR1bGVUYXNrLCBjbGVhclRhc2spO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmICYmIHNlbGZbWEhSX0VSUk9SX0JFRk9SRV9TQ0hFRFVMRURdID09PSB0cnVlICYmICFvcHRpb25zLmFib3J0ZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgdGFzay5zdGF0ZSA9PT0gU0NIRURVTEVEKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHhociByZXF1ZXN0IHRocm93IGVycm9yIHdoZW4gc2VuZFxuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBzaG91bGQgaW52b2tlIHRhc2sgaW5zdGVhZCBvZiBsZWF2aW5nIGEgc2NoZWR1bGVkXG4gICAgICAgICAgICAgICAgICAgIC8vIHBlbmRpbmcgbWFjcm9UYXNrXG4gICAgICAgICAgICAgICAgICAgIHRhc2suaW52b2tlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYWJvcnROYXRpdmUgPSBwYXRjaE1ldGhvZChYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSwgJ2Fib3J0JywgKCkgPT4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhc2sgPSBmaW5kUGVuZGluZ1Rhc2soc2VsZik7XG4gICAgICAgICAgICBpZiAodGFzayAmJiB0eXBlb2YgdGFzay50eXBlID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIFhIUiBoYXMgYWxyZWFkeSBjb21wbGV0ZWQsIGRvIG5vdGhpbmcuXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIFhIUiBoYXMgYWxyZWFkeSBiZWVuIGFib3J0ZWQsIGRvIG5vdGhpbmcuXG4gICAgICAgICAgICAgICAgLy8gRml4ICM1NjksIGNhbGwgYWJvcnQgbXVsdGlwbGUgdGltZXMgYmVmb3JlIGRvbmUgd2lsbCBjYXVzZVxuICAgICAgICAgICAgICAgIC8vIG1hY3JvVGFzayB0YXNrIGNvdW50IGJlIG5lZ2F0aXZlIG51bWJlclxuICAgICAgICAgICAgICAgIGlmICh0YXNrLmNhbmNlbEZuID09IG51bGwgfHwgKHRhc2suZGF0YSAmJiB0YXNrLmRhdGEuYWJvcnRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXNrLnpvbmUuY2FuY2VsVGFzayh0YXNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKFpvbmUuY3VycmVudFtmZXRjaFRhc2tBYm9ydGluZ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGUgYWJvcnQgaXMgY2FsbGVkIGZyb20gZmV0Y2ggcG9seWZpbGwsIHdlIG5lZWQgdG8gY2FsbCBuYXRpdmUgYWJvcnQgb2YgWEhSLlxuICAgICAgICAgICAgICAgIHJldHVybiBhYm9ydE5hdGl2ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgd2UgYXJlIHRyeWluZyB0byBhYm9ydCBhbiBYSFIgd2hpY2ggaGFzIG5vdCB5ZXQgYmVlbiBzZW50LCBzbyB0aGVyZSBpcyBub1xuICAgICAgICAgICAgLy8gdGFza1xuICAgICAgICAgICAgLy8gdG8gY2FuY2VsLiBEbyBub3RoaW5nLlxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblpvbmUuX19sb2FkX3BhdGNoKCdnZW9sb2NhdGlvbicsIChnbG9iYWwpID0+IHtcbiAgICAvLy8gR0VPX0xPQ0FUSU9OXG4gICAgaWYgKGdsb2JhbFsnbmF2aWdhdG9yJ10gJiYgZ2xvYmFsWyduYXZpZ2F0b3InXS5nZW9sb2NhdGlvbikge1xuICAgICAgICBwYXRjaFByb3RvdHlwZShnbG9iYWxbJ25hdmlnYXRvciddLmdlb2xvY2F0aW9uLCBbJ2dldEN1cnJlbnRQb3NpdGlvbicsICd3YXRjaFBvc2l0aW9uJ10pO1xuICAgIH1cbn0pO1xuWm9uZS5fX2xvYWRfcGF0Y2goJ1Byb21pc2VSZWplY3Rpb25FdmVudCcsIChnbG9iYWwsIFpvbmUpID0+IHtcbiAgICAvLyBoYW5kbGUgdW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uXG4gICAgZnVuY3Rpb24gZmluZFByb21pc2VSZWplY3Rpb25IYW5kbGVyKGV2dE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudFRhc2tzID0gZmluZEV2ZW50VGFza3MoZ2xvYmFsLCBldnROYW1lKTtcbiAgICAgICAgICAgIGV2ZW50VGFza3MuZm9yRWFjaChldmVudFRhc2sgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHdpbmRvd3MgaGFzIGFkZGVkIHVuaGFuZGxlZHJlamVjdGlvbiBldmVudCBsaXN0ZW5lclxuICAgICAgICAgICAgICAgIC8vIHRyaWdnZXIgdGhlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgY29uc3QgUHJvbWlzZVJlamVjdGlvbkV2ZW50ID0gZ2xvYmFsWydQcm9taXNlUmVqZWN0aW9uRXZlbnQnXTtcbiAgICAgICAgICAgICAgICBpZiAoUHJvbWlzZVJlamVjdGlvbkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2dCA9IG5ldyBQcm9taXNlUmVqZWN0aW9uRXZlbnQoZXZ0TmFtZSwgeyBwcm9taXNlOiBlLnByb21pc2UsIHJlYXNvbjogZS5yZWplY3Rpb24gfSk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VGFzay5pbnZva2UoZXZ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGdsb2JhbFsnUHJvbWlzZVJlamVjdGlvbkV2ZW50J10pIHtcbiAgICAgICAgWm9uZVt6b25lU3ltYm9sKCd1bmhhbmRsZWRQcm9taXNlUmVqZWN0aW9uSGFuZGxlcicpXSA9XG4gICAgICAgICAgICBmaW5kUHJvbWlzZVJlamVjdGlvbkhhbmRsZXIoJ3VuaGFuZGxlZHJlamVjdGlvbicpO1xuICAgICAgICBab25lW3pvbmVTeW1ib2woJ3JlamVjdGlvbkhhbmRsZWRIYW5kbGVyJyldID1cbiAgICAgICAgICAgIGZpbmRQcm9taXNlUmVqZWN0aW9uSGFuZGxlcigncmVqZWN0aW9uaGFuZGxlZCcpO1xuICAgIH1cbn0pO1xuWm9uZS5fX2xvYWRfcGF0Y2goJ3F1ZXVlTWljcm90YXNrJywgKGdsb2JhbCwgWm9uZSwgYXBpKSA9PiB7XG4gICAgcGF0Y2hRdWV1ZU1pY3JvdGFzayhnbG9iYWwsIGFwaSk7XG59KTtcbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIFRoZSBjaGFyYWN0ZXIgdXNlZCB0byBtYXJrIHRoZSBzdGFydCBhbmQgZW5kIG9mIGEgXCJibG9ja1wiIGluIGEgYCRsb2NhbGl6ZWAgdGFnZ2VkIHN0cmluZy5cbiAqIEEgYmxvY2sgY2FuIGluZGljYXRlIG1ldGFkYXRhIGFib3V0IHRoZSBtZXNzYWdlIG9yIHNwZWNpZnkgYSBuYW1lIG9mIGEgcGxhY2Vob2xkZXIgZm9yIGFcbiAqIHN1YnN0aXR1dGlvbiBleHByZXNzaW9ucy5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplYEhlbGxvLCAke3RpdGxlfTp0aXRsZTohYDtcbiAqICRsb2NhbGl6ZWA6bWVhbmluZ3xkZXNjcmlwdGlvbkBAaWQ6c291cmNlIG1lc3NhZ2UgdGV4dGA7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IEJMT0NLX01BUktFUiA9ICc6JztcblxuLyoqXG4gKiBUaGUgbWFya2VyIHVzZWQgdG8gc2VwYXJhdGUgYSBtZXNzYWdlJ3MgXCJtZWFuaW5nXCIgZnJvbSBpdHMgXCJkZXNjcmlwdGlvblwiIGluIGEgbWV0YWRhdGEgYmxvY2suXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqICRsb2NhbGl6ZSBgOmNvcnJlY3R8SW5kaWNhdGVzIHRoYXQgdGhlIHVzZXIgZ290IHRoZSBhbnN3ZXIgY29ycmVjdDogUmlnaHQhYDtcbiAqICRsb2NhbGl6ZSBgOm1vdmVtZW50fEJ1dHRvbiBsYWJlbCBmb3IgbW92aW5nIHRvIHRoZSByaWdodDogUmlnaHQhYDtcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgTUVBTklOR19TRVBBUkFUT1IgPSAnfCc7XG5cbi8qKlxuICogVGhlIG1hcmtlciB1c2VkIHRvIHNlcGFyYXRlIGEgbWVzc2FnZSdzIGN1c3RvbSBcImlkXCIgZnJvbSBpdHMgXCJkZXNjcmlwdGlvblwiIGluIGEgbWV0YWRhdGEgYmxvY2suXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqICRsb2NhbGl6ZSBgOkEgd2VsY29tZSBtZXNzYWdlIG9uIHRoZSBob21lIHBhZ2VAQG15QXBwLWhvbWVwYWdlLXdlbGNvbWU6IFdlbGNvbWUhYDtcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgSURfU0VQQVJBVE9SID0gJ0BAJztcblxuLyoqXG4gKiBUaGUgbWFya2VyIHVzZWQgdG8gc2VwYXJhdGUgbGVnYWN5IG1lc3NhZ2UgaWRzIGZyb20gdGhlIHJlc3Qgb2YgYSBtZXRhZGF0YSBibG9jay5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplIGA6QEBjdXN0b20taWTikJ8yZGY2NDc2N2NkODk1YThmYWJlM2UxOGI5NGI1YjZiNmY5ZTJlM2YwOiBXZWxjb21lIWA7XG4gKiBgYGBcbiAqXG4gKiBOb3RlIHRoYXQgdGhpcyBjaGFyYWN0ZXIgaXMgdGhlIFwic3ltYm9sIGZvciB0aGUgdW5pdCBzZXBhcmF0b3JcIiAo4pCfKSBub3QgdGhlIFwidW5pdCBzZXBhcmF0b3JcbiAqIGNoYXJhY3RlclwiIGl0c2VsZiwgc2luY2UgdGhhdCBoYXMgbm8gdmlzdWFsIHJlcHJlc2VudGF0aW9uLiBTZWUgaHR0cHM6Ly9ncmFwaGVtaWNhLmNvbS8lRTIlOTAlOUYuXG4gKlxuICogSGVyZSBpcyBzb21lIGJhY2tncm91bmQgZm9yIHRoZSBvcmlnaW5hbCBcInVuaXQgc2VwYXJhdG9yIGNoYXJhY3RlclwiOlxuICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvODY5NTExOC93aGF0cy10aGUtZmlsZS1ncm91cC1yZWNvcmQtdW5pdC1zZXBhcmF0b3ItY29udHJvbC1jaGFyYWN0ZXJzLWFuZC1pdHMtdXNhZ2VcbiAqL1xuZXhwb3J0IGNvbnN0IExFR0FDWV9JRF9JTkRJQ0FUT1IgPSAnXFx1MjQxRic7XG4iLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCeXRlfSBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0ICogYXMgaTE4biBmcm9tICcuL2kxOG5fYXN0JztcblxuLyoqXG4gKiBBIGxhemlseSBjcmVhdGVkIFRleHRFbmNvZGVyIGluc3RhbmNlIGZvciBjb252ZXJ0aW5nIHN0cmluZ3MgaW50byBVVEYtOCBieXRlc1xuICovXG5sZXQgdGV4dEVuY29kZXI6IFRleHRFbmNvZGVyfHVuZGVmaW5lZDtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIG1lc3NhZ2UgaWQgb3IgY29tcHV0ZSBpdCB1c2luZyB0aGUgWExJRkYxIGRpZ2VzdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpZ2VzdChtZXNzYWdlOiBpMThuLk1lc3NhZ2UpOiBzdHJpbmcge1xuICByZXR1cm4gbWVzc2FnZS5pZCB8fCBjb21wdXRlRGlnZXN0KG1lc3NhZ2UpO1xufVxuXG4vKipcbiAqIENvbXB1dGUgdGhlIG1lc3NhZ2UgaWQgdXNpbmcgdGhlIFhMSUZGMSBkaWdlc3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlRGlnZXN0KG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSk6IHN0cmluZyB7XG4gIHJldHVybiBzaGExKHNlcmlhbGl6ZU5vZGVzKG1lc3NhZ2Uubm9kZXMpLmpvaW4oJycpICsgYFske21lc3NhZ2UubWVhbmluZ31dYCk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBtZXNzYWdlIGlkIG9yIGNvbXB1dGUgaXQgdXNpbmcgdGhlIFhMSUZGMi9YTUIvJGxvY2FsaXplIGRpZ2VzdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY2ltYWxEaWdlc3QobWVzc2FnZTogaTE4bi5NZXNzYWdlKTogc3RyaW5nIHtcbiAgcmV0dXJuIG1lc3NhZ2UuaWQgfHwgY29tcHV0ZURlY2ltYWxEaWdlc3QobWVzc2FnZSk7XG59XG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgbWVzc2FnZSBpZCB1c2luZyB0aGUgWExJRkYyL1hNQi8kbG9jYWxpemUgZGlnZXN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZURlY2ltYWxEaWdlc3QobWVzc2FnZTogaTE4bi5NZXNzYWdlKTogc3RyaW5nIHtcbiAgY29uc3QgdmlzaXRvciA9IG5ldyBfU2VyaWFsaXplcklnbm9yZUljdUV4cFZpc2l0b3IoKTtcbiAgY29uc3QgcGFydHMgPSBtZXNzYWdlLm5vZGVzLm1hcChhID0+IGEudmlzaXQodmlzaXRvciwgbnVsbCkpO1xuICByZXR1cm4gY29tcHV0ZU1zZ0lkKHBhcnRzLmpvaW4oJycpLCBtZXNzYWdlLm1lYW5pbmcpO1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSB0aGUgaTE4biBhc3QgdG8gc29tZXRoaW5nIHhtbC1saWtlIGluIG9yZGVyIHRvIGdlbmVyYXRlIGFuIFVJRC5cbiAqXG4gKiBUaGUgdmlzaXRvciBpcyBhbHNvIHVzZWQgaW4gdGhlIGkxOG4gcGFyc2VyIHRlc3RzXG4gKlxuICogQGludGVybmFsXG4gKi9cbmNsYXNzIF9TZXJpYWxpemVyVmlzaXRvciBpbXBsZW1lbnRzIGkxOG4uVmlzaXRvciB7XG4gIHZpc2l0VGV4dCh0ZXh0OiBpMThuLlRleHQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRleHQudmFsdWU7XG4gIH1cblxuICB2aXNpdENvbnRhaW5lcihjb250YWluZXI6IGkxOG4uQ29udGFpbmVyLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBgWyR7Y29udGFpbmVyLmNoaWxkcmVuLm1hcChjaGlsZCA9PiBjaGlsZC52aXNpdCh0aGlzKSkuam9pbignLCAnKX1dYDtcbiAgfVxuXG4gIHZpc2l0SWN1KGljdTogaTE4bi5JY3UsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgY29uc3Qgc3RyQ2FzZXMgPVxuICAgICAgICBPYmplY3Qua2V5cyhpY3UuY2FzZXMpLm1hcCgoazogc3RyaW5nKSA9PiBgJHtrfSB7JHtpY3UuY2FzZXNba10udmlzaXQodGhpcyl9fWApO1xuICAgIHJldHVybiBgeyR7aWN1LmV4cHJlc3Npb259LCAke2ljdS50eXBlfSwgJHtzdHJDYXNlcy5qb2luKCcsICcpfX1gO1xuICB9XG5cbiAgdmlzaXRUYWdQbGFjZWhvbGRlcihwaDogaTE4bi5UYWdQbGFjZWhvbGRlciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gcGguaXNWb2lkID9cbiAgICAgICAgYDxwaCB0YWcgbmFtZT1cIiR7cGguc3RhcnROYW1lfVwiLz5gIDpcbiAgICAgICAgYDxwaCB0YWcgbmFtZT1cIiR7cGguc3RhcnROYW1lfVwiPiR7XG4gICAgICAgICAgICBwaC5jaGlsZHJlbi5tYXAoY2hpbGQgPT4gY2hpbGQudmlzaXQodGhpcykpLmpvaW4oJywgJyl9PC9waCBuYW1lPVwiJHtwaC5jbG9zZU5hbWV9XCI+YDtcbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXIocGg6IGkxOG4uUGxhY2Vob2xkZXIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHBoLnZhbHVlID8gYDxwaCBuYW1lPVwiJHtwaC5uYW1lfVwiPiR7cGgudmFsdWV9PC9waD5gIDogYDxwaCBuYW1lPVwiJHtwaC5uYW1lfVwiLz5gO1xuICB9XG5cbiAgdmlzaXRJY3VQbGFjZWhvbGRlcihwaDogaTE4bi5JY3VQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIGA8cGggaWN1IG5hbWU9XCIke3BoLm5hbWV9XCI+JHtwaC52YWx1ZS52aXNpdCh0aGlzKX08L3BoPmA7XG4gIH1cblxuICB2aXNpdEJsb2NrUGxhY2Vob2xkZXIocGg6IGkxOG4uQmxvY2tQbGFjZWhvbGRlciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gYDxwaCBibG9jayBuYW1lPVwiJHtwaC5zdGFydE5hbWV9XCI+JHtcbiAgICAgICAgcGguY2hpbGRyZW4ubWFwKGNoaWxkID0+IGNoaWxkLnZpc2l0KHRoaXMpKS5qb2luKCcsICcpfTwvcGggbmFtZT1cIiR7cGguY2xvc2VOYW1lfVwiPmA7XG4gIH1cbn1cblxuY29uc3Qgc2VyaWFsaXplclZpc2l0b3IgPSBuZXcgX1NlcmlhbGl6ZXJWaXNpdG9yKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVOb2Rlcyhub2RlczogaTE4bi5Ob2RlW10pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBub2Rlcy5tYXAoYSA9PiBhLnZpc2l0KHNlcmlhbGl6ZXJWaXNpdG9yLCBudWxsKSk7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIHRoZSBpMThuIGFzdCB0byBzb21ldGhpbmcgeG1sLWxpa2UgaW4gb3JkZXIgdG8gZ2VuZXJhdGUgYW4gVUlELlxuICpcbiAqIElnbm9yZSB0aGUgSUNVIGV4cHJlc3Npb25zIHNvIHRoYXQgbWVzc2FnZSBJRHMgc3RheXMgaWRlbnRpY2FsIGlmIG9ubHkgdGhlIGV4cHJlc3Npb24gY2hhbmdlcy5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuY2xhc3MgX1NlcmlhbGl6ZXJJZ25vcmVJY3VFeHBWaXNpdG9yIGV4dGVuZHMgX1NlcmlhbGl6ZXJWaXNpdG9yIHtcbiAgb3ZlcnJpZGUgdmlzaXRJY3UoaWN1OiBpMThuLkljdSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBsZXQgc3RyQ2FzZXMgPSBPYmplY3Qua2V5cyhpY3UuY2FzZXMpLm1hcCgoazogc3RyaW5nKSA9PiBgJHtrfSB7JHtpY3UuY2FzZXNba10udmlzaXQodGhpcyl9fWApO1xuICAgIC8vIERvIG5vdCB0YWtlIHRoZSBleHByZXNzaW9uIGludG8gYWNjb3VudFxuICAgIHJldHVybiBgeyR7aWN1LnR5cGV9LCAke3N0ckNhc2VzLmpvaW4oJywgJyl9fWA7XG4gIH1cbn1cblxuLyoqXG4gKiBDb21wdXRlIHRoZSBTSEExIG9mIHRoZSBnaXZlbiBzdHJpbmdcbiAqXG4gKiBzZWUgaHR0cHM6Ly9jc3JjLm5pc3QuZ292L3B1YmxpY2F0aW9ucy9maXBzL2ZpcHMxODAtNC9maXBzLTE4MC00LnBkZlxuICpcbiAqIFdBUk5JTkc6IHRoaXMgZnVuY3Rpb24gaGFzIG5vdCBiZWVuIGRlc2lnbmVkIG5vdCB0ZXN0ZWQgd2l0aCBzZWN1cml0eSBpbiBtaW5kLlxuICogICAgICAgICAgRE8gTk9UIFVTRSBJVCBJTiBBIFNFQ1VSSVRZIFNFTlNJVElWRSBDT05URVhULlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hhMShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHRleHRFbmNvZGVyID8/PSBuZXcgVGV4dEVuY29kZXIoKTtcbiAgY29uc3QgdXRmOCA9IFsuLi50ZXh0RW5jb2Rlci5lbmNvZGUoc3RyKV07XG4gIGNvbnN0IHdvcmRzMzIgPSBieXRlc1RvV29yZHMzMih1dGY4LCBFbmRpYW4uQmlnKTtcbiAgY29uc3QgbGVuID0gdXRmOC5sZW5ndGggKiA4O1xuXG4gIGNvbnN0IHcgPSBuZXcgVWludDMyQXJyYXkoODApO1xuICBsZXQgYSA9IDB4Njc0NTIzMDEsIGIgPSAweGVmY2RhYjg5LCBjID0gMHg5OGJhZGNmZSwgZCA9IDB4MTAzMjU0NzYsIGUgPSAweGMzZDJlMWYwO1xuXG4gIHdvcmRzMzJbbGVuID4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbGVuICUgMzIpO1xuICB3b3JkczMyWygobGVuICsgNjQgPj4gOSkgPDwgNCkgKyAxNV0gPSBsZW47XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3JkczMyLmxlbmd0aDsgaSArPSAxNikge1xuICAgIGNvbnN0IGgwID0gYSwgaDEgPSBiLCBoMiA9IGMsIGgzID0gZCwgaDQgPSBlO1xuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCA4MDsgaisrKSB7XG4gICAgICBpZiAoaiA8IDE2KSB7XG4gICAgICAgIHdbal0gPSB3b3JkczMyW2kgKyBqXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdbal0gPSByb2wzMih3W2ogLSAzXSBeIHdbaiAtIDhdIF4gd1tqIC0gMTRdIF4gd1tqIC0gMTZdLCAxKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmtWYWwgPSBmayhqLCBiLCBjLCBkKTtcbiAgICAgIGNvbnN0IGYgPSBma1ZhbFswXTtcbiAgICAgIGNvbnN0IGsgPSBma1ZhbFsxXTtcbiAgICAgIGNvbnN0IHRlbXAgPSBbcm9sMzIoYSwgNSksIGYsIGUsIGssIHdbal1dLnJlZHVjZShhZGQzMik7XG4gICAgICBlID0gZDtcbiAgICAgIGQgPSBjO1xuICAgICAgYyA9IHJvbDMyKGIsIDMwKTtcbiAgICAgIGIgPSBhO1xuICAgICAgYSA9IHRlbXA7XG4gICAgfVxuICAgIGEgPSBhZGQzMihhLCBoMCk7XG4gICAgYiA9IGFkZDMyKGIsIGgxKTtcbiAgICBjID0gYWRkMzIoYywgaDIpO1xuICAgIGQgPSBhZGQzMihkLCBoMyk7XG4gICAgZSA9IGFkZDMyKGUsIGg0KTtcbiAgfVxuXG4gIC8vIENvbnZlcnQgdGhlIG91dHB1dCBwYXJ0cyB0byBhIDE2MC1iaXQgaGV4YWRlY2ltYWwgc3RyaW5nXG4gIHJldHVybiB0b0hleFUzMihhKSArIHRvSGV4VTMyKGIpICsgdG9IZXhVMzIoYykgKyB0b0hleFUzMihkKSArIHRvSGV4VTMyKGUpO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYW5kIGZvcm1hdCBhIG51bWJlciBhcyBhIHN0cmluZyByZXByZXNlbnRpbmcgYSAzMi1iaXQgdW5zaWduZWQgaGV4YWRlY2ltYWwgbnVtYmVyLlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBmb3JtYXQgYXMgYSBzdHJpbmcuXG4gKiBAcmV0dXJucyBBIGhleGFkZWNpbWFsIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlLlxuICovXG5mdW5jdGlvbiB0b0hleFUzMih2YWx1ZTogbnVtYmVyKTogc3RyaW5nIHtcbiAgLy8gdW5zaWduZWQgcmlnaHQgc2hpZnQgb2YgemVybyBlbnN1cmVzIGFuIHVuc2lnbmVkIDMyLWJpdCBudW1iZXJcbiAgcmV0dXJuICh2YWx1ZSA+Pj4gMCkudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDgsICcwJyk7XG59XG5cbmZ1bmN0aW9uIGZrKGluZGV4OiBudW1iZXIsIGI6IG51bWJlciwgYzogbnVtYmVyLCBkOiBudW1iZXIpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgaWYgKGluZGV4IDwgMjApIHtcbiAgICByZXR1cm4gWyhiICYgYykgfCAofmIgJiBkKSwgMHg1YTgyNzk5OV07XG4gIH1cblxuICBpZiAoaW5kZXggPCA0MCkge1xuICAgIHJldHVybiBbYiBeIGMgXiBkLCAweDZlZDllYmExXTtcbiAgfVxuXG4gIGlmIChpbmRleCA8IDYwKSB7XG4gICAgcmV0dXJuIFsoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCksIDB4OGYxYmJjZGNdO1xuICB9XG5cbiAgcmV0dXJuIFtiIF4gYyBeIGQsIDB4Y2E2MmMxZDZdO1xufVxuXG4vKipcbiAqIENvbXB1dGUgdGhlIGZpbmdlcnByaW50IG9mIHRoZSBnaXZlbiBzdHJpbmdcbiAqXG4gKiBUaGUgb3V0cHV0IGlzIDY0IGJpdCBudW1iZXIgZW5jb2RlZCBhcyBhIGRlY2ltYWwgc3RyaW5nXG4gKlxuICogYmFzZWQgb246XG4gKiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtY29tcGlsZXIvYmxvYi9tYXN0ZXIvc3JjL2NvbS9nb29nbGUvamF2YXNjcmlwdC9qc2NvbXAvR29vZ2xlSnNNZXNzYWdlSWRHZW5lcmF0b3IuamF2YVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZ2VycHJpbnQoc3RyOiBzdHJpbmcpOiBiaWdpbnQge1xuICB0ZXh0RW5jb2RlciA/Pz0gbmV3IFRleHRFbmNvZGVyKCk7XG4gIGNvbnN0IHV0ZjggPSB0ZXh0RW5jb2Rlci5lbmNvZGUoc3RyKTtcbiAgY29uc3QgdmlldyA9IG5ldyBEYXRhVmlldyh1dGY4LmJ1ZmZlciwgdXRmOC5ieXRlT2Zmc2V0LCB1dGY4LmJ5dGVMZW5ndGgpO1xuXG4gIGxldCBoaSA9IGhhc2gzMih2aWV3LCB1dGY4Lmxlbmd0aCwgMCk7XG4gIGxldCBsbyA9IGhhc2gzMih2aWV3LCB1dGY4Lmxlbmd0aCwgMTAyMDcyKTtcblxuICBpZiAoaGkgPT0gMCAmJiAobG8gPT0gMCB8fCBsbyA9PSAxKSkge1xuICAgIGhpID0gaGkgXiAweDEzMGY5YmVmO1xuICAgIGxvID0gbG8gXiAtMHg2YjVmNTZkODtcbiAgfVxuXG4gIHJldHVybiAoQmlnSW50LmFzVWludE4oMzIsIEJpZ0ludChoaSkpIDw8IEJpZ0ludCgzMikpIHwgQmlnSW50LmFzVWludE4oMzIsIEJpZ0ludChsbykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZU1zZ0lkKG1zZzogc3RyaW5nLCBtZWFuaW5nOiBzdHJpbmcgPSAnJyk6IHN0cmluZyB7XG4gIGxldCBtc2dGaW5nZXJwcmludCA9IGZpbmdlcnByaW50KG1zZyk7XG5cbiAgaWYgKG1lYW5pbmcpIHtcbiAgICAvLyBSb3RhdGUgdGhlIDY0LWJpdCBtZXNzYWdlIGZpbmdlcnByaW50IG9uZSBiaXQgdG8gdGhlIGxlZnQgYW5kIHRoZW4gYWRkIHRoZSBtZWFuaW5nXG4gICAgLy8gZmluZ2VycHJpbnQuXG4gICAgbXNnRmluZ2VycHJpbnQgPSBCaWdJbnQuYXNVaW50Tig2NCwgbXNnRmluZ2VycHJpbnQgPDwgQmlnSW50KDEpKSB8XG4gICAgICAgICgobXNnRmluZ2VycHJpbnQgPj4gQmlnSW50KDYzKSkgJiBCaWdJbnQoMSkpO1xuICAgIG1zZ0ZpbmdlcnByaW50ICs9IGZpbmdlcnByaW50KG1lYW5pbmcpO1xuICB9XG5cbiAgcmV0dXJuIEJpZ0ludC5hc1VpbnROKDYzLCBtc2dGaW5nZXJwcmludCkudG9TdHJpbmcoKTtcbn1cblxuZnVuY3Rpb24gaGFzaDMyKHZpZXc6IERhdGFWaWV3LCBsZW5ndGg6IG51bWJlciwgYzogbnVtYmVyKTogbnVtYmVyIHtcbiAgbGV0IGEgPSAweDllMzc3OWI5LCBiID0gMHg5ZTM3NzliOTtcbiAgbGV0IGluZGV4ID0gMDtcblxuICBjb25zdCBlbmQgPSBsZW5ndGggLSAxMjtcbiAgZm9yICg7IGluZGV4IDw9IGVuZDsgaW5kZXggKz0gMTIpIHtcbiAgICBhICs9IHZpZXcuZ2V0VWludDMyKGluZGV4LCB0cnVlKTtcbiAgICBiICs9IHZpZXcuZ2V0VWludDMyKGluZGV4ICsgNCwgdHJ1ZSk7XG4gICAgYyArPSB2aWV3LmdldFVpbnQzMihpbmRleCArIDgsIHRydWUpO1xuICAgIGNvbnN0IHJlcyA9IG1peChhLCBiLCBjKTtcbiAgICBhID0gcmVzWzBdLCBiID0gcmVzWzFdLCBjID0gcmVzWzJdO1xuICB9XG5cbiAgY29uc3QgcmVtYWluZGVyID0gbGVuZ3RoIC0gaW5kZXg7XG5cbiAgLy8gdGhlIGZpcnN0IGJ5dGUgb2YgYyBpcyByZXNlcnZlZCBmb3IgdGhlIGxlbmd0aFxuICBjICs9IGxlbmd0aDtcblxuICBpZiAocmVtYWluZGVyID49IDQpIHtcbiAgICBhICs9IHZpZXcuZ2V0VWludDMyKGluZGV4LCB0cnVlKTtcbiAgICBpbmRleCArPSA0O1xuXG4gICAgaWYgKHJlbWFpbmRlciA+PSA4KSB7XG4gICAgICBiICs9IHZpZXcuZ2V0VWludDMyKGluZGV4LCB0cnVlKTtcbiAgICAgIGluZGV4ICs9IDQ7XG5cbiAgICAgIC8vIFBhcnRpYWwgMzItYml0IHdvcmQgZm9yIGNcbiAgICAgIGlmIChyZW1haW5kZXIgPj0gOSkge1xuICAgICAgICBjICs9IHZpZXcuZ2V0VWludDgoaW5kZXgrKykgPDwgODtcbiAgICAgIH1cbiAgICAgIGlmIChyZW1haW5kZXIgPj0gMTApIHtcbiAgICAgICAgYyArPSB2aWV3LmdldFVpbnQ4KGluZGV4KyspIDw8IDE2O1xuICAgICAgfVxuICAgICAgaWYgKHJlbWFpbmRlciA9PT0gMTEpIHtcbiAgICAgICAgYyArPSB2aWV3LmdldFVpbnQ4KGluZGV4KyspIDw8IDI0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQYXJ0aWFsIDMyLWJpdCB3b3JkIGZvciBiXG4gICAgICBpZiAocmVtYWluZGVyID49IDUpIHtcbiAgICAgICAgYiArPSB2aWV3LmdldFVpbnQ4KGluZGV4KyspO1xuICAgICAgfVxuICAgICAgaWYgKHJlbWFpbmRlciA+PSA2KSB7XG4gICAgICAgIGIgKz0gdmlldy5nZXRVaW50OChpbmRleCsrKSA8PCA4O1xuICAgICAgfVxuICAgICAgaWYgKHJlbWFpbmRlciA9PT0gNykge1xuICAgICAgICBiICs9IHZpZXcuZ2V0VWludDgoaW5kZXgrKykgPDwgMTY7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIFBhcnRpYWwgMzItYml0IHdvcmQgZm9yIGFcbiAgICBpZiAocmVtYWluZGVyID49IDEpIHtcbiAgICAgIGEgKz0gdmlldy5nZXRVaW50OChpbmRleCsrKTtcbiAgICB9XG4gICAgaWYgKHJlbWFpbmRlciA+PSAyKSB7XG4gICAgICBhICs9IHZpZXcuZ2V0VWludDgoaW5kZXgrKykgPDwgODtcbiAgICB9XG4gICAgaWYgKHJlbWFpbmRlciA9PT0gMykge1xuICAgICAgYSArPSB2aWV3LmdldFVpbnQ4KGluZGV4KyspIDw8IDE2O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtaXgoYSwgYiwgYylbMl07XG59XG5cbi8vIGNsYW5nLWZvcm1hdCBvZmZcbmZ1bmN0aW9uIG1peChhOiBudW1iZXIsIGI6IG51bWJlciwgYzogbnVtYmVyKTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcbiAgYSAtPSBiOyBhIC09IGM7IGEgXj0gYyA+Pj4gMTM7XG4gIGIgLT0gYzsgYiAtPSBhOyBiIF49IGEgPDwgODtcbiAgYyAtPSBhOyBjIC09IGI7IGMgXj0gYiA+Pj4gMTM7XG4gIGEgLT0gYjsgYSAtPSBjOyBhIF49IGMgPj4+IDEyO1xuICBiIC09IGM7IGIgLT0gYTsgYiBePSBhIDw8IDE2O1xuICBjIC09IGE7IGMgLT0gYjsgYyBePSBiID4+PiA1O1xuICBhIC09IGI7IGEgLT0gYzsgYSBePSBjID4+PiAzO1xuICBiIC09IGM7IGIgLT0gYTsgYiBePSBhIDw8IDEwO1xuICBjIC09IGE7IGMgLT0gYjsgYyBePSBiID4+PiAxNTtcbiAgcmV0dXJuIFthLCBiLCBjXTtcbn1cbi8vIGNsYW5nLWZvcm1hdCBvblxuXG4vLyBVdGlsc1xuXG5lbnVtIEVuZGlhbiB7XG4gIExpdHRsZSxcbiAgQmlnLFxufVxuXG5mdW5jdGlvbiBhZGQzMihhOiBudW1iZXIsIGI6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBhZGQzMnRvNjQoYSwgYilbMV07XG59XG5cbmZ1bmN0aW9uIGFkZDMydG82NChhOiBudW1iZXIsIGI6IG51bWJlcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICBjb25zdCBsb3cgPSAoYSAmIDB4ZmZmZikgKyAoYiAmIDB4ZmZmZik7XG4gIGNvbnN0IGhpZ2ggPSAoYSA+Pj4gMTYpICsgKGIgPj4+IDE2KSArIChsb3cgPj4+IDE2KTtcbiAgcmV0dXJuIFtoaWdoID4+PiAxNiwgKGhpZ2ggPDwgMTYpIHwgKGxvdyAmIDB4ZmZmZildO1xufVxuXG4vLyBSb3RhdGUgYSAzMmIgbnVtYmVyIGxlZnQgYGNvdW50YCBwb3NpdGlvblxuZnVuY3Rpb24gcm9sMzIoYTogbnVtYmVyLCBjb3VudDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIChhIDw8IGNvdW50KSB8IChhID4+PiAoMzIgLSBjb3VudCkpO1xufVxuXG5mdW5jdGlvbiBieXRlc1RvV29yZHMzMihieXRlczogQnl0ZVtdLCBlbmRpYW46IEVuZGlhbik6IG51bWJlcltdIHtcbiAgY29uc3Qgc2l6ZSA9IChieXRlcy5sZW5ndGggKyAzKSA+Pj4gMjtcbiAgY29uc3Qgd29yZHMzMiA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgd29yZHMzMltpXSA9IHdvcmRBdChieXRlcywgaSAqIDQsIGVuZGlhbik7XG4gIH1cblxuICByZXR1cm4gd29yZHMzMjtcbn1cblxuZnVuY3Rpb24gYnl0ZUF0KGJ5dGVzOiBCeXRlW10sIGluZGV4OiBudW1iZXIpOiBCeXRlIHtcbiAgcmV0dXJuIGluZGV4ID49IGJ5dGVzLmxlbmd0aCA/IDAgOiBieXRlc1tpbmRleF07XG59XG5cbmZ1bmN0aW9uIHdvcmRBdChieXRlczogQnl0ZVtdLCBpbmRleDogbnVtYmVyLCBlbmRpYW46IEVuZGlhbik6IG51bWJlciB7XG4gIGxldCB3b3JkID0gMDtcbiAgaWYgKGVuZGlhbiA9PT0gRW5kaWFuLkJpZykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICB3b3JkICs9IGJ5dGVBdChieXRlcywgaW5kZXggKyBpKSA8PCAoMjQgLSA4ICogaSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICB3b3JkICs9IGJ5dGVBdChieXRlcywgaW5kZXggKyBpKSA8PCA4ICogaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHdvcmQ7XG59XG4iLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8vIFRoaXMgbW9kdWxlIHNwZWNpZmllciBpcyBpbnRlbnRpb25hbGx5IGEgcmVsYXRpdmUgcGF0aCB0byBhbGxvdyBidW5kbGluZyB0aGUgY29kZSBkaXJlY3RseVxuLy8gaW50byB0aGUgcGFja2FnZS5cbi8vIEBuZ19wYWNrYWdlOiBpZ25vcmUtY3Jvc3MtcmVwby1pbXBvcnRcbmltcG9ydCB7Y29tcHV0ZU1zZ0lkfSBmcm9tICcuLi8uLi8uLi8uLi9jb21waWxlci9zcmMvaTE4bi9kaWdlc3QnO1xuXG5pbXBvcnQge0JMT0NLX01BUktFUiwgSURfU0VQQVJBVE9SLCBMRUdBQ1lfSURfSU5ESUNBVE9SLCBNRUFOSU5HX1NFUEFSQVRPUn0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIFJlLWV4cG9ydCB0aGlzIGhlbHBlciBmdW5jdGlvbiBzbyB0aGF0IHVzZXJzIG9mIGBAYW5ndWxhci9sb2NhbGl6ZWAgZG9uJ3QgbmVlZCB0byBhY3RpdmVseSBpbXBvcnRcbiAqIGZyb20gYEBhbmd1bGFyL2NvbXBpbGVyYC5cbiAqL1xuZXhwb3J0IHtjb21wdXRlTXNnSWR9O1xuXG4vKipcbiAqIEEgc3RyaW5nIGNvbnRhaW5pbmcgYSB0cmFuc2xhdGlvbiBzb3VyY2UgbWVzc2FnZS5cbiAqXG4gKiBJLkUuIHRoZSBtZXNzYWdlIHRoYXQgaW5kaWNhdGVzIHdoYXQgd2lsbCBiZSB0cmFuc2xhdGVkIGZyb20uXG4gKlxuICogVXNlcyBgeyRwbGFjZWhvbGRlci1uYW1lfWAgdG8gaW5kaWNhdGUgYSBwbGFjZWhvbGRlci5cbiAqL1xuZXhwb3J0IHR5cGUgU291cmNlTWVzc2FnZSA9IHN0cmluZztcblxuLyoqXG4gKiBBIHN0cmluZyBjb250YWluaW5nIGEgdHJhbnNsYXRpb24gdGFyZ2V0IG1lc3NhZ2UuXG4gKlxuICogSS5FLiB0aGUgbWVzc2FnZSB0aGF0IGluZGljYXRlcyB3aGF0IHdpbGwgYmUgdHJhbnNsYXRlZCB0by5cbiAqXG4gKiBVc2VzIGB7JHBsYWNlaG9sZGVyLW5hbWV9YCB0byBpbmRpY2F0ZSBhIHBsYWNlaG9sZGVyLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgVGFyZ2V0TWVzc2FnZSA9IHN0cmluZztcblxuLyoqXG4gKiBBIHN0cmluZyB0aGF0IHVuaXF1ZWx5IGlkZW50aWZpZXMgYSBtZXNzYWdlLCB0byBiZSB1c2VkIGZvciBtYXRjaGluZyB0cmFuc2xhdGlvbnMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBNZXNzYWdlSWQgPSBzdHJpbmc7XG5cbi8qKlxuICogRGVjbGFyZXMgYSBjb3B5IG9mIHRoZSBgQWJzb2x1dGVGc1BhdGhgIGJyYW5kZWQgdHlwZSBpbiBgQGFuZ3VsYXIvY29tcGlsZXItY2xpYCB0byBhdm9pZCBhblxuICogaW1wb3J0IGludG8gYEBhbmd1bGFyL2NvbXBpbGVyLWNsaWAuIFRoZSBjb21waWxlci1jbGkncyBkZWNsYXJhdGlvbiBmaWxlcyBhcmUgbm90IG5lY2Vzc2FyaWx5XG4gKiBjb21wYXRpYmxlIHdpdGggd2ViIGVudmlyb25tZW50cyB0aGF0IHVzZSBgQGFuZ3VsYXIvbG9jYWxpemVgLCBhbmQgd291bGQgaW5hZHZlcnRlbnRseSBpbmNsdWRlXG4gKiBgdHlwZXNjcmlwdGAgZGVjbGFyYXRpb24gZmlsZXMgaW4gYW55IGNvbXBpbGF0aW9uIHVuaXQgdGhhdCB1c2VzIGBAYW5ndWxhci9sb2NhbGl6ZWAgKHdoaWNoXG4gKiBpbmNyZWFzZXMgcGFyc2luZyB0aW1lIGFuZCBtZW1vcnkgdXNhZ2UgZHVyaW5nIGJ1aWxkcykgdXNpbmcgYSBkZWZhdWx0IGltcG9ydCB0aGF0IG9ubHlcbiAqIHR5cGUtY2hlY2tzIHdoZW4gYGFsbG93U3ludGhldGljRGVmYXVsdEltcG9ydHNgIGlzIGVuYWJsZWQuXG4gKlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy80NTE3OVxuICovXG50eXBlIEFic29sdXRlRnNQYXRoTG9jYWxpemVDb3B5ID0gc3RyaW5nJntfYnJhbmQ6ICdBYnNvbHV0ZUZzUGF0aCd9O1xuXG4vKipcbiAqIFRoZSBsb2NhdGlvbiBvZiB0aGUgbWVzc2FnZSBpbiB0aGUgc291cmNlIGZpbGUuXG4gKlxuICogVGhlIGBsaW5lYCBhbmQgYGNvbHVtbmAgdmFsdWVzIGZvciB0aGUgYHN0YXJ0YCBhbmQgYGVuZGAgcHJvcGVydGllcyBhcmUgemVyby1iYXNlZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTb3VyY2VMb2NhdGlvbiB7XG4gIHN0YXJ0OiB7bGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlcn07XG4gIGVuZDoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9O1xuICBmaWxlOiBBYnNvbHV0ZUZzUGF0aExvY2FsaXplQ29weTtcbiAgdGV4dD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBZGRpdGlvbmFsIGluZm9ybWF0aW9uIHRoYXQgY2FuIGJlIGFzc29jaWF0ZWQgd2l0aCBhIG1lc3NhZ2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZU1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIEEgaHVtYW4gcmVhZGFibGUgcmVuZGVyaW5nIG9mIHRoZSBtZXNzYWdlXG4gICAqL1xuICB0ZXh0OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBMZWdhY3kgbWVzc2FnZSBpZHMsIGlmIHByb3ZpZGVkLlxuICAgKlxuICAgKiBJbiBsZWdhY3kgbWVzc2FnZSBmb3JtYXRzIHRoZSBtZXNzYWdlIGlkIGNhbiBvbmx5IGJlIGNvbXB1dGVkIGRpcmVjdGx5IGZyb20gdGhlIG9yaWdpbmFsXG4gICAqIHRlbXBsYXRlIHNvdXJjZS5cbiAgICpcbiAgICogU2luY2UgdGhpcyBpbmZvcm1hdGlvbiBpcyBub3QgYXZhaWxhYmxlIGluIGAkbG9jYWxpemVgIGNhbGxzLCB0aGUgbGVnYWN5IG1lc3NhZ2UgaWRzIG1heSBiZVxuICAgKiBhdHRhY2hlZCBieSB0aGUgY29tcGlsZXIgdG8gdGhlIGAkbG9jYWxpemVgIG1ldGFibG9jayBzbyBpdCBjYW4gYmUgdXNlZCBpZiBuZWVkZWQgYXQgdGhlIHBvaW50XG4gICAqIG9mIHRyYW5zbGF0aW9uIGlmIHRoZSB0cmFuc2xhdGlvbnMgYXJlIGVuY29kZWQgdXNpbmcgdGhlIGxlZ2FjeSBtZXNzYWdlIGlkLlxuICAgKi9cbiAgbGVnYWN5SWRzPzogc3RyaW5nW107XG4gIC8qKlxuICAgKiBUaGUgaWQgb2YgdGhlIGBtZXNzYWdlYCBpZiBhIGN1c3RvbSBvbmUgd2FzIHNwZWNpZmllZCBleHBsaWNpdGx5LlxuICAgKlxuICAgKiBUaGlzIGlkIG92ZXJyaWRlcyBhbnkgY29tcHV0ZWQgb3IgbGVnYWN5IGlkcy5cbiAgICovXG4gIGN1c3RvbUlkPzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIG1lYW5pbmcgb2YgdGhlIGBtZXNzYWdlYCwgdXNlZCB0byBkaXN0aW5ndWlzaCBpZGVudGljYWwgYG1lc3NhZ2VTdHJpbmdgcy5cbiAgICovXG4gIG1lYW5pbmc/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGBtZXNzYWdlYCwgdXNlZCB0byBhaWQgdHJhbnNsYXRpb24uXG4gICAqL1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBsb2NhdGlvbiBvZiB0aGUgbWVzc2FnZSBpbiB0aGUgc291cmNlLlxuICAgKi9cbiAgbG9jYXRpb24/OiBTb3VyY2VMb2NhdGlvbjtcbn1cblxuLyoqXG4gKiBJbmZvcm1hdGlvbiBwYXJzZWQgZnJvbSBhIGAkbG9jYWxpemVgIHRhZ2dlZCBzdHJpbmcgdGhhdCBpcyB1c2VkIHRvIHRyYW5zbGF0ZSBpdC5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IG5hbWUgPSAnSm8gQmxvZ2dzJztcbiAqICRsb2NhbGl6ZWBIZWxsbyAke25hbWV9OnRpdGxlQEBJRDohYDtcbiAqIGBgYFxuICpcbiAqIE1heSBiZSBwYXJzZWQgaW50bzpcbiAqXG4gKiBgYGBcbiAqIHtcbiAqICAgaWQ6ICc2OTk4MTk0NTA3NTk3NzMwNTkxJyxcbiAqICAgc3Vic3RpdHV0aW9uczogeyB0aXRsZTogJ0pvIEJsb2dncycgfSxcbiAqICAgbWVzc2FnZVN0cmluZzogJ0hlbGxvIHskdGl0bGV9IScsXG4gKiAgIHBsYWNlaG9sZGVyTmFtZXM6IFsndGl0bGUnXSxcbiAqICAgYXNzb2NpYXRlZE1lc3NhZ2VJZHM6IHsgdGl0bGU6ICdJRCcgfSxcbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlZE1lc3NhZ2UgZXh0ZW5kcyBNZXNzYWdlTWV0YWRhdGEge1xuICAvKipcbiAgICogVGhlIGtleSB1c2VkIHRvIGxvb2sgdXAgdGhlIGFwcHJvcHJpYXRlIHRyYW5zbGF0aW9uIHRhcmdldC5cbiAgICovXG4gIGlkOiBNZXNzYWdlSWQ7XG4gIC8qKlxuICAgKiBBIG1hcHBpbmcgb2YgcGxhY2Vob2xkZXIgbmFtZXMgdG8gc3Vic3RpdHV0aW9uIHZhbHVlcy5cbiAgICovXG4gIHN1YnN0aXR1dGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBtYXBwaW5nIG9mIHBsYWNlaG9sZGVyIG5hbWVzIHRvIGFzc29jaWF0ZWQgTWVzc2FnZUlkcy5cbiAgICogVGhpcyBjYW4gYmUgdXNlZCB0byBtYXRjaCBJQ1UgcGxhY2Vob2xkZXJzIHRvIHRoZSBtZXNzYWdlIHRoYXQgY29udGFpbnMgdGhlIElDVS5cbiAgICovXG4gIGFzc29jaWF0ZWRNZXNzYWdlSWRzPzogUmVjb3JkPHN0cmluZywgTWVzc2FnZUlkPjtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIG1hcHBpbmcgb2YgcGxhY2Vob2xkZXIgbmFtZXMgdG8gc291cmNlIGxvY2F0aW9uc1xuICAgKi9cbiAgc3Vic3RpdHV0aW9uTG9jYXRpb25zPzogUmVjb3JkPHN0cmluZywgU291cmNlTG9jYXRpb258dW5kZWZpbmVkPjtcbiAgLyoqXG4gICAqIFRoZSBzdGF0aWMgcGFydHMgb2YgdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBtZXNzYWdlUGFydHM6IHN0cmluZ1tdO1xuICAvKipcbiAgICogQW4gb3B0aW9uYWwgbWFwcGluZyBvZiBtZXNzYWdlIHBhcnRzIHRvIHNvdXJjZSBsb2NhdGlvbnNcbiAgICovXG4gIG1lc3NhZ2VQYXJ0TG9jYXRpb25zPzogKFNvdXJjZUxvY2F0aW9ufHVuZGVmaW5lZClbXTtcbiAgLyoqXG4gICAqIFRoZSBuYW1lcyBvZiB0aGUgcGxhY2Vob2xkZXJzIHRoYXQgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHN1YnN0aXR1dGlvbnMuXG4gICAqL1xuICBwbGFjZWhvbGRlck5hbWVzOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBQYXJzZSBhIGAkbG9jYWxpemVgIHRhZ2dlZCBzdHJpbmcgaW50byBhIHN0cnVjdHVyZSB0aGF0IGNhbiBiZSB1c2VkIGZvciB0cmFuc2xhdGlvbiBvclxuICogZXh0cmFjdGlvbi5cbiAqXG4gKiBTZWUgYFBhcnNlZE1lc3NhZ2VgIGZvciBhbiBleGFtcGxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VNZXNzYWdlKFxuICAgIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIGV4cHJlc3Npb25zPzogcmVhZG9ubHkgYW55W10sIGxvY2F0aW9uPzogU291cmNlTG9jYXRpb24sXG4gICAgbWVzc2FnZVBhcnRMb2NhdGlvbnM/OiAoU291cmNlTG9jYXRpb258dW5kZWZpbmVkKVtdLFxuICAgIGV4cHJlc3Npb25Mb2NhdGlvbnM6IChTb3VyY2VMb2NhdGlvbnx1bmRlZmluZWQpW10gPSBbXSk6IFBhcnNlZE1lc3NhZ2Uge1xuICBjb25zdCBzdWJzdGl0dXRpb25zOiB7W3BsYWNlaG9sZGVyTmFtZTogc3RyaW5nXTogYW55fSA9IHt9O1xuICBjb25zdCBzdWJzdGl0dXRpb25Mb2NhdGlvbnM6IHtbcGxhY2Vob2xkZXJOYW1lOiBzdHJpbmddOiBTb3VyY2VMb2NhdGlvbnx1bmRlZmluZWR9ID0ge307XG4gIGNvbnN0IGFzc29jaWF0ZWRNZXNzYWdlSWRzOiB7W3BsYWNlaG9sZGVyTmFtZTogc3RyaW5nXTogTWVzc2FnZUlkfSA9IHt9O1xuICBjb25zdCBtZXRhZGF0YSA9IHBhcnNlTWV0YWRhdGEobWVzc2FnZVBhcnRzWzBdLCBtZXNzYWdlUGFydHMucmF3WzBdKTtcbiAgY29uc3QgY2xlYW5lZE1lc3NhZ2VQYXJ0czogc3RyaW5nW10gPSBbbWV0YWRhdGEudGV4dF07XG4gIGNvbnN0IHBsYWNlaG9sZGVyTmFtZXM6IHN0cmluZ1tdID0gW107XG4gIGxldCBtZXNzYWdlU3RyaW5nID0gbWV0YWRhdGEudGV4dDtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBtZXNzYWdlUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB7bWVzc2FnZVBhcnQsIHBsYWNlaG9sZGVyTmFtZSA9IGNvbXB1dGVQbGFjZWhvbGRlck5hbWUoaSksIGFzc29jaWF0ZWRNZXNzYWdlSWR9ID1cbiAgICAgICAgcGFyc2VQbGFjZWhvbGRlcihtZXNzYWdlUGFydHNbaV0sIG1lc3NhZ2VQYXJ0cy5yYXdbaV0pO1xuICAgIG1lc3NhZ2VTdHJpbmcgKz0gYHskJHtwbGFjZWhvbGRlck5hbWV9fSR7bWVzc2FnZVBhcnR9YDtcbiAgICBpZiAoZXhwcmVzc2lvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3Vic3RpdHV0aW9uc1twbGFjZWhvbGRlck5hbWVdID0gZXhwcmVzc2lvbnNbaSAtIDFdO1xuICAgICAgc3Vic3RpdHV0aW9uTG9jYXRpb25zW3BsYWNlaG9sZGVyTmFtZV0gPSBleHByZXNzaW9uTG9jYXRpb25zW2kgLSAxXTtcbiAgICB9XG4gICAgcGxhY2Vob2xkZXJOYW1lcy5wdXNoKHBsYWNlaG9sZGVyTmFtZSk7XG4gICAgaWYgKGFzc29jaWF0ZWRNZXNzYWdlSWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYXNzb2NpYXRlZE1lc3NhZ2VJZHNbcGxhY2Vob2xkZXJOYW1lXSA9IGFzc29jaWF0ZWRNZXNzYWdlSWQ7XG4gICAgfVxuICAgIGNsZWFuZWRNZXNzYWdlUGFydHMucHVzaChtZXNzYWdlUGFydCk7XG4gIH1cbiAgY29uc3QgbWVzc2FnZUlkID0gbWV0YWRhdGEuY3VzdG9tSWQgfHwgY29tcHV0ZU1zZ0lkKG1lc3NhZ2VTdHJpbmcsIG1ldGFkYXRhLm1lYW5pbmcgfHwgJycpO1xuICBjb25zdCBsZWdhY3lJZHMgPSBtZXRhZGF0YS5sZWdhY3lJZHMgPyBtZXRhZGF0YS5sZWdhY3lJZHMuZmlsdGVyKGlkID0+IGlkICE9PSBtZXNzYWdlSWQpIDogW107XG4gIHJldHVybiB7XG4gICAgaWQ6IG1lc3NhZ2VJZCxcbiAgICBsZWdhY3lJZHMsXG4gICAgc3Vic3RpdHV0aW9ucyxcbiAgICBzdWJzdGl0dXRpb25Mb2NhdGlvbnMsXG4gICAgdGV4dDogbWVzc2FnZVN0cmluZyxcbiAgICBjdXN0b21JZDogbWV0YWRhdGEuY3VzdG9tSWQsXG4gICAgbWVhbmluZzogbWV0YWRhdGEubWVhbmluZyB8fCAnJyxcbiAgICBkZXNjcmlwdGlvbjogbWV0YWRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgbWVzc2FnZVBhcnRzOiBjbGVhbmVkTWVzc2FnZVBhcnRzLFxuICAgIG1lc3NhZ2VQYXJ0TG9jYXRpb25zLFxuICAgIHBsYWNlaG9sZGVyTmFtZXMsXG4gICAgYXNzb2NpYXRlZE1lc3NhZ2VJZHMsXG4gICAgbG9jYXRpb24sXG4gIH07XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIG1lc3NhZ2UgcGFydCAoYGNvb2tlZGAgKyBgcmF3YCkgdG8gZXh0cmFjdCB0aGUgbWVzc2FnZSBtZXRhZGF0YSBmcm9tIHRoZSB0ZXh0LlxuICpcbiAqIElmIHRoZSBtZXNzYWdlIHBhcnQgaGFzIGEgbWV0YWRhdGEgYmxvY2sgdGhpcyBmdW5jdGlvbiB3aWxsIGV4dHJhY3QgdGhlIGBtZWFuaW5nYCxcbiAqIGBkZXNjcmlwdGlvbmAsIGBjdXN0b21JZGAgYW5kIGBsZWdhY3lJZGAgKGlmIHByb3ZpZGVkKSBmcm9tIHRoZSBibG9jay4gVGhlc2UgbWV0YWRhdGEgcHJvcGVydGllc1xuICogYXJlIHNlcmlhbGl6ZWQgaW4gdGhlIHN0cmluZyBkZWxpbWl0ZWQgYnkgYHxgLCBgQEBgIGFuZCBg4pCfYCByZXNwZWN0aXZlbHkuXG4gKlxuICogKE5vdGUgdGhhdCBg4pCfYCBpcyB0aGUgYExFR0FDWV9JRF9JTkRJQ0FUT1JgIC0gc2VlIGBjb25zdGFudHMudHNgLilcbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogYDptZWFuaW5nfGRlc2NyaXB0aW9uQEBjdXN0b20taWQ6YFxuICogYDptZWFuaW5nfEBAY3VzdG9tLWlkOmBcbiAqIGA6bWVhbmluZ3xkZXNjcmlwdGlvbjpgXG4gKiBgOmRlc2NyaXB0aW9uQEBjdXN0b20taWQ6YFxuICogYDptZWFuaW5nfDpgXG4gKiBgOmRlc2NyaXB0aW9uOmBcbiAqIGA6QEBjdXN0b20taWQ6YFxuICogYDptZWFuaW5nfGRlc2NyaXB0aW9uQEBjdXN0b20taWTikJ9sZWdhY3ktaWQtMeKQn2xlZ2FjeS1pZC0yOmBcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIGNvb2tlZCB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcGFyYW0gcmF3IFRoZSByYXcgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHJldHVybnMgQSBvYmplY3QgY29udGFpbmluZyBhbnkgbWV0YWRhdGEgdGhhdCB3YXMgcGFyc2VkIGZyb20gdGhlIG1lc3NhZ2UgcGFydC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTWV0YWRhdGEoY29va2VkOiBzdHJpbmcsIHJhdzogc3RyaW5nKTogTWVzc2FnZU1ldGFkYXRhIHtcbiAgY29uc3Qge3RleHQ6IG1lc3NhZ2VTdHJpbmcsIGJsb2NrfSA9IHNwbGl0QmxvY2soY29va2VkLCByYXcpO1xuICBpZiAoYmxvY2sgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB7dGV4dDogbWVzc2FnZVN0cmluZ307XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgW21lYW5pbmdEZXNjQW5kSWQsIC4uLmxlZ2FjeUlkc10gPSBibG9jay5zcGxpdChMRUdBQ1lfSURfSU5ESUNBVE9SKTtcbiAgICBjb25zdCBbbWVhbmluZ0FuZERlc2MsIGN1c3RvbUlkXSA9IG1lYW5pbmdEZXNjQW5kSWQuc3BsaXQoSURfU0VQQVJBVE9SLCAyKTtcbiAgICBsZXQgW21lYW5pbmcsIGRlc2NyaXB0aW9uXTogKHN0cmluZ3x1bmRlZmluZWQpW10gPSBtZWFuaW5nQW5kRGVzYy5zcGxpdChNRUFOSU5HX1NFUEFSQVRPUiwgMik7XG4gICAgaWYgKGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gbWVhbmluZztcbiAgICAgIG1lYW5pbmcgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChkZXNjcmlwdGlvbiA9PT0gJycpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4ge3RleHQ6IG1lc3NhZ2VTdHJpbmcsIG1lYW5pbmcsIGRlc2NyaXB0aW9uLCBjdXN0b21JZCwgbGVnYWN5SWRzfTtcbiAgfVxufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBtZXNzYWdlIHBhcnQgKGBjb29rZWRgICsgYHJhd2ApIHRvIGV4dHJhY3QgYW55IHBsYWNlaG9sZGVyIG1ldGFkYXRhIGZyb20gdGhlXG4gKiB0ZXh0LlxuICpcbiAqIElmIHRoZSBtZXNzYWdlIHBhcnQgaGFzIGEgbWV0YWRhdGEgYmxvY2sgdGhpcyBmdW5jdGlvbiB3aWxsIGV4dHJhY3QgdGhlIGBwbGFjZWhvbGRlck5hbWVgIGFuZFxuICogYGFzc29jaWF0ZWRNZXNzYWdlSWRgIChpZiBwcm92aWRlZCkgZnJvbSB0aGUgYmxvY2suXG4gKlxuICogVGhlc2UgbWV0YWRhdGEgcHJvcGVydGllcyBhcmUgc2VyaWFsaXplZCBpbiB0aGUgc3RyaW5nIGRlbGltaXRlZCBieSBgQEBgLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiBgOnBsYWNlaG9sZGVyLW5hbWVAQGFzc29jaWF0ZWQtaWQ6YFxuICogYGBgXG4gKlxuICogQHBhcmFtIGNvb2tlZCBUaGUgY29va2VkIHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEBwYXJhbSByYXcgVGhlIHJhdyB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcmV0dXJucyBBIG9iamVjdCBjb250YWluaW5nIHRoZSBtZXRhZGF0YSAoYHBsYWNlaG9sZGVyTmFtZWAgYW5kIGBhc3NvY2lhdGVkTWVzc2FnZUlkYCkgb2YgdGhlXG4gKiAgICAgcHJlY2VkaW5nIHBsYWNlaG9sZGVyLCBhbG9uZyB3aXRoIHRoZSBzdGF0aWMgdGV4dCB0aGF0IGZvbGxvd3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVBsYWNlaG9sZGVyKGNvb2tlZDogc3RyaW5nLCByYXc6IHN0cmluZyk6XG4gICAge21lc3NhZ2VQYXJ0OiBzdHJpbmc7IHBsYWNlaG9sZGVyTmFtZT86IHN0cmluZzsgYXNzb2NpYXRlZE1lc3NhZ2VJZD86IHN0cmluZzt9IHtcbiAgY29uc3Qge3RleHQ6IG1lc3NhZ2VQYXJ0LCBibG9ja30gPSBzcGxpdEJsb2NrKGNvb2tlZCwgcmF3KTtcbiAgaWYgKGJsb2NrID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4ge21lc3NhZ2VQYXJ0fTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBbcGxhY2Vob2xkZXJOYW1lLCBhc3NvY2lhdGVkTWVzc2FnZUlkXSA9IGJsb2NrLnNwbGl0KElEX1NFUEFSQVRPUik7XG4gICAgcmV0dXJuIHttZXNzYWdlUGFydCwgcGxhY2Vob2xkZXJOYW1lLCBhc3NvY2lhdGVkTWVzc2FnZUlkfTtcbiAgfVxufVxuXG4vKipcbiAqIFNwbGl0IGEgbWVzc2FnZSBwYXJ0IChgY29va2VkYCArIGByYXdgKSBpbnRvIGFuIG9wdGlvbmFsIGRlbGltaXRlZCBcImJsb2NrXCIgb2ZmIHRoZSBmcm9udCBhbmQgdGhlXG4gKiByZXN0IG9mIHRoZSB0ZXh0IG9mIHRoZSBtZXNzYWdlIHBhcnQuXG4gKlxuICogQmxvY2tzIGFwcGVhciBhdCB0aGUgc3RhcnQgb2YgbWVzc2FnZSBwYXJ0cy4gVGhleSBhcmUgZGVsaW1pdGVkIGJ5IGEgY29sb24gYDpgIGNoYXJhY3RlciBhdCB0aGVcbiAqIHN0YXJ0IGFuZCBlbmQgb2YgdGhlIGJsb2NrLlxuICpcbiAqIElmIHRoZSBibG9jayBpcyBpbiB0aGUgZmlyc3QgbWVzc2FnZSBwYXJ0IHRoZW4gaXQgd2lsbCBiZSBtZXRhZGF0YSBhYm91dCB0aGUgd2hvbGUgbWVzc2FnZTpcbiAqIG1lYW5pbmcsIGRlc2NyaXB0aW9uLCBpZC4gIE90aGVyd2lzZSBpdCB3aWxsIGJlIG1ldGFkYXRhIGFib3V0IHRoZSBpbW1lZGlhdGVseSBwcmVjZWRpbmdcbiAqIHN1YnN0aXR1dGlvbjogcGxhY2Vob2xkZXIgbmFtZS5cbiAqXG4gKiBTaW5jZSBibG9ja3MgYXJlIG9wdGlvbmFsLCBpdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSBjb250ZW50IG9mIGEgbWVzc2FnZSBibG9jayBhY3R1YWxseSBzdGFydHNcbiAqIHdpdGggYSBibG9jayBtYXJrZXIuIEluIHRoaXMgY2FzZSB0aGUgbWFya2VyIG11c3QgYmUgZXNjYXBlZCBgXFw6YC5cbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBgdGV4dGAgb2YgdGhlIG1lc3NhZ2UgcGFydCBhbmQgdGhlIHRleHQgb2YgdGhlIGBibG9ja2AsIGlmIGl0XG4gKiBleGlzdHMuXG4gKiBAdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBgYmxvY2tgIGlzIHVudGVybWluYXRlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRCbG9jayhjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiB7dGV4dDogc3RyaW5nLCBibG9jaz86IHN0cmluZ30ge1xuICBpZiAocmF3LmNoYXJBdCgwKSAhPT0gQkxPQ0tfTUFSS0VSKSB7XG4gICAgcmV0dXJuIHt0ZXh0OiBjb29rZWR9O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGVuZE9mQmxvY2sgPSBmaW5kRW5kT2ZCbG9jayhjb29rZWQsIHJhdyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJsb2NrOiBjb29rZWQuc3Vic3RyaW5nKDEsIGVuZE9mQmxvY2spLFxuICAgICAgdGV4dDogY29va2VkLnN1YnN0cmluZyhlbmRPZkJsb2NrICsgMSksXG4gICAgfTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGNvbXB1dGVQbGFjZWhvbGRlck5hbWUoaW5kZXg6IG51bWJlcikge1xuICByZXR1cm4gaW5kZXggPT09IDEgPyAnUEgnIDogYFBIXyR7aW5kZXggLSAxfWA7XG59XG5cbi8qKlxuICogRmluZCB0aGUgZW5kIG9mIGEgXCJtYXJrZWQgYmxvY2tcIiBpbmRpY2F0ZWQgYnkgdGhlIGZpcnN0IG5vbi1lc2NhcGVkIGNvbG9uLlxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIGNvb2tlZCBzdHJpbmcgKHdoZXJlIGVzY2FwZWQgY2hhcnMgaGF2ZSBiZWVuIHByb2Nlc3NlZClcbiAqIEBwYXJhbSByYXcgVGhlIHJhdyBzdHJpbmcgKHdoZXJlIGVzY2FwZSBzZXF1ZW5jZXMgYXJlIHN0aWxsIGluIHBsYWNlKVxuICpcbiAqIEByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZW5kIG9mIGJsb2NrIG1hcmtlclxuICogQHRocm93cyBhbiBlcnJvciBpZiB0aGUgYmxvY2sgaXMgdW50ZXJtaW5hdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRW5kT2ZCbG9jayhjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiBudW1iZXIge1xuICBmb3IgKGxldCBjb29rZWRJbmRleCA9IDEsIHJhd0luZGV4ID0gMTsgY29va2VkSW5kZXggPCBjb29rZWQubGVuZ3RoOyBjb29rZWRJbmRleCsrLCByYXdJbmRleCsrKSB7XG4gICAgaWYgKHJhd1tyYXdJbmRleF0gPT09ICdcXFxcJykge1xuICAgICAgcmF3SW5kZXgrKztcbiAgICB9IGVsc2UgaWYgKGNvb2tlZFtjb29rZWRJbmRleF0gPT09IEJMT0NLX01BUktFUikge1xuICAgICAgcmV0dXJuIGNvb2tlZEluZGV4O1xuICAgIH1cbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYFVudGVybWluYXRlZCAkbG9jYWxpemUgbWV0YWRhdGEgYmxvY2sgaW4gXCIke3Jhd31cIi5gKTtcbn1cbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtCTE9DS19NQVJLRVJ9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7TWVzc2FnZUlkLCBNZXNzYWdlTWV0YWRhdGEsIFBhcnNlZE1lc3NhZ2UsIHBhcnNlTWVzc2FnZSwgVGFyZ2V0TWVzc2FnZX0gZnJvbSAnLi9tZXNzYWdlcyc7XG5cblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIG1lc3NhZ2UgdGhhdCBoYXMgYmVlbiBwcm9jZXNzZWQgdG8gZXh0cmFjdCB0aGUgbWVzc2FnZSBwYXJ0cyBhbmQgcGxhY2Vob2xkZXJzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlZFRyYW5zbGF0aW9uIGV4dGVuZHMgTWVzc2FnZU1ldGFkYXRhIHtcbiAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheTtcbiAgcGxhY2Vob2xkZXJOYW1lczogc3RyaW5nW107XG59XG5cbi8qKlxuICogVGhlIGludGVybmFsIHN0cnVjdHVyZSB1c2VkIGJ5IHRoZSBydW50aW1lIGxvY2FsaXphdGlvbiB0byB0cmFuc2xhdGUgbWVzc2FnZXMuXG4gKi9cbmV4cG9ydCB0eXBlIFBhcnNlZFRyYW5zbGF0aW9ucyA9IFJlY29yZDxNZXNzYWdlSWQsIFBhcnNlZFRyYW5zbGF0aW9uPjtcblxuZXhwb3J0IGNsYXNzIE1pc3NpbmdUcmFuc2xhdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBwcml2YXRlIHJlYWRvbmx5IHR5cGUgPSAnTWlzc2luZ1RyYW5zbGF0aW9uRXJyb3InO1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBwYXJzZWRNZXNzYWdlOiBQYXJzZWRNZXNzYWdlKSB7XG4gICAgc3VwZXIoYE5vIHRyYW5zbGF0aW9uIGZvdW5kIGZvciAke2Rlc2NyaWJlTWVzc2FnZShwYXJzZWRNZXNzYWdlKX0uYCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTWlzc2luZ1RyYW5zbGF0aW9uRXJyb3IoZTogYW55KTogZSBpcyBNaXNzaW5nVHJhbnNsYXRpb25FcnJvciB7XG4gIHJldHVybiBlLnR5cGUgPT09ICdNaXNzaW5nVHJhbnNsYXRpb25FcnJvcic7XG59XG5cbi8qKlxuICogVHJhbnNsYXRlIHRoZSB0ZXh0IG9mIHRoZSBgJGxvY2FsaXplYCB0YWdnZWQtc3RyaW5nIChpLmUuIGBtZXNzYWdlUGFydHNgIGFuZFxuICogYHN1YnN0aXR1dGlvbnNgKSB1c2luZyB0aGUgZ2l2ZW4gYHRyYW5zbGF0aW9uc2AuXG4gKlxuICogVGhlIHRhZ2dlZC1zdHJpbmcgaXMgcGFyc2VkIHRvIGV4dHJhY3QgaXRzIGBtZXNzYWdlSWRgIHdoaWNoIGlzIHVzZWQgdG8gZmluZCBhbiBhcHByb3ByaWF0ZVxuICogYFBhcnNlZFRyYW5zbGF0aW9uYC4gSWYgdGhpcyBkb2Vzbid0IG1hdGNoIGFuZCB0aGVyZSBhcmUgbGVnYWN5IGlkcyB0aGVuIHRyeSBtYXRjaGluZyBhXG4gKiB0cmFuc2xhdGlvbiB1c2luZyB0aG9zZS5cbiAqXG4gKiBJZiBvbmUgaXMgZm91bmQgdGhlbiBpdCBpcyB1c2VkIHRvIHRyYW5zbGF0ZSB0aGUgbWVzc2FnZSBpbnRvIGEgbmV3IHNldCBvZiBgbWVzc2FnZVBhcnRzYCBhbmRcbiAqIGBzdWJzdGl0dXRpb25zYC5cbiAqIFRoZSB0cmFuc2xhdGlvbiBtYXkgcmVvcmRlciAob3IgcmVtb3ZlKSBzdWJzdGl0dXRpb25zIGFzIGFwcHJvcHJpYXRlLlxuICpcbiAqIElmIHRoZXJlIGlzIG5vIHRyYW5zbGF0aW9uIHdpdGggYSBtYXRjaGluZyBtZXNzYWdlIGlkIHRoZW4gYW4gZXJyb3IgaXMgdGhyb3duLlxuICogSWYgYSB0cmFuc2xhdGlvbiBjb250YWlucyBhIHBsYWNlaG9sZGVyIHRoYXQgaXMgbm90IGZvdW5kIGluIHRoZSBtZXNzYWdlIGJlaW5nIHRyYW5zbGF0ZWQgdGhlbiBhblxuICogZXJyb3IgaXMgdGhyb3duLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlKFxuICAgIHRyYW5zbGF0aW9uczogUmVjb3JkPHN0cmluZywgUGFyc2VkVHJhbnNsYXRpb24+LCBtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LFxuICAgIHN1YnN0aXR1dGlvbnM6IHJlYWRvbmx5IGFueVtdKTogW1RlbXBsYXRlU3RyaW5nc0FycmF5LCByZWFkb25seSBhbnlbXV0ge1xuICBjb25zdCBtZXNzYWdlID0gcGFyc2VNZXNzYWdlKG1lc3NhZ2VQYXJ0cywgc3Vic3RpdHV0aW9ucyk7XG4gIC8vIExvb2sgdXAgdGhlIHRyYW5zbGF0aW9uIHVzaW5nIHRoZSBtZXNzYWdlSWQsIGFuZCB0aGVuIHRoZSBsZWdhY3lJZCBpZiBhdmFpbGFibGUuXG4gIGxldCB0cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uc1ttZXNzYWdlLmlkXTtcbiAgLy8gSWYgdGhlIG1lc3NhZ2VJZCBkaWQgbm90IG1hdGNoIGEgdHJhbnNsYXRpb24sIHRyeSBtYXRjaGluZyB0aGUgbGVnYWN5IGlkcyBpbnN0ZWFkXG4gIGlmIChtZXNzYWdlLmxlZ2FjeUlkcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNzYWdlLmxlZ2FjeUlkcy5sZW5ndGggJiYgdHJhbnNsYXRpb24gPT09IHVuZGVmaW5lZDsgaSsrKSB7XG4gICAgICB0cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uc1ttZXNzYWdlLmxlZ2FjeUlkc1tpXV07XG4gICAgfVxuICB9XG4gIGlmICh0cmFuc2xhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IE1pc3NpbmdUcmFuc2xhdGlvbkVycm9yKG1lc3NhZ2UpO1xuICB9XG4gIHJldHVybiBbXG4gICAgdHJhbnNsYXRpb24ubWVzc2FnZVBhcnRzLCB0cmFuc2xhdGlvbi5wbGFjZWhvbGRlck5hbWVzLm1hcChwbGFjZWhvbGRlciA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5zdWJzdGl0dXRpb25zLmhhc093blByb3BlcnR5KHBsYWNlaG9sZGVyKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZS5zdWJzdGl0dXRpb25zW3BsYWNlaG9sZGVyXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBUaGVyZSBpcyBhIHBsYWNlaG9sZGVyIG5hbWUgbWlzbWF0Y2ggd2l0aCB0aGUgdHJhbnNsYXRpb24gcHJvdmlkZWQgZm9yIHRoZSBtZXNzYWdlICR7XG4gICAgICAgICAgICAgICAgZGVzY3JpYmVNZXNzYWdlKG1lc3NhZ2UpfS5cXG5gICtcbiAgICAgICAgICAgIGBUaGUgdHJhbnNsYXRpb24gY29udGFpbnMgYSBwbGFjZWhvbGRlciB3aXRoIG5hbWUgJHtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcn0sIHdoaWNoIGRvZXMgbm90IGV4aXN0IGluIHRoZSBtZXNzYWdlLmApO1xuICAgICAgfVxuICAgIH0pXG4gIF07XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGBtZXNzYWdlUGFydHNgIGFuZCBgcGxhY2Vob2xkZXJOYW1lc2Agb3V0IG9mIGEgdGFyZ2V0IGBtZXNzYWdlYC5cbiAqXG4gKiBVc2VkIGJ5IGBsb2FkVHJhbnNsYXRpb25zKClgIHRvIGNvbnZlcnQgdGFyZ2V0IG1lc3NhZ2Ugc3RyaW5ncyBpbnRvIGEgc3RydWN0dXJlIHRoYXQgaXMgbW9yZVxuICogYXBwcm9wcmlhdGUgZm9yIGRvaW5nIHRyYW5zbGF0aW9uLlxuICpcbiAqIEBwYXJhbSBtZXNzYWdlIHRoZSBtZXNzYWdlIHRvIGJlIHBhcnNlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJhbnNsYXRpb24obWVzc2FnZVN0cmluZzogVGFyZ2V0TWVzc2FnZSk6IFBhcnNlZFRyYW5zbGF0aW9uIHtcbiAgY29uc3QgcGFydHMgPSBtZXNzYWdlU3RyaW5nLnNwbGl0KC97XFwkKFtefV0qKX0vKTtcbiAgY29uc3QgbWVzc2FnZVBhcnRzID0gW3BhcnRzWzBdXTtcbiAgY29uc3QgcGxhY2Vob2xkZXJOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBwYXJ0cy5sZW5ndGggLSAxOyBpICs9IDIpIHtcbiAgICBwbGFjZWhvbGRlck5hbWVzLnB1c2gocGFydHNbaV0pO1xuICAgIG1lc3NhZ2VQYXJ0cy5wdXNoKGAke3BhcnRzW2kgKyAxXX1gKTtcbiAgfVxuICBjb25zdCByYXdNZXNzYWdlUGFydHMgPVxuICAgICAgbWVzc2FnZVBhcnRzLm1hcChwYXJ0ID0+IHBhcnQuY2hhckF0KDApID09PSBCTE9DS19NQVJLRVIgPyAnXFxcXCcgKyBwYXJ0IDogcGFydCk7XG4gIHJldHVybiB7XG4gICAgdGV4dDogbWVzc2FnZVN0cmluZyxcbiAgICBtZXNzYWdlUGFydHM6IG1ha2VUZW1wbGF0ZU9iamVjdChtZXNzYWdlUGFydHMsIHJhd01lc3NhZ2VQYXJ0cyksXG4gICAgcGxhY2Vob2xkZXJOYW1lcyxcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBgUGFyc2VkVHJhbnNsYXRpb25gIGZyb20gYSBzZXQgb2YgYG1lc3NhZ2VQYXJ0c2AgYW5kIGBwbGFjZWhvbGRlck5hbWVzYC5cbiAqXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnRzIFRoZSBtZXNzYWdlIHBhcnRzIHRvIGFwcGVhciBpbiB0aGUgUGFyc2VkVHJhbnNsYXRpb24uXG4gKiBAcGFyYW0gcGxhY2Vob2xkZXJOYW1lcyBUaGUgbmFtZXMgb2YgdGhlIHBsYWNlaG9sZGVycyB0byBpbnRlcnNwZXJzZSBiZXR3ZWVuIHRoZSBgbWVzc2FnZVBhcnRzYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VQYXJzZWRUcmFuc2xhdGlvbihcbiAgICBtZXNzYWdlUGFydHM6IHN0cmluZ1tdLCBwbGFjZWhvbGRlck5hbWVzOiBzdHJpbmdbXSA9IFtdKTogUGFyc2VkVHJhbnNsYXRpb24ge1xuICBsZXQgbWVzc2FnZVN0cmluZyA9IG1lc3NhZ2VQYXJ0c1swXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGFjZWhvbGRlck5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWVzc2FnZVN0cmluZyArPSBgeyQke3BsYWNlaG9sZGVyTmFtZXNbaV19fSR7bWVzc2FnZVBhcnRzW2kgKyAxXX1gO1xuICB9XG4gIHJldHVybiB7XG4gICAgdGV4dDogbWVzc2FnZVN0cmluZyxcbiAgICBtZXNzYWdlUGFydHM6IG1ha2VUZW1wbGF0ZU9iamVjdChtZXNzYWdlUGFydHMsIG1lc3NhZ2VQYXJ0cyksXG4gICAgcGxhY2Vob2xkZXJOYW1lc1xuICB9O1xufVxuXG4vKipcbiAqIENyZWF0ZSB0aGUgc3BlY2lhbGl6ZWQgYXJyYXkgdGhhdCBpcyBwYXNzZWQgdG8gdGFnZ2VkLXN0cmluZyB0YWcgZnVuY3Rpb25zLlxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIG1lc3NhZ2UgcGFydHMgd2l0aCB0aGVpciBlc2NhcGUgY29kZXMgcHJvY2Vzc2VkLlxuICogQHBhcmFtIHJhdyBUaGUgbWVzc2FnZSBwYXJ0cyB3aXRoIHRoZWlyIGVzY2FwZWQgY29kZXMgYXMtaXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlVGVtcGxhdGVPYmplY3QoY29va2VkOiBzdHJpbmdbXSwgcmF3OiBzdHJpbmdbXSk6IFRlbXBsYXRlU3RyaW5nc0FycmF5IHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgJ3JhdycsIHt2YWx1ZTogcmF3fSk7XG4gIHJldHVybiBjb29rZWQgYXMgYW55O1xufVxuXG5cbmZ1bmN0aW9uIGRlc2NyaWJlTWVzc2FnZShtZXNzYWdlOiBQYXJzZWRNZXNzYWdlKTogc3RyaW5nIHtcbiAgY29uc3QgbWVhbmluZ1N0cmluZyA9IG1lc3NhZ2UubWVhbmluZyAmJiBgIC0gXCIke21lc3NhZ2UubWVhbmluZ31cImA7XG4gIGNvbnN0IGxlZ2FjeSA9IG1lc3NhZ2UubGVnYWN5SWRzICYmIG1lc3NhZ2UubGVnYWN5SWRzLmxlbmd0aCA+IDAgP1xuICAgICAgYCBbJHttZXNzYWdlLmxlZ2FjeUlkcy5tYXAobCA9PiBgXCIke2x9XCJgKS5qb2luKCcsICcpfV1gIDpcbiAgICAgICcnO1xuICByZXR1cm4gYFwiJHttZXNzYWdlLmlkfVwiJHtsZWdhY3l9IChcIiR7bWVzc2FnZS50ZXh0fVwiJHttZWFuaW5nU3RyaW5nfSlgO1xufVxuIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0xvY2FsaXplRm59IGZyb20gJy4vbG9jYWxpemUnO1xuaW1wb3J0IHtNZXNzYWdlSWQsIFBhcnNlZFRyYW5zbGF0aW9uLCBwYXJzZVRyYW5zbGF0aW9uLCBUYXJnZXRNZXNzYWdlLCB0cmFuc2xhdGUgYXMgX3RyYW5zbGF0ZX0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogV2UgYXVnbWVudCB0aGUgYCRsb2NhbGl6ZWAgb2JqZWN0IHRvIGFsc28gc3RvcmUgdGhlIHRyYW5zbGF0aW9ucy5cbiAqXG4gKiBOb3RlIHRoYXQgYmVjYXVzZSB0aGUgVFJBTlNMQVRJT05TIGFyZSBhdHRhY2hlZCB0byBhIGdsb2JhbCBvYmplY3QsIHRoZXkgd2lsbCBiZSBzaGFyZWQgYmV0d2VlblxuICogYWxsIGFwcGxpY2F0aW9ucyB0aGF0IGFyZSBydW5uaW5nIGluIGEgc2luZ2xlIHBhZ2Ugb2YgdGhlIGJyb3dzZXIuXG4gKi9cbmRlY2xhcmUgY29uc3QgJGxvY2FsaXplOiBMb2NhbGl6ZUZuJntUUkFOU0xBVElPTlM6IFJlY29yZDxNZXNzYWdlSWQsIFBhcnNlZFRyYW5zbGF0aW9uPn07XG5cbi8qKlxuICogTG9hZCB0cmFuc2xhdGlvbnMgZm9yIHVzZSBieSBgJGxvY2FsaXplYCwgaWYgZG9pbmcgcnVudGltZSB0cmFuc2xhdGlvbi5cbiAqXG4gKiBJZiB0aGUgYCRsb2NhbGl6ZWAgdGFnZ2VkIHN0cmluZ3MgYXJlIG5vdCBnb2luZyB0byBiZSByZXBsYWNlZCBhdCBjb21waWxlZCB0aW1lLCBpdCBpcyBwb3NzaWJsZVxuICogdG8gbG9hZCBhIHNldCBvZiB0cmFuc2xhdGlvbnMgdGhhdCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGAkbG9jYWxpemVgIHRhZ2dlZCBzdHJpbmdzIGF0IHJ1bnRpbWUsXG4gKiBpbiB0aGUgYnJvd3Nlci5cbiAqXG4gKiBMb2FkaW5nIGEgbmV3IHRyYW5zbGF0aW9uIHdpbGwgb3ZlcndyaXRlIGEgcHJldmlvdXMgdHJhbnNsYXRpb24gaWYgaXQgaGFzIHRoZSBzYW1lIGBNZXNzYWdlSWRgLlxuICpcbiAqIE5vdGUgdGhhdCBgJGxvY2FsaXplYCBtZXNzYWdlcyBhcmUgb25seSBwcm9jZXNzZWQgb25jZSwgd2hlbiB0aGUgdGFnZ2VkIHN0cmluZyBpcyBmaXJzdFxuICogZW5jb3VudGVyZWQsIGFuZCBkb2VzIG5vdCBwcm92aWRlIGR5bmFtaWMgbGFuZ3VhZ2UgY2hhbmdpbmcgd2l0aG91dCByZWZyZXNoaW5nIHRoZSBicm93c2VyLlxuICogTG9hZGluZyBuZXcgdHJhbnNsYXRpb25zIGxhdGVyIGluIHRoZSBhcHBsaWNhdGlvbiBsaWZlLWN5Y2xlIHdpbGwgbm90IGNoYW5nZSB0aGUgdHJhbnNsYXRlZCB0ZXh0XG4gKiBvZiBtZXNzYWdlcyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIHRyYW5zbGF0ZWQuXG4gKlxuICogVGhlIG1lc3NhZ2UgSURzIGFuZCB0cmFuc2xhdGlvbnMgYXJlIGluIHRoZSBzYW1lIGZvcm1hdCBhcyB0aGF0IHJlbmRlcmVkIHRvIFwic2ltcGxlIEpTT05cIlxuICogdHJhbnNsYXRpb24gZmlsZXMgd2hlbiBleHRyYWN0aW5nIG1lc3NhZ2VzLiBJbiBwYXJ0aWN1bGFyLCBwbGFjZWhvbGRlcnMgaW4gbWVzc2FnZXMgYXJlIHJlbmRlcmVkXG4gKiB1c2luZyB0aGUgYHskUExBQ0VIT0xERVJfTkFNRX1gIHN5bnRheC4gRm9yIGV4YW1wbGUgdGhlIG1lc3NhZ2UgZnJvbSB0aGUgZm9sbG93aW5nIHRlbXBsYXRlOlxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgaTE4bj5wcmU8c3Bhbj5pbm5lci1wcmU8Yj5ib2xkPC9iPmlubmVyLXBvc3Q8L3NwYW4+cG9zdDwvZGl2PlxuICogYGBgXG4gKlxuICogd291bGQgaGF2ZSB0aGUgZm9sbG93aW5nIGZvcm0gaW4gdGhlIGB0cmFuc2xhdGlvbnNgIG1hcDpcbiAqXG4gKiBgYGB0c1xuICoge1xuICogICBcIjI5MzI5MDE0OTE5NzYyMjQ3NTdcIjpcbiAqICAgICAgXCJwcmV7JFNUQVJUX1RBR19TUEFOfWlubmVyLXByZXskU1RBUlRfQk9MRF9URVhUfWJvbGR7JENMT1NFX0JPTERfVEVYVH1pbm5lci1wb3N0eyRDTE9TRV9UQUdfU1BBTn1wb3N0XCJcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB0cmFuc2xhdGlvbnMgQSBtYXAgZnJvbSBtZXNzYWdlIElEIHRvIHRyYW5zbGF0ZWQgbWVzc2FnZS5cbiAqXG4gKiBUaGVzZSBtZXNzYWdlcyBhcmUgcHJvY2Vzc2VkIGFuZCBhZGRlZCB0byBhIGxvb2t1cCBiYXNlZCBvbiB0aGVpciBgTWVzc2FnZUlkYC5cbiAqXG4gKiBAc2VlIHtAbGluayBjbGVhclRyYW5zbGF0aW9uc30gZm9yIHJlbW92aW5nIHRyYW5zbGF0aW9ucyBsb2FkZWQgdXNpbmcgdGhpcyBmdW5jdGlvbi5cbiAqIEBzZWUge0BsaW5rICRsb2NhbGl6ZX0gZm9yIHRhZ2dpbmcgbWVzc2FnZXMgYXMgbmVlZGluZyB0byBiZSB0cmFuc2xhdGVkLlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZFRyYW5zbGF0aW9ucyh0cmFuc2xhdGlvbnM6IFJlY29yZDxNZXNzYWdlSWQsIFRhcmdldE1lc3NhZ2U+KSB7XG4gIC8vIEVuc3VyZSB0aGUgdHJhbnNsYXRlIGZ1bmN0aW9uIGV4aXN0c1xuICBpZiAoISRsb2NhbGl6ZS50cmFuc2xhdGUpIHtcbiAgICAkbG9jYWxpemUudHJhbnNsYXRlID0gdHJhbnNsYXRlO1xuICB9XG4gIGlmICghJGxvY2FsaXplLlRSQU5TTEFUSU9OUykge1xuICAgICRsb2NhbGl6ZS5UUkFOU0xBVElPTlMgPSB7fTtcbiAgfVxuICBPYmplY3Qua2V5cyh0cmFuc2xhdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAkbG9jYWxpemUuVFJBTlNMQVRJT05TW2tleV0gPSBwYXJzZVRyYW5zbGF0aW9uKHRyYW5zbGF0aW9uc1trZXldKTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFsbCB0cmFuc2xhdGlvbnMgZm9yIGAkbG9jYWxpemVgLCBpZiBkb2luZyBydW50aW1lIHRyYW5zbGF0aW9uLlxuICpcbiAqIEFsbCB0cmFuc2xhdGlvbnMgdGhhdCBoYWQgYmVlbiBsb2FkaW5nIGludG8gbWVtb3J5IHVzaW5nIGBsb2FkVHJhbnNsYXRpb25zKClgIHdpbGwgYmUgcmVtb3ZlZC5cbiAqXG4gKiBAc2VlIHtAbGluayBsb2FkVHJhbnNsYXRpb25zfSBmb3IgbG9hZGluZyB0cmFuc2xhdGlvbnMgYXQgcnVudGltZS5cbiAqIEBzZWUge0BsaW5rICRsb2NhbGl6ZX0gZm9yIHRhZ2dpbmcgbWVzc2FnZXMgYXMgbmVlZGluZyB0byBiZSB0cmFuc2xhdGVkLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyVHJhbnNsYXRpb25zKCkge1xuICAkbG9jYWxpemUudHJhbnNsYXRlID0gdW5kZWZpbmVkO1xuICAkbG9jYWxpemUuVFJBTlNMQVRJT05TID0ge307XG59XG5cbi8qKlxuICogVHJhbnNsYXRlIHRoZSB0ZXh0IG9mIHRoZSBnaXZlbiBtZXNzYWdlLCB1c2luZyB0aGUgbG9hZGVkIHRyYW5zbGF0aW9ucy5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIG1heSByZW9yZGVyIChvciByZW1vdmUpIHN1YnN0aXR1dGlvbnMgYXMgaW5kaWNhdGVkIGluIHRoZSBtYXRjaGluZyB0cmFuc2xhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZShtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCBzdWJzdGl0dXRpb25zOiByZWFkb25seSBhbnlbXSk6XG4gICAgW1RlbXBsYXRlU3RyaW5nc0FycmF5LCByZWFkb25seSBhbnlbXV0ge1xuICB0cnkge1xuICAgIHJldHVybiBfdHJhbnNsYXRlKCRsb2NhbGl6ZS5UUkFOU0xBVElPTlMsIG1lc3NhZ2VQYXJ0cywgc3Vic3RpdHV0aW9ucyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oKGUgYXMgRXJyb3IpLm1lc3NhZ2UpO1xuICAgIHJldHVybiBbbWVzc2FnZVBhcnRzLCBzdWJzdGl0dXRpb25zXTtcbiAgfVxufVxuIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7ZmluZEVuZE9mQmxvY2t9IGZyb20gJy4uLy4uL3V0aWxzJztcblxuLyoqIEBub2RvYyAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2NhbGl6ZUZuIHtcbiAgKG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLmV4cHJlc3Npb25zOiByZWFkb25seSBhbnlbXSk6IHN0cmluZztcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRzIGFuIGlucHV0IFwibWVzc2FnZSB3aXRoIGV4cHJlc3Npb25zXCIgaW50byBhIHRyYW5zbGF0ZWQgXCJtZXNzYWdlIHdpdGhcbiAgICogZXhwcmVzc2lvbnNcIi5cbiAgICpcbiAgICogVGhlIGNvbnZlcnNpb24gbWF5IGJlIGRvbmUgaW4gcGxhY2UsIG1vZGlmeWluZyB0aGUgYXJyYXkgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbiwgc29cbiAgICogZG9uJ3QgYXNzdW1lIHRoYXQgdGhpcyBoYXMgbm8gc2lkZS1lZmZlY3RzLlxuICAgKlxuICAgKiBUaGUgZXhwcmVzc2lvbnMgbXVzdCBiZSBwYXNzZWQgaW4gc2luY2UgaXQgbWlnaHQgYmUgdGhleSBuZWVkIHRvIGJlIHJlb3JkZXJlZCBmb3JcbiAgICogZGlmZmVyZW50IHRyYW5zbGF0aW9ucy5cbiAgICovXG4gIHRyYW5zbGF0ZT86IFRyYW5zbGF0ZUZuO1xuICAvKipcbiAgICogVGhlIGN1cnJlbnQgbG9jYWxlIG9mIHRoZSB0cmFuc2xhdGVkIG1lc3NhZ2VzLlxuICAgKlxuICAgKiBUaGUgY29tcGlsZS10aW1lIHRyYW5zbGF0aW9uIGlubGluZXIgaXMgYWJsZSB0byByZXBsYWNlIHRoZSBmb2xsb3dpbmcgY29kZTpcbiAgICpcbiAgICogYGBgXG4gICAqIHR5cGVvZiAkbG9jYWxpemUgIT09IFwidW5kZWZpbmVkXCIgJiYgJGxvY2FsaXplLmxvY2FsZVxuICAgKiBgYGBcbiAgICpcbiAgICogd2l0aCBhIHN0cmluZyBsaXRlcmFsIG9mIHRoZSBjdXJyZW50IGxvY2FsZS4gRS5nLlxuICAgKlxuICAgKiBgYGBcbiAgICogXCJmclwiXG4gICAqIGBgYFxuICAgKi9cbiAgbG9jYWxlPzogc3RyaW5nO1xufVxuXG4vKiogQG5vZG9jICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0ZUZuIHtcbiAgKG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksXG4gICBleHByZXNzaW9uczogcmVhZG9ubHkgYW55W10pOiBbVGVtcGxhdGVTdHJpbmdzQXJyYXksIHJlYWRvbmx5IGFueVtdXTtcbn1cblxuLyoqXG4gKiBUYWcgYSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyBmb3IgbG9jYWxpemF0aW9uLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAkbG9jYWxpemUgYHNvbWUgc3RyaW5nIHRvIGxvY2FsaXplYFxuICogYGBgXG4gKlxuICogKipQcm92aWRpbmcgbWVhbmluZywgZGVzY3JpcHRpb24gYW5kIGlkKipcbiAqXG4gKiBZb3UgY2FuIG9wdGlvbmFsbHkgc3BlY2lmeSBvbmUgb3IgbW9yZSBvZiBgbWVhbmluZ2AsIGBkZXNjcmlwdGlvbmAgYW5kIGBpZGAgZm9yIGEgbG9jYWxpemVkXG4gKiBzdHJpbmcgYnkgcHJlLXBlbmRpbmcgaXQgd2l0aCBhIGNvbG9uIGRlbGltaXRlZCBibG9jayBvZiB0aGUgZm9ybTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplYDptZWFuaW5nfGRlc2NyaXB0aW9uQEBpZDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqXG4gKiAkbG9jYWxpemVgOm1lYW5pbmd8OnNvdXJjZSBtZXNzYWdlIHRleHRgO1xuICogJGxvY2FsaXplYDpkZXNjcmlwdGlvbjpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqICRsb2NhbGl6ZWA6QEBpZDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqIGBgYFxuICpcbiAqIFRoaXMgZm9ybWF0IGlzIHRoZSBzYW1lIGFzIHRoYXQgdXNlZCBmb3IgYGkxOG5gIG1hcmtlcnMgaW4gQW5ndWxhciB0ZW1wbGF0ZXMuIFNlZSB0aGVcbiAqIFtBbmd1bGFyIGkxOG4gZ3VpZGVdKGd1aWRlL2kxOG4tY29tbW9uLXByZXBhcmUjbWFyay10ZXh0LWluLWNvbXBvbmVudC10ZW1wbGF0ZSkuXG4gKlxuICogKipOYW1pbmcgcGxhY2Vob2xkZXJzKipcbiAqXG4gKiBJZiB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgY29udGFpbnMgZXhwcmVzc2lvbnMsIHRoZW4gdGhlIGV4cHJlc3Npb25zIHdpbGwgYmUgYXV0b21hdGljYWxseVxuICogYXNzb2NpYXRlZCB3aXRoIHBsYWNlaG9sZGVyIG5hbWVzIGZvciB5b3UuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqICRsb2NhbGl6ZSBgSGkgJHtuYW1lfSEgVGhlcmUgYXJlICR7aXRlbXMubGVuZ3RofSBpdGVtcy5gO1xuICogYGBgXG4gKlxuICogd2lsbCBnZW5lcmF0ZSBhIG1lc3NhZ2Utc291cmNlIG9mIGBIaSB7JFBIfSEgVGhlcmUgYXJlIHskUEhfMX0gaXRlbXNgLlxuICpcbiAqIFRoZSByZWNvbW1lbmRlZCBwcmFjdGljZSBpcyB0byBuYW1lIHRoZSBwbGFjZWhvbGRlciBhc3NvY2lhdGVkIHdpdGggZWFjaCBleHByZXNzaW9uIHRob3VnaC5cbiAqXG4gKiBEbyB0aGlzIGJ5IHByb3ZpZGluZyB0aGUgcGxhY2Vob2xkZXIgbmFtZSB3cmFwcGVkIGluIGA6YCBjaGFyYWN0ZXJzIGRpcmVjdGx5IGFmdGVyIHRoZVxuICogZXhwcmVzc2lvbi4gVGhlc2UgcGxhY2Vob2xkZXIgbmFtZXMgYXJlIHN0cmlwcGVkIG91dCBvZiB0aGUgcmVuZGVyZWQgbG9jYWxpemVkIHN0cmluZy5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgdG8gbmFtZSB0aGUgYGl0ZW1zLmxlbmd0aGAgZXhwcmVzc2lvbiBwbGFjZWhvbGRlciBgaXRlbUNvdW50YCB5b3Ugd3JpdGU6XG4gKlxuICogYGBgdHNcbiAqICRsb2NhbGl6ZSBgVGhlcmUgYXJlICR7aXRlbXMubGVuZ3RofTppdGVtQ291bnQ6IGl0ZW1zYDtcbiAqIGBgYFxuICpcbiAqICoqRXNjYXBpbmcgY29sb24gbWFya2VycyoqXG4gKlxuICogSWYgeW91IG5lZWQgdG8gdXNlIGEgYDpgIGNoYXJhY3RlciBkaXJlY3RseSBhdCB0aGUgc3RhcnQgb2YgYSB0YWdnZWQgc3RyaW5nIHRoYXQgaGFzIG5vXG4gKiBtZXRhZGF0YSBibG9jaywgb3IgZGlyZWN0bHkgYWZ0ZXIgYSBzdWJzdGl0dXRpb24gZXhwcmVzc2lvbiB0aGF0IGhhcyBubyBuYW1lIHlvdSBtdXN0IGVzY2FwZVxuICogdGhlIGA6YCBieSBwcmVjZWRpbmcgaXQgd2l0aCBhIGJhY2tzbGFzaDpcbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogLy8gbWVzc2FnZSBoYXMgYSBtZXRhZGF0YSBibG9jayBzbyBubyBuZWVkIHRvIGVzY2FwZSBjb2xvblxuICogJGxvY2FsaXplIGA6c29tZSBkZXNjcmlwdGlvbjo6dGhpcyBtZXNzYWdlIHN0YXJ0cyB3aXRoIGEgY29sb24gKDopYDtcbiAqIC8vIG5vIG1ldGFkYXRhIGJsb2NrIHNvIHRoZSBjb2xvbiBtdXN0IGJlIGVzY2FwZWRcbiAqICRsb2NhbGl6ZSBgXFw6dGhpcyBtZXNzYWdlIHN0YXJ0cyB3aXRoIGEgY29sb24gKDopYDtcbiAqIGBgYFxuICpcbiAqIGBgYHRzXG4gKiAvLyBuYW1lZCBzdWJzdGl0dXRpb24gc28gbm8gbmVlZCB0byBlc2NhcGUgY29sb25cbiAqICRsb2NhbGl6ZSBgJHtsYWJlbH06bGFiZWw6OiAke31gXG4gKiAvLyBhbm9ueW1vdXMgc3Vic3RpdHV0aW9uIHNvIGNvbG9uIG11c3QgYmUgZXNjYXBlZFxuICogJGxvY2FsaXplIGAke2xhYmVsfVxcOiAke31gXG4gKiBgYGBcbiAqXG4gKiAqKlByb2Nlc3NpbmcgbG9jYWxpemVkIHN0cmluZ3M6KipcbiAqXG4gKiBUaGVyZSBhcmUgdGhyZWUgc2NlbmFyaW9zOlxuICpcbiAqICogKipjb21waWxlLXRpbWUgaW5saW5pbmcqKjogdGhlIGAkbG9jYWxpemVgIHRhZyBpcyB0cmFuc2Zvcm1lZCBhdCBjb21waWxlIHRpbWUgYnkgYVxuICogdHJhbnNwaWxlciwgcmVtb3ZpbmcgdGhlIHRhZyBhbmQgcmVwbGFjaW5nIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyB3aXRoIGEgdHJhbnNsYXRlZFxuICogbGl0ZXJhbCBzdHJpbmcgZnJvbSBhIGNvbGxlY3Rpb24gb2YgdHJhbnNsYXRpb25zIHByb3ZpZGVkIHRvIHRoZSB0cmFuc3BpbGF0aW9uIHRvb2wuXG4gKlxuICogKiAqKnJ1bi10aW1lIGV2YWx1YXRpb24qKjogdGhlIGAkbG9jYWxpemVgIHRhZyBpcyBhIHJ1bi10aW1lIGZ1bmN0aW9uIHRoYXQgcmVwbGFjZXMgYW5kXG4gKiByZW9yZGVycyB0aGUgcGFydHMgKHN0YXRpYyBzdHJpbmdzIGFuZCBleHByZXNzaW9ucykgb2YgdGhlIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIHdpdGggc3RyaW5nc1xuICogZnJvbSBhIGNvbGxlY3Rpb24gb2YgdHJhbnNsYXRpb25zIGxvYWRlZCBhdCBydW4tdGltZS5cbiAqXG4gKiAqICoqcGFzcy10aHJvdWdoIGV2YWx1YXRpb24qKjogdGhlIGAkbG9jYWxpemVgIHRhZyBpcyBhIHJ1bi10aW1lIGZ1bmN0aW9uIHRoYXQgc2ltcGx5IGV2YWx1YXRlc1xuICogdGhlIG9yaWdpbmFsIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIHdpdGhvdXQgYXBwbHlpbmcgYW55IHRyYW5zbGF0aW9ucyB0byB0aGUgcGFydHMuIFRoaXNcbiAqIHZlcnNpb24gaXMgdXNlZCBkdXJpbmcgZGV2ZWxvcG1lbnQgb3Igd2hlcmUgdGhlcmUgaXMgbm8gbmVlZCB0byB0cmFuc2xhdGUgdGhlIGxvY2FsaXplZFxuICogdGVtcGxhdGUgbGl0ZXJhbHMuXG4gKlxuICogQHBhcmFtIG1lc3NhZ2VQYXJ0cyBhIGNvbGxlY3Rpb24gb2YgdGhlIHN0YXRpYyBwYXJ0cyBvZiB0aGUgdGVtcGxhdGUgc3RyaW5nLlxuICogQHBhcmFtIGV4cHJlc3Npb25zIGEgY29sbGVjdGlvbiBvZiB0aGUgdmFsdWVzIG9mIGVhY2ggcGxhY2Vob2xkZXIgaW4gdGhlIHRlbXBsYXRlIHN0cmluZy5cbiAqIEByZXR1cm5zIHRoZSB0cmFuc2xhdGVkIHN0cmluZywgd2l0aCB0aGUgYG1lc3NhZ2VQYXJ0c2AgYW5kIGBleHByZXNzaW9uc2AgaW50ZXJsZWF2ZWQgdG9nZXRoZXIuXG4gKlxuICogQGdsb2JhbEFwaVxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY29uc3QgJGxvY2FsaXplOiBMb2NhbGl6ZUZuID0gZnVuY3Rpb24oXG4gICAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4uZXhwcmVzc2lvbnM6IHJlYWRvbmx5IGFueVtdKSB7XG4gIGlmICgkbG9jYWxpemUudHJhbnNsYXRlKSB7XG4gICAgLy8gRG9uJ3QgdXNlIGFycmF5IGV4cGFuc2lvbiBoZXJlIHRvIGF2b2lkIHRoZSBjb21waWxlciBhZGRpbmcgYF9fcmVhZCgpYCBoZWxwZXIgdW5uZWNlc3NhcmlseS5cbiAgICBjb25zdCB0cmFuc2xhdGlvbiA9ICRsb2NhbGl6ZS50cmFuc2xhdGUobWVzc2FnZVBhcnRzLCBleHByZXNzaW9ucyk7XG4gICAgbWVzc2FnZVBhcnRzID0gdHJhbnNsYXRpb25bMF07XG4gICAgZXhwcmVzc2lvbnMgPSB0cmFuc2xhdGlvblsxXTtcbiAgfVxuICBsZXQgbWVzc2FnZSA9IHN0cmlwQmxvY2sobWVzc2FnZVBhcnRzWzBdLCBtZXNzYWdlUGFydHMucmF3WzBdKTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBtZXNzYWdlUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBtZXNzYWdlICs9IGV4cHJlc3Npb25zW2kgLSAxXSArIHN0cmlwQmxvY2sobWVzc2FnZVBhcnRzW2ldLCBtZXNzYWdlUGFydHMucmF3W2ldKTtcbiAgfVxuICByZXR1cm4gbWVzc2FnZTtcbn07XG5cbmNvbnN0IEJMT0NLX01BUktFUiA9ICc6JztcblxuLyoqXG4gKiBTdHJpcCBhIGRlbGltaXRlZCBcImJsb2NrXCIgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIGBtZXNzYWdlUGFydGAsIGlmIGl0IGlzIGZvdW5kLlxuICpcbiAqIElmIGEgbWFya2VyIGNoYXJhY3RlciAoOikgYWN0dWFsbHkgYXBwZWFycyBpbiB0aGUgY29udGVudCBhdCB0aGUgc3RhcnQgb2YgYSB0YWdnZWQgc3RyaW5nIG9yXG4gKiBhZnRlciBhIHN1YnN0aXR1dGlvbiBleHByZXNzaW9uLCB3aGVyZSBhIGJsb2NrIGhhcyBub3QgYmVlbiBwcm92aWRlZCB0aGUgY2hhcmFjdGVyIG11c3QgYmVcbiAqIGVzY2FwZWQgd2l0aCBhIGJhY2tzbGFzaCwgYFxcOmAuIFRoaXMgZnVuY3Rpb24gY2hlY2tzIGZvciB0aGlzIGJ5IGxvb2tpbmcgYXQgdGhlIGByYXdgXG4gKiBtZXNzYWdlUGFydCwgd2hpY2ggc2hvdWxkIHN0aWxsIGNvbnRhaW4gdGhlIGJhY2tzbGFzaC5cbiAqXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnQgVGhlIGNvb2tlZCBtZXNzYWdlIHBhcnQgdG8gcHJvY2Vzcy5cbiAqIEBwYXJhbSByYXdNZXNzYWdlUGFydCBUaGUgcmF3IG1lc3NhZ2UgcGFydCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHRoZSBtZXNzYWdlIHBhcnQgd2l0aCB0aGUgcGxhY2Vob2xkZXIgbmFtZSBzdHJpcHBlZCwgaWYgZm91bmQuXG4gKiBAdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBibG9jayBpcyB1bnRlcm1pbmF0ZWRcbiAqL1xuZnVuY3Rpb24gc3RyaXBCbG9jayhtZXNzYWdlUGFydDogc3RyaW5nLCByYXdNZXNzYWdlUGFydDogc3RyaW5nKSB7XG4gIHJldHVybiByYXdNZXNzYWdlUGFydC5jaGFyQXQoMCkgPT09IEJMT0NLX01BUktFUiA/XG4gICAgICBtZXNzYWdlUGFydC5zdWJzdHJpbmcoZmluZEVuZE9mQmxvY2sobWVzc2FnZVBhcnQsIHJhd01lc3NhZ2VQYXJ0KSArIDEpIDpcbiAgICAgIG1lc3NhZ2VQYXJ0O1xufVxuIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFRoaXMgZmlsZSBleHBvcnRzIGFsbCB0aGUgYHV0aWxzYCBhcyBwcml2YXRlIGV4cG9ydHMgc28gdGhhdCBvdGhlciBwYXJ0cyBvZiBgQGFuZ3VsYXIvbG9jYWxpemVgXG4vLyBjYW4gbWFrZSB1c2Ugb2YgdGhlbS5cbmV4cG9ydCB7JGxvY2FsaXplIGFzIMm1JGxvY2FsaXplLCBMb2NhbGl6ZUZuIGFzIMm1TG9jYWxpemVGbiwgVHJhbnNsYXRlRm4gYXMgybVUcmFuc2xhdGVGbn0gZnJvbSAnLi9zcmMvbG9jYWxpemUnO1xuZXhwb3J0IHtjb21wdXRlTXNnSWQgYXMgybVjb21wdXRlTXNnSWQsIGZpbmRFbmRPZkJsb2NrIGFzIMm1ZmluZEVuZE9mQmxvY2ssIGlzTWlzc2luZ1RyYW5zbGF0aW9uRXJyb3IgYXMgybVpc01pc3NpbmdUcmFuc2xhdGlvbkVycm9yLCBtYWtlUGFyc2VkVHJhbnNsYXRpb24gYXMgybVtYWtlUGFyc2VkVHJhbnNsYXRpb24sIG1ha2VUZW1wbGF0ZU9iamVjdCBhcyDJtW1ha2VUZW1wbGF0ZU9iamVjdCwgTWlzc2luZ1RyYW5zbGF0aW9uRXJyb3IgYXMgybVNaXNzaW5nVHJhbnNsYXRpb25FcnJvciwgUGFyc2VkTWVzc2FnZSBhcyDJtVBhcnNlZE1lc3NhZ2UsIFBhcnNlZFRyYW5zbGF0aW9uIGFzIMm1UGFyc2VkVHJhbnNsYXRpb24sIFBhcnNlZFRyYW5zbGF0aW9ucyBhcyDJtVBhcnNlZFRyYW5zbGF0aW9ucywgcGFyc2VNZXNzYWdlIGFzIMm1cGFyc2VNZXNzYWdlLCBwYXJzZU1ldGFkYXRhIGFzIMm1cGFyc2VNZXRhZGF0YSwgcGFyc2VUcmFuc2xhdGlvbiBhcyDJtXBhcnNlVHJhbnNsYXRpb24sIFNvdXJjZUxvY2F0aW9uIGFzIMm1U291cmNlTG9jYXRpb24sIFNvdXJjZU1lc3NhZ2UgYXMgybVTb3VyY2VNZXNzYWdlLCBzcGxpdEJsb2NrIGFzIMm1c3BsaXRCbG9jaywgdHJhbnNsYXRlIGFzIMm1dHJhbnNsYXRlfSBmcm9tICcuL3NyYy91dGlscyc7XG4iLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBwdWJsaWMgQVBJIG9mIHRoZSBgQGFuZ3VsYXIvbG9jYWxpemVgIGVudHJ5LXBvaW50XG5cbmV4cG9ydCB7Y2xlYXJUcmFuc2xhdGlvbnMsIGxvYWRUcmFuc2xhdGlvbnN9IGZyb20gJy4vc3JjL3RyYW5zbGF0ZSc7XG5leHBvcnQge01lc3NhZ2VJZCwgVGFyZ2V0TWVzc2FnZX0gZnJvbSAnLi9zcmMvdXRpbHMnO1xuXG4vLyBFeHBvcnRzIHRoYXQgYXJlIG5vdCBwYXJ0IG9mIHRoZSBwdWJsaWMgQVBJXG5leHBvcnQgKiBmcm9tICcuL3ByaXZhdGUnO1xuIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIERPIE5PVCBBREQgcHVibGljIGV4cG9ydHMgdG8gdGhpcyBmaWxlLlxuLy8gVGhlIHB1YmxpYyBBUEkgZXhwb3J0cyBhcmUgc3BlY2lmaWVkIGluIHRoZSBgLi9sb2NhbGl6ZWAgbW9kdWxlLCB3aGljaCBpcyBjaGVja2VkIGJ5IHRoZVxuLy8gcHVibGljX2FwaV9ndWFyZCBydWxlc1xuXG5leHBvcnQgKiBmcm9tICcuL2xvY2FsaXplJztcblxuLy8gVGhlIGdsb2JhbCBkZWNsYXJhdGlvbiBtdXN0IGJlIGluIHRoZSBpbmRleC5kLnRzIGFzIG90aGVyd2lzZSBpdCB3aWxsIG5vdCBiZSBwaWNrZWQgdXAgd2hlbiB1c2VkXG4vLyB3aXRoXG4vLyAvLy8gPHJlZmVyZW5jZSB0eXBlcz1cIkBhbmd1bGFyL2xvY2FsaXplXCIgLz5cblxuaW1wb3J0IHvJtUxvY2FsaXplRm59IGZyb20gJy4vbG9jYWxpemUnO1xuXG4vLyBgZGVjbGFyZSBnbG9iYWxgIGFsbG93cyB1cyB0byBlc2NhcGUgdGhlIGN1cnJlbnQgbW9kdWxlIGFuZCBwbGFjZSB0eXBlcyBvbiB0aGUgZ2xvYmFsIG5hbWVzcGFjZVxuZGVjbGFyZSBnbG9iYWwge1xuICAvKipcbiAgICogVGFnIGEgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgZm9yIGxvY2FsaXphdGlvbi5cbiAgICpcbiAgICogRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqICRsb2NhbGl6ZSBgc29tZSBzdHJpbmcgdG8gbG9jYWxpemVgXG4gICAqIGBgYFxuICAgKlxuICAgKiAqKlByb3ZpZGluZyBtZWFuaW5nLCBkZXNjcmlwdGlvbiBhbmQgaWQqKlxuICAgKlxuICAgKiBZb3UgY2FuIG9wdGlvbmFsbHkgc3BlY2lmeSBvbmUgb3IgbW9yZSBvZiBgbWVhbmluZ2AsIGBkZXNjcmlwdGlvbmAgYW5kIGBpZGAgZm9yIGEgbG9jYWxpemVkXG4gICAqIHN0cmluZyBieSBwcmUtcGVuZGluZyBpdCB3aXRoIGEgY29sb24gZGVsaW1pdGVkIGJsb2NrIG9mIHRoZSBmb3JtOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiAkbG9jYWxpemVgOm1lYW5pbmd8ZGVzY3JpcHRpb25AQGlkOnNvdXJjZSBtZXNzYWdlIHRleHRgO1xuICAgKlxuICAgKiAkbG9jYWxpemVgOm1lYW5pbmd8OnNvdXJjZSBtZXNzYWdlIHRleHRgO1xuICAgKiAkbG9jYWxpemVgOmRlc2NyaXB0aW9uOnNvdXJjZSBtZXNzYWdlIHRleHRgO1xuICAgKiAkbG9jYWxpemVgOkBAaWQ6c291cmNlIG1lc3NhZ2UgdGV4dGA7XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGlzIGZvcm1hdCBpcyB0aGUgc2FtZSBhcyB0aGF0IHVzZWQgZm9yIGBpMThuYCBtYXJrZXJzIGluIEFuZ3VsYXIgdGVtcGxhdGVzLiBTZWUgdGhlXG4gICAqIFtBbmd1bGFyIGkxOG4gZ3VpZGVdKGd1aWRlL2kxOG4tY29tbW9uLXByZXBhcmUjbWFyay10ZXh0LWluLWNvbXBvbmVudC10ZW1wbGF0ZSkuXG4gICAqXG4gICAqICoqTmFtaW5nIHBsYWNlaG9sZGVycyoqXG4gICAqXG4gICAqIElmIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyBjb250YWlucyBleHByZXNzaW9ucywgdGhlbiB0aGUgZXhwcmVzc2lvbnMgd2lsbCBiZSBhdXRvbWF0aWNhbGx5XG4gICAqIGFzc29jaWF0ZWQgd2l0aCBwbGFjZWhvbGRlciBuYW1lcyBmb3IgeW91LlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgdHNcbiAgICogJGxvY2FsaXplIGBIaSAke25hbWV9ISBUaGVyZSBhcmUgJHtpdGVtcy5sZW5ndGh9IGl0ZW1zLmA7XG4gICAqIGBgYFxuICAgKlxuICAgKiB3aWxsIGdlbmVyYXRlIGEgbWVzc2FnZS1zb3VyY2Ugb2YgYEhpIHskUEh9ISBUaGVyZSBhcmUgeyRQSF8xfSBpdGVtc2AuXG4gICAqXG4gICAqIFRoZSByZWNvbW1lbmRlZCBwcmFjdGljZSBpcyB0byBuYW1lIHRoZSBwbGFjZWhvbGRlciBhc3NvY2lhdGVkIHdpdGggZWFjaCBleHByZXNzaW9uIHRob3VnaC5cbiAgICpcbiAgICogRG8gdGhpcyBieSBwcm92aWRpbmcgdGhlIHBsYWNlaG9sZGVyIG5hbWUgd3JhcHBlZCBpbiBgOmAgY2hhcmFjdGVycyBkaXJlY3RseSBhZnRlciB0aGVcbiAgICogZXhwcmVzc2lvbi4gVGhlc2UgcGxhY2Vob2xkZXIgbmFtZXMgYXJlIHN0cmlwcGVkIG91dCBvZiB0aGUgcmVuZGVyZWQgbG9jYWxpemVkIHN0cmluZy5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRvIG5hbWUgdGhlIGBpdGVtcy5sZW5ndGhgIGV4cHJlc3Npb24gcGxhY2Vob2xkZXIgYGl0ZW1Db3VudGAgeW91IHdyaXRlOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiAkbG9jYWxpemUgYFRoZXJlIGFyZSAke2l0ZW1zLmxlbmd0aH06aXRlbUNvdW50OiBpdGVtc2A7XG4gICAqIGBgYFxuICAgKlxuICAgKiAqKkVzY2FwaW5nIGNvbG9uIG1hcmtlcnMqKlxuICAgKlxuICAgKiBJZiB5b3UgbmVlZCB0byB1c2UgYSBgOmAgY2hhcmFjdGVyIGRpcmVjdGx5IGF0IHRoZSBzdGFydCBvZiBhIHRhZ2dlZCBzdHJpbmcgdGhhdCBoYXMgbm9cbiAgICogbWV0YWRhdGEgYmxvY2ssIG9yIGRpcmVjdGx5IGFmdGVyIGEgc3Vic3RpdHV0aW9uIGV4cHJlc3Npb24gdGhhdCBoYXMgbm8gbmFtZSB5b3UgbXVzdCBlc2NhcGVcbiAgICogdGhlIGA6YCBieSBwcmVjZWRpbmcgaXQgd2l0aCBhIGJhY2tzbGFzaDpcbiAgICpcbiAgICogRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIC8vIG1lc3NhZ2UgaGFzIGEgbWV0YWRhdGEgYmxvY2sgc28gbm8gbmVlZCB0byBlc2NhcGUgY29sb25cbiAgICogJGxvY2FsaXplIGA6c29tZSBkZXNjcmlwdGlvbjo6dGhpcyBtZXNzYWdlIHN0YXJ0cyB3aXRoIGEgY29sb24gKDopYDtcbiAgICogLy8gbm8gbWV0YWRhdGEgYmxvY2sgc28gdGhlIGNvbG9uIG11c3QgYmUgZXNjYXBlZFxuICAgKiAkbG9jYWxpemUgYFxcOnRoaXMgbWVzc2FnZSBzdGFydHMgd2l0aCBhIGNvbG9uICg6KWA7XG4gICAqIGBgYFxuICAgKlxuICAgKiBgYGB0c1xuICAgKiAvLyBuYW1lZCBzdWJzdGl0dXRpb24gc28gbm8gbmVlZCB0byBlc2NhcGUgY29sb25cbiAgICogJGxvY2FsaXplIGAke2xhYmVsfTpsYWJlbDo6ICR7fWBcbiAgICogLy8gYW5vbnltb3VzIHN1YnN0aXR1dGlvbiBzbyBjb2xvbiBtdXN0IGJlIGVzY2FwZWRcbiAgICogJGxvY2FsaXplIGAke2xhYmVsfVxcOiAke31gXG4gICAqIGBgYFxuICAgKlxuICAgKiAqKlByb2Nlc3NpbmcgbG9jYWxpemVkIHN0cmluZ3M6KipcbiAgICpcbiAgICogVGhlcmUgYXJlIHRocmVlIHNjZW5hcmlvczpcbiAgICpcbiAgICogKiAqKmNvbXBpbGUtdGltZSBpbmxpbmluZyoqOiB0aGUgYCRsb2NhbGl6ZWAgdGFnIGlzIHRyYW5zZm9ybWVkIGF0IGNvbXBpbGUgdGltZSBieSBhXG4gICAqIHRyYW5zcGlsZXIsIHJlbW92aW5nIHRoZSB0YWcgYW5kIHJlcGxhY2luZyB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgd2l0aCBhIHRyYW5zbGF0ZWRcbiAgICogbGl0ZXJhbCBzdHJpbmcgZnJvbSBhIGNvbGxlY3Rpb24gb2YgdHJhbnNsYXRpb25zIHByb3ZpZGVkIHRvIHRoZSB0cmFuc3BpbGF0aW9uIHRvb2wuXG4gICAqXG4gICAqICogKipydW4tdGltZSBldmFsdWF0aW9uKio6IHRoZSBgJGxvY2FsaXplYCB0YWcgaXMgYSBydW4tdGltZSBmdW5jdGlvbiB0aGF0IHJlcGxhY2VzIGFuZFxuICAgKiByZW9yZGVycyB0aGUgcGFydHMgKHN0YXRpYyBzdHJpbmdzIGFuZCBleHByZXNzaW9ucykgb2YgdGhlIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIHdpdGggc3RyaW5nc1xuICAgKiBmcm9tIGEgY29sbGVjdGlvbiBvZiB0cmFuc2xhdGlvbnMgbG9hZGVkIGF0IHJ1bi10aW1lLlxuICAgKlxuICAgKiAqICoqcGFzcy10aHJvdWdoIGV2YWx1YXRpb24qKjogdGhlIGAkbG9jYWxpemVgIHRhZyBpcyBhIHJ1bi10aW1lIGZ1bmN0aW9uIHRoYXQgc2ltcGx5IGV2YWx1YXRlc1xuICAgKiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgd2l0aG91dCBhcHBseWluZyBhbnkgdHJhbnNsYXRpb25zIHRvIHRoZSBwYXJ0cy4gVGhpc1xuICAgKiB2ZXJzaW9uIGlzIHVzZWQgZHVyaW5nIGRldmVsb3BtZW50IG9yIHdoZXJlIHRoZXJlIGlzIG5vIG5lZWQgdG8gdHJhbnNsYXRlIHRoZSBsb2NhbGl6ZWRcbiAgICogdGVtcGxhdGUgbGl0ZXJhbHMuXG4gICAqXG4gICAqIEBwYXJhbSBtZXNzYWdlUGFydHMgYSBjb2xsZWN0aW9uIG9mIHRoZSBzdGF0aWMgcGFydHMgb2YgdGhlIHRlbXBsYXRlIHN0cmluZy5cbiAgICogQHBhcmFtIGV4cHJlc3Npb25zIGEgY29sbGVjdGlvbiBvZiB0aGUgdmFsdWVzIG9mIGVhY2ggcGxhY2Vob2xkZXIgaW4gdGhlIHRlbXBsYXRlIHN0cmluZy5cbiAgICogQHJldHVybnMgdGhlIHRyYW5zbGF0ZWQgc3RyaW5nLCB3aXRoIHRoZSBgbWVzc2FnZVBhcnRzYCBhbmQgYGV4cHJlc3Npb25zYCBpbnRlcmxlYXZlZCB0b2dldGhlci5cbiAgICovXG4gIGNvbnN0ICRsb2NhbGl6ZTogybVMb2NhbGl6ZUZuO1xufVxuIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1JGxvY2FsaXplIGFzICRsb2NhbGl6ZSwgybVMb2NhbGl6ZUZuIGFzIExvY2FsaXplRm4sIMm1VHJhbnNsYXRlRm4gYXMgVHJhbnNsYXRlRm59IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcblxuZXhwb3J0IHskbG9jYWxpemUsIExvY2FsaXplRm4sIFRyYW5zbGF0ZUZufTtcblxuLy8gQXR0YWNoICRsb2NhbGl6ZSB0byB0aGUgZ2xvYmFsIGNvbnRleHQsIGFzIGEgc2lkZS1lZmZlY3Qgb2Yg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UUFBQSxLQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0YsR0FISyxXQUFBLFNBR0osQ0FBQSxFQUFBO0FDMEJlLFNBQUEsZUFBZSxRQUFnQixLQUFXO0FBQ3hELFdBQVMsY0FBYyxHQUFHLFdBQVcsR0FBRyxjQUFjLE9BQU8sUUFBUSxlQUFlLFlBQVk7QUFDOUYsUUFBSSxJQUFJLFFBQVEsTUFBTSxNQUFNO0FBQzFCO2VBQ1MsT0FBTyxXQUFXLE1BQU1DLGdCQUFjO0FBQy9DLGFBQU87OztBQUdYLFFBQU0sSUFBSSxNQUFNLDZDQUE2QyxHQUFHLElBQUk7QUFDdEU7SUd6TWFDLGNBQXdCLFNBQ2pDLGlCQUF1QyxhQUEyQjtBQUNwRSxNQUFJQSxZQUFVLFdBQVc7QUFFdkIsVUFBTSxjQUFjQSxZQUFVLFVBQVUsY0FBYyxXQUFXO0FBQ2pFLG1CQUFlLFlBQVksQ0FBQztBQUM1QixrQkFBYyxZQUFZLENBQUM7O0FBRTdCLE1BQUksVUFBVSxXQUFXLGFBQWEsQ0FBQyxHQUFHLGFBQWEsSUFBSSxDQUFDLENBQUM7QUFDN0QsV0FBUyxJQUFJLEdBQUcsSUFBSSxhQUFhLFFBQVEsS0FBSztBQUM1QyxlQUFXLFlBQVksSUFBSSxDQUFDLElBQUksV0FBVyxhQUFhLENBQUMsR0FBRyxhQUFhLElBQUksQ0FBQyxDQUFDOztBQUVqRixTQUFPO0FBQ1Q7QUFFQSxJQUFNLGVBQWU7QUFlckIsU0FBUyxXQUFXLGFBQXFCLGdCQUFzQjtBQUM3RCxTQUFPLGVBQWUsT0FBTyxDQUFDLE1BQU0sZUFDaEMsWUFBWSxVQUFVLGVBQWUsYUFBYSxjQUFjLElBQUksQ0FBQyxJQUNyRTtBQUNOOzs7QUl0S0MsV0FBbUIsWUFBWUM7IiwibmFtZXMiOlsiWm9uZSIsInNlbGYiLCJkZWxlZ2F0ZSIsInByb3AiLCJPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJPYmplY3REZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiX2dsb2JhbCIsImV2ZW50IiwicGF0Y2hPcHRpb25zIiwicmV0dXJuVGFyZ2V0IiwiaW50ZXJuYWxXaW5kb3ciLCJ3aW5kb3ciLCJpc0Jyb3dzZXIiLCJpc01peCIsInpvbmVTeW1ib2xFdmVudE5hbWVzIiwiVFJVRV9TVFIiLCJGQUxTRV9TVFIiLCJaT05FX1NZTUJPTF9QUkVGSVgiLCJuYW1lIiwibG9hZFRhc2tzIiwiQkxPQ0tfTUFSS0VSIiwiRW5kaWFuIiwiQkxPQ0tfTUFSS0VSIiwiJGxvY2FsaXplIiwiJGxvY2FsaXplIl0sInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=