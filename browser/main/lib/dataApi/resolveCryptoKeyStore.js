const _ = require('lodash')
const _path = require('path')
const CSON = require('@rokt33r/season')

/**
 * @param {String} path
 */

function resolveCryptoKeyStore (path) {
  const cryptoKeyStore = {
    path,
    storages: []
  }

  const cryptoKeyStorePath = _path.join(path, 'Boostnote-Keystore.json')
  try {
    const { storages, version } = CSON.readFileSync(cryptoKeyStorePath)
    if (!_.isArray(storages)) throw new Error('storages should be an array.')
    cryptoKeyStore.storages = storages
    cryptoKeyStore.version = version
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('Boostnote-Keystore.json file doesn\'t exist the given path')
      CSON.writeFileSync(cryptoKeyStorePath, { storages: [], version: '1.0' })
    } else {
      console.error(err)
    }

    cryptoKeyStore.version = '1.0'
  }

  return Promise.resolve(cryptoKeyStore)
}

module.exports = resolveCryptoKeyStore
