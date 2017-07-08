'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai'),
      expect = chai.expect,
      chaiAsPromised = require('chai-as-promised'),
      nock = require('nock')

const fs = require('fs'),
      configFile = require('../lib/config_file')

chai.use(chaiAsPromised)

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
      it('rejects the promise', () => {
        return expect(configFile.read()).to.be.rejectedWith('COULD_NOT_READ_CONFIG_FILE')
      })
    })
    
    context('when the file does exist', () => {
      it('it rejects the promise if the credentials are invalid', () => {
        fs.writeFileSync('.statik.run.test', 'hello-world\n123')
        const scope = nock('http://www.statik.run').get('/credentials/hello-world/123').reply(401)
        
        return configFile.read().catch(err => {
          expect(scope.isDone()).to.be.true
          expect(err).to.equal('INVALID_CONFIG_FILE')
        })
      })

      it('it resolves the promise if the credentials are valid', () => {
        fs.writeFileSync('.statik.run.test', 'hello-world\n123')
        const scope = nock('http://www.statik.run').get('/credentials/hello-world/123').reply(200)
        
        return configFile.read().then(data => {
          const {subdomain, secretKey} = data

          expect(scope.isDone()).to.be.true
          expect(subdomain).to.equal('hello-world')
          expect(secretKey).to.equal('123')
        })
      })
    })
  })

  describe('create(subdomain, secretKey)', () => {
    it('creates a file and stores the subdomain and the secret key inside it', () => {
      nock('http://www.statik.run').post('/sites/hello/123').reply(200)

      return configFile.create('hello', '123').then(data => {
        const {subdomain, secretKey} = data
        expect(subdomain).to.equal('hello')
        expect(secretKey).to.equal('123')
      })
    })

    it('makes a POST request to the backend', () => {
      const scope = nock('http://www.statik.run').post('/sites/hello/123').reply(200)

      return configFile.create('hello', '123').then(data => {
        expect(scope.isDone()).to.be.true
      }).catch(err => console.log(err))
    })
  })
})
