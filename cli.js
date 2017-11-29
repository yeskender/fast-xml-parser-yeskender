#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var parser = require('./lib/parser');


if(process.argv[2] === "--help" || process.argv[2] === "-h"){
    console.log("Fast XML Parser");
    console.log("----------------");
    console.log("xml2js [-ns|-a] <filename> [-o outputfile.json]");
}else if(process.argv[2] === "--version"){
    console.log(require(path.join(__dirname + "/package.json")).version);
}else{
    var options = {
        ignoreNameSpace : true,
        ignoreNonTextNodeAttr : false,
        ignoreTextNodeAttr : false
    };
    var fileName = "";
    var outputFileName;
	for(var i=2; i<process.argv.length;i++){
		if(process.argv[i] === "-ns"){
            options.ignoreNameSpace = false;
        }else if(process.argv[i] === "-a"){
            options.ignoreNonTextNodeAttr = true;
            options.ignoreTextNodeAttr = true;
        }else if(process.argv[i] === "-o"){
            outputFileName = process.argv[++i];
            if (outputFileName === '-') {
                outputFileName = void 0;
            }
        }else{//filename
            fileName = process.argv[i];
        }
    }
    var callback = function (xmlData) {
        output = JSON.stringify(parser.parse(xmlData,options),null,4);
        if (outputFileName) {
            writeToFile(outputFileName, output);
        } else {
            console.log(output);
        }
    };

    try{
        if (!fileName) {
            require('readtoend').readToEnd(process.stdin, function (err, data) {
                if (err) {
                    throw err;
                }
                callback(data);
            });
        }else {
            fs.readFile(fileName, function (err, data) {
                if (err) {
                    throw err;
                }
                callback(xmlData);
            });
        }
    }catch(e){
        console.log("Seems an invalid file." + e);
    }
}

function writeToFile(fileName, data){
	fs.writeFile(fileName, data, function (err) {
		if (err) throw err;
	 	console.log('JSON output has been written to ' + fileName);
	});
}
