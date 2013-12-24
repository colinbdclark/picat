"use strict";

var fluid = require("infusion"),
    fs = require("fs"),
    picat = fluid.registerNamespace("picat");

fluid.defaults("picat.app", {
    gradeNames: ["kettle.app", "autoInit"],
    
    indexPage: "index.html",
    
    listeners: {
        onCreate: {
            "this": console,
            method: "log",
            args: ["Created picat.app!"]
        }
    },
    
    handlers: {
        index: {
            route: "/",
            type: "get"
        },
        
        cat: {
            route: "/cat",
            type: "get"
        }
    }
});

fluid.defaults("kettle.requests.request.handler.cat", {
    gradeNames: ["fluid.littleComponent", "autoInit"],
    
    invokers: {
        handle: {
            funcName: "picat.handleCatSnap",
            args: ["{requestProxy}", "{request}", "{callbackWrapper}", "{camera}"]
        }
    }
});

// TODO: Declarativize.
picat.handleCatSnap = function (requestProxy, request, callbackWrapper, camera) {
    request.res.setHeader("Content-Type", "image/jpg");

    camera.snap(
        callbackWrapper.wrap(requestProxy.events.onSuccess.fire), 
        callbackWrapper.wrap(requestProxy.events.onError.fire)
    );
};

fluid.defaults("kettle.requests.request.handler.index", {
    gradeNames: ["fluid.littleComponent", "autoInit"],
    
    invokers: {
        handle: {
            funcName: "picat.handleIndex",
            args: ["{requestProxy}", "{request}", "{callbackWrapper}", "{app}.options.indexPage"]
        }
    }
});

picat.handleIndex = function (requestProxy, request, callbackWrapper, fileName) {
    var onSuccess = callbackWrapper.wrap(requestProxy.events.onSuccess.fire),
        onError = callbackWrapper.wrap(requestProxy.events.onError.fire);
    
    request.res.setHeader("Content-Type", "text/html");
    
    fs.readFile(fileName, function (error, fileData) {
        if (error) {
            onError("Error loading index: " + error);
        }
    
        onSuccess(fileData);
    });
};


