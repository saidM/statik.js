'use strict'

const fs = require('fs'),
      crypto = require('crypto')

// The config file name is not the same based on the NODE_ENV variable
const filename = process.env.NODE_ENV == 'test' ? '.statik.run.test' : '.statik.run',
      secret = crypto.randomBytes(64).toString('hex')

/**
 * Checks for the presence of the config file in the working directory
 *
 * @return {Boolean} - true if the file exists
 */
const exists = () => fs.existsSync(filename)

/**
 * Reads the config file
 *
 * @return {Promise} - resolves with: {subdomain, secretKey}
 */
const read = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) return reject('COULD_NOT_READ_CONFIG_FILE')

      const [subdomain, secretKey] = data.toString().split('\n')
      resolve({subdomain, secretKey})
    })
  })
}

/**
 * Creates the config file and stores the subdomain & the secret key inside it
 *
 * @param {String} subdomain
 * @param {String} secretKey
 * @return {Promise} - resolves with: {subdomain, secretKey}
 */
const create = (subdomain = Date.now(), secretKey = secret) => {
  return new Promise((resolve, reject) => {
    // Write the subdomain first, then add the secret key after a line break
    const content = `${subdomain}\n${secretKey}`

    fs.writeFile(filename, content, 'utf8', (err, data) => {
      if (err) return reject('COULD_NOT_WRITE_CONFIG_FILE')
      resolve({subdomain, secretKey})
    })
  })
}

/**
 * Returns the credentials from the config file (subdomain & private key)
 * Does not do anything by itself, it just calls the appropriate method to get the data
 *
 * @return {Promise} - resolves with: {subdomain, secretKey}
 */
const credentials = () => {
  if (exists()) return read()
  return create()
}

module.exports = {exists, read, create, credentials}
