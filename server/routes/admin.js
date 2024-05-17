const express = require('express');
const router = express.Router();
const post = require('../models/post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const adminLayout = '../views/layouts/admin';








/**
 * GET /
 * Admin - Login Page
*/
router.get('/admin', async (req, res) => {
    try {
      const locals = {
        title: "Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
      console.log(error);
    }
  }); 

  /**
 * GET /
 * Admin Dashboard
*/ 
    
  router.get('/dashboard', async (req, res) => {
    try {
      const locals = {
        title: 'Dashboard',
        description: "Simple Blog created with NodeJs, Express & MongoDb."

      }
      const data = await post.find();
      res.render('admin/dashboard', {
        locals,
        data,
        layout: adminLayout
      });
    } catch (error) {
      console.log(error);

    }
    
  });

  
  /**
 * GET /
 * Admin create new post
*/ 
    
router.get('/add-post', async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: "Simple Blog created with NodeJs, Express & MongoDb."

    }
    const data = await post.find();
    res.render('admin/add-post', {
      locals,
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);

  }
  
});

 /**
 * GET /
 * Admin create new post
*/ 
    
router.get('/edit-post/:id', async (req, res) => {
  try {

    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management Ststem",
    };
    
  const data = await post.findOne({ _id: res.params.id});
res.render('admin/edit-post',{
  locals,
  data,
  layout:adminLayout
})

  } catch (error) {
    console.log(error);

  }
  
});

 /**
 * PUT /
 * Admin create new post
*/ 
    
router.put('/edit-post/:id', async (req, res) => {
  try {
    
  await post.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    body: req.body.body,
    updatedAt: Date.now()
  });
  res.redirect(`/edit-post/${req.params.id}`);


  } catch (error) {
    console.log(error);

  }
  
});

/**
 * post /
 * Admin create new post
*/ 
    
router.post('/add-post', async (req, res) => {
  try {
    try {
      const newPost = new post({
        title: req.body.title,
        body: req.body.body
      });
      await post.create(newPost);
      res.redirect('/dashboard');
    }catch (error) {
      console.log(error);
    }
    
  } catch (error) {
    console.log(error);

  }
  
});
  

  /**
 * 
 * Check Login
*/
const authMiddleware = (req, res, next ) => {
  const token = req.cookies.token;

  if(!token) {
    return res.status(401).json( { message: 'Unauthorized'} );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}




/**
 * post /
 * Admin -  check Login 
*/
router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne( { username } );

    if(!user) {
      return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(401).json( { message: 'Invalid credentials' } );
    }

    function generateAccessToken(user) {
  const payload = {
    id: user.id,
    email: user.email
  };
  
  const secret = 'your-secret-key';
  const options = { expiresIn: '1h' };

  return jwt.sign(payload, secret, options);
}
    res.redirect('/dashboard');

  } catch (error) {
    console.log(error);
  }
});

 


  /**
 * POST /
 * Admin - Register
*/
router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      try {
        const user = await User.create({ username, password:hashedPassword });
        res.status(201).json({ message: 'User Created', user });
      } catch (error) {
        if(error.code === 11000) {
          res.status(409).json({ message: 'User already in use'});
        }
        res.status(500).json({ message: 'Internal server error'})
      }
  
    } catch (error) {
      console.log(error);
    }
  });

  /**
 * DELETE /
 * Delete post
*/ 
router.delete('/delete-post/:id', async (req, res) => {
  try {

    await post.deleteOne( { _id: req.params.id} );
    
   res.redirect('/dashboard');

  } catch (error) {
    console.log(error);

  }
  
});
/**
 * GET /
 * Admin logout
*/ 
 router.get('/logout', (req,res) => {
  res.clearCookie('token');
 // res.json({ Message: 'logout Successful.'});
  res.redirect('/');
 });


  //router.post('/admin', async (req, res) => {
    //try {
      //const { username, password } = req.body;
     
      //if(req.body.username === 'admin' && req.body.password === 'password') {
        //res.send('You are logged in.')
      //} else {
        //res.send('Wrong username or password');
      //}
 
    //} catch (error) {
      //console.log(error);
    //}
  //});








module.exports = router;