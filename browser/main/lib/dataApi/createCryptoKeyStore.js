const _ = require('lodash')
import { resolveCryptoKeyStore } from './resolveCryptoKeyStore'

/**
 * @param {String} path
 */

function createCryptoKeyStore (path) {
  if (!_.isString(path)) {
    throw new Error('Path must be a string.')
  }

  return resolveCryptoKeyStore(path).then(cryptoKeyStore => {
    localStorage.setItem('cryptoKeyStore', JSON.stringify(_.pick(cryptoKeyStore, ['path', 'version'])))
    return cryptoKeyStore
  })
}

module.exports = createCryptoKeyStore
