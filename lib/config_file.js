'use strict'

const fs = require('fs'),
      crypto = require('crypto'),
      axios = require('axios')

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
 * Reads the config file and makes a request to the backend to check the validity of the couple subdomain/secret key
 *
 * @return {Promise} - resolves with: {subdomain, token}
 */
const read = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) return reject('COULD_NOT_READ_CONFIG_FILE')
    
    const [subdomain, token] = data.toString().split('\n')
    resolve({subdomain, token})
    })
  })
}

/**
 * Creates the config file and stores the subdomain & the secret key inside it
 *
 * @param {String} subdomain
 * @param {String} token
 * @return {Promise} - resolves with: {subdomain, token}
 */
const create = (subdomain = Date.now(), token = secret) => {
  return new Promise((resolve, reject) => {
    // Write the subdomain first, then add the secret key after a line break
    const content = `${subdomain}\n${token}`

    fs.writeFile(filename, content, 'utf8', (err, data) => {
      if (err) return reject('COULD_NOT_WRITE_CONFIG_FILE')
    
      axios.post(`http://www.statik.run/sites/${subdomain}/${token}`)
      .then(res => resolve({subdomain, token}))
      .catch(err => reject(err))
    })
  })
}

/**
 * Returns the credentials from the config file (subdomain & private key)
 * Does not do anything by itself, it just calls the appropriate method to get the data
 *
 * @return {Promise} - resolves with: {subdomain, token}
 */
const credentials = () => {
  if (exists()) {
    // The config file exists. Check that the subdomain and the secret key match
    return read()
  } else {
    // There is no secret file; create one
    return create()
  }
}

module.exports = {exists, read, create, credentials}
