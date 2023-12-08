const fs = require("fs");
const readline = require("readline");

// Function to take user input and write to input.json
function takeUserInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let items = [];

  function askUser() {
    rl.question("Enter item (quantity, name, price) or type 'done' to finish: ", (input) => {
      if (input.toLowerCase() === "done") {
        rl.close();
        writeToFile(items);
      } else {
        let [quantity, ...rest] = input.split(" ");
        let name = rest.slice(0, -1).join(" ");
        let price = parseFloat(rest[rest.length - 1]);

        items.push({ quantity: parseInt(quantity), name, price });

        askUser();
      }
    });
  }

  askUser();
}

// Function to write data to input.json
function writeToFile(items) {
  fs.writeFileSync("input.json", JSON.stringify(items, null, 2), "utf8");
  console.log("Data written to input.json");
  processInputFile();
}

// Function to calculate tax based on category and exemption status
function calculateTax(item, categories) {
  const { price, isExempt, isImported } = item;
  let tax = 0;

  // Basic sales tax of 10% only applies to non-exempt and non-food items
  if (!isExempt && !isFood(categories, item.name)) {
    tax += price * 0.1;
  }

  // Additional 5% tax on imported items
  if (isImported) {
    tax += price * 0.05;
  }

  // Round tax to the nearest 0.05
  return Math.ceil(tax / 0.05) * 0.05;
}

function isFood(categories, itemName) {
  if (!categories || categories.length === 0) {
    return false; // Return false if categories array is empty or undefined
  }
  const category = categories.find((cat) => itemName.toLowerCase().includes(cat.name.toLowerCase()));
  return category.exempt;
}

// Function to process input data from input.json
function processInputFile() {
  const inputData = JSON.parse(fs.readFileSync("input.json", "utf8"));
  const categories = [
    { name: "book", exempt: true },
    { name: "chocolate", exempt: true },
    {name: "headache pills", exempt: true}
  ];

  // Calculate taxes for each item
  const receiptItems = inputData.map((item) => {
    const category = categories.find((cat) => item.name.toLowerCase().includes(cat.name.toLowerCase()));
    const isImported = item.name.toLowerCase().includes('imported');

    const tax = calculateTax({ ...item, isImported, isExempt: category ? category.exempt : false });

    return {
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      tax: tax,
      total: item.price + tax,
    };
  });

  // Calculate total taxes and total amount
  const totalSalesTaxes = receiptItems.reduce((acc, item) => acc + item.tax, 0);
  const totalAmount = receiptItems.reduce((acc, item) => acc + item.total, 0);

  // Output the receipt items as needed
  console.log("Receipt Items:");
  receiptItems.forEach((item) => {
    console.log(`${item.quantity} ${item.name}: ${item.total.toFixed(2)}`);
  });

  // Output total taxes and total amount
  console.log(`Sales Taxes: ${totalSalesTaxes.toFixed(2)}`);
  console.log(`Total: ${totalAmount.toFixed(2)}`);
}

// Start by taking user input
takeUserInput();
        