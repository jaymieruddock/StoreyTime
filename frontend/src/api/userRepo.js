import axios from 'axios';

export class UserRepo {

    url = 'https://localhost:8000/';
    config = {

    };

    registerUser(user) {
        return new Promise((resolve, reject) => {
            axios.post(this.url + 'register', user, this.config)
                .then(resp => resolve(resp.data))
                .catch(resp => reject(resp));
        });
    }

    userLogin(user) {
        return new Promise((resolve, reject) => {
            axios.get(this.url + 'login', user)
                .then(resp => {
                    resolve(resp.data);
                    localStorage.setItem('email', resp.data.email);
                    localStorage.setItem('firstName', resp.data.firstName);
                    localStorage.setItem('lastName', resp.data.lastName);
                    localStorage.setItem('state', resp.data.state);
                    localStorage.setItem('user_type', resp.data.user_type);
                    localStorage.setItem('code', resp.data.code);

                })
                .catch(resp => reject(resp));
        });
    }
}