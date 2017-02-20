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

## [app.settings](./app/config/app.settings)

   Normally settings are passed to node using command line variables. However, with this scheme the command 
   line argument starts to get really long. Using command line is more hassle in windows becuase every command
   needs to be prefixed with SET. Using this seed project you can really avoid long command line input.

__How does settings work?__

When the app starts, [settings-loader.js](./app/config/settings-loader.js) reads the [app.settings](./app/config/app.settings)
file and pareses all the lines. Each line must be terminated with `;`. Any line that is terminated with `;` and 
matches the regex `.*=.*`  are __Key/Value pair__; everything else is ignored. Therefore, any new lines added to this 
[app.settings](./app/config/app.settings) file to make it more readable are ignored. Adding __comments__ is easier too; 
just don't use = any where in your comment. Personally, I prefer to use javascript one liner comment syntax. 
After parsing the [app.settings](./app/config/app.settings), file all the key value pair are add in the 
[__process.env__](https://nodejs.org/api/process.html#process_process_env) as `process.env.key = value`. Any value defined 
ßin app settings are accessible globally through out the code from `process.env`.

One of the interesting feature about values defined in app.settings is that you can __use placeholder for value__. __Placeholder__
is a text occurring with patter `{.*}` and can be used only for value in a key/value pair. 
An example of such usage in this seed project is  defination of `log_file_path`. Here is snippet of log_file_path definition 
form [app.settings](./app/config/app.settings):

```
log_file_path = /var/log/{appname}/;
```

The placeholder will be replaced with an actual value. 

In this usage `{appname}` is the placeholder and it will be replaced with an actual value of appname. In order to replace placeholder
with an actual value, a lookup is done using the placeholder text. In this case value for the key appname is looked up and if a 
value is found, the placeholder text will be replaced. However, if it is not found than an error will be thrown. You will most likely
catch this error during local development, NODE_ENV = local, and not have to deal with errors in any other environment. This lookup
of the placeholder is done at the very end of parsing. Hence, placeholder values can appear even before the actual key/value pair is 
defined. In this case `log_file_path` can defined  before `appname` and still the placeholder will be correctly replaced with actual value.

<a id="appsettingsvalues"> __Defining values__ </a>

All the settings values should be defined in [app/config/app.settings](./app/config/app.settings). 
Listed below are the kye/value pair known to the app. You can define any values you want and read them from process.env.


key                                     | value      | Required | Default           |  [Use environment prefix](#envprefix) | Description
---                                     |  ---       | ---      | ---               | ---                                   | ---
appname                                 | String     | No       | seed              | No                                    | The name of your app. We strongly recommended to set this value in app.settings
api_version                             | String     | No       | api1              | No                                    | If defined it will be used to prefix all the routes in your app. This flag makes changing API version as trivial as updating value for this key in app.settings file
port                                    | Number     | No       | 3000              | Yes                                   | The port in which app will listen to
log_file_path                           | String     | Yes      | /var/log/seed/    | Yes                                   | The directory where logs file will be written. You should ensure such directory exists and the process have permission to write in this directory
log_file_name                           | String     | No       | {appname}-log.log | No                                    | Log file will be added in log_file_path directory. Also, for default log file name appname will be replaced using value defined in app.settings
level                                   | String     | No       | warn              | Yes                                   | Winston is used for logging. Please refer to winston API for more info. Also, checkout the file [app/config/logger.js](./app/config/logger.js) for applicable logging methods. If running tests, `NODE_ENV = local`, logging will not be done at all 
append_controller_filename_to_all_route | true/false | No       | false             | No                                    | In order for this flag to make sense please reference [API documentation](#apidoc)

<a id="envprefix"> **What is environment prefix?** </a>

When you are running your app, you might want to use different value based on the environment (e.g. local, development, qa, production or any 
value defined in `NODE_ENV` flag). For example for local development you might want to use port 3000 but for production you might
want to use something else. So, for port you can define the vaue prefixed by your environment as local_port. When the app starts, it looks
for this environment prefixed value and if found then it will use it else it will fallback to the key port. 

This means for some keys you you can define different sets of values by prefixing your key with environemnt and yet still use generic keys as 
global value. For example, in case of port you can define `local_port` to define the port that should be use for local development; additionally,
you can define `port` which will be a fallback value for all other environment.

Any key that can use environment prefix must use the format `{NODE_ENV}_key`. NODE_ENV will be replaced using the value passed to __NODE_ENV__
flag. The generic fallback key for environment prefixed key is just key from the above defined format.


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