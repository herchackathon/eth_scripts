# HERC.ONE CLI tools

## Compatible with 
> - Ethereum

## Architecture overview

### Main functions

- Automatic deploy [HIPR contracts](https://github.com/HERCone/contracts) to Ethereum network and test it
- Automatic configure [HIPR](https://github.com/HERCone/HIPR) and [hipr-restful](https://github.com/HERCone/restful-hipr/)
- Autotools for running & testing
- Show deployed contracts info
- Configure season
- Simulate player actions
- Payout to winners
- hipr-cli scripts for server & docker deploy

### Main menu

- Validation 
  - validate HIPR configuration
- HIPR contracts
  - Deploy contracts
  - Show contracts info
  - Wipe player scores
  - Configure season
  - Simulate scores
  - Configure payout
  - Airdrop to winners
- Configuration
  - Configure HIPR
  - Configure hipr-restful
- Deploy
  - build local container for dev
  - build local docker
  - deploy to dev-server
- Autotools
  - Run ganache
  - Run hipr-restful
  - Run HIPR

## Getting started

Clone repo:

```
git clone https://github.com/herchackathon/eth_scripts
```

Run:
```
cd eth_scripts
npm install
npm start
```

## Keys

```
Ctrl-q      Quit
ESC         Back, close window
Up, Down    Arrows navigation
```

### Contributing	

HERC protocol is an open source and community based project to which the core development team highly encourages fellow developers to build improvements and scale the future of the platform.  
To report bugs within the HERC smart contracts or unit tests, please create an issue in this repository. 

