const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true,
  }
});

const app = express();
app.use(cors())
app.use(express.json());

app.get('/', (req, res)=> {
  res.send('server running on '+process.env.PORT+' '+process.env.DATABASE_URL);
})

app.post('/signin', (req, res) => {
    if (!req.body.email || !req.body.password)
        return res.status(400).json({"errmess": "Invalid email or password!"});
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
          .catch(err => res.status(400).json({"errmess":"unable to get user"}))
      } else {
        res.status(400).json({"errmess": "Invalid email or password!"})
      }
    })
    .catch(err => res.status(400).json({"errmess": "Invalid email or password!"}))
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  if (!email || !name || !password)
    return res.status(400).json('EMPTY');
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
    .catch(err => res.status(400).json({"errmess": "This email has been already used!"}))
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

app.listen(process.env.PORT || 2808, ()=> {
  console.log(`app is running on port ${process.env.PORT}`);
})
