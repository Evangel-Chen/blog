const express = require('express');
const crypto = require('crypto');
const mysql = require('./../database');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // 新加的文章展示在最前面
  var query = 'SELECT * FROM article ORDER BY articleID DESC';
  mysql.query(query, (err, rows) => {
     var articles = rows;
     articles.forEach( (ele) => {
         var year = ele.articleTime.getFullYear();
         var month = ele.articleTime.getMonth() + 1 > 10 ? ele.articleTime.getMonth() : '0' + (ele.articleTime.getMonth() + 1);
         var date = ele.articleTime.getDate() > 10 ? ele.articleTime.getDate() : '0' + ele.articleTime.getDate();
         ele.articleTime = year + '-' + month + '-' + date;
     });
     res.render(
       "index",
       {articles: articles, user:req.session.user}
     );
  });
});

/* login page */
router.get('/login', (req, res) => {
  res.render('login', { message:'', user:req.session.user });
});

/* 登录信息验证 */
router.post('/login', function(req, res) {
  var name = req.body.name;
  var password = req.body.password;
  var hash = crypto.createHash('md5');
  hash.update(password);
  password = hash.digest('hex');
  var query = 'SELECT * FROM author WHERE authorName=' + mysql.escape(name) + ' AND authorPassword=' + mysql.escape(password);
  mysql.query(query, function(err, rows) {
      if(err) {
          console.log(err);
          return;
      }
      const user = rows[0];
      if(!user) {
          res.render('login', {message:'用户名或者密码错误'});
          return;
      }
      // 查询后将用户信息添加到session中
      req.session.user = user;
      res.redirect('/');
  });
});

router.get('/articles/:articleID', function(req, res) {
  var articleID = req.params.articleID;
  var query = 'SELECT * FROM article WHERE articleID=' + mysql.escape(articleID);
  mysql.query(query, function(err, rows) {
     if(err) {
         console.log(err);
         return;
     }
     var query = 'UPDATE article SET articleClick=articleClick+1 WHERE articleID=' + mysql.escape(articleID);
     var article = rows[0];
     mysql.query(query, function(err, rows, fields) {
        if(err) {
            console.log(err)
            return;
        }
         var year = article.articleTime.getFullYear();
         var month = article.articleTime.getMonth() + 1 > 10 ? article.articleTime.getMonth() : '0' + (article.articleTime.getMonth() + 1);
         var date = article.articleTime.getDate() > 10 ? article.articleTime.getDate() : '0' + article.articleTime.getDate();
         article.articleTime = year + '-' + month + '-' + date;
         res.render('article', { article: article, user: req.session.user });
     });
  });
});

router.get('/edit', function(req, res, next) {
  var user = req.session.user;
  if(!user) {
      res.redirect('/login');
      return;
  }
 res.render('edit', { user: req.session.user });
});

router.post('/edit', function(req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var author = req.session.user.authorName;
  var query = 'INSERT article SET articleTitle=' + mysql.escape(title) + ',articleAuthor=' + mysql.escape(author) + ',articleContent=' + mysql.escape(content) + ',articleTime=CURDATE()';
  mysql.query(query, function(err, rows, fields) {
     if(err) {
         console.log(err);
         return;
     }
     res.redirect('/');
  });
});

router.get('/friends', function(req, res, next){
  res.render('friends', {user:req.session.user});
});

router.get('/about', function(req, res, next) {
 res.render('about', {user:req.session.user});
});

router.get('/logout', function(req, res, next) {
 req.session.user = null;
 res.redirect('/');
});

module.exports = router;
