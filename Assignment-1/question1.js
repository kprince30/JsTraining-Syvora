const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function calculator() {
  rl.question('Enter the first number: ', (num1) => {
    rl.question('Enter the second number: ', (num2) => {
      rl.question('Enter the operation (add, subtract, multiply, divide): ', (operation) => {
        const number1 = parseFloat(num1);
        const number2 = parseFloat(num2);

        let result;

        switch (operation) {
          case 'add':
            result = number1 + number2;
            break;
          case 'subtract':
            result = number1 - number2;
            break;
          case 'multiply':
            result = number1 * number2;
            break;
          case 'divide':
            if (number2 === 0) {
              console.log('Error: Division by zero');
              rl.close();
              return;
            }
            result = number1 / number2;
            break;
          default:
            console.log('Invalid operator');
            rl.close();
            return;
        }

        console.log(`Result: ${result}`);
        rl.close();
      });
    });
  });
}

calculator();
