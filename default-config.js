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
    },
    deploy: {
        'dev-server-0': {
            'name': 'ec2-18-191-222-136.us-east-2.compute.amazonaws.com',
            'host': 'ec2-18-191-222-136.us-east-2.compute.amazonaws.com',
            'user': 'ubuntu',
            'pem': '~/.ssh/gojodev.pem',
            'log': 'srv0.log',
            'build-path': '~/hipr-deploy'
        }
    }
}

module.exports = config
