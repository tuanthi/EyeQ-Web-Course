const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : 'localhost',
    user : 'postgres',
    password : 'thunder',
    database : 'Sbrain',
    port: 1521
  }
});

const app = express();
app.use(cors())
app.use(express.json());

app.get('/', (req, res)=> {
  res.send(db.users);
})

app.get('/test', (req, res)=>{
    db.select('name').from('testdb')
        .then(data => {
            console.log(data);
            res.json("this is a test");
        })
})

app.post('/test2', (req, res)=>{
    console.log(req.body);
    res.json('success');
})

app.post('/signin', (req, res) => {
  db.select('lg_usemail', 'lg_hash').from('elogin')
    .where('lg_usemail', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].lg_hash);
      if (isValid) {
        return db.select('*').from('eusers')
          .where('us_email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('WCRED')
      }
    })
    .catch(err => res.status(400).json('WCRED'))
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        lg_hash: hash,
        lg_usemail: email
      })
      .into('elogin')
      .returning('lg_usemail')
      .then(loginEmail => {
        return trx('eusers')
          .returning('*')
          .insert({
            us_email: loginEmail[0],
            us_name: name,
            us_joined: new Date()
          })
          .then(user => res.json(user[0]))
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json(err))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('eusers').where('us_id', '=', id)
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('eusers').where('us_id', '=', id)
  .increment('us_entries', 1)
  .returning('us_entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(2808, ()=> {
  console.log('app is running on port 2808');
})
