var express = require('express');
var router = express.Router();

// GET page model 
var Page = require('../models/page');

/* GET pages index. */
router.get('/', function(req, res) {
Page.find({}).sort({sorting: 1}).exec(function(err, pages) {
  res.render('admin/pages', {
    pages: pages
    });
  });
});

/* GET pages index. */
router.get('/add-page', function(req, res) {
  var title = "";
  var slug = "";
  var content = "";
  
  res.render('admin/add_page', {
      title: title,
      slug: slug,
      content: content 
  });
});

/* POST add page. */
router.post('/add-page', function(req, res) {

  req.checkBody('title', 'Title must have value.').notEmpty();
  req.checkBody('content', 'Content must have value.').notEmpty();
  
  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
  var content = req.body.content;

  var errors = req.validationErrors();

  if (errors) {
    
    res.render('admin/add_page', {
        errors: errors,
        title: title,
        slug: slug,
        content: content 
    });
  } else {
    Page.findOne({slug: slug}, function (err, page) {
        if (page) {
          req.flash('danger', 'Page slug exists, choose another.');
          
    res.render('admin/add_page', {
      title: title,
      slug: slug,
      content: content 
  });
        } else {
          var page = new Page ( {
            title: title,
            slug: slug,
            content: content,
            sorting: 100
          });
          page.save(function(err) {
            if (err) return console.log(err);

            req.flash('success', 'Page added!');
            res.redirect('/admin/pages');
          });
        }
    });
  }

});

/* POST reorder pages*/
router.post('/reorder-pages', function(req, res) {
   var ids = req.body['id[]'];

   var count = 0;

   for (var i = 0; i < ids.length; i++) {
     var id = ids[i];
     count++;

     (function(count) {

     
     Page.findById(id, function(err, page) {
        page.sorting = count;
        page.save(function(err) {
          if (err) 
             return console.log(err)
        });
     });
    })(count);
   }
  });

  /* GET edit page */
router.get('/edit-page/:slug', function(req, res) {
    Page.findOne({slug: req.params.slug}, function (err, page) {
        if (err) return console.log(err);

        res.render('admin/edit_page', {
          title: page.title,
          slug: page.slug,
          content: page.content,
          id: page._id
      });
    });
});

/* POST edit page. */
router.post('/edit-page/:slug', function(req, res) {

  req.checkBody('title', 'Title must have value.').notEmpty();
  req.checkBody('content', 'Content must have value.').notEmpty();
  
  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
  var content = req.body.content;
  var id = req.body.id;

  var errors = req.validationErrors();

  if (errors) {
    
    res.render('admin/edit_page', {
        errors: errors,
        title: title,
        slug: slug,
        content: content,
        id: id
    });
  } else {
    Page.findOne({slug: slug, _id:{'$ne':id}}, function (err, page) {
        if (page) {
          req.flash('danger', 'Page slug exists, choose another.');
          
    res.render('admin/edit_page', {
      title: title,
      slug: slug,
      content: content,
      id: id
  });
        } else {
          
          Page.findById(id, function(err, page) {
            if (err) return console.log(err);
            page.title = title;
            page.slug = slug;
            page.conent = content;
            
            page.save(function(err) {
              if (err) return console.log(err);
  
              req.flash('success', 'Page added!');
              res.redirect('/admin/pages/edit-page/'+page.slug);
            });

          });
         
        }
    });
  }

});

module.exports = router;