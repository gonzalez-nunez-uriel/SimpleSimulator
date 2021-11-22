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

    describe("Simulate Add with Immediate", function () {

        it ("Adds two registers together w/ spaces", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            simulator.execute(environment, 'addi $t0, $t1, 4');
            expect(environment.registers['$t0']).to.equal(5);
        });

        it ("Adds two registers together wo/ spaces", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            simulator.execute(environment, 'addi $t0,$t1,4');
            expect(environment.registers['$t0']).to.equal(5);
        });

        it ("Adds two registers together mixed format 1", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            simulator.execute(environment, 'addi $t0,$t1, 4');
            expect(environment.registers['$t0']).to.equal(5);
        });

        it ("Adds two registers together mixed format 2", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            simulator.execute(environment, 'addi $t0, $t1,4');
            expect(environment.registers['$t0']).to.equal(5);
        });

        it ("Adds two registers together w/ spaces in front", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 1;
            simulator.execute(environment, '    addi $t0,$t1,4');
            expect(environment.registers['$t0']).to.equal(5);
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

    describe("Store from memory to register", function() {
        it ("Loads with a zero offset.", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 4;
            environment.registers['$t0'] = 12;
            simulator.execute(environment, 'sw $t0,0($t1)')
            expect(environment.memory[4]).to.equal(12);
        });

        it ("Loads with a zero register and an offset.", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 0;
            environment.registers['$t0'] = 5;
            simulator.execute(environment, 'sw $t0,16($t1)')
            expect(environment.memory[16]).to.equal(5);
        });

        it ("Loads with a register value & offset.", function() {
            let environment = simulator.factory('mips');
            environment.registers['$t1'] = 12;
            environment.registers['$t0'] = 21;
            simulator.execute(environment, 'sw $t0,8($t1)')
            expect(environment.memory[20]).to.equal(21);
        });
    });
});

describe("Instructions Stored in Memory and Executed One by One", function() {
    it( "Simple load, add, and store", function() {
        let environment = simulator.factory( 'mips' );
        environment.memory[0] = 10;
        environment.memory[4] = 12;
        environment.memory[8] = 'lw $t0,0($zero)'; // $t0 <- 10
        environment.memory[12] = 'lw $t1,4($zero)'; // $t1 <- 12
        environment.memory[16] = 'add $t2,$t1,$t0'; // $t2 <- 22
        environment.memory[20] = 'addi $t3,$zero,32'; // $t3 <- 32
        environment.memory[24] = 'sw $t2,0($t3)'; // MEM[32] <- 22
        environment.memory[28] = 'halt';
        environment.registers[ '$pc' ] = 8;
        simulator.step( environment ); // inst @ 8 executed
        simulator.step( environment ); // inst @ 12 executed
        simulator.step( environment ); // inst @ 16 executed
        simulator.step( environment ); // inst @ 20 executed
        simulator.step( environment ); // inst @ 24 executed
        simulator.step( environment ); // inst @ 28 executed
        expect( environment.memory[ 32 ] ).to.equal( 22 );
    });
    it( "Simple load, add, subtract, and store", function (){
        let environment = simulator.factory('mips');
        environment.memory[0]  = 1;
        environment.memory[4]  = 2;
        environment.memory[8]  = 3;
        environment.memory[12] = 5;
        environment.memory[16] = 'lw $t0, 0($zero)'; // $t0 <- 1
        environment.memory[20] = 'lw $t1, 4($zero)'; // $t1 <- 2
        environment.memory[24] = 'sub $t2, $t1, $t0'; // $t2 <- 2 - 1
        environment.memory[28] = 'sw $t2, 0($sp)'; // MEM[sp] <- 1
        environment.memory[32] = 'lw $t0, 12($zero)'; // $t0 <- 5
        environment.memory[36] = 'lw $t1, 0($sp)'; // $t1 <- 1
        environment.memory[40] = 'add $t2, $t0, $t1'; // $t2 <- 6
        environment.memory[44] = 'halt';
        environment.registers[ '$pc' ] = 16;
        environment.registers[ '$sp' ] = 48;
        simulator.step( environment ); // inst @ 16 executed
        simulator.step( environment ); // inst @ 20 executed
        simulator.step( environment ); // inst @ 24 executed
        simulator.step( environment ); // inst @ 28 executed
        simulator.step( environment ); // inst @ 32 executed
        simulator.step( environment ); // inst @ 36 executed
        simulator.step( environment ); // inst @ 40 executed
        simulator.step( environment ); // inst @ 44 executed
        expect( environment.registers[ '$t2' ] ).to.equal(6);
    });
});