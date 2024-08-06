// utils.js
const fs = require('fs');

function generateName() {
    const idName = fs.readFileSync("listnames.txt", "utf-8").split('\n');;
    const filteredNames = idName.filter(name => name.trim() !== '');
    const randomIndex = Math.floor(Math.random() * filteredNames.length);
    const randomName = filteredNames[randomIndex];

    return randomName
}

module.exports = {
    generateName
};
