const test = require('ava')
import { createCryptoKeyStore } from 'browser/main/lib/dataApi/createCryptoKeyStore'

global.document = require('jsdom').jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator

const Storage = require('dom-storage')
const localStorage = window.localStorage = global.localStorage = new Storage(null, { strict: true })
const path = require('path')
const TestDummy = require('../fixtures/TestDummy')
const sander = require('sander')
const _ = require('lodash')
const os = require('os')
const CSON = require('@rokt33r/season')

const cryptoKeyStorePath = path.join(os.tmpdir(), 'test/create-folder')

test.beforeEach((t) => {
  t.context.cryptoKeyStore = TestDummy.dummyStorage(cryptoKeyStorePath)
})

test.serial('Create cryptokey store', (t) => {
  return Promise.resolve()
    .then(function doTest () {
      return createCryptoKeyStore(cryptoKeyStorePath)
    })
    .then(function validateResult (cryptoKeyStore) {
      // Check output
      t.true(_.isString(cryptoKeyStore.path))
      t.is(cryptoKeyStore.path, cryptoKeyStorePath)
      t.is(cryptoKeyStore.version, '1.0')
      t.true(_.isArray(cryptoKeyStore.storages))

      // Check localStorage
      const cacheData = JSON.parse(localStorage.getItem('cryptoKeyStore'))
      t.is(cacheData.version, '1.0')
      t.is(cacheData.path, cryptoKeyStorePath)

      // Check Boostnote-Keystore.json
      const jsonData = CSON.readFileSync(path.join(cryptoKeyStore.path, 'Boostnote-Keystore.json'))
      t.true(_.isArray(jsonData.storages))
      t.is(jsonData.version, '1.0')
    })
})

test.after.always(() => {
  localStorage.clear()
  sander.rimrafSync(cryptoKeyStorePath)
})
