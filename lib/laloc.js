#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
const yargs = require('yargs');
const awsLambdaMockedContext = require('./aws-context.js')

var lambdaFunction;
var lambdaFunctionFilename;
var lambdaFunctionHandler;
var event;
var context = this.context;
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m"
const colorReset = "\x1b[0m"
var lamdaTimeout = null;

/*
 *  Process command line options
 */
console.log(FgYellow + '\nlaloc v0.1.0-beta');
console.log('Execute lambda functions localy simulating AWS Lambda environment.\n' + colorReset);

yargs
  .usage('$0 [options]')
  .option('function', {
    alias: 'f',
    describe: 'Lambda function to execute localy.',
    type: 'string' 
  })
  .option('handler', {
    alias: 'h',
    default: 'handler', 
    describe: 'Lambda function handler name.',
    type: 'string'
  })
  .option('timeout', {
    alias: 't',
    default: 3,
    describe: 'aws lambda execution timeout (secs).',
    type: 'number'
  })
  .demandOption(['function'], 'Please provide lambda function file name (using -f option)')
  .help()
  .argv


  /*
   * Prepare to execute AWS Lambda Function locally
   */
  lambdaFunctionFilename = "./" + yargs.argv.function;
  lambdaFunctionHandler = yargs.argv.handler; 
  lambdaFunction = require(lambdaFunctionFilename);
  
  /*
   * Load aws lambda event simulated data from json file
   */
  
   try{
       event = JSON.parse(fs.readFileSync(lambdaFunctionFilename+'.json', 'utf8').trim());
   }catch(ex){
    console.log( FgYellow + '--> WARNING: lambda event data not loaded');
    console.log( FgRed + ex + '\n' + colorReset);   
  }
    
  
  /*
   * Call lambda function locally
   */
  console.log(FgGreen + '--> Starting lambda function \'' + lambdaFunctionFilename + '\' handler \''+ lambdaFunctionHandler + '\'.\n' + colorReset);
  lambdaFunction[lambdaFunctionHandler](event, awsLambdaMockedContext, laLocCallback);   

  
  /*
   * Implements AWS Lambda environment timeout simulation
   */
  lamdaTimeout = setTimeout(function() {
    console.log( FgRed + '--> Local lambda function \'' + lambdaFunctionFilename + '\' execution timed out after ' + yargs.argv.timeout + ' seconds.\n' + colorReset);
    process.exit(1);
  }, yargs.argv.timeout * 1000);
  
  
  /*
   * Implements AWS lambda environment callback to simulate returning execution result to AWS lambda
   */
  function laLocCallback(err, message){  
    
    if (err){
       console.log(FgRed + '\n--> error output: ' + err);
       console.log(FgRed + '\n--> Local lambda execution finished with error.');
    } else{
       if (message){
         console.log(FgGreen + '\n--> output: ' + message);
       }
       console.log(FgGreen + '\n--> Local lambda execution finished with success.');
    }
    console.log(colorReset);
    process.exit(0);
  }

  
// Load the sample event to be passed to Lambda. The _sampleEvent.json file can be modified to match
// what you want Lambda to process on.
//