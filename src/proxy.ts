import { Mutex } from 'async-mutex'
import { isObject, scheduleSaving } from './utils'
import { State, StateMetadata } from './types'

export const proxyState = (state: State, filename: string, compression: number): State => {
  // Metadata
  const metadata: StateMetadata = {
    state,
    filename,
    compression,
    mutex: new Mutex(),
    savingID: null,
    unsavedChanges: 0
  }

  // Proxy handler
  const handler: ProxyHandler<State> = {
    // When getting a property
    get (target: State, property: PropertyKey, receiver: any): any {
      // Get value normally
      const propertyValue = Reflect.get(target, property, receiver)

      // If it's proxiable, make it a proxy in order to watch nested changes
      if (isObject(propertyValue)) {
        return new Proxy(propertyValue, handler)
      } else {
        return propertyValue
      }
    },

    // When a property is set
    set (target: State, property: PropertyKey, value: any, receiver: any): boolean {
      scheduleSaving(metadata)
      return Reflect.set(target, property, value, receiver)
    },

    // When a property is deleted
    deleteProperty (target: State, property: PropertyKey): boolean {
      scheduleSaving(metadata)
      return Reflect.deleteProperty(target, property)
    }
  }

  return new Proxy<State>(state, handler)
}
