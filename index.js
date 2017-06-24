'use strict'

const {exec} = require('child_process')
const utils = require('./utils')

/**
 * Uploads all the selected files to the remote server
 * This is the last step. It logs infos back to the user
 *
 * @param {Object[]} files - [{ filename, content }]
 */
const upload = (files) => {
  // Generate a unique subdomain (current timestamp)
  const subdomain = Date.now()

  // Upload all the valid files to the server
  utils.upload(subdomain, files)
  .then(() => {
    const baseUrl = `http://${subdomain}.statik.run`

    console.log(`${files.length} files uploaded to the server:`)
    files.map(file => console.log(`${baseUrl}/${file.filename}`))
  })
  .catch(err => console.error('Connection to remote server failed! Please try again.'))
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
  
  // Read the content for each valid files and store it in an array
  utils.readFiles(validFiles, (err, files) => upload(files))
})
