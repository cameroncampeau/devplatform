# Dev Platform
This is a simple set of tools I've built to allow for rapid prototyping and development of my personal projects. 

There's 3 main utilities:

**DefaultDB**: This is a basic, disk-based database. It acts as a wrapper for diskdb(https://www.npmjs.com/package/diskdb), allowing for easier usage. 

**DefaultServer**: This is a simple HTTP server module, built with ExpressJS. It offers an easy interface for projects to add their express routes to the global HTTP server. 

**PortManager**: This a simple utility to manage the available ports on the server. For projects that require their own server (HTTP or otherwise), this ensures there are no conflicts. 


## Projects
Some of the projects I've worked on are available in the projects directory. Many of these are a work-in-progress or incomplete as I start projects based on specific skills or technologies that I want to learn, and usually move on to new things once I feel I've learned them. 


#### Some highlights:
**BudgetTracker**: This was a project I created to address one of my own needs. I wanted a tool to keep track of the money I've saved for each of my savings goals. This tool allows users to do exactly that - create a savings goal and record the movement of the money associated with it. 
- Included: VueJS, Express 


**COVID Tracker**: This was an app I designed to track COVID case numbers. My goal with this project was apply my knowledge of regression analsyis to a real-life scenario. I was also interested to do more work with web scraping, and decided to retrieve official numbers by scraping available resources. 
- Included: Cheerio, Express, ChartJS

**Find Dog**: This is another project I created to address one of my own needs. I was looking to adopt a dog, and wanted an easier place to keep track of the available dogs from the Toronto Humane Society shelter. The app scrapes available dogs from the Toronto Humane Society website, and allows users to filter them and favourite the ones they like. This app was built very quickly and roughly to provide functionality first, it is not an accurate representation of my normal work. 

**ImageGen**: This was a project inspired by Github's randomized avatars. Its a simple module that can be used to generate a random 20x20 pixel image and display it on an HTML5 canvas. It relies on the Stanford Javascript Crypto Library to generate random bytes. 
- Included: HTML5 Canvas, Stanford Javascript Crypto Library (SJCL)


**File Explorer**: This was an app I built to get more experience working with filesystems. It allows users to browse through the server filesystem in a web interface.
- Included: Express, Node Filesystem, VueJS 
- Note: This app is NOT secure. It was built only as a POC and learning opportunity. 


**Music Download**: I designed this app to explore the functionality of ffmpeg, a library for converting video files to audio. In this app, I integrated with the Youtube API to allow users to download videos as MP3s given a video URL. 
- Included: VueJS, ffmpeg, Youtube API



