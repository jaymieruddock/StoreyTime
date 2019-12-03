import axios from 'axios';

export class PostRepo {

    url = 'http://localhost:8000/';
    config = {

    };

    createPost (post) {
        return new Promise((resolve, reject) => {
            axios.post(this.url + 'user/newPost/' + localStorage.getItem('id'), post)
                .then(resp =>  resolve(resp.data))
                .catch(resp => reject(resp));
        });
    }

    addTags(post_id, tag_word) {
        return new Promise((resolve, reject) => {
            axios.put(this.url + 'user/newPost/addTags/' + localStorage.getItem('id'), {post_id, tag_word})
                .then(resp => {console.log(resp.data); resolve(resp.data)})
                .catch(resp => reject(resp));
        });
    }

    editPost (post) {
        return new Promise((resolve, reject) => {
            axios.put(this.url + 'user/editPost/' + localStorage.getItem('id'), post)
                .then(resp => resolve(resp.data))
                .catch(resp => reject(resp));
        });
    }

    deletePost(post_id){
        return new Promise((resolve, reject) => {
            axios.put(this.url + 'user/deletePost/' + localStorage.getItem('id'), post_id)
                .then(resp => resolve(resp.data))
                .catch(resp => reject(resp));
        });
    }
}