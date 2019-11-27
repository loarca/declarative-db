import * as fs from 'fs'
import * as zlib from 'zlib'
import { promisify } from 'util'
import { State, StateMetadata } from './types'

const MAX_UNSAVED_CHANGES = 1000
const MAX_UNSAVED_TIMEOUT = 60 * 1000

export const isObject = (obj: any): obj is State => {
  const type = typeof obj
  return type === 'function' || (type === 'object' && !!obj)
}

const saveToDisk = async (metadata: StateMetadata): Promise<void> => {
  let unlock = (): void => { }

  try {
    // Lock mutex to protect saving to disk
    unlock = await metadata.mutex.acquire()

    // Get string data
    let data: string | Buffer = JSON.stringify(metadata.state, null, metadata.compression ? undefined : 2)

    // Compress data if specified
    if (metadata.compression) {
      data = await promisify<zlib.InputType, zlib.ZlibOptions, Buffer>(zlib.deflate)(data, {
        level: metadata.compression
      })
    }

    // Save state to disk
    await promisify(fs.writeFile)(metadata.filename, data)
  } catch (err) {
    console.error('[declarative-db]', err)
  } finally {
    // Unlock mutex
    unlock()
  }
}

export const scheduleSaving = (metadata: StateMetadata): void => {
  metadata.unsavedChanges++

  // If unsaved changes limit is exceeded, save state immediately
  if (metadata.unsavedChanges >= MAX_UNSAVED_CHANGES) {
    if (metadata.savingID) clearTimeout(metadata.savingID)
    metadata.savingID = null
    metadata.unsavedChanges = 0
    saveToDisk(metadata)
  } else {
    // Schedule saving to disk
    if (metadata.savingID) clearTimeout(metadata.savingID)
    metadata.savingID = setTimeout(() => {
      metadata.savingID = null
      metadata.unsavedChanges = 0
      saveToDisk(metadata)
    }, MAX_UNSAVED_TIMEOUT)
  }
}

export const loadState = async (filename: string, initialState: State): Promise<State> => {
  // Determine initial state
  let state = initialState

  // If the file specified by filename exists, load contents
  try {
    let rawState = await promisify(fs.readFile)(filename)

    // Determine if it's compressed
    try {
      // If it is, uncompress it
      rawState = await promisify(zlib.unzip)(rawState) as Buffer
    } catch (err) {
      // If it is not, do nothing
    }

    state = JSON.parse(rawState.toString()) as State
  } catch (err) {
    // If the file specified by filename doesn't exist, use initialState
    // Otherwise, rethrow
    if (err.code !== 'ENOENT') { throw err }
  }

  // Return unproxied state
  return state
}
