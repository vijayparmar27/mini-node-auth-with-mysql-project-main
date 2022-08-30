const { db } = require('../model/db');

exports.data_page = (req, res) => {
  let sql = "SELECT * FROM data";
  db.query(sql, (err, rows) => {
    if (err) {
      console.log('error in data_page')
      console.log(err)
    };
    res.render('user_index.ejs', {
      title: 'Project For Qualification',
      users: rows,
      user: req.user
    });
  });
}

exports.add = (req, res) => {

  res.render(`user_add`, {
    title: 'Project For Qualification',
    user: req.user

  });
}

exports.edit = (req, res) => {
  const userId = req.params.userId;
  let sql = 'Select * from data where id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log(err);
      console.log('error in edit data')
    }
    console.log(result[0])
    res.render('user_edit', {
      title: 'Project For Qualification',
      user: result[0],
      user: req.user
    });
  });
}

exports.delete = (req, res) => {
  const userId = req.params.userId;
  let sql = `DELETE from data where id = ${userId}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log('error in delect query');
      console.log(err)
    }
    else {
      console.log('delete successfuly')

      res.redirect(`/data_page`);
    }
  });
}

exports.save = (req, res) => {
  console.log(req.body)
  const { name, class1, email } = req.body;
  const file = req.file;
  console.log(file)
  let data = { name: name, class: class1, image: file.filename, Email: email };
  let sql = "INSERT INTO data SET ?";
  db.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect(`/data_page`);
  });
}

exports.update = (req, res) => {
  const userId = req.params.userId;
  const { name, class1, email } = req.body;
  // const userId = req.body.id;
  const file = req.file;
  if (file) {
    console.log(file)
    let sql = `update data set name=?,class=?,image=?,Email=? where id=${userId}`;
    db.query(sql, [name, class1, file.filename, email], (err, results) => {
      if (err) {
        console.log('update data error');
        console.log(err);
      }
      res.redirect('/data_page');
    });
  }
  else {
    let sql = `update data set name=?,class=?,Email=? where id=${userId}`;
    db.query(sql, [name, class1, email], (err, results) => {
      if (err) {
        console.log('update data error');
        console.log(err);
      }
      res.redirect('/data_page');
    });

  }
}