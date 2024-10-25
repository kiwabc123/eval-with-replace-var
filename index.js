// Function to generate possible keys from AA to ZZ
function generatePossibleKeys() {
    const possibleKeys = [];
    for (let i = 65; i <= 90; i++) { // ASCII values for A-Z
        for (let j = 65; j <= 90; j++) {
            possibleKeys.push(String.fromCharCode(i) + String.fromCharCode(j));
        }
    }
    return possibleKeys;
}

// Randomly select a replacement key from AA to ZZ
function getRandomKey(possibleKeys) {
    if (possibleKeys.length === 0) {
        throw new Error("No keys available in the possibleKeys array.");
    }
    const randomIndex = Math.floor(Math.random() * possibleKeys.length);
    return possibleKeys.splice(randomIndex, 1)[0];  // Remove and return the used key
}

// Main function to handle formula modification and evaluation
function processFormula(formula, variables) {
    const possibleKeys = generatePossibleKeys();
    const mapVar = Object.keys(variables);
    const keyMap = {};

    // Loop through mapVar to assign a random key to each original key
    mapVar.forEach(key => {
        keyMap[key] = getRandomKey(possibleKeys);  // Assign a random key to each mapVar entry
    });

    // Replace all occurrences of the original keys in the formula with random keys
    const pattern = Object.keys(keyMap).map(key => key.replace(/[()]/g, "\\$&")).join('|');
    formula = formula.replace(new RegExp(pattern, 'g'), function(matched) {
        return keyMap[matched];
    });

    console.log(`Modified Formula: ${formula}`);  // Output the modified formula
    console.log(`Key Map:`, keyMap);              // Output the map of original keys to random keys

    // Update the variables to use the random keys
    const updatedVariables = {};
    Object.entries(variables).forEach(([key, value]) => {
        const newKey = keyMap[key] || key; // Use random key if exists, otherwise keep original
        updatedVariables[newKey] = value;  // Set the value for the new key
    });

    // Evaluate the formula using the modified formula and updated variables
    const result = evaluateFormula(formula, updatedVariables);

    console.log(`Result: ${result}`);  // Output the result of the evaluation

    return result;
}

// Function to evaluate the formula using JavaScript's eval
function evaluateFormula(formula, variables) {
    // Create a function that substitutes the variable values into the formula
    const evalFormula = new Function(...Object.keys(variables), `return ${formula};`);
    
    // Call the eval function with the values from updatedVariables
    return evalFormula(...Object.values(variables));
}

// Example usage:

// Original formula
let formula = "((A(a) + B(b)) - C)";

// Variables with their initial values
let variables = {
    "A(a)": 100,  // Value for A(a)
    "B(b)": 200,  // Value for B(b)
    C: 200,       // Value for C
    D: 5,         // Value for D
    E: 6          // Value for E
};

// Call the main function
processFormula(formula, variables);
