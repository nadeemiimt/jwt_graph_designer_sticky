// https://www.techiediaries.com/fake-api-jwt-json-server/
// run: npm run start-auth

const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./database.json')
userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

maindb = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'))

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload) {
  console.log("Create token payload:" + payload.roles);
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

// Verify the token 
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

// Check if the user exists in database
function isAuthenticated({ username, password }) {
  return userdb.users.findIndex(user => user.username === username && user.password === password) !== -1
}

// Check if the user exists in database
function getUser({ username, password }) {
  return userdb.users[userdb.users.findIndex(user => user.username === username && user.password === password)];
}

// Get all users
function getAllUsers() {
  return userdb.users;
}

// Get all products
function getAllProducts() {
  return maindb.products;
}

// Get all orders
function getAllOrders() {
  return JSON.parse(fs.readFileSync('./db.json', 'UTF-8')).orderdata;
}

// Get all stores
function getAllStores() {
  return maindb.storedata;
}

// Get all notes
function getAllNotes() {
  return JSON.parse(fs.readFileSync('./db.json', 'UTF-8')).notes;
}

// Register New User
server.post('/api/auth/register', (req, res) => {
  console.log("register endpoint called; request body:");
  console.log(req.body);
  const { username, password, roles } = req.body;

  if (isAuthenticated({ username, password }) === true) {
    const status = 401;
    const message = 'UserName and Password already exist';
    res.status(status).json({ status, message });
    return
  }

  fs.readFile("./users.json", (err, data) => {
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({ status, message })
      return
    };

    // Get current users data
    var data = JSON.parse(data.toString());

    // Get the id of last user
    var last_item_id = data.users[data.users.length - 1].id;

    //Add new user
    data.users.push({ id: last_item_id + 1, username: username, password: password, roles: roles }); //add some data
    var writeData = fs.writeFile("./users.json", JSON.stringify(data, null, 2), (err, result) => {  // WRITE
      if (err) {
        const status = 401
        const message = err
        res.status(status).json({ status, message })
        return
      }
    });
  });

  // refresh data in memory
  userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

  // Create token for new user
  const access_token = createToken({ username, password, roles })
  console.log("Access Token:" + access_token);
  res.status(200).json({ access_token })
})

// Login to one of the users from ./users.json
server.post('/api/auth/signin', (req, res) => {
  console.log("login endpoint called; request body:");
  console.log(req.body);
  const { username, password } = req.body;
  if (isAuthenticated({ username, password }) === false) {
    const status = 401
    const message = 'Incorrect username or password'
    res.status(status).json({ status, message })
    return
  }
  const user = getUser({ username, password });
  const roles = user.roles;
  const access_token = createToken({ username, password, roles })
  console.log("Access Token:" + access_token);
  res.status(200).json({ access_token, "user": user })
})

server.get('/api/users', (req, res) => {
  console.log("users endpoint called;");
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Access token not provided'
      res.status(status).json({ status, message })
      return
    }
    // ok

  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({ status, message })
  }

  const users = getAllUsers();
  users.forEach(element => {
    element.password = '**********';
  });

  const access_token = req.headers.authorization.split(' ')[1];
  console.log("Access Token:" + access_token);
  res.status(200).json({ access_token, "users": users })
})

server.get('/api/products', (req, res) => {
  console.log("users endpoint called;");
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Access token not provided'
      res.status(status).json({ status, message })
      return
    }
    // ok

  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({ status, message })
  }

  const products = getAllProducts();
  const access_token = req.headers.authorization.split(' ')[1];
  console.log("Access Token:" + access_token);
  res.status(200).json({ access_token, "products": products })
})

server.get('/api/store', (req, res) => {
  console.log("order called;");
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Access token not provided'
      res.status(status).json({ status, message })
      return
    }
    // ok

  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({ status, message })
  }

  const stores = getAllStores();

  // const access_token = req.headers.authorization.split(' ')[1];
  // console.log("Access Token:" + access_token);
  res.status(200).json({ "stores": stores })
})

server.post('/api/order', (req, res) => {
  console.log("order called;");
  const { offset, pageSize, active, direction } = req.body;
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Access token not provided'
      res.status(status).json({ status, message })
      return
    }
    // ok

  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({ status, message })
  }

  const data = getAllOrders().sort((a, b) => {
    const isAsc = direction === 'asc';
    switch (active) {
      case 'name': return compare(a.name, b.name, isAsc);
      case 'id': return compare(+a.id, +b.id, isAsc);
      case 'orderTotal': return compare(+a.orderTotal, +b.orderTotal, isAsc);
      case 'date': return compare(a.date, b.date, isAsc);
      case 'status': return compare(a.status, b.status, isAsc);
      case 'paymentMode': return compare(a.paymentMode, b.paymentMode, isAsc);
      default: {
        if (direction == "") {
          return compare(+a.id, +b.id, true);
        }
        return 0;
      };
    }
  });

  var result = data.splice(offset, pageSize);

  // const access_token = req.headers.authorization.split(' ')[1];
  // console.log("Access Token:" + access_token);
  res.status(200).json({ "orders": result })
})

server.get('/api/notes', (req, res) => {
  console.log("notes get called;");
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Access token not provided'
      res.status(status).json({ status, message })
      return
    }
    // ok

  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({ status, message })
  }

  const notes = getAllNotes();

  // const access_token = req.headers.authorization.split(' ')[1];
  // console.log("Access Token:" + access_token);
  res.status(200).json({ "notes": notes })
})

server.post('/api/notes', (req, res) => {
  const { content } = req.body;
  console.log("notes get called;");
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Access token not provided'
      res.status(status).json({ status, message })
      return
    }
    // ok

  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({ status, message })
  }

  fs.readFile("./db.json", (err, data) => {
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({ status, message })
      return
    };

    // Get current notes data
    var data = JSON.parse(data.toString());

    // Get the id of last note
    var last_note_id = data.notes[data.notes.length - 1]?.id ?? 0;

    //Add new user
    data.notes.push({ id: last_note_id + 1, content: content }); //add some data
    var writeData = fs.writeFile("./db.json", JSON.stringify(data, null, 2), (err, result) => {  // WRITE
      if (err) {
        const status = 500
        const message = err
        res.status(status).json({ status, message })
        return
      }

      // refresh data in memory
      maindb = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'))

      // const access_token = req.headers.authorization.split(' ')[1];
      // console.log("Access Token:" + access_token);
      res.status(201).json({ "notes": maindb.notes })
    });
  });
})

server.put('/api/notes', (req, res) => {
  const { id, content } = req.body;
  console.log("notes get called;");
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Access token not provided'
      res.status(status).json({ status, message })
      return
    }
    // ok

  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({ status, message })
  }

  fs.readFile("./db.json", (err, data) => {
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({ status, message })
      return
    };

    // Get current notes data
    var data = JSON.parse(data.toString());

    // Get the id of last user
    var note_id = data.notes.filter(x => x.id == id)[0]?.id;

    if (note_id) {

      var foundIndex = data.notes.findIndex(x => x.id == id);
      data.notes[foundIndex].content = content;

      var writeData = fs.writeFile("./db.json", JSON.stringify(data, null, 2), (err, result) => {  // WRITE
        if (err) {
          const status = 500
          const message = err
          res.status(status).json({ status, message })
          return
        }

        // refresh data in memory
        maindb = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'))

        res.status(201).json({ "notes": maindb.notes })
      });
    }
    else {
      const status = 404
      const message = "record not found"
      res.status(status).json({ status, message })
    }
  });
})

server.delete('/api/notes/', (req, res) => {
  console.log("notes delete called;");
  console.log("notes delete query;", req.query);
  console.log("notes delete query value;", req.query['id']);
  var id  = req.query['id'];
  console.log("notes delete id;", id);
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Access token not provided'
      res.status(status).json({ status, message })
      return
    }
    // ok

  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({ status, message })
  }

  fs.readFile("./db.json", (err, data) => {
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({ status, message })
      return
    };

    // Get current users data
    var data = JSON.parse(data.toString());

    // Get the id of last user
    var note = data.notes.find(x => x.id == id);
    console.log("filter data",note)
    var note_id = note?.id;

    if (note_id) {
      // remove data
      data.notes = data.notes.filter(x => x.id != id);

      for (let index = 0; index < data.notes.length; index++) {
        data.notes[index].id = index + 1;
      }

      var writeData = fs.writeFile("./db.json", JSON.stringify(data, null, 2), (err, result) => {  // WRITE
        if (err) {
          const status = 500
          const message = err
          res.status(status).json({ status, message })
          return
        }
        // refresh data in memory
        maindb = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'))

        res.status(201).json({ "notes": maindb.notes })
      });
    }
    else {
      const status = 404
      const message = "record not found"
      res.status(status).json({ status, message })
    }
  });
})

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

server.get('/api/ordercount', (req, res) => {
  console.log("order called;");
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Access token not provided'
      res.status(status).json({ status, message })
      return
    }
    // ok

  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({ status, message })
  }

  const ordersCount = getAllOrders().length;

  // const access_token = req.headers.authorization.split(' ')[1];
  // console.log("Access Token:" + access_token);
  res.status(200).json({ "ordercount": ordersCount })
})

server.use(/^(?!\/api).*$/, (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Access token not provided'
      res.status(status).json({ status, message })
      return
    }
    next()
  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({ status, message })
  }
})

server.use(router)

server.listen(8000, () => {
  console.log('Run Auth API Server')
})