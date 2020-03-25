var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

//this is so we can delete the sqlite file on every load, so our tsets will always be fresh
const fs = require('fs');
try {
    fs.unlinkSync(DBSOURCE);
    console.error(DBSOURCE + ' reset');
} catch(err) {
    console.error(err)
}

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            createdAt text,
            updatedAt text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
            (err) => {
                if (err) {
                    // Table already created
                    console.log(err);
                }else{
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO user (name, email, password, createdAt) VALUES (?,?,?,?)';
                    db.run(insert, ["admin","admin@example.com",md5("admin123456"), new Date().toISOString()])
                    db.run(insert, ["user","user@example.com",md5("user123456"), new Date().toISOString()])
                }
            });
    }
});


module.exports = db
