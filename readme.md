# Work in progress... not ready for use yet

# Overview
This project is the seed for building API using [Node.js](https://nodejs.org/en/) and [Express](http://expressjs.com/).
The main goal of this project is to write modular controller and automated app documentation.

# <a id="features"> Features </a>
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


__Defining values__ <a id="appsettingsvalues"> </a>

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

# <a id="apidoc"> API Documentation </a>
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
all the time we said keep reading routing (next section) is where everything ties up.

# Routing
Before talking about this app routing, let's talk about what we want to build. When we use [Express js routing](http://expressjs.com/en/guide/routing.html) is done as follows:

    ```
        app.get('/', function (req, res) {
            res.send('hello world')
        })
    ```
Our eventual goal is to build a route string and find function or array of functions to execute for that route. Then finally we figure out which HTTP method should be used to register 
this route and the function. Not that becuase we are using Express framework, any API express supports are also supported by this seed project because our route registation is done
using express. Now let's talk about how we do it.

When the app starts, index.js file in the [router directory](./app/router/index.js) is loaded. This file reads the controller directory and parses every
file in this directory. For each file in this controller direcotry, index.js parses the API Documentation. The most important values from the API Documentation 
in each object defined are protected, route, appendFileNameToRoutePrefix and method. 

__STEP 1: Building Routes__
When building route, following are the things considered and added in the order defined below:

- if api version is defined it is added at the very beginning of the route
- do we want to add the controller file name or not? Read the value of appendFileNameToRoutePrefix. If it is falsy (either undefined or set to false) then
the global settings append_controller_filename_to_all_route is read. (We talked about this flag in [Define Settings section](#appsettingsvalues)). If 
it is also falsy (either undefined or set to false) then the controller name is not appended; Else we will append the controller name after the api version in the route
- finally we consider the route value defined in the API Documentation. If it is defined we will add this to the route. Therefore, all the route parameters that you want
needs to be defined in the route when you create API documentation. Finally, you should leverage this route in order to make your API endpoint restful.

So, in the end pseudo code for building the route string can be summarized as:
  
  ```
    let actualRoute = api_version + controller_filename + route; // use only variables that has value
  ```

__Note:__ 

1. If you need to debug what route got built, then in the index.js file, add console.log statement to print the newRoute variable defined in the `function registerRoute`.
2. In the [Feature section](#features) we showed you two end points defined in the controller file [general.js](./app/controller/general.js). One of the endpoint has the 
file name 'general' as part of endpoint while other does not. This is because hello object has the flags appendFileNameToRoutePrefix set to true. For the docs object,
route is set to apidoc; appendFileNameToRoutePrefix is not defined and global flag append_controller_filename_to_all_route is also falsy. Therefore, apidoc appears as part
of endpoint but not the controller filename.
3. If you want to see code in action refer to the method [getApiRoute](./app/router/index.js).

Next step is to find function or functions to execute.

__STEP 2: Find Function(s) to execute__
This is where the protected flag comes in use. Let's assume you ar building a banking application. Clearly if user wants to see his account details then he must login first. We need to ensure that the endpoint 
which retrieves user's account balance always is secured (aka __protected__). One way to protect this endpoint is to validate the authtoken passed by the client when 
calling your restful API. Assume there are multiple endpoints that all does the validation of the authtoken before serving the request. Now, this function of validation
of authtoken can be refactored into a common code. In this seed app we have referred to this common function as `enableRouteProtection` and is defined in the index.js.
If you have marked protected flag as true, the `function enableRouteProtection` is registered as the first function with the express API. When a request is received for
this protected endpoint, express will execute this function first. If you throw an error in this function Express will return error; If you call `next` at the end of the
execution of this function express will call the next function registered. 

Next value we look at is method in the API Documentation. The method can be a function or an array of function. We will take this function and provide it to the Express during 
the route registration. So, express will call all the function in the order as it was defined. 

So, the pseudo code for generating function now looks as follows:

``` 
    let functionToExecute;

 if (protected === true)
    functionToExecute = enableRouteProtection + method;
 else   
    functionToExecute = method;
```

__Note:__

1. Want to see code in action, refer to the method [registerRoute](./app/router/index.js). Look at the if and else section for the variables `enableRouteProtection` and `fnToExecute`.


__STEP 3: Find the HTTP Verb to use__

If you look at the [general.js](./app/controller/general.js) file, in the very end we have following code snippet:

    ```
        export let get = [hello, docs];
    ```

This exported variable __must__ be one of the HTTP Verb (get, post, put, patch, delete) in lower case.
We look at this exported variable and find out the HTTP Method that should be used to register the route using Express.

__Note:__

1. Want to see code in action, refer to the method [registerRoute](./app/router/index.js). Look at the if and else section for the variables `httpVerb`.

Finally we have route and the function to execute registered for different HTTP Methods. Hopefully, everything makes sense.

#Testing

### Running test
    npm test

### Running with code coverage
    npm run test:cover