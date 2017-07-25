#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
const yargs = require('yargs');
const awsLambdaMockedContext = require('./aws-context.js')  //mock aws lambda context data

var lambdaFunction;        // lambda function to be executed
var lambdaFuntionFileName;
var lambdaEventDataFile;  
var event;                 // aws event data (json format)
var lamdaTimeout = null;   // timer to simulate aws lambda timeout

/*
 * Color variables used on console messages output
 */
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m"
const colorReset = "\x1b[0m"


/*
 *  Process command line options
 */
console.log(FgYellow + '\nlaloc v0.1.4-beta');
console.log('Execute lambda functions localy simulating AWS Lambda environment.\n' + colorReset);


yargs
  .usage('$0 <LambdaFuncion> [options]')
  .option('handler', {
    alias: 'h',
    default: 'handler', 
    describe: 'Lambda function handler name.',
    type: 'string'
  })
  .option('event', {
    alias: 'e', 
    describe: 'Lambda function event data.     [default: <LambdaFuncion>.json]',
    type: 'string'
  })
  .option('timeout', {
    alias: 't',
    default: 3,
    describe: 'AWS lambda execution timeout (secs).',
    type: 'number'
  })
  .demandCommand(1, 'You need to provide <LambdaFuncion> file name.')
  .help()
  .argv

  /*
   * Resolve supplied filename to adsolute filename
   */
   lambdaFunctionFilename = path.resolve(yargs.argv._[0]);
  
  /*
   * Prepare to execute AWS Lambda Function locally
   */
  
  try{
    lambdaFunction = require(lambdaFunctionFilename);
  }catch(ex){
    console.log( FgRed + '--> Local lambda function file\'' 
                 + lambdaFunctionFilename + '\' not found, or contains error');
    process.exit(1);
  }
    
  
  /*
   * Load aws lambda event simulated data from json file
   */
  
   try{
       
       if (yargs.argv.event){  // load eventa data from option -e
         lambdaEventDataFile = path.resolve(yargs.argv.event);
       }else{                  // defaults to <LambdaFuncion>.json if -e not provided.
         lambdaEventDataFile = lambdaFunctionFilename.replace(path.extname(lambdaFunctionFilename),'.json') 
       }
    
       lambdaFunctionFilename.replace(path.extname(lambdaFunctionFilename),'.json')
       event = JSON.parse(fs.readFileSync(lambdaEventDataFile, 'utf8'));
       console.log( FgGreen + '--> INFO: using lambda event data file \'' + path.basename(lambdaEventDataFile) + '\'');
   }catch(ex){
        console.log( FgYellow + '--> WARNING: lambda event data not loaded');
        console.log( FgRed + ex + '\n' + colorReset);   
  }
    
  
  /*
   * Call lambda function locally
   */
  console.log(FgGreen + '--> Starting lambda function \'' + path.basename(lambdaFunctionFilename) 
              + '\' handler \''+ yargs.argv.handler + '\'.\n' + colorReset);
  console.time('    Executed in ');
  lambdaFunction[yargs.argv.handler](event, awsLambdaMockedContext, laLocCallback);   

  
  /*
   * Implements AWS Lambda environment timeout simulation
   */
  lamdaTimeout = setTimeout(function() {
    console.log( FgRed + '--> Local lambda function \'' + path.basename(lambdaFunctionFilename) + '\' execution timed out after ' + yargs.argv.timeout + ' seconds.\n' + colorReset);
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
         console.log(FgGreen + '\n--> output: ' + JSON.stringify(message));
       }
       console.log(FgGreen + '\n--> Local lambda execution finished with success.');
       console.timeEnd('    Executed in ');
    }
    console.log(colorReset);
    process.exit(0);
  }
