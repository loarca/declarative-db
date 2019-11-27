import { Mutex } from 'async-mutex'

/**
 * Type for declarative-db database.
 * It can be an object or array.
 * @typedef {object|Array} State
 */
export type State = Record<PropertyKey, any> | Array<any>

/**
 * Options for creating a declarative database.
 * @typedef {object} DeclarativeDbOptions
 * @property {string} filename - The filename where the database file will be saved.
 * @property {number} [compression=0] - Compression level ranging from 0 to 9 (both inclusive).
 * @property {State} [initialState={}] - Initial state that would be used if filename doesn't exist.
 */
export interface DeclarativeDbOptions {
  filename: string
  compression?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  initialState?: State
}

/**
 * Metadata for a single proxied database object.
 * @typedef {object} StateMetadata
 * @private
 */
export interface StateMetadata {
  state: State
  filename: string
  compression: number
  mutex: Mutex
  savingID: NodeJS.Timeout | null
  unsavedChanges: number
}
