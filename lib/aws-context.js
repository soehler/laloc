'use strict'

const uuidv4 = require('uuid/v4');

module.exports = Context;

function Context() {}

Context.getRemainingTimeInMillis = 0;
Context.callbackWaitsForEmptyEventLoop = true;
Context.functionName = 'function';
Context.functionVersion = '$LATEST'
Context.invokedFunctionArn='arn:aws:lambda:aws-region:1234567890123:function:function';
Context.memoryLimitInMB=512;
Context.awsRequestId= uuidv4();
Context.logGroupName='/aws/lambda/function';
Context.logStreamName='2017/11/11/[$LATEST]7ddte84jfftru4ycte49ghr539f6d6v8';





