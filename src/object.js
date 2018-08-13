module.exports = ({state, value}) => {
  // Make sure value is an object
  value = typeof value === 'object' && value !== null ? value : {};

  // Set state
  state.setState(value);

  const handlers = {

    // When getting a property
    get() {
      // Get value normally
      let properyValue = Reflect.get(...arguments);

      // If it's proxiable, make it a proxy in order to watch nested changes
      if (typeof properyValue === 'object' && properyValue !== null)
        return new Proxy(properyValue, handlers);
      else
        return properyValue;
    },

    // When a property is set
    set() {
      state.scheduleSaving();
      return Reflect.set(...arguments);
    },

    // When a property is deleted
    deleteProperty() {
      state.scheduleSaving();
      return Reflect.deleteProperty(...arguments);
    },

  };

  return new Proxy(value, handlers);
};
