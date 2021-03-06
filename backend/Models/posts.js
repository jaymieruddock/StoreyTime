'use strict';

var connection = require('./db.js');

var Post = function(post) {
    this.post_id = post.post_id;
    this.creator_id = post.creator_id;
    this.date_created = post.date_created;
    this.title = post.title;
    this.post_text = post.post_text;
    this.inactive = post.inactive;
};

Post.createPost = function(creator_id, newPost, result)
{
    var d = new Date;
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    var date = year+ '-' + month + '-' + day + ' ' + time;
    var post_text = connection.escape(newPost.post_text );
    var title = connection.escape(newPost.title);
    connection.query("INSERT INTO `ballotBuddy`.`posts` (`creator_id`, `date_created`, `title`, `post_text`, `inactive`) VALUES (?, ?, ?, ?, ?)", [creator_id, date, title, post_text, 0],
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
    connection.query("SELECT id, firstName, lastName, title, post_text, date_created FROM `ballotBuddy`.`users` AS U JOIN (SELECT * FROM `ballotBuddy`.`posts` WHERE post_id=?) AS P ON U.id = P.creator_id", [post_id],
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
    connection.query("SELECT id, firstName, lastName, title, post_text, date_created FROM `ballotBuddy`.`users` AS U JOIN (SELECT * FROM `ballotBuddy`.`posts`) AS P ON U.id = P.creator_id WHERE P.inactive != 1 ORDER BY date_created DESC",
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

Post.myPosts = function(creator_id, result)
{
    connection.query("SELECT `creator_id` as creator_id, `title`, `post_text`, `date_created`, `inactive` as I,`post_id`, group_concat(distinct `tag_word`) from `ballotBuddy`.`posts` as P join (select tag_word, post_id as p_id from `ballotBuddy`.`tags` as ta join( select * from `ballotBuddy`.`tags_posts` ) as tp on ta.tag_id = tp.tag_id) as T on P.post_id = T.p_id WHERE creator_id = ? GROUP BY post_id", [creator_id],
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

Post.getComments = function(post_id, result) {
    connection.query("SELECT comment_id, comment_text, firstName, lastName, date_created from `ballotBuddy`.`comments` as C join (select * from users) as U on C.creator_id = U.id WHERE C.inactive != 1 AND C.post_id=?", [post_id],
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
