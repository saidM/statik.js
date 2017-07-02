'use strict'

process.env.NODE_ENV = 'test'

const expect = require('chai').expect,
      configFile = require('../config_file')

const fs = require('fs')

describe('Config file', () => {
  beforeEach(() => {
    // Remove the config file before each test
    const exists = fs.existsSync('.statik.run.test')
    if (exists === true) fs.unlink('.statik.run.test')
  })

  describe('exists()', () => {
    it('returns false if there is no config file in the working directory', () => {
      expect(configFile.exists()).to.be.false
    })

    it('returns true if there is a config file in the working directory', () => {
      // Create the file first
      fs.openSync('.statik.run.test', 'w')

      expect(configFile.exists()).to.be.true
    })
  })

  describe('read()', () => {
    context('when the file does not exist', () => {
      it('returns an error in the callback', done => {
        configFile.read((err, subdomain) => {
          expect(err).not.to.be.null
          expect(subdomain).to.be.null
          done()
        })
      })
    })
    
    context('when the file does exist', () => {
      it('it returns the subdomain and the secret key in the callback', done => {
        fs.writeFileSync('.statik.run.test', 'hello-world\n123')

        configFile.read((err, data) => {
          expect(err).to.be.null
  
          expect(data.subdomain).to.equal('hello-world')
          expect(data.secretKey).to.equal('123')
          done()
        })
      })
    })
  })

  describe('create(subdomain, secretKey)', () => {
    it('creates a file and stores the subdomain and the secret key inside it', done => {
      configFile.create('hello', '123', (err, data) => {
        const {subdomain, secretKey} = data

        expect(err).to.be.null
        expect(subdomain).to.equal('hello')
        expect(secretKey).to.equal('123')
        done()
      })
    })
  })
})
