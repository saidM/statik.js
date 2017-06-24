#! /usr/bin/env node
'use strict'

const {exec} = require('child_process')

exec('node /usr/local/lib/node_modules/statik/index.js', (error, stdout, stderr) => {
  if (error) console.error(error)
  if (stdout) console.log(stdout)
  if (stderr) console.stderr(stderr)
})
