import { loadState, isObject } from './utils'
import { proxyState } from './proxy'
import { State, DeclarativeDbOptions } from './types'
export { State, DeclarativeDbOptions }

/**
 * Create a declarative database.
 * @param {DeclarativeDbOptions} options - Options for database creation.
 */
export default async (options: DeclarativeDbOptions): Promise<State> => {
  // Deconstruct options
  let { filename, compression, initialState } = options

  // Make sure initialState is an object (or array)
  initialState = isObject(initialState) ? initialState : {} as State

  // Make sure compression option is valid
  if (typeof compression === 'undefined') compression = 0
  if (typeof compression !== 'number' || compression < 0 || compression > 9) {
    console.warn('[declarative-db]', '`compression` option must be a number between 0 and 9, using 0 by default.')
    compression = 0
  }

  // Load state from disk, create a new one if doesn't exist
  const state = await loadState(filename, initialState)

  // Create proxied object
  return proxyState(state, filename, compression)
}
