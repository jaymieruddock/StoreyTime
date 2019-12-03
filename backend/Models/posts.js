'use strict';

var connection = require('./db.js');

var Post = function(post) {
    this.post_id = post.post_id;
    this.creator_id = post.creator_id;
    this.tag_id1 = post.tag_id1;
    this.tag_id2 = post.tag_id2;
    this.tag_id3 = post.tag_id3;
    this.date_created = post.date_created;
    this.title = post.title;
    this.post_text = post.post_text;
};

Post.createPost = function(creator_id, newPost, result)
{
    var d = new Date;
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    var date = year+ '-' + month + '-' + day + ' ' + time;
    connection.query("INSERT INTO `ballotBuddy`.`posts` (`creator_id`, `date_created`, `title`, `post_text`) VALUES ('"+ creator_id +"', '"+ date +"', '"+ newPost.title +"', '"+ newPost.post_text +"');",
    function(err1, res1)
    {
        if(err1)
        {
            result(err1, null);
        }
        else
        {
            connection.query("SELECT MAX(`post_id`) FROM `ballotBuddy`.`posts` WHERE `creator_id` = ?", [creator_id],
            function(err2, res2)
            {
                if(res2.length > 0 )
                {
                    result(null, {"code":200, "post_id": res2[0]['MAX(`post_id`)'], "creator_id": creator_id});
                }
                else
                {
                    result(err2, null);
                }
            });  
        }
    });
};

Post.addTags = function(post_id, creator_id, tag_word, result)
{
    connection.query("SELECT tag_id FROM `ballotBuddy`.`tags` WHERE tag_word = ?;", [tag_word] , 
    function(err, res)
    {
        if(err)
        {
            result(err, null);
        }
        else
        {
            connection.query("INSERT INTO `ballotBuddy`.`tags_posts` (`tag_id`, `post_id`) VALUES ( '"+ res[0].tag_id +"', '"+ post_id +"');", 
            function(err1, res1)
            {
                if(err1)
                {
                    result(err1, null);
                }
                else
                {
                    result(null, {"code":200, "post_id": post_id, "id": creator_id});
                }
            });
        }
    });
};

Post.getPost = function(post_id, result)
{
    connection.query("SELECT firstName, lastName, title, post_text, date_created FROM `ballotBuddy`.`users` AS U JOIN (SELECT * FROM `ballotBuddy`.`posts` WHERE post_id=?) AS P ON U.id = P.creator_id", [post_id],
    function(err, res)
    {
        if(err)
        {
            result(err, null);
        }
        else
        {
            result(null, {"code":200, res});
        }
    });
};

Post.getPosts = function(result)
{
    connection.query("SELECT firstName, lastName, title, post_text, date_created FROM `ballotBuddy`.`users` AS U JOIN (SELECT * FROM `ballotBuddy`.`posts`) AS P ON U.id = P.creator_id ORDER BY date_created DESC",
    function(err, res)
    {
        if(err)
        {
            result(err, null);
        }
        else
        {
            result(null, {"code":200, res});
        }
    });
};

Post.editText = function(post_id, creator_id, newText, result) {
    connection.query("UPDATE `ballotBuddy`.`posts` SET post_text = ? WHERE post_id = ? AND creator_id = ?", [newText, post_id, creator_id], 
    function(err, res)
    {
        if(err)
        {
            result(err, null);
        }
        else
        {
            result(null, {"code":200, "post_id":post_id, "creator_id": creator_id, "post_text": newText});
        }
    }); 
};

Post.deletePost = function(creator_id, post_id, result) {
    connection.query("UPDATE `ballotBuddy`.`posts` SET inactive = 1 WHERE post_id = ? AND creator_id = ?", [post_id, creator_id],
    function(err, res)
    {
        if(err)
        {
            result(err, null);
        }
        else
        {
            result(null, {"code":200});
        }
    });
};

module.exports = Post;
