const readline = require('readline');

// Create interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask question
rl.question('Whats process run? ', (param) => {
    // Log the answer
    console.log(`Execute ${param}!`);
    // Close the interface
    rl.close();
})
