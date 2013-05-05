#!/usr/bin/env node

function next(notok){
    if ( stack.length ) {
        stack.shift()()
        if ( notok ) ok = false
    } else {
        console.error('')
    }
}

function getFiles(list){
    var files = []
    list.forEach(function(pattern){
        glob(pattern, {nonull:false, sync:true}, function(err, matches){
            if ( err ) throw err
            files = files.concat(matches.map(function(m){
                return path.resolve(m)
            }))
        })
    })
    return files
}

var tapebrown = require('../index.js')
    , argv = require('optimist').argv
    , glob = require('glob')
    , path = require('path')
    , testfiles = getFiles(argv._)
    , port = argv.port
    , debug = argv.debug
    , stack = testfiles.map(function(file){
        return function(){ tapebrown(file, next, {port: port, debug: debug}) }
    })
    , ok = true

next()
