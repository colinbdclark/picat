"use strict";

var fluid = require("infusion"),
    picat = fluid.registerNamespace("picat");

fluid.defaults("picat.app", {
    gradeNames: ["kettle.app", "autoInit"],
    
    listeners: {
        onCreate: {
            "this": console,
            method: "log",
            args: ["Created picat.app!"]
        }
    },
    
    handlers: {
        snap: {
            route: "/snap",
            type: "get"
        },
        
        cat: {
            route: "/cat/:fileName",
            type: "get"
        }
    }
});

fluid.defaults("kettle.requests.request.handler.snap", {
    gradeNames: ["fluid.littleComponent", "autoInit"],
    
    invokers: {
        handle: {
            funcName: "picat.handleSnap",
            args: ["{requestProxy}", "{camera}"]
        }
    }
});

fluid.defaults("kettle.requests.request.handler.cat", {
    gradeNames: ["fluid.littleComponent", "autoInit"],
    
    invokers: {
        handle: {
            funcName: "picat.handleCatPicture",
            args: ["{requestProxy}", "{request}.req.params.fileName"]
        }
    }
});

picat.handleSnap = function (requestProxy, camera) {
    camera.snap(requestProxy.events.onSuccess.fire, requestProxy.events.onError.fire);
};

picat.handleCatPicture = function (requestProxy, fileName) {
    requestProxy.events.onSuccess.fire("This is your cat: " + fileName);
};
