'use strict';

module.exports = function(app) {

    var userController = require('../Controller/userController.js');
    var groupController = require('../Controller/groupsController.js');
    var dbManager = require('../Controller/dbController.js');
    // var pollController = require('../Controller/pollsController.js');
    //var postController = require('../Controller/postsController.js');
    
    app.route('/setupdb')
      .get(dbManager.setupdb);

    //USER 
    app.get('/', function(err, result) {
     result.status(200).send("on 0.0.0.0:3000");
    });

    app.route('/login') //DONE
      .post(userController.loginUser);
      
    app.route('/register') //DONE 
      .post(userController.createUser);

    //user home
    app.route('/user/:id')
      .get(userController.getUser);

    //update password
    app.route('/user/update/password/:id') //DONE
      .put(userController.resetPassword);

    //update names
    app.route('/user/update/firstName/:id') //DONE
      .put(userController.changeFirstName);

    app.route('/user/update/lastName/:id') //DONE
      .put(userController.changeLastName);

    //update email
    app.route('/user/update/email/:id') //DONE
      .put(userController.changeEmail);

};