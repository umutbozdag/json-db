const fs = require("fs");
const jsonfile = require('jsonfile');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

class Database {
    constructor(dbName) {
        this.dbName = dbName;

        if(!fs.existsSync(this.dbName)) {
            this.createNewDatabase();
        }
    }

    createNewDatabase() {
        jsonfile.writeFile(this.dbName, [], (err) => {
            if (err) console.error(err);
        })
    }

    removeDatabase() {
        fs.close(1, (err) => {
            if(err) console.error(err);
            else console.log('database connection closed');
        });
        fs.unlink(this.dbName, (err) => {
            if (err) console.error(err);
            else console.log('removed', this.dbName);
        });
    }

    create(value, cb) {
        jsonfile.readFile(this.dbName, (err, data) => {
            if (err) {
                console.log(err);
            }

            if(!data) {
                jsonfile.writeFile(this.dbName, [], (err) => {
                    if (err) console.error(err);
                })
            }

            else {
                let id = uuidv4();
                const newData = {
                    ...value,
                    _id: id
                }
                data.push(newData);
                jsonfile.writeFile(this.dbName, data, (err) => {
                    if(err) {
                        console.log(err);
                    }

                    cb(err, newData);
                });
            }
        });
    }

    read(value, query, cb) {
        let found;
        jsonfile.readFile(this.dbName, (err, data) => {
            if (err) console.log(err);
            else if(_.isPlainObject(value)) {
                if(_.isEmpty(value)) {
                    cb(err, data);
                    return data;
                }
                else if(_.some(data, value)) {
                    found = _.filter(data, _.matches(value));

                } else {
                }
            }

       /*     else if (value === null) {
                let found = _(data)
                    .map(query)
                    .flatten()
                    .filter({ name: 'Event' })
                    .value();
                console.log('found', found);
                console.log('here', _.find(data, found));
            }*/
            else {
                throw new Error('ERROR: Please provide an object');
            }
            cb(err, found);
        });
    }



    readOne(value, query, cb) {
        let found;
        jsonfile.readFile(this.dbName, (err, data) => {
            if (err) console.log(err);

            else if(_.isPlainObject(value)) {
                if(_.some(data, value)) {
                    found = _.find(data, _.matches(value));
                    return found;
                }
            }
            else {
                found = data.find(x => x._id === value);
                return found;
            }

            cb(err, found);
        });
    }

    remove(value, query, cb) {
        jsonfile.readFile(this.dbName, (err, data) => {
            let removedDocuments;
            if (err) console.log(err);
            else if(_.isPlainObject(value)) {
                if(_.isEmpty(value)) {
                    // Remove all data if value is empty ({}) object
                    removedDocuments = _.remove(data, function(n) {
                        return true;
                    });
                    jsonfile.writeFileSync(this.dbName, data);
                }
                else {
                    removedDocuments = _.remove(data, value);
                    jsonfile.writeFileSync(this.dbName, data);
                }
            }
            cb(err, removedDocuments);
        });
    }

/*    removeById(value, cb) {
        let removedDocuments;
        jsonfile.readFile(this.dbName, (err, data) => {
            if (err) console.log(err);
            else if(_.isPlainObject(value)) {
                console.log( value['_id']);
                removedDocuments = _.remove(data, function(n) {
                    return n._id === value['_id'];
                });
                jsonfile.writeFileSync(this.dbName, data);
                return removedDocuments;
            } else {
                throw new Error("ERROR: Please provide an object like { _id: ID (ID is string) }");
            }

            cb(err, removedDocuments);
        });
    }*/

    update(document, newData) {

    }
}

const db = new Database('deneme.json', 5);
// db.createNewDatabase();

db.create({name: 'Green', lastname: "Gy"}, function(err, data) {
    console.table(data);
});


// db.read('3d783b17-cc8f-44c5-a9eb-76adada34e20');
// db.read({name: 'Umut', lastname: "Bozdağ", _id: '931ca02e-f13a-47dd-a31f-0eaecf737edc', friends: {friend1: {name: "Oguz", lastname: "Kas"}, friend2: {name: "Asko", lastname: "Seyyir"}}});
db.read({}, _, (err, data) => {
    // console.log('READ', err);
})
// db.removeDatabase();

// db.remove({name: 'Umut'});
/*db.remove({name: 'FooO'}, _, function(err, data)  {
    console.table(data);
});*/

fetch()

module.exports = Database;

