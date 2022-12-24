# noapp-project
A project for noapp


https://noapp-project.pages.dev/



# no-project


### Problem Statement:
Create a set of APIs using Node(Express) + MongoDB(mongoose) which should implement
the following features.

- Authentication module using jwt
- Upload and save contact (csv file) through api in db using service workers.

contacts sample format:
name, phone, email, linkedin profile url

## HOSTED WEBSITE - [link](https://noapp-project.pages.dev/)

### Approach to the problem:

I have used the following technologies to built the website
- Frontend is built with **_React.js_**
- Backend is built with **_Node.js_**, **_Express.js_**
- Database - **_MongoDB_**

### Hosting
- Frontend - netlify.com
- Backend - glitch.com
- Database - MongoDB cloud

### Workflow

![image](https://user-images.githubusercontent.com/71181112/209439379-775a66c2-a0a9-45ee-a80b-89e39493f18a.png)


#### Explanaiton of the workflow

First the user visits the login page of the website, i.e., [[https://noapp-project.pages.dev](https://noapp-project.pages.dev/)] where he will be asked to login. If the user wants to signup then he can visit signup screen as well.
After successful signup, he will be pushed to the login screen where he can login and go the dashboard where he can see his details about the previously csv file uploads. If he have not uploaded any csv then he will be asked to CSV in a format given there.


## Frontend

Project Structure


![image](https://user-images.githubusercontent.com/71181112/209439620-370c0c9e-b15d-4e0e-91e4-e098dd755e46.png)


I have made 4 components namely:

![image](https://user-images.githubusercontent.com/71181112/209439660-348c6614-dcdd-4048-a62b-632c559188fa.png)

 
### signup.js
This is the signup page where users have to signup

### login.js
This is the login page where users have to login

### dashboard.js
This is the dashboard where users will see their infomation in the form of a table.
### header.js
Header is a component used to show navbar.

### Packages installed


![image](https://user-images.githubusercontent.com/71181112/209439715-9a784d61-5e8a-44a1-bfd5-d01fd81dd586.png)




## Backend

### Packages installed
![image](https://user-images.githubusercontent.com/71181112/209446510-d5b6bd72-5e95-44a0-9927-3b8e5b1b5722.png)



### Project Structure


![image](https://user-images.githubusercontent.com/71181112/209446483-fd8344b9-c0ec-4eeb-ba6e-16ddff212d59.png)


### API ENDPOINTS

## Endpoint - ('/signup')

Accepts parameters from the frontend like
- email
- password
- confirm password

then the basic validation is done using the function validateRegisterInput() which takes the request body stated above and return if there is an error or not
Now if there is an error then an error response is send back to the frontend specifying the error.

Now if validation is correct then we will move forward and check whehter the email exists on the database or not.

 We have used findOne to check if it exists or not.
 If exists then return the response with **Email already exists**
 
``` 
User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
        return res.status(400).json({ email: "Email already exists" });
    }
    else{
    // Save the user in the database
    }
```

**IF USER DOES NOT EXIST**

Then save the user in the database in the collection called **users**.

[IMPORTANT POINTS]
- Hash the password before saving in the database so that admin of the database will also not able to see the password.
- For hashing I have used **bcryptjs** library to hash the password.

## Endpoint - ('/login')    

Accepts paramters from the frontend 
- email
- password

then the basic validation is done using the function validateLoginInput() which takes the request body stated above and return if there is an error or not
Now if there is an error then an error response is send back to the frontend specifying the error.

Now if validation is correct then we will move forward and check whehter the email exists on the database or not.

```
User.findOne({ email }).then((user) => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ err: "Email/Password is wrong" });
        }
        else{
            // check whether the password is correct or not
        }
```

##### Features:
- A **JWT** token is sent if password matches which contains information like expiry time of the token as well as email (here).
- This will help users to login without even filling the details in the login page.
- They will be redirected to the '/dashboard' if the token is correct.

## Endpoint - ('/upload')    

Accepts paramters like:
- email
- CSV file

#### the email and the data of csv file is stored in the database.


## Database

### MongoDB
I have hosted my database in the mongoDB cloud.
There are two collections (tables) in my database:
- **users**
- **csvUsers**

#### Schema of Users Table


```
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

```

#### Schema of csvUsers table

```
const dataSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    linkedIn:{
        type: String,
        required: true,
    }
});
const csvSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    
    data:[dataSchema]
});
```
