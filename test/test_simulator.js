// test/test_simulator.js

let expect = require('chai').expect;
let simulator = require('../simulator');

describe("Single Line MIPS Parser", function() {
    describe("Simulate Adds", function() {

        it ("Adds two registers together w/ spaces", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            environment.registers['$t2'] = 2;
            simulator.execute(environment, 'add $t0, $t1, $t2');
            expect(environment.registers['$t0']).to.equal(3);
        });

        it ("Adds two registers together wo/ spaces", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            environment.registers['$t2'] = 2;
            simulator.execute(environment, 'add $t0,$t1,$t2');
            expect(environment.registers['$t0']).to.equal(3);
        });

        it ("Adds two registers together mixed format 1", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            environment.registers['$t2'] = 2;
            simulator.execute(environment, 'add $t0, $t1,$t2');
            expect(environment.registers['$t0']).to.equal(3);
        });

        // mixed format 2
        it ("Adds two registers together mixed format 2", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            environment.registers['$t2'] = 2;
            simulator.execute(environment, 'add $t0,$t1, $t2');
            expect(environment.registers['$t0']).to.equal(3);
        });

        it ("Adds two registers together w spaces in front", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            environment.registers['$t2'] = 2;
            simulator.execute(environment, '   add $t0,$t1,$t2');
            expect(environment.registers['$t0']).to.equal(3);
        });
    });

    describe("Simulate Subtract", function() {

        it ("Subtracts two registers together w/ spaces", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 2;
            environment.registers['$t2'] = 1;
            simulator.execute(environment, 'sub $t0, $t1, $t2');
            expect(environment.registers['$t0']).to.equal(1);
        });

        it ("Subtracts two registers together wo/ spaces", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 2;
            environment.registers['$t2'] = 1;
            simulator.execute(environment, 'sub $t0,$t1,$t2');
            expect(environment.registers['$t0']).to.equal(1);
        });

        it ("Subtracts two registers together w/ mixed format 1", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 2;
            environment.registers['$t2'] = 1;
            simulator.execute(environment, 'sub $t0, $t1,$t2');
            expect(environment.registers['$t0']).to.equal(1);
        });

        it ("Subtracts two registers together w/ mixed format 2", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 2;
            environment.registers['$t2'] = 1;
            simulator.execute(environment, 'sub $t0,$t1, $t2');
            expect(environment.registers['$t0']).to.equal(1);
        });

        it ("Subtracts two registers together w/ spaces at the front", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 2;
            environment.registers['$t2'] = 1;
            simulator.execute(environment, '   sub $t0,$t1,$t2');
            expect(environment.registers['$t0']).to.equal(1);
        });
    });

    describe("Loading from Memory", function() {
        it ("Loads with a zero offset.", function() {
            let environment = simulator.factory('mips');
            environment.memory[4] = 5;
            environment.registers['$t1'] = 4;
            simulator.execute(environment, 'lw $t0,0($t1)')
            expect(environment.registers['$t0']).to.equal(5);
        });

        it ("Loads with a zero register and an offset.", function() {
            let environment = simulator.factory('mips');
            environment.memory[16] = 5;
            simulator.execute(environment, 'lw $t0, 16($zero)');
            expect(environment.registers['$t0']).to.equal(5);
        });

        it ("Loads with a register value & offset.", function() {
            let environment = simulator.factory('mips');
            environment.memory[20] = 5;
            environment.registers['$t1'] = 12;
            simulator.execute(environment, 'lw $t0, 8($t1)');
            expect(environment.registers['$t0']).to.equal(5);
        });
    });
});