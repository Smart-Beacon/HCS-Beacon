const { v4 } = require('uuid');
 
const createuuid = async () => {
    const tokens = v4().split('-')
    console.log(tokens);
    return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
}
 
module.exports = {
    createuuid,
}