# TinyApp Project

**TinyApp** is a full stack web application built with Node and Express that allows users to shorten long URLs *(à la bit.ly)*.

## Final Product

!["Register Page"](https://github.com/Avec-em/tinyapp/blob/master/Screen%20Shot%202020-05-14%20at%2011.12.42%20PM.png)
!["/URLs"](https://github.com/Avec-em/tinyapp/blob/master/Screen%20Shot%202020-05-14%20at%2011.12.58%20PM.png)

### Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

### Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Edit the scripts section of your package.json to look like the following
```
"scripts": {
  "start": "./node_modules/.bin/nodemon -L express_server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
``` 
- From now on, start the server by running npm start :)
- Have fun :)