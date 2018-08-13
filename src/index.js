const generateState = require('./state');
const generateObject = require('./object');

module.exports =  async ({filename, compression, initialState}) => {
  // Make sure initialState is an object (or array)
  initialState = typeof initialState === 'object' && initialState !== null
    ? initialState : {};

  // Make sure compression is a number
  compression = typeof compression === 'number' ? compression : 0;

  // Create state
  const state = await generateState({filename, compression});

  // Create proxied object
  return generateObject({state, value: initialState});
};
