const generatePassword = () => Math.random().toString(36).substring(2,7);

console.log(generatePassword())