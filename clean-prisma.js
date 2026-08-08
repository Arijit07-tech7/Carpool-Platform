const fs = require('fs');

const filePath = 'c:/Users/ABIR/OneDrive/Desktop/hacathon/odoo/backend/prisma/schema.prisma';
let schema = fs.readFileSync(filePath, 'utf8');

let result = '';
let inParens = 0;
let inBrackets = 0;
let inQuotes = false;

for (let i = 0; i < schema.length; i++) {
  const char = schema[i];

  if (char === '"' && schema[i - 1] !== '\\') {
    inQuotes = !inQuotes;
    result += char;
  } else if (inQuotes) {
    result += char;
  } else {
    if (char === '(') {
      inParens++;
      result += char;
    } else if (char === ')') {
      inParens--;
      result += char;
    } else if (char === '[') {
      inBrackets++;
      result += char;
    } else if (char === ']') {
      inBrackets--;
      result += char;
    } else if (char === ',' && inParens > 0 && inBrackets === 0) {
      // Replace comma with space if it's inside parentheses but outside square brackets
      result += ' ';
    } else {
      result += char;
    }
  }
}

fs.writeFileSync(filePath, result, 'utf8');
console.log('Successfully cleaned schema.prisma!');
