'use strict'

const fs = require('fs'),
      axios = require('axios')

/**
 * Removes the first dot(s) and first slash from the filename string
 *
 * @param {String} filename
 * @returns {String} formatted filename
 */
const formatFilename = filename => filename.substring(2)

/**
 * Returns an array of all the files alongside their respective content
 *
 * @param {String[]} filenames
 * @param {Function} cb - Callback that gets executed when the body of all the files have been retrieved
 * @return {Object[]} files - [{ filename, content }]
 */
const readFiles = (filenames, cb) => {
  let files = []

  filenames.forEach((filename, index) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      files.push({ filename: formatFilename(filename), content: data })
      if (index == filenames.length - 1) cb(null, files)
    })
  })
}

const upload = (subdomain, files) => {
  // For each file, make a request to the API
  const requests = files.map(file => axios.put(`http://${subdomain}.statik.run/${file.filename}`, { content: file.content }))

  // Make all the requests in parallel
  return Promise.all(requests)
}

module.exports = {readFiles, upload}
