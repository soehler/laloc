# laloc 

[![npm version](https://badge.fury.io/js/laloc.svg)](https://badge.fury.io/js/laloc) 


AWS Lambda is amazing but requires a great effort to debug its functions.

After looking for a lot of open source tools to help execute lambda functions locally, for development and debugging, I decided to write yet another one myself, because all options I've found were buggy, too complex,lacking support for fixing bugs or just don't fit my taste.  

So here is my contribution, it is not perfect (nor pretends to be) but it works and requires a little typing to use, just:

```laloc labbdafunction.js```

Mainly Inspired from [lambda-local](https://github.com/ashiina/lambda-local)

## Features: ##
* Implements lambda function timeout simulation.
* Allow simulation of AWS Event data using a json file.
* Looks for lambdafunction.json event file automatically, by default.
* Specify custom handler name.

## How to Use ##

### Installation: ###
As laloc is a command line tool, you need to enable  by installing laloc as a global module:

```npm i laloc -g```

### Usage: ### 

```
laloc LambdaFunction [options]

Parameter:

LambdaFuncion, Full lambda function filename including extension (required).

Options:

  --handler, -h  Lambda function handler name.     
  --event, -e    Lambda function event data.                                         
  --timeout, -t  AWS lambda execution timeout (secs).
  --help         Show help                                             
```

### Examples: ###
```
# Execute lambda function locally loading mylambda function.json event data file authomaticaly.
> laloc  mylambdafunction.js

# Run function locally loading event data from event.json file.
> laloc mylambdafunction.js -e event.json

# Execute function overriding default AWS Lambda 3 seconds timeout.
> laloc mylambdafunction.js -t 10 

# Execute function overriding lambda function default handler 'handler' name.
> laloc mylambdafunction.js -h myhandler 
```
### Notes: ###
* Developed and tested on MAC OS, not tested on MS Windows yet (help welcome)
