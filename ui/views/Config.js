var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , TextView = require('./TextView')
  , _ = require('lodash')

class ConfigView extends TextView {
    constructor (screen, options) {
        super(screen, options)

        var config = {
            deploy: {
                "local-container": {
                    cmd: "..."
                },
                "local-docker": {
                    cmd: "..."
                },
                "dev-server": {
                    cmd: "..."
                },
            }
        }

        config = options.config
        var scriptConfig = options.scriptConfig

        var text = JSON.stringify(config, null, 2)

        text += '\n\nhipr-local-config.sh:\n\n' + scriptConfig

        this.setText(text)
    }
}

module.exports = ConfigView
