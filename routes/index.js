const express = require('express');
const crypto = require('crypto');
const mysql = require('./../database');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  const page = req.query.page || 1;
  const start = (page - 1) * 8;
  const end = page * 8;
  const queryCount = 'SELECT COUNT(*) AS articleNum FROM article';
  // 新加的文章展示在最前面
  const query = 'SELECT * FROM article ORDER BY articleID DESC LIMIT ' + start + ',' + end;
  mysql.query(query, (err, rows) => {
     const articles = rows;
     articles.forEach((ele) => {
         const year = ele.articleTime.getFullYear();
         const month = ele.articleTime.getMonth() + 1 > 10 ? ele.articleTime.getMonth() : '0' + (ele.articleTime.getMonth() + 1);
         const date = ele.articleTime.getDate() > 10 ? ele.articleTime.getDate() : '0' + ele.articleTime.getDate();
         ele.articleTime = year + '-' + month + '-' + date;
     });
     mysql.query(queryCount, (err, rows) => {
       const articleNum = rows[0].articleNum;
       const pageNum = Math.ceil(articleNum / 8);
       res.render( 'index', { articles: articles,
                              user:req.session.user,
                              pageNum: pageNum,
                              page: page
                            }
       );
     });

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

router.get('/modify/:articleID', (req, res, next) => {
  const articleID = req.params.articleID;
  const user = req.session.user;
  const query = 'SELECT * FROM article WHERE articleID=' + mysql.escape(articleID);
  if (!user) {
    res.redirect('/login');
    return;
  }
  mysql.query(query, (err, rows, fields) =>{
    if (err) {
      console.log(err);
      return;
    }
    const article = rows[0];
    const { articleTitle, articleContent } = article;
    console.log(articleTitle, articleContent);
    res.render('modify', { user, title: articleTitle, content: articleContent});
  });
}); 

router.post('/modify/:articleID', function(req, res, next) {
  var articleID = req.params.articleID;
  var user = req.session.user;
  var title = req.body.title;
  var content = req.body.content;
  var query = 'UPDATE article SET articleTitle=' + mysql.escape(title) + ',articleContent=' + mysql.escape(content) + 'WHERE articleID=' + mysql.escape(articleID);
  mysql.query(query, function(err, rows, fields) {
      if(err) {
          console.log(err);
          return;
      }
      res.redirect('/');
  });
});

router.get('/delete/:articleID', (req, res, next) => {
  var articleID = req.params.articleID;
  var user = req.session.user;
  var query = 'DELETE FROM article WHERE articleID=' + mysql.escape(articleID);
  if(!user) {
      res.redirect('/login');
      return;
  }
  mysql.query(query, function(err, rows, fields) {
      res.redirect('/')
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
