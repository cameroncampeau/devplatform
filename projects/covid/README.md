# Covid Tracker
A simple app to track and visualize COVID case numbers over time. Official numbers are scraped from https://www.worldometers.info/coronavirus/


## Setup
The app can be started using DevPlatform with the command:
`node app.js covid`

It can also be brought into an existing application by importing the express router from the app.js

```
const covid_app = require(./app.js);
const app = require("express")();
app.use("/covid", covid_app);
```