module.exports = {
    test_msg: "Import successful",
    supported_cpus: ['mips'],
    //~ Is it efficient to search a list?
    supported_instructions: null,
    factory: factory,
    execute: execute,
    // To make functions visible for simple repl manipulation. To make it easy to find and debug.
    // dg stand for debug. Short, so there is no need to type too much.
    dg: {
        remove_front_whitespaces: remove_front_whitespaces,
        parse_mips: parse_mips,
        handle_command: handle_command,
        add_registers: add_registers,
        build_mips_registers: build_mips_registers,
        build_mips_instructions: build_mips_instructions,
        build_memory: build_memory,
        preprocess_args: preprocess_args

    }
}



mips_instructions = new Set();
mips_instructions.add('set');

console.log('>>');
console.log(mips_instructions);
console.log('>>');

function factory( cpu ) {
    if ( cpu == 'mips' ) {
        // this returns the environment
        return {
            parser: parse_mips,
            registers: build_mips_registers(),
            instructions: build_mips_instructions(),
            memory: build_memory()
      }
  }
}

function execute( environment, text_input ) {
    let command = environment.parser( text_input );
    handle_command( environment, command );
}

//~ optimize latter
function remove_front_whitespaces( text_input ) {
    let index = text_input.indexOf( ' ' );
    while( true ){
        if ( index != 0 )
            break;
        text_input = text_input.slice( 1 );
        index = text_input.indexOf( ' ' );
    }
    return text_input;
}

function preprocess_args( args, expected_num_of_args ) {
    args = args.replaceAll( ' ', '' );
    args = args.split( ',' );
    if( args.length == expected_num_of_args )
        return args;
    else {
        //~ NEEDS TO BE IMPLEMENTED. Throw an exception or show an error msg?
        // For interactive mode it would be great to just display a message, while for source code the execution must halt
        return null; // temporary
    }
}

function parse_mips( text_input ) {
    text_input = remove_front_whitespaces( text_input );
    let index = text_input.indexOf( ' ' );
    let command =  {
        opt: text_input.slice( 0, index ), 
        args: text_input.slice( index + 1 )
    }
    return command;
}

function handle_command( environment, command ) {
    let opt = environment.instructions[ command.opt ];
    //~ what if opt  is null?
    opt( environment, command.args );
}

function add_registers( regs, character, n ) {
    for ( let idx = 0; idx < n; idx++ )
        regs[ `$${ character }${ idx }` ] = 0;
}

function build_mips_registers() {
    let registers = {};

    // special registers
    registers['$gp'] = 0;
    registers['$sp'] = 0;
    registers['$fp'] = 0;
    registers['$ra'] = 0;


    // regular registers
    registers['$zero'] = 0;  // Always Zero


    // Add v0-1 registers used for system calls and procedure return values
    add_registers( registers, 'v', 2 );

    // Add a0-3 registers used for passing arguments to procedures
    add_registers( registers, 'a', 4 );

    // Add t0-9 used for local storage; calling procedure saves these
    add_registers( registers, 't', 10 );

    // add s0-7 used for local storage; called procedure saves these
    add_registers( registers, 's', 8 );

    return registers;
}

function build_mips_instructions() {
    let instructions = {};

    //~ still has the issue that each new instruction needs to be manually added here.
    let mips_instructions = new Set();
    ['add','addi','sub','lw','sw'].forEach( e => mips_instructions.add(e) );
    module.exports.supported_instructions = mips_instructions;

    instructions['add'] = function ( environment, args ) {
        args = preprocess_args( args, 3 );
        environment.registers[ args[ 0 ] ] = environment.registers[ args[ 1 ] ] + environment.registers[ args[ 2 ] ]
        //~ a quick debug. Written before test framework was set up
    }

    instructions['addi'] = function ( environment, args ) {
        args = preprocess_args( args, 3 );
        environment.registers[ args[ 0 ] ] = environment.registers[ args[ 1 ] ] + parseInt( args[ 2 ] );
    }

    instructions['sub'] = function ( environment, args ) {
        args = preprocess_args( args, 3 );
        //~ What if the number of arguments is not right?
        environment.registers[ args[ 0 ] ] = environment.registers[ args[ 1 ] ] - environment.registers[ args[ 2 ] ]
        //~ a quick debug. Written before test framework was set up
    }

    instructions['lw'] = function ( environment, args ) {
        args = preprocess_args( args, 2 );
        //~ we need to make sure the offset is a multiple of 4
        let target_reg = args[ 0 ];
        let slice_index = args[ 1 ].indexOf( '(' );
        //~ needs to assert that the offset is positive? Why would if be negative? Isn't that against the rules?
        let offset = parseInt( args[ 1 ].slice( 0, slice_index ) );
        let address_reg = args[ 1 ].slice( slice_index ).replace( '(', '' ).replace( ')', '' );
        let address = offset + environment.registers[ address_reg ];
        environment.registers[ target_reg ] = environment.memory[ address ];
    }

    instructions['sw'] = function ( environment, args ) {
        args = preprocess_args( args, 2 );
        //~ we need to make sure the offset is a multiple of 4
        let source_reg = args[ 0 ];
        let slice_index = args[ 1 ].indexOf( '(' );
        //~ needs to assert that the offset is positive? Why would if be negative? Isn't that against the rules
        let offset = parseInt( args[ 1 ].slice( 0, slice_index ) );
        let address_reg = args[ 1 ].slice( slice_index ).replace( '(', '' ).replace( ')', '' );
        let address = offset + environment.registers[ address_reg ];
        environment.memory[ address ] = environment.registers[ source_reg ];
    }

    return instructions;
}

function build_memory() {
    let memory = {};
    //~ Might not be the best location. Just temporary.
    let size = 2**10;

    // size must be incremented by 4 to simualte memory alignment
    for( let x = 0; x < size; x += 4 ) {
        memory[x] = 0;
    }

    return memory;
}