void function(root){


    var browserify = require('browserify')
        , fs = require('fs')
        , finished = require('tap-finished')
        , through = require('through')
        , brfs = require('brfs')

    function fileToString(path){ return fs.readFileSync(path).toString() }

    module.exports = function(testfile, end, opts){


        var b = browserify(testfile)
            , browser = require('browser-run')(opts.port)

        browser.pipe(through(function(chunk){
            process.stdout.write(chunk)
            this.queue(chunk)
        })).pipe(finished(function(results){
            browser.stop()
            if (end) { end(results.fail.length > 0) }
        }))

        b.add(testfile)
        b.transform(brfs)

        b.bundle({debug:opts.debug}).pipe(browser)

    }

}(this)

