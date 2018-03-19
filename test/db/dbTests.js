var assert = require('assert')
var bcrypt = require('bcrypt')
var { db, addUser, verifyUser } = require('../../db/mainDb.js')

var testTeacher = ['Valerie', 'Frizzle', 'mfrizz@magic.bus', 'TheFriz']

const addFrizzle = function(){

  let hashedTeacher = testTeacher.slice()

  const salt = 10;
  return bcrypt.hash(hashedTeacher[3], salt)
    .then(hash => {
      hashedTeacher[3] = hash

      db.query('INSERT INTO teachers (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)', hashedTeacher)
    })
    .catch(err => console.log('issue with add Frizzle', err))
}


const removeFrizzle = function(){
  return db.query('DELETE FROM teachers WHERE email=$1', [testTeacher[2]])
}

exports.signUp = function() {
  describe('Sign Up', function() {
    describe('teacher', function() {


      it('should add a new teacher to the database', function(done) {
        var client

        addUser(...testTeacher, 'teacher')
        .then(()=> {
          return db.connect()
        })
        .then(newClient => {
          client = newClient
          return client.query(`SELECT * FROM teachers WHERE email=$1`, [testTeacher[2]])
        })
        .then(res => {
          if (res.rowCount) {
            done()
            // return client.query(`DELETE FROM teachers WHERE email=$1`, [testTeacher[2]])
          }
          else done('New teacher was not added to db')
        })
        .then(()=> {
          client.release()
        })
        .catch(err => {
          if (client) client.release()
          done(err)
        })
      });

      it('should should not add a teacher that already exists', function(done) {
        addUser(...testTeacher, 'teacher')
        .then(res => {
          if (res === 'User already exists') {
            done()
          } else {
            done('Did not return expected response')
          }
        })
        .catch(err => {
          done(err)
        })
        .then(()=> {
          return db.connect().then(client => client.query(`DELETE FROM teachers WHERE email=$1`, [testTeacher[2]]))
        })
      })
    });
  })
}

exports.verifyUser = function() {
  describe('Verify User', function() {
    describe('teacher', function() {

      it('should verify a user if correct credentials', function(done) {
        addFrizzle()
        .then(()=> {
          return verifyUser(testTeacher[2], testTeacher[3])
        })
        .then((res)=> {
          if (res === true) {
            done()
          } else {
            done('Failed to match credentials, did not return true')
          }
        })
        .catch(err=> {
          done(err)
        })
      })

      it('should not verify a user if wrong credentails', function(done) {
        verifyUser(testTeacher[2], 'bad pass')
        .then((res)=> {
          if (res === false) {
            done()
          } else {
            done('Did not return false')
          }
        })
        .catch(err=> {
          done(err)
        })
      })

      it('should not verify a user if user does not exist', function(done) {
        verifyUser('bad user', testTeacher[3])
        .then((res)=> {
          if (res === false) {
            done()
            removeFrizzle()
          } else {
            done('Did not return false')
            removeFrizzle()
          }
        })
        .catch(err=> {
          done(err)
          removeFrizzle()
        })
      })
    });
  })
}