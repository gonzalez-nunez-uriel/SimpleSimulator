const simulator = require('./simulator'); console.log(simulator.test_msg);
const readline = require("readline");

// reader configuration
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("close", function() {
    console.log("\nSimulation complete.");
    process.exit(0);
});

// simulation configuration
// needs input validation
/*
var recursiveAsyncConfig = function (){
  rl.question(`Select CPU from ${simulator.supported_cpus}:`, (text_input) => {
    
  });
};*/


// So how does this shit not break the stack?
var recursiveAsyncReadLine = function (environment) {
    rl.question('>> ', function (text_input) {
        if(text_input == "exit" || text_input == "quit")
            return rl.close();
        console.log(simulator.parse(text_input)); //simulator(text_input);
        recursiveAsyncReadLine();
    });
};

recursiveAsyncReadLine();