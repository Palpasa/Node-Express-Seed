# This project is the seed for building API using [Node.js](https://nodejs.org/en/) and [Express](http://expressjs.com/).

# Features
  1. Custom settings file so that everything does not need to be passed from command line
  2. Easy API versioning
  3. Simple logging configuration
  4. Seperate controller and repository codes
  5. Automated API documentation builder
  6. Integration with babel

# See the app in action <a id="app-in-action"></a>
    1. Clone this project
    2. Run `npm install`
    3. Run `npm start`

Go the the following endpoints:

 - http://localhost:3500/api1/general => returns message hello
 - http://localhost:3500/api1/apidoc => JSON formatted api documentation

# Using this Project

## Define settings

   Normally settings are passed to node using command line variables. However, with this scheme the command 
   line argument starts to get really long. Using command line is more hassle in windows becuase every command
   needs to be prefixed with SET. For windows and unix some of us might even have seperate values defined in scripts.
   Using this seed project you can really avoid long command line input.

__How does settings work?__

When the app starts, settings-loader.js reads the app.settings file and pareses all the key value pair. Any line 
that matches the regex `.*=.*`  are __Key/Value pair__. Any other line are ignored. Therefore, new lines added to seperate
contents of settings file are ignored. If you want to add any __comments__, just do not use = any where in that line. I 
prefer to use javascript one liner comment syntax. After parsing the app.settings, file all the key value pair are add in 
the `process.env` as `process.env.key = value`. Therefore, any value defined in app settings are accessible globally through 
out the code.

One of the interesting thing about app.settings is you can __define placeholder for value (only value can have placeholder)__ 
and it will be replaced with an actual value when app.settings parses the value. An example of such usage in this seed project is 
defination of `log_file_path`. The value defined in app.settings is `log_file_path = /var/log/{appname}/;`. The __placeholder__ 
is text between `{}`. A key lookup is done using the text defined in the curly braces and if a value is found, the placeholder is replaced.
This final value will be the key/value pair that will be added to proces.env. However, if no value is found for the placeholder than an error
is thrown which will tell which placeholder is missing the defination. 

Note that placeholder key can appear even before the actual key is defined. This is because placeholder are looked up and replaced in the 
very end of parsing phase.


__Defining values__

Values are defined in [app/config/app.settings](./app/config/app.settings). Listed below are the kye/value pair known to the app.


key | value | Required | Default | Description | Can use environment prefix |
--- |  ---  | --- | --- | --- | --- |
appname | String | No | seed | The name of your app. We strongly recommended to set this value in app.settings | No |
api_version | String | No | api1 | If defined it will be used to prefix all the routes in your app. This flag makes changing API version as trivial as updating value for this key in app.settings file. | No |
port | Number | No  | 3000 | the port in which app will listen to | Yes |
log_file_path | String | Yes | /var/log/seed/ | The directory where logs file will be written. You should ensure such directory exists and the process have permission to write in this directory. | Yes | 
log_file_name | String | No | {appname}-log.log | Log file will be added in log_file_path directory. Also, for default log file name appname will be replaced using value defined in app.settings. | No |
level | String | No | warn | Winston is used as logging framework. Please refer to winston API for more info. Also, checkout the file [app/config/logger.js](./app/config/logger.js) for logging methods that you can be used. | Yes |
append_controller_filename_to_all_route | true/false | No | false | In order for this flag to make sense please reference [API documentation](#apidoc). | No |

* What is environment prefix:
When you are running your app, you might want to use different value based on the environment (e.g. local, development, qa, production or any 
value defined in `NODE_ENV` flag). For example for local development you might want to use port 3000 but for production you might
want to use something else. So, for port you can define the vaue prefixed by your environment as local_port. When the app starts, it looks
for this environment prefixed value, if found then it will use it else it will fallback to using just port. This means for some environment
you can define custom value and for some you can just fallback to the generic one. For instance in local envrionment you can choose to 
use value defined by `local_port` and for all other environment you can use valu defined by `port`.

Any key that can use environment prefix must have the format `{NODE_ENV}_key`. NODE_ENV will be replaced with the value passed to __NODE_ENV__
flag. The generic fallback key for environment prefixed key is just key from the above defined format.

* When app is running locally, NODE_ENV is set to local, all loggings will be done locally. When running tests, NODE_ENV = test, no logs will be written at all.

# API Documentation <a id="apidoc"> </a>
In the earlier [app in action](#app-in-action) one of the end point returned JSON formatted API documents. This works 
because API documents are expected to be defined in every files that are in controller directory. Open any one of the files
in controller directory to see API documentation process. Let's open [general.js](./app/controller/general.js) file and
look at the hello Object. Earlier when you went to the endpoint http://localhost:3500/api1/general, the method in this 
hello object responded. Let's how everything ties up together.


Object-Key |  Value | Description |
--- | --- | --- |
api | Object | The value is free form and really does not have to be even an object. Ideally this should describe what this particular endpoint does, what are the params this endpoint is expecting and the response from this endpoint. In the hello example, I have added desc, params and response to describe this particular API.|
protected | true/false | protected means before the call to the method defined in the object some common code will be executed. This common code is defined in [function enableRouteProtection](./app/router/index.js). Ideally you should update this function as defined in there. |
route | String | This will be a suffix to your API Endpoint (more about it coming right below). You do not have to worry about appending / in this route. It will be appened if not provided. Therefore, a simple string value should be your choice here. Any [route parameters](https://expressjs.com/en/guide/routing.html) should be defined as ':paramName' described in Express JS.|
appendFileNameToRoutePrefix | true/false | If it is not defined it means false. More about this value is coming up just in a bit; keep reading this whole API Documentation section. |
method | A function or an array of function | This is the method that will be executed. The function will have request and response params only. This is passed to express during route registration. If this is an array of function, all the function will be called in the order provided. First function should call next at the end of execution for the second one to be called and so on. Refer to [express routing guide](https://expressjs.com/en/guide/routing.html)|

For everything in the API documentation to make sense now we need to take about routing and how the endpoints are built. For 
all the time we said keep reading this is the section where all ties up together.


When app starts, 
talk about routing now

# route builder
global flag [optional[: append_controller_filename_to_all_route (default is false)
local flag: appendFileNameToRoutePrefix


### API Documentation


### app version



#Testing

### Running test
    npm test

### Running with code coverage
    npm run test:cover