// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const fs = require('fs-extra')
const path = require('path')
const wp = require('@cypress/webpack-preprocessor')
const _ = require('lodash')

const loadConfig = (file) => {
  const pathToConfigFile = path.resolve('.', 'config', `${file}.json`)
  return fs.readJson(pathToConfigFile, { throws: false })
}

const requiredFields = {
  "username": "Username is required",
  "password": "Password is required"
}

const checkConfig = (config) => {
  if (!config) {
    throw Error("No configuration found!")
  }

  _.each(requiredFields, (msg, field) => {
    if (!config[field]) {
      throw Error(msg);
    }
  })
}

module.exports = (on, config) => {
  // Apply webpack config
  const options = {
    webpackOptions: require('../../webpack.config'),
  }

  on('file:preprocessor', wp(options))
  // Read config
  return loadConfig(config.env.configFile || 'development').then(envOverride => {
    checkConfig(envOverride);
    const env = Object.assign(config.env || {}, envOverride);
    return Object.assign(config, { env: env })
  })
}