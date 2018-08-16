const fs = require('fs');
const zlib = require('zlib');
const { promisify } = require('util');
const Mutex = require('async-mutex').Mutex;

const MAX_UNSAVED_CHANGES = 1000;
const MAX_UNSAVED_TIMEOUT = 60 * 1000;

class State {
  constructor({state, filename, compression}) {
    this.state = state;
    this.filename = filename;
    this.compression = compression;

    this.mutex = new Mutex();
    this.savingID = null;
    this.unsavedChanges = 0;
  }

  setState(state) {
    // Save state in memory
    this.state = state;

    // Schedule saving to disk
    this.scheduleSaving();
  }

  scheduleSaving() {
    this.unsavedChanges++;

    // If unsaved changes limit is exceeded, save state immediately
    if (this.unsavedChanges >= MAX_UNSAVED_CHANGES) {
      clearTimeout(this.savingID);
      this.savingID = null;
      this.unsavedChanges = 0;
      this.saveToDisk();
    } else {
      // Schedule saving to disk
      clearTimeout(this.savingID);
      this.savingID = setTimeout(() => {
        this.savingID = null;
        this.unsavedChanges = 0;
        this.saveToDisk();
      }, MAX_UNSAVED_TIMEOUT);
    }
  }

  async saveToDisk() {
    let unlock = () => null;

    try {
      // Lock mutex to protect saving to disk
      unlock = await this.mutex.acquire();

      // Get string data
      let data = JSON.stringify(this.state, null, this.compression ? null : 2);

      // Compress data if specified
      if (this.compression) data = await promisify(zlib.deflate)(data, {
        level: this.compression,
      });

      // Save state to disk
      await promisify(fs.writeFile)(this.filename, data);
    } catch (err) {
      console.error('[declarative-db]', err);
    } finally {
      // Unlock mutex
      unlock();
    }
  }
}

module.exports = async ({initialState, filename, compression}) => {
  // Make sure compression option is valid
  if (typeof compression !== 'number' || compression < 0 || compression > 9)
    throw new Error(
      'declarative-db: compression option must be a number between 0 and 9.'
    );

  // Determine initial state
  let state = initialState;
  // If the file specified by filename exists, load contents
  try {
    let rawState = await promisify(fs.readFile)(filename);

    // Determine if it's compressed
    try {
      // If it is, uncompress it
      rawState = await promisify(zlib.unzip)(rawState);
    } catch (err) {
      // If it is not, do nothing
    }

    state = JSON.parse(rawState);
  } catch (err) {
    // If the file specified by filename doesn't exist, use basic state = {}
    // Otherwise, rethrow
    if (err.code !== 'ENOENT')
      throw err;
  }

  // Generate new State object
  return new State({state, filename, compression});
};
