// Created by: BennyYasuo, 2019.06.20

var path = require('path');
var fs = require('fs');
var curFile;

function checkTime(i) { if (i < 10) { i = "0" + i; } return i; }  

function makeLogFile() {
    let normPath = path.join(__dirname, "../logs");
    fs.readdir(normPath, (err, fls) => { 
        if (err) console.log(err);   
        let numArr = [];
        let files = fls.filter(f => f.split("_").pop());
        console.log(files);
        files.forEach((f) => {
            let fl = `${f}`;
            let toPush = parseInt(fl.split("_")[1]);
            numArr.push(toPush);
            console.log(toPush);
        });
        let id;
        if(numArr.length == 0) id = 1;
        if(numArr.length > 0) id = Math.max.apply(Math, numArr) + 1;
        console.log(id);
        let dateObj = new Date();
        let date = dateObj.toLocaleDateString().split(',')[0];
        let h = dateObj.getHours();
        let m = dateObj.getMinutes();
        let s = dateObj.getSeconds();
        h = checkTime(h);
        m = checkTime(m);
        s = checkTime(s);
        let format = `${h}-${m}-${s}`;
        let mkfilePath = path.join(__dirname, "../logs/" + date + "-" + format + "_" + id + ".txt");
        curFile = `${date}-${format}_${id}.txt`;
        console.log(mkfilePath);
        fs.writeFileSync(mkfilePath, `Log file successfully made on ${date} ${format.replace(/-/g, ":")}`);
    });
}

function addToLogs(str) {
    let filePath = path.join(__dirname, "../logs/" + curFile);
    let dateObj = new Date();
    let h = dateObj.getHours();
    let m = dateObj.getMinutes();
    let s = dateObj.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    let format = `${h}:${m}:${s}`;
    fs.appendFile(filePath, `\r\n[${format}]: ${str}`, 'utf8', function(err) { 
        if (err) throw err;
    });
}

module.exports = { makeLogFile, addToLogs }