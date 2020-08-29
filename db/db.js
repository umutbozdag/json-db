const fs = require("fs");
const jsonfile = require("jsonfile");
const _ = require("lodash");
const generateUUID = require("../utils");
const { Console } = require("console");

class Database {
  constructor(dbName) {
    this.dbName = dbName;
    this._data = null;

    if (!fs.existsSync(this.dbName) || !Array.isArray(this._readDB())) {
      this.createNewDatabase();
    } else {
      this._readDB();
    }
  }

  createNewDatabase() {
    jsonfile.writeFileSync(this.dbName, []);
    this._readDB();
  }

  _readDB() {
    this._data = jsonfile.readFileSync(this.dbName);
    return this._data;
  }

  _writeToDB(doc, cb) {
    jsonfile.writeFile(this.dbName, doc, (err, data) => {
      cb(err, data);
    });
  }

  removeDatabase() {
    fs.close(1, (err) => {
      if (err) console.error(err);
      else console.log("database connection closed");
    });
    fs.unlink(this.dbName, (err) => {
      if (err) console.error(err);
      else console.log("removed", this.dbName);
    });
  }

  insert(doc, cb) {
    if (_.isPlainObject(doc)) {
      if (!doc._id) {
        console.log("HERE");
        this._data.push({
          ...doc,
          _id: generateUUID(),
        });
        jsonfile.writeFile(this.dbName, this._data, (err) => {
          if (err) {
            console.log(err);
          }

          cb(err, this._data);
        });
      } else {
        this._data.push({
          ...doc,
        });
        jsonfile.writeFile(this.dbName, this._data, (err) => {
          if (err) {
            console.log(err);
          }

          cb(err, this._data);
        });
      }
    } else {
      throw new Error("Please provide an object");
    }

    // if (Array.isArray(doc)) {
    //   doc.forEach((d) => {
    //     if (d._id) {
    //       this._data.push({
    //         ...d,
    //       });
    //       jsonfile.writeFile(this.dbName, this._data, (err) => {
    //         if (err) {
    //           console.log(err);
    //         }

    //         cb(err, this._data);
    //       });
    //     } else {
    //       this._data.push({
    //         [],
    //         _id: generateUUID(),
    //       });

    //       console.log("DATA NOW", this._data);

    //       jsonfile.writeFile(this.dbName, this._data, (err) => {
    //         if (err) {
    //           console.log(err);
    //         }

    //         cb(err, this._data);
    //       });
    //     }
    //   });
    // }
  }
  /**
   *
   * @param {document} doc
   * @param {callback} cb
   */
  find(doc, cb) {
    if (!Object.keys(doc).length) {
      cb(this._data);
    } else {
      cb(_.filter(this._data, _.matches(doc)));
    }
  }

  /**
   *
   * @param {document} doc
   * @param {new document} opts
   * @param {callback} cb
   */

  findOne(doc, cb) {
    cb(_.find(this._data, doc));
  }

  // TODO: if opts obj has $set operator, find all the matching objects and update all of their value with the provided one.
  // TODO: if opts obj hasn't anything(?), find all the matching objects and REPLACE all all of them with the provided one. (check _id)
  update(doc, opts, cb) {
    if (opts.$set) {
      const matches = _.find(this._data, doc);
      console.log("matches", matches);

      _.assign(doc, opts.$set);
      console.log("assigned", _.assign(doc, opts.$set));
    } else {
      if (_.findIndex(this._data, doc) > -1) {
        this._data.splice(idx, 1, newDoc);
        jsonfile.writeFileSync(this.dbName, this._data);
        cb(this._data);
      }
    }
  }

  remove(doc, cb) {
    const idx = _.findIndex(this._data, doc);
    if (idx > -1) {
      console.log("idx", idx);
      this._data.splice(idx, 1);

      jsonfile.writeFileSync(this.dbName, this._data);
      cb(this._data);
    }
  }
}
const myDB = new Database("test.json");
// myDB.insert({ test2: "test2", _id: 50 }, (err, data) => {
//   console.log("new data", data);
// });

const myArr = [{ test4: "test4" }, { test5: "test5" }];

// myArr.forEach((x) => {
//   myDB.insert(x, (err, data) => {
//     console.log("inserted", data);
//   });
// });

myDB.find({ test3: "test3", _id: 2 }, (data) => {
  console.log("find", data);
});

myDB.findOne({ test3: "test3" }, (data) => {
  console.log("findOne", data);
});

myDB.find({}, (data) => {
  console.log("ALL DATA", data);
});

myDB.remove({ test3: "test4" }, (data) => {
  console.log("removed", data);
});

myDB.update({ _id: 1 }, { $set: { _id: 5 } }, (data) => {
  console.log("hello", data);
});
module.exports = Database;
