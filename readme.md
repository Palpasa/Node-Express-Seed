# This is the seed project for backend code. The backing db is mongodb

## Getting started

## STEP 0: Delete the .git folder
    - rm -fr .git 

## Step 1: Install node modules
    
    ```
      npm i
    ```
    
### Step 2: Install mongodb
    Now add bin directory that has mongod.exe to path so you can run command mongod from command line
    
    The default database used is seed and it is configured in config file.
     
### Step 3: Globally install nodemon: npm install nodemon -g
     To make easier for loading after changes in development, we are using nodemon to run the application. See package.json

### Step 4: Update package.json
    Update your project name from backend-seed
    
### Step 5: Import postman requests
    From the postman directory, import both the files. It has routes to call the seed project 
    
### Step 5: Start the project
    npm start
    
    The app starts in localhost:3000/
    
### Step 6: Use postman to make some calls
   Call the documents endpoint and see all the api that was automatically generated
   
### Step 7: Build something interesting!  



  settings data  


### Port: 
{env}.port or port

### logger
{env}.level or level => default warn
filepath => may or maynot end with /. Required
filename: optional. default filelog-warn.log
NODE_ENV === local, all logs are logged to console
for running test, all logs are ignored

# route builder
global flag [optional[: append_controller_filename_to_all_route (default is false)
local flag: appendFileNameToRoutePrefix



### app version



#Testing

### Running test
    npm test

### Running with code coverage
    npm run test:cover