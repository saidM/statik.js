'use strict'

const chai = require('chai'),
      expect = chai.expect,
      chaiAsPromised = require('chai-as-promised'),
      nock = require('nock'),
      utils = require('../utils')

chai.use(chaiAsPromised)

describe('Upload()', () => {
  it('resolves the promise', () => {
    let files = []
    for (let i = 0; i < 3; i++) files.push({ filename: `file-${i}.html`, content: `Content of file #${i}` }) 
    
    const request1 = nock('http://www.statik.run').put(`/123/files/${files[0].filename}`, { content: files[0].content }).reply(200)
    const request2 = nock('http://www.statik.run').put(`/123/files/${files[1].filename}`, { content: files[1].content }).reply(200)
    const request3 = nock('http://www.statik.run').put(`/123/files/${files[2].filename}`, { content: files[2].content }).reply(200)
    
    const promise = utils.upload(123, files)
    return expect(promise).to.eventually.be.fulfilled
  })

  it('makes a PUT request for each file', () => {
    let files = []
    for (let i = 0; i < 3; i++) files.push({ filename: `file-${i}.html`, content: `Content of file #${i}` }) 

    const request1 = nock('http://www.statik.run').put(`/123/files/${files[0].filename}`, { content: files[0].content }).reply(200)
    const request2 = nock('http://www.statik.run').put(`/123/files/${files[1].filename}`, { content: files[1].content }).reply(200)
    const request3 = nock('http://www.statik.run').put(`/123/files/${files[2].filename}`, { content: files[2].content }).reply(200)

    utils.upload(123, files).then(() => {
      request1.done()
      request2.done()
      request3.done()
    })
  })
})
