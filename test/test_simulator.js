// test/test_simulator.js

let expect = require('chai').expect;
let simulator = require('../simulator');

describe("Single Line MIPS Parser", function() {
    describe("Simulate Adds", function() {

        it ("Adds two registers together w/ spaces", function() {
            environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            environment.registers['$t2'] = 2;
            simulator.execute(environment, 'add $t0, $t1, $t2');
            expect(environment.registers['$t0']).to.equal(3);
        });

        it ("Adds two registers together wo/ spaces", function() {
            environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            environment.registers['$t2'] = 2;
            simulator.execute(environment, 'add $t0,$t1,$t2');
            expect(environment.registers['$t0']).to.equal(3);
        });

        it ("Adds two registers together mixed format 1", function() {
            environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            environment.registers['$t2'] = 2;
            simulator.execute(environment, 'add $t0, $t1,$t2');
            expect(environment.registers['$t0']).to.equal(3);
        });

        // mixed format 2
        it ("Adds two registers together mixed format 2", function() {
            environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            environment.registers['$t2'] = 2;
            simulator.execute(environment, 'add $t0,$t1, $t2');
            expect(environment.registers['$t0']).to.equal(3);
        });

        it ("Adds two registers together w spaces in front", function() {
            environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            environment.registers['$t2'] = 2;
            simulator.execute(environment, '   add $t0,$t1,$t2');
            expect(environment.registers['$t0']).to.equal(3);
        });
    });
});