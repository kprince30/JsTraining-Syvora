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

function writeToFile(items) {
  fs.writeFileSync("input.json", JSON.stringify(items, null, 2), "utf8");
  console.log("Data written to input.json");
  processInputFile();
}

function calculateTax(item, categories) {
  const { price, isExempt, isImported } = item;
  let tax = 0;

  if (!isExempt && !isFood(categories, item.name)) {
    tax += price * 0.1;
  }

  if (isImported) {
    tax += price * 0.05;
  }

  return Math.ceil(tax / 0.05) * 0.05;
}

function isFood(categories, itemName) {
  if (!categories || categories.length === 0) {
    return false; 
  }
  const category = categories.find((cat) => itemName.toLowerCase().includes(cat.name.toLowerCase()));
  return category.exempt;
}

function processInputFile() {
  const inputData = JSON.parse(fs.readFileSync("input.json", "utf8"));
  const categories = [
    { name: "book", exempt: true },
    { name: "chocolate", exempt: true },
    {name: "headache pills", exempt: true}
  ];

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

  const totalSalesTaxes = receiptItems.reduce((acc, item) => acc + item.tax, 0);
  const totalAmount = receiptItems.reduce((acc, item) => acc + item.total, 0);

  console.log("Receipt Items:");
  receiptItems.forEach((item) => {
    console.log(`${item.quantity} ${item.name}: ${item.total.toFixed(2)}`);
  });

  console.log(`Sales Taxes: ${totalSalesTaxes.toFixed(2)}`);
  console.log(`Total: ${totalAmount.toFixed(2)}`);
}

takeUserInput();
        