'use strict'

const {exec} = require('child_process'),
      crypto = require('crypto')

const configFile = require('./lib/config_file'),
      utils = require('./utils')

/**
 * Uploads all the selected files to the remote server
 * This is the last step. It logs infos back to the user
 *
 * @param {String} subdomain
 * @param {Object[]} files - [{ filename, content }]
 */
const upload = (subdomain, token, files) => {
  const baseUrl = `http://${subdomain}.statik.run`

  // Upload all the valid files to the server
  utils.upload(subdomain, token, files)
  .then(() => {
    console.log(`${files.length} files uploaded to the server:`)
    files.map(file => console.log(`${baseUrl}/${file.filename}`))
  })
  .catch(err => {
    console.error('Connection to remote server failed! Please try again.', err)
    process.exit(1)
  })
}

/**
 * Perform a search in the current directory for all the files (recursive)
 * Only works in UNIX-based systems for now (support for Windows scheduled for later)
 */
exec('find .', {maxBuffer: 1024*500}, (error, stdout, stderr) => {
  // If the UNIX command failed, we are most likely on a Windows environment (not supported yet)
  if (error) {
    console.log(error);
    process.exit(1)
  }

  // Create an array out of the result of the 'find' function (it returns a string by default)
  const allFiles = stdout.split('\n')

  // Grab only the .html, .js, .css and images files
  let validFiles = allFiles.filter(file => ['css', 'html', 'js', 'png', 'gif', 'jpg', 'jpeg'].includes(file.split('.').pop()))

  validFiles = validFiles.filter(file => !file.includes('/node_modules'))

  // Create the config file to store the subdomain and the secret key
  configFile.credentials().then(data => {
    const {subdomain, token} = data
    
    // Read the content for each valid files and store it in an array. Then post each file to the server
    utils.readFiles(validFiles, (err, files) => upload(subdomain, token, files))
  }).catch(err => console.log('An error occured trying to upload the files to the server:', err))
})
