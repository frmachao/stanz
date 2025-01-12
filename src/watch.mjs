import { getRandomId, debounce } from "./public.mjs";
import { WATCHS } from "./main.mjs";

export const emitUpdate = ({
  type,
  currentTarget,
  target,
  name,
  value,
  oldValue,
  args,
  path = [],
}) => {
  if (path && path.includes(currentTarget)) {
    console.warn("Circular references appear");
    return;
  }

  let options = {
    type,
    target,
    name,
    value,
    oldValue,
  };

  if (type === "array") {
    options = {
      type,
      target,
      name,
      args,
    };
  }

  if (currentTarget._hasWatchs) {
    currentTarget[WATCHS].forEach((func) => {
      func({
        currentTarget,
        ...options,
        path: [...path],
      });
    });
  }

  currentTarget._update &&
    currentTarget.owner.forEach((parent) => {
      emitUpdate({
        currentTarget: parent,
        ...options,
        path: [currentTarget, ...path],
      });
    });
};

export default (Stanz) => {
  Object.assign(Stanz.prototype, {
    watch(callback) {
      const wid = "w-" + getRandomId();

      this[WATCHS].set(wid, callback);

      return wid;
    },

    unwatch(wid) {
      return this[WATCHS].delete(wid);
    },

    watchTick(callback) {
      return this.watch(debounce(callback));
    },
  });
};
