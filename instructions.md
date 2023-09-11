
### 1. Setup a New Node.js Project:

1. Create a new directory for your project using the command below. Be sure to type this in the terminal
   ```bash
   mkdir my-express-app
   cd my-express-app
   ```
   - Open the folder you just created in VSCode.
   - Right click on the folder name in VSCode and click on the option `Open in Intergrated Terminal`

2. In the intergrated terminal, initialize a new Node.js application using the command below:
   ```bash
   npm init
   ```

   - You'll be prompted to answer several questions. If unsure, just press `Enter` to choose the defaults. This command will create a `package.json` file for your project.
   - **DON'T TYPE THIS IF YOUVE ALREADY TYPED THE COMMAND ABOVE**. If you'd like to skip the questions you can use the below coimmand
   ```bash
   npm init -y
   ```

### 2. Install Express:

3. Install Express.js using npm:
   ```bash
   npm install express --save-dev
   ```

### 3. Create Your Server File:

4. Create a new file named `server.js` (or `app.js` or `index.js`, whatever you prefer) in your project directory.

   
5. Open this file in your favorite code editor and set up a basic Express server:
   
    ```javascript
    const express = require('express');
    const app = express();
    const PORT = 3000;

    // This is a get request that will print hello world on the screen
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
   ```

### 4. Start the Server:

6. Start your server with:
   ```bash
   node server.js
   ```

   - You should see the message `Server is running on http://localhost:3000` in your terminal.
   - You can visit `http://localhost:3000` in your browser and you should see the message "Hello World!".

### 5. (Optional) Install Nodemon for Development:

7. For a better development experience, you can install `nodemon`, which will automatically restart your server whenever you make changes to your files:

   ```bash
   npm install nodemon --save-dev
   ```

8. Modify your `package.json` to have the following start script, type it wither below `main` or above `author` in the package.json file:
   ```json
   "scripts": {
       "start": "nodemon server.js"
   }
   ```

9. Now, you can start your server with:
   ```bash
   npm start
   ```

   - This will use `nodemon` to start your server, and it will automatically restart whenever you make changes to your `server.js` file.

### 6. Setting Up CRUD Operations with Express:

10. Before setting up CRUD routes, install a couple of necessary packages:
    ```bash
    npm install body-parser --save-dev
    ```

    This package will help you parse incoming request bodies, a necessity for POST and PUT requests.

11. Require and configure `body-parser` in your `server.js`:

    ```javascript
    // Type this below the line that creates the port. 
    const bodyParser = require('body-parser');

    // Type this above the first request in order to configure the app before it is used in sending any requests.
    // Configure body parser to handle JSON payloads
    app.use(bodyParser.json());
    ```

12. Now, set up a mock database using a JSON file. Create a file named `database.json` in your root directory (your app folder) with the following content:

    ```json
    {
      "data": []
    }
    ```

13. Next, require the `fs` module (File System) in your `server.js` to read and write to the `database.json` file:

    ```javascript
    // Type this below the line that sets the body parsers
    // Note: all 'require' statements are always going to be at the very top of the file. 
    const fs = require('fs');
    ```

14. Implement CRUD routes:

    - **CREATE**: Save new data.
    ```javascript
    app.post('/data', (req, res) => {
        const newData = req.body;
        fs.readFile('database.json', 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to read the database.' });
            }
            const database = JSON.parse(data);
            database.data.push(newData);
            fs.writeFile('database.json', JSON.stringify(database, null, 2), err => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to write to the database.' });
                }
                res.json(newData);
            });
        });
    });
    ```

    - **READ**: Fetch all data.
    ```javascript
    app.get('/data', (req, res) => {
        fs.readFile('database.json', 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to read the database.' });
            }
            const database = JSON.parse(data);
            res.json(database.data);
        });
    });
    ```

    - **UPDATE**: Modify existing data (for simplicity, this example uses the index of the item in the array as its "ID").
    ```javascript
    app.put('/data/:id', (req, res) => {
        const id = req.params.id;
        const updatedData = req.body;
        fs.readFile('database.json', 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to read the database.' });
            }
            const database = JSON.parse(data);
            if (id >= 0 && id < database.data.length) {
                database.data[id] = updatedData;
                fs.writeFile('database.json', JSON.stringify(database, null, 2), err => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to write to the database.' });
                    }
                    res.json(updatedData);
                });
            } else {
                res.status(404).json({ error: 'Data not found.' });
            }
        });
    });
    ```

    - **DELETE**: Remove data.
    ```javascript
    app.delete('/data/:id', (req, res) => {
        const id = req.params.id;
        fs.readFile('database.json', 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to read the database.' });
            }
            const database = JSON.parse(data);
            if (id >= 0 && id < database.data.length) {
                const deletedData = database.data.splice(id, 1);
                fs.writeFile('database.json', JSON.stringify(database, null, 2), err => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to write to the database.' });
                    }
                    res.json(deletedData);
                });
            } else {
                res.status(404).json({ error: 'Data not found.' });
            }
        });
    });
    ```

- Reference (CRUD operations with Express.js): https://expressjs.com/en/guide/routing.html

### 7. Testing CRUD Operations with Postman:

15. Open Postman and open up your workspace created in the previous lesson. To test the APIs you created make sure your app is runnig in the terminal:

    - **CREATE**: 
        - Select `POST` from the dropdown, and enter `http://localhost:3000/data` in the URL bar.
        - Go to the 'Body' tab, select 'raw', and 'JSON' format.
        - Enter a JSON object and click 'Send'.
        - Check the `database.json` file in your folder to see what changed.

    - **READ**: 
        - Select `GET` from the dropdown and enter `http://localhost:3000/data`.
        - Check the `database.json` file in your folder to see what changed.

    - **UPDATE**: 
        - Select `PUT` from the dropdown, and enter `http://localhost:3000/data/[id]` where `[id]` is the index of the data you want to update.
        - Follow the same steps as 'CREATE' to input the new data.
        - Check the `database.json` file in your folder to see what changed.

    - **DELETE**: 
        - Select `DELETE` from the dropdown and enter `http://localhost:3000/data/[id]` where `[id]` is the index of the data you want to delete.
        - Check the `database.json` file in your folder to see what changed.

- Reference (Using Postman for API testing): https://learning.postman.com/docs/getting-started/introduction/

### 8. Need Assistance:

Send any questions you might have to the WhatsApp chat. Add an extra post and get request of your own. We'll review this in class.