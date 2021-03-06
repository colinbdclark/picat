"use strict";

var fluid = require("infusion"),
    exec = require("child_process").exec,
    fs = require("fs"),
    picat = fluid.registerNamespace("picat");

fluid.defaults("picat.camera", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    
    captureCmd: "raspistill -v -t 2000 -vf -ex %exposureMode -o %fileName",
    
    imageSpec: {
        fileName: "hugo.jpg",
        exposureMode: "night"
    },
    
    members: {
        cmd: {
            expander: {
                funcName: "fluid.stringTemplate",
                args: ["{that}.options.captureCmd", "{that}.options.imageSpec"]
            }
        },
    },
    
    invokers: {
        snap: {
            funcName: "picat.camera.snap",
            args: ["{that}.cmd", "{that}.options.imageSpec.fileName", "{arguments}.0", "{arguments}.1"]
        }
    },
    
    listeners: {
        onCreate: {
            "this": console,
            method: "log",
            args: ["Created picat.camera!"]
        }
    },
});

// TODO: Split out into separate methods and declarativize.
picat.camera.snap = function (cmd, fileName, onSuccess, onError) {
    exec(cmd, function (error) {
        if (error) {
            onError("Error capturing snapshot: " + error);
            return;
        }
        
        fs.readFile(fileName, function (error, fileData) {
            if (error) {
                onError("Error loading image: " + error);
            }
        
            onSuccess(fileData);
        });
    });
};
