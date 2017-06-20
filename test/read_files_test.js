'use strict'

const chai = require('chai'),
      expect = chai.expect,
      utils = require('../utils')

describe('readFiles()', () => {
  it('returns the content of each filename passed to the function', (done => {
    const filenames = ['./test/read_files_test.js']

    utils.readFiles(filenames, (err, files) => {
      expect(err).to.be.null
      expect(files.length).to.equal(1)
      expect(files[0].filename).to.equal('test/read_files_test.js')
      expect(files[0].content.split('\n')[0]).to.equal("'use strict'") // this is the current file
      done()
    })
  }))
})
