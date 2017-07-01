'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai'),
      expect = chai.expect,
      fs = require('fs'),
      utils = require('../utils')

describe('createHiddenFile()', () => {
  // Delete the file before each test
  beforeEach(done => {
    const exists = fs.existsSync('.statik.run.test')
    if (exists === true) fs.unlinkSync('.statik.run.test')
    done()
  })

  it('creates a hidden file', done => {
    utils.createHiddenFile('123', (err, data) => {
      const exists = fs.existsSync('.statik.run.test')
      expect(exists).to.equal(true)
      done()
    })
  })

  it('stores the subdomain and the secret key in the hidden file', (done) => {
    utils.createHiddenFile('hello-world', (err, data) => {
      fs.readFile('.statik.run.test', (err2, data2) => {
        const [subdomain, secretKey] = data2.toString().split('\n')

        expect(subdomain).to.equal('hello-world')
        expect(secretKey).not.to.be.undefined
        done()
      })
    })
  })
})
