# noapp-project
A project for noapp


https://noapp-project.pages.dev/



# no-project

## This project is used to build an admission form for the Yoga Classes.

### Problem Statement:


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



### Project Structure


![image](https://user-images.githubusercontent.com/71181112/207114808-92a45eee-338b-4676-b8ef-105596630b51.png)


### API ENDPOINTS

## Endpoint - ('/register')

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

then the basic validation is done using the function validatePaymentInput() which takes the request body stated above and return if there is an error or not
Now if there is an error then an error response is send back to the frontend specifying the error.

Now if validation is correct then we will move forward and check whehter the email exists on the database or not.

##### Features:
- **completePayment() function** - This is the function where approval of payment is done. In this function, there will be a **payment gateway** (ex- razorpay gateway) from which we will confirm whether out payment is done or not. As per the problem statement, I have not implemented this.
- **Assumptions** - **Payment is always successful**
- Cases:
- Case (i) Payment is failed then return as Payment failed
- Case (ii) If the subscription of the Yoga Classes crosses the month end then set all the fields rellated to the payment of the users to null.
```
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        payment_done: false,
                        amount_paid: null,
                        days_left: 0,
                        transaction_token: null,
                        start_date: null,
                        end_date: null,
                        batch: null,
```
- Case (iii) If someone tries to repay it then it will return with **Payment already Done**.
- Case (iv) Otherwise set the database such that now the payment is done. After this Payment information is updated in the database.
```
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        payment_done: payment_done,
                        amount_paid: amount_paid,
                        days_left: days_left,
                        transaction_token: transaction_token,
                        start_date: start_date,
                        end_date: end_date,
                        batch: batch,
```


## Database

### MongoDB
I have hosted my database in the mongoDB cloud.
There are two collections (tables) in my database:
- **users**
- **memberships**

#### Schema of Users Table


```
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: Date.now
  }
```

#### Schema of memberships table

```
const memberSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  payment_done: {
    type: Boolean,
    default: false,
  },
  amount_paid: {
    type: String,
    default: null,
  },
  transaction_token: {
    type: String,
    default: null
  },
  start_date: {
    type: Date,
    default: null
  },
  end_date: {
    type: Date,
    default: null
  },
  days_left: {
    type: Number,
    default: null
  },
  phone: {
    type: Number,
    required: true
  },
  batch: {
    type: String,
    default: null
  }
```

## ER Diagram of my database


<img width="658" alt="Screenshot_20221213_000522" src="https://user-images.githubusercontent.com/71181112/207162833-0dc6d654-22c7-4b87-b82c-9bd0e44e81e9.png">



<img width="735" alt="Screenshot_20221213_000812" src="https://user-images.githubusercontent.com/71181112/207162852-875aae52-cac3-4ad3-9e57-fcdd7ae0a111.png">






