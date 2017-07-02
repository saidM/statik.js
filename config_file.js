'use strict'

const fs = require('fs')

// The config file name is not the same based on the NODE_ENV variable
const filename = process.env.NODE_ENV == 'test' ? '.statik.run.test' : '.statik.run'


/**
 * Check for the presence of the config file in the working directory
 *
 * @return {Boolean} - true if the file exists
 */
const exists = () => fs.existsSync(filename)


/**
 * Read the config file
 *
 * @return {Function} cb - {subdomain, secretKey}
 */
const read = (cb) => {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) return cb(err, null)

    const [subdomain, secretKey] = data.toString().split('\n')
    cb(null, {subdomain, secretKey})
  })
}

/**
 * Creates the config file and stores the subdomain & the secret key inside it
 *
 * @param {String} subdomain
 * @param {String} secretKey
 * @return {Function} cb - {subdomain, secretKey}
 */
const create = (subdomain, secretKey, cb) => {
  // Write the subdomain first, then add the secret key after a line break
  const content = `${subdomain}\n${secretKey}`

  fs.writeFile(filename, content, 'utf8', (err, data) => {
    if (err) return cb(err, null)
    cb(null, {subdomain, secretKey})
  })
}

module.exports = {exists, read, create}
