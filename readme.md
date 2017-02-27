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

__Running on Windows?__

For every command there is an equivalent entry for windows prefixed by w. To run quickly in windows run the following commands:

    1. Clone this project
    2. Run `npm install`
    3. Run `npm run wstart`


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
because API documents are expected to be defined in every files in [controller directory](./app/controller/). Open any 
one of the files in controller directory to see API documentation example. Let's open 
[general.js](./app/controller/general.js) file and look at the hello Object. Earlier when you went to the endpoint 
http://localhost:3500/api1/general, the method in this hello object responded. Let's how everything ties up together.

<a id="apidocformat">**__Documentation Format__**</a> 

Key |  Value | Description
--- | --- | ---
api | Object | The value is free form and really does not have to be even an object. Ideally this should describe what this particular endpoint does, what are the params this endpoint is expecting and the response from this endpoint. In the hello example, I have added desc, params and response to describe this particular API.
protected | true/false | protected means before the call to the method defined in the object some common code will be executed. This common code is defined in [function enableRouteProtection](./app/router/index.js). Ideally you should update this function as defined in there.
route | String | This will be a suffix to your API Endpoint (more about it coming right below). You do not have to worry about appending / in this route. It will be appened if not provided. Therefore, a simple string value should be your choice here. Any [route parameters](https://expressjs.com/en/guide/routing.html) should be defined as ':paramName' described in Express JS.
appendFileNameToRoutePrefix | true/false | If it is not defined it means false. More about this value is coming up just in a bit; keep reading this whole API Documentation section
method | A function or an array of function | This is the method that will be executed. The function will have request and response params only. This is passed to express during route registration. If this is an array of function, all the function will be called in the order provided. First function should call next at the end of execution for the second one to be called and so on. Refer to [express routing guide](https://expressjs.com/en/guide/routing.html)

For every parameter in the [documentation format](#apidocformat) to make sense we need to take about [routing](#routing) and how the endpoints are built. After that everything will make sense.

# <a id="routing"> Routing </a>
Before talking about this app routing, let's talk about how we register route and callback function. We are using [Express js](http://expressjs.com/) as
framework and we will leverage [Express js routing](http://expressjs.com/en/guide/routing.html) feature. In Express, route and callback function is
defined as follows:

```
app.get('/', function (req, res) {
    res.send('hello world')
})
```

Our goal during the routing phase is to build the endpoint, register the function or an array of function to 
execute for that endpoint and finally figure out which HTTP method should be used for registration. Since we pass everything
to Express framework for registation, any API that express supports are definitely supported by this seed project. Now let's
talk about how we do it.

In the [router directory](./app/router) there is index.js file which is loaded when the app starts. This file reads the 
controller directory and parses all the files (only the javascript files should be in controller directory). For each file 
index.js parses, all the values from the [API Documentation format](#apidocformat) are expected to be defined. 
The most important values from this API format when doing route registration are protected, route, appendFileNameToRoutePrefix 
and method. Let's go through the various steps that we go thorugh in order to register route and callback function(s) with express.

__STEP 1: Building Endpoints (routes)__

When building route, following values are considered in the order defined below:

- if api_version is defined, it is added at the very beginning of the endpoint
- do we want to add the controller file name or not? From the API documentation format we read the value of 
[appendFileNameToRoutePrefix](#apidocformat). If it is falsy (either undefined or set to false) than the global settings 
[append_controller_filename_to_all_route is read](#appsettingsvalues). If it is also falsy (either undefined or set to false),
 than the controller name is not appended; else we will append the controller name after the api version in the endpoint
- finally we consider the [route](#apidocformat) value defined in the API Documentation. If it is defined, we will append
 this to the endpoint. If you want to add any route parameters to your endpoint you can do so in the route when creating API
 documentation. Finally, you should leverage this route in order to make your API endpoint's restful.

We can summarize above steps in the following pseudo code:
  
```
let newRoute = api_version + controller_filename + route; // use only variables that has value
```

__Tips:__ 

1. If you need to debug what endoints got built, then in the [index.js](./app/router/index.js) file, add console.log statement to 
print the newRoute variable defined in the `function registerRoute`.
2. In the [Feature section](#features) we showed you two end points generated for the controller [general.js](./app/controller/general.js). 
hello endpoint has the file name 'general' as part of endpoint while docs does not. Based on our above discussion of endpoints, 
hello object has the flag `appendFileNameToRoutePrefix` set to true and therefore controller filename gets appended in the endpoint. 
For the docs object, route is set to apidoc and the flag `appendFileNameToRoutePrefix` is not defined; Also, the global flag 
`append_controller_filename_to_all_route` is falsy. Therefore, only apidoc appears as part of the endpoint but not the controller filename.
3. If you want to see code in action refer to the method [getApiRoute](./app/router/index.js).

Next step is to find function or functions to execute.

__STEP 2: Find Function(s) to execute__

This is where the protected flag comes in use. Let's assume you are building a banking application. If user wants to see 
his account details then he must login first. So you might think of login endpoint as unsecure and the endppoint 
to retrieve user's account balance as secured (aka __protected__). One way to protect the protected endpoint is to validate 
some user data. For example, suppose that after user logs in your application sends the client Auth token
which the client needs to include in the API calls that are protected. Assuming there are multiple endpoints that are protected, 
all of them must validate the authtoken before returning the account balance to client. Now, this function that does auth
token validation is common logic for all protected endpoints and it needs to be refactored into a common code. In this seed app, 
we have referred to this common function as `enableRouteProtection` and is defined in the [index.js](./app/router/index.js).
If you have marked protected flag as true in your API documentation, then the `function enableRouteProtection` is registered as 
first function with the express API. When a request is received for this protected endpoint, express will execute 
`enableRouteProtection function` first. If you throw an error in this function Express will return error; If you call `next` 
at the end of the execution of this function, express will call the next function registered in the chain.

Next value we look at is method in the API Documentation format. The method value can be a function or an array of function. 
We will take this value and provide it to the Express during the route registration. All the function provided will be executed in  
the order as it was defined.

Let's summarize the above discussion into pseudo code:

``` 
    let functionToExecute;

 if (protected === true)
    functionToExecute = enableRouteProtection + method;
 else   
    functionToExecute = method;
```
where method is defined in the [API Documentation Format](#apidocformat).

__Tips:__

1. Want to see code in action, refer to the method [registerRoute](./app/router/index.js). Look at the `if and else section` 
for the variables `enableRouteProtection` and `fnToExecute`. Here, is the copied code snippet:

```
    if (/true/i.test(aRequestAPIDocAndCallbackFn.protected)) {
        app[httpVerb](newRoute, enableRouteProtection, fnToExecute);
    } else {
        app[httpVerb](newRoute, fnToExecute);
    }
```


__STEP 3: Find the HTTP Verb to use__

If you look at the [general.js](./app/controller/general.js) file, in the very end we have following code snippet:

    ```
        export let get = [hello, docs];
    ```

This exported variable __must__ be one of the HTTP Verb (get, post, put, patch, delete) in lower case.
We look at this exported variable and find out the HTTP Method that should be used to register the endpoint using Express.

__Tips:__

1. Want to see code in action, refer to the method [registerRoute](./app/router/index.js). Look at the `if and else section`
 for the variables `httpVerb`. Here, is the copied code snippet:

```
    if (/true/i.test(aRequestAPIDocAndCallbackFn.protected)) {
        app[httpVerb](newRoute, enableRouteProtection, fnToExecute);
    } else {
        app[httpVerb](newRoute, fnToExecute);
    }
```

Finally, now we have endpoint and the function to execute registered for different HTTP Methods. Hopefully, by now everything makes sense.

#Testing

### Running test
    npm test

### Running with code coverage
    npm run test:cover