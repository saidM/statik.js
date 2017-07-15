#! /usr/bin/env node
'use strict'

const {exec} = require('child_process')

exec('node /usr/local/lib/node_modules/statik.js/index.js', (error, stdout, stderr) => {
  if (stdout) {
    console.log(stdout)
    process.exit(0)
  } else if (error || stderr) {
    console.error(error || stderr)
    process.exit(1)
  }
})