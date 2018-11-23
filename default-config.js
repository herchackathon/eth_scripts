config = {
    containerDir: 'container',
    contractsDeployDir: '../blockchain/contracts-deploy',
    contractsSource: {
        'assetVerification': '../blockchain/contracts-dev/assetVerification'
    },
    apps: {
        ganache: {
            url: 'https://github.com/trufflesuite/ganache/releases/download/v1.2.2/ganache-1.2.2-x86_64.AppImage',
            bin: 'ganache-1.2.2-x86_64.AppImage'
        }
    }
}

module.exports = config
