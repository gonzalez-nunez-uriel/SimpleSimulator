module.exports = {
    test_msg: "Import successful",
    supported_cpus: 'mips',
    factory: factory,
    execute: execute
}

function factory(cpu) {
    if (cpu == 'mips') {
    // this returns the environment
        return {
            parser: parse_mips,
            registers: build_mips_registers(),
            instructions: build_mips_instructions()
      }
  }
}

function execute(environment, text_input) {
    let command = environment.parser(text_input);
    handle_command(environment.registers, environment.instructions, command);
}

//~ optimize latter
function remove_front_whitespaces(text_input) {
    let index = text_input.indexOf(' ');
    while(true){
        if (index != 0)
            break;
        text_input = text_input.slice(1);
        index = text_input.indexOf(' ');
    }
    return text_input;
}

function parse_mips(text_input) {
    text_input = remove_front_whitespaces(text_input);
    let index = text_input.indexOf(' ');
    let command =  {
        opt: text_input.slice( 0, index ), 
        args: text_input.slice( index + 1 )
    }
    return command;
}

function handle_command(registers, instructions, command) {
    let opt = instructions[command.opt];
    // what if opt  is null?
    opt(registers, command.args);
}

function add_registers(regs, character, n) {
    for (let idx = 0; idx < n; idx++)
        regs[`$${character}${idx}`] = 0;
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
    add_registers(registers, 'v', 2);

    // Add a0-3 registers used for passing arguments to procedures
    add_registers(registers, 'a', 4);

    // Add t0-9 used for local storage; calling procedure saves these
    add_registers(registers, 't', 10);

    // add s0-7 used for local storage; called procedure saves these
    add_registers(registers, 's', 8);

    return registers;
}

function build_mips_instructions() {
    let instructions = {};
    instructions['add'] = function (registers, args) {
    
        args = args.replaceAll( ' ', '' );  
        args = args.split(',');
        //What if the number of arguments is not right?
        registers[ args[ 0 ] ] = registers[ args[ 1 ] ] + registers[ args[ 2 ] ]
        // a quick debug. Written before test framework was set up
    }
    return instructions;
}
