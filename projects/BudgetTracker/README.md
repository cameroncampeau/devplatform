# Budget Tracker

This was a project I created to address one of my own needs. I wanted a tool to keep track of the money I've saved for each of my savings goals. This tool allows users to do exactly that - create a savings goal and record the movement the money associated with it (deposits, withdrawls, transfers,etc).


## Setup
The app can be started using DevPlatform with the command:
`node app.js budgettracker`

It can also be brought into an existing application by importing the express router from the app.js

```
const budget_app = require(./app.js);
const app = require("express")();
app.use("/budget", budget_app);
```