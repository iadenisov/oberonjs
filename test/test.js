function TestError(s) {this.__s = s;}
TestError.prototype.toString = function(){return this.__s;};

function runImpl(tests, stat, tab){
    for(var t in tests)
        if (!runTest(t, tests, stat, tab))
            ++stat.failCount;
}

function runTest(t, tests, stat, tab){
    var r = tests[t];
	if (typeof r != "function"){
        console.log(tab + t);
        runImpl(r, stat, tab + "\t");
        return true;
    }

    var result = false;
	var padding = "                           ";
	var log = t;
	if (log.length < padding.length)
		log = t + padding.substring(log.length);
	else
		log += " ";

	try {
        ++stat.count;
		r();
		log += "OK";
		result = true;
	}
	catch (x){
		if (x instanceof TestError)
			log += "Failed\n\t" + tab + x;
		else
			log += "Failed\n" + (x.stack ? x.stack : '\t' + tab + x);
	}
	console.log(tab + log);
	return result;
}

function run(tests){
    var stat = {count: 0, failCount: 0};

    var start = Date.now();
    if (typeof process != "undefined" && process.argv.length > 2)
        runTest(process.argv[2], tests, stat, "");
    else
        runImpl(tests, stat, "");
    var stop = Date.now();

    console.log("elapsed: " + (stop - start) / 1000 + " s" );
    console.log(stat.count + " test(s) run");
    if (!stat.failCount)
        console.log("All OK!");
    else
        console.log(stat.failCount + " test(s) failed");
}

exports.run = run;
exports.TestError = TestError;