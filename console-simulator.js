const simulator = require('./simulator'); console.log(simulator.test_msg);
const readline = require("readline");
const fs = require('fs');

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
['exit','quit','q','close','halt','h'].forEach( e => exit_commands.add( e ) );

// Console commands
// This object maps the textual command to the fn obj that handles it
console_commands = {
    show_registers: show_registers,
    put_value_in_mem: put_value_in_mem,
    pvm: put_value_in_mem, // an alias
    put_instruction_in_mem: put_instruction_in_mem,
    pim: put_instruction_in_mem,
    show: show,
    sh: show,
    show_all: show_all_memory,
    sha: show_all_memory,
    step: step,
    s: step,
    load_file: load_file,
    lf: load_file
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
            
            if( recognized_console_commands.has( parse_console_command( text_input ) ) )
                handle_console_command( environment, text_input );
            else {
                let input_opt = environment.parser( text_input ).opt;
                if( simulator.supported_instructions.has( input_opt ) ){
                    simulator.execute( environment, text_input );
                    recursiveAsyncReadLine( environment );
                }
                else {
                    console.log( `Error: instruction '${ text_input }' not recognized.` );
                    recursiveAsyncReadLine( environment );
                }
            }
        }
        
    });
};

function handle_console_command( environment, text_input ) {
    let console_command = parse_console_command( text_input );
    console_commands[ console_command ]( environment, text_input );
    recursiveAsyncReadLine( environment );
}

function parse_console_command( text_input ) {
    let slice_index = text_input.indexOf( ' ' );
    let console_command = null;
    if(slice_index === -1){
        console_command = text_input;
    }
    else {
        console_command = text_input.slice( 0, slice_index );
    }
    
    return console_command;
}

function show_registers( environment, text_input ) {
    for( const property in environment.registers ) {
        console.log( `${ property }: ${ environment.registers[ property ] }` );
    }
}

// shows a single cell in memory
// show address
// show 1242
function show( environment, text_input ) {
    let args = text_input.split( ' ' );
    console.log( ` ${ args[1] }: ${ environment.memory[ parseInt( args[1] ) ] }` );
}

function show_all_memory( environment, text_input ){
    for( const address in environment.memory ) {
        console.log( `${address}: ${environment.memory[ address ]}` );
    }
}

// accepts an instruction in the form of pvm/put_value_in_mem 101029 1020340
// address and value were to put it
function put_value_in_mem( environment, text_input ) {
    let args = text_input.split( ' ' );
    // the address must be memory aligned
    if( args[1] % 4 == 0) {
        environment.memory[ parseInt( args[1] ) ] = parseInt( args[2] );
    }
}

// accepts an instruction in the form of pim/put_instruction_in_mem 10 1020340
// instruction and address were to put it
function put_instruction_in_mem( environment, text_input ) {
    let between_command_address = text_input.indexOf( ' ' );
    let between_address_instruction = text_input.indexOf( ' ', between_command_address + 1);
    let address = parseInt( text_input.slice( between_command_address, between_address_instruction ) );
    
    // the address must be memory aligned
    if( address % 4 == 0) {
        let instruction = text_input.slice( between_address_instruction + 1);
        environment.memory[ address ] = instruction;
    } 
}

function load_file( environment, text_input ) {
    let slice_index = text_input.indexOf( ' ' );
    let file_path = text_input.slice( slice_index + 1 );
    let source = fs.readFileSync(file_path, {encoding: 'utf8', flag:'r'});
    //console.log(source.split('\n'));//~print
    simulator.load_source_into_memory( environment, source );
}

function step( environment, text_input ) {
    simulator.step( environment );
}

recursiveAsyncConfig();