/* based on netsniff.js example from phantomjs */

function createCSV(address, startTime, resources)
{
    totalSize = 0;

    console.log('Web Perf for '+ address);
    console.log('Recording time,ms,bytes');

    resources.forEach(function (resource) {
        var request = resource.request,
            startReply = resource.startReply,
            endReply = resource.endReply;
        if (!request || !startReply || !endReply) {
            return;
        }
        totalSize += startReply.bodySize;
    });

    console.log(startTime+','+(page.endTime - page.startTime)+','+(totalSize));
}

var page = require('webpage').create(),
    system = require('system');

if (system.args.length === 1) {
    console.log('Usage: webperf.csv.js <some URL>');
    phantom.exit(1);
} else {

    page.address = system.args[1];
    page.resources = [];

    page.onLoadStarted = function () {
        page.startTime = new Date();
    };

    page.onResourceRequested = function (req) {
        page.resources[req.id] = {
            request: req,
            startReply: null,
            endReply: null
        };
    };

    page.onResourceReceived = function (res) {
        if (res.stage === 'start') {
            page.resources[res.id].startReply = res;
        }
        if (res.stage === 'end') {
            page.resources[res.id].endReply = res;
        }
    };

    page.open(page.address, function (status) {
        if (status !== 'success') {
            console.log('FAIL to load address');
        } else {
            page.endTime = new Date();
            createCSV(page.address, page.startTime, page.resources);
        }
        phantom.exit();
    });
}

