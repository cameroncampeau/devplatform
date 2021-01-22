# Find a Dog
This is another project I created to address one of my own needs. I was looking to adopt a dog, and wanted an easier place to keep track of the available dogs from the Toronto Humane Society shelter. The app scrapes available dogs from the Toronto Humane Society website, and allows users to filter them and favourite the ones they like. 


Note: This app was built very quickly and roughly to provide functionality first, it is not an accurate representation of my normal work. 


## Setup
The app can be started using DevPlatform with the command:
`node app.js finddog`

It can also be brought into an existing application by importing the express router from the app.js

```
const dog_app = require(./route.js);
const app = require("express")();
app.use("/finddog", dog_app);
```