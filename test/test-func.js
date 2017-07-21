exports.handler = (event , context, callback) => {
    console.log ('>>> test-func called <<<')
    console.log ('\nCONTEXT DATA');
    console.log (context.awsRequestId);
    console.log ('\nEVENT DATA')
    console.log (event.value1);
    console.log (event.value2);
    console.log (event.value3);
    callback(null, "success");
}