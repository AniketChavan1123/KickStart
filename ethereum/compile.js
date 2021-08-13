// like before we don't want to compile contract every time(bcz contract code will rarely change),
// but instead we will compile it once and store the source 
// into build folder
// both contract's bytecode will be stored at build directory as json format
const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');     //file system..fs-extra....has some extra features apart from provided by node
const buildPath = path.resolve(__dirname,'build'); // referencing build directory in our current directory(__dirname)
fs.removeSync(buildPath);               // node fs doesn't have cmd to easily remove everything inside folder;
                                //removeSync search for folder and delete all residing files
const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol');
const source = fs.readFileSync(campaignPath,'utf8');            // getting contents of Campaign.sol file
const output=solc.compile(source,1).contracts;  // contract property
                                                // output has 2 contract factory,campaign
fs.ensureDirSync(buildPath);    // check if build directory exist...if no c- it will create one

// console.log(output);
for(let contract in output){
    fs.outputJsonSync(path.resolve(buildPath,contract.replace(':','')+'.json'),// contract is key in output(json)
    output[contract]);                              // removing colon from keyname
}// loop summary--in object we have 2 contracts in json format 
//  Namely campaignPath,campaignFactory
// we are looping through output grabbing each contract..i.e'output[contract]' and putting into build as keyname.json 
