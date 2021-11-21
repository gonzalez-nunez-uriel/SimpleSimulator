const simulator = require('./simulator'); console.log(simulator.test_msg);
const readline = require("readline");
const { env } = require('yargs');

// reader configuration
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on( "close", function () {
    console.log( "\nSimulation complete." );
    process.exit(0);
});

// Exit commands
exit_commands = new Set();
['exit','quit','q','close'].forEach( e => exit_commands.add( e ) );

// Console commands
// This object maps the textual command to the fn obj that handles it
console_commands = {
    show_registers: show_registers
}

//~populates set obj
recognized_console_commands = new Set();
for( const property in console_commands){
    recognized_console_commands.add( `${ property }` );
}


// simulation configuration
//~ needs input validation
//~ how does this not break the stack? I think it does, right? This shit can only handle k inputs
var recursiveAsyncConfig = function () {
    let config_msg = 'Select CPU from ';
    //~ There is probably a better way to do this
    simulator.supported_cpus.forEach( cpu_choice => config_msg += cpu_choice + ' ' );

    rl.question( config_msg, (text_input) => {
        if( simulator.supported_cpus.has( text_input ) ) {
            console.log( `CPU selected: ${ text_input }` );
            console.log( 'Simuation Start' )
            environment = simulator.factory( text_input ); //~ this creates a global var, right?
            recursiveAsyncReadLine( environment );
        } else {
            console.log( 'Sorry, input not recognized' );
            recursiveAsyncConfig();
        }
    });
};

//~ So how does this shit not break the stack?
var recursiveAsyncReadLine = function ( environment ) {
    rl.question( '>> ', function ( text_input ) {
        if( exit_commands.has( text_input ) )
            return rl.close();
        else {
            if( recognized_console_commands.has( text_input ) )
                handle_console_command( environment, text_input );
            else {
                let input_opt = environment.parser( text_input ).opt;
                if( simulator.supported_instructions.has( input_opt ) ){
                    simulator.execute( environment, text_input );
                    recursiveAsyncReadLine( environment );
                }
                else {
                    console.log( `Error: instruction '${ text_input }' not recognized.` );
                }
            }
        }
        
    });
};

function handle_console_command( environment, text_input ) {
    console_commands[ text_input ]( environment );
    recursiveAsyncReadLine( environment );
}

function show_registers( environment ) {
    for( const property in environment.registers ) {
        console.log( `${ property }: ${ environment.registers[ property ] }` );
    }
}

recursiveAsyncConfig();