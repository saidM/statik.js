#! /usr/bin/env node
'use strict'

const {exec} = require('child_process')
exec('node /usr/local/lib/node_modules/statik/index.js', (error, stdout, stderr) => {
  if (stdout) {
    console.log(stdout)
    process.exit(0)
  } else if (error || stderr) {
    console.error('An error occured!')
    process.exit(1)
  }
})
