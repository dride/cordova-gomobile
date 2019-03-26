# Motivation

Cordova give us great way to build and maintain one codebase for both Android and iOS yet in some case the power of native code is needed, this project will help you maintain one code base for native code using Go and GoMobile.
You write the business logic of your app and this project will generate a cordova plugin with all the exported functions from your Go code.

# Installation

Clone this project into your \$GOPATH

### Install goMobile

`go get golang.org/x/mobile/cmd/gomobile`

`gomobile init`

`npm install`

### Build Cordova plugin

> npm run build

### What happens on build?

- [x]  Your index.go file is parsed and all functions are exported
- [x]  CordovaGoCore.swift is generated according to your index.go
- [x]   CordovaGoCore.java  is generated according to your index.go
- [x]   www/index.js bridge is created according to your index.go
- [x]   Types file is generated ✨


## FAQ

### How to update my GOPATH

export GOPATH=$HOME/cordova-gomobile/

export GOBIN=$GOPATH/bin

