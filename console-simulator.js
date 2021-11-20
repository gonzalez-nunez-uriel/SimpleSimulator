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
//~ needs input validation
//~ how does this not break the stack? I think it does, right? This shit can only handle k inputs
var recursiveAsyncConfig = function (){
    let config_msg = 'Select CPU from ';
    //~ There is probably a better way to do this
    simulator.supported_cpus.forEach(cpu_choice => config_msg += cpu_choice + ' ');
    
    rl.question(config_msg, (text_input) => {
        if( simulator.supported_cpus.includes(text_input) ) {
            console.log(`CPU selected: ${text_input}`);
            console.log('Simuation Start')
            recursiveAsyncReadLine();
        } else {
            console.log('Sorry, input not recognized');
            recursiveAsyncConfig();
        }
    });
};

recursiveAsyncConfig();

//~ So how does this shit not break the stack?
var recursiveAsyncReadLine = function (environment) {
    rl.question('>> ', function (text_input) {
        if(text_input == "exit" || text_input == "quit")
            return rl.close();
        console.log(simulator.parse(text_input)); //simulator(text_input);
        recursiveAsyncReadLine();
    });
};