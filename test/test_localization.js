"use strict";

// Run with NODE_PATH=<localized compiler directory>:src and argument en or ru.
var assert = require("assert");
var oc = require("oc.js");
var oberon = require("oberon/oberon_grammar.js").language;
var eberon = require("eberon/eberon_grammar.js").language;
var ru = process.argv[2] === "ru";
var cases = [
    [oberon, "MODULE m;\nBEGIN\n\n- END m.",
     "line 4: END expected (MODULE)", "строка 4: ожидается END для MODULE"],
    [oberon, "MODULE m BEGIN END m.",
     "line 1: syntax error", "строка 1: синтаксическая ошибка"],
    [oberon, "MODULE m; BEGIN IF TRUE END END m.",
     "line 1: THEN expected", "строка 1: ожидается THEN"],
    [eberon, "MODULE m; BEGIN v <- END m.",
     "line 1: initialization expression expected", "строка 1: ожидается выражение инициализации"],
    [eberon, "MODULE m; VAR i: INTEGER; BEGIN i := TRUE ? 1 END m.",
     'line 1: expected ":" after "?" in ternary operator',
     'строка 1: ожидается ":" после "?" в условном выражении']
];
cases.forEach(function(test){
    var errors = [];
    oc.compile(new oc.ReadModule(test[1], "example.ob"), test[0], function(e){errors.push(e);});
    assert.deepStrictEqual(errors, ["example.ob, " + test[ru ? 3 : 2]]);
});
console.log(cases.length + " localization tests passed (" + (ru ? "ru" : "en") + ")");
