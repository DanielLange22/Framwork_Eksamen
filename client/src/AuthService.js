/**
 * Service class for authenticating users against an API
 * and storing JSON Web Tokens in the browser's LocalStorage.
 */
class AuthService {
    TOKEN_KEY = "token";

    constructor(auth_api_url) {
        this.auth_api_url = auth_api_url;
    }

    async login(username, password) {
        const res = await this.fetch(this.auth_api_url, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        });
        let json = await res.json();
        if (res.status === 404) {
            throw Error(json.msg);
        }

        this.setAdmin(json.admin);
        this.setToken(json.token);
        this.setUsername(username);
        return json;
    }

    API_URL = process.env.REACT_APP_API_URL;
    async createLogin(username, password, admin) {
        try {
            await this.fetch(`${this.API_URL}/users/create`, {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password,
                    admin: admin
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(response => response.json())
                .then(json => {
                    console.log("Succes creating a new user GL!");
                });
        } catch (e) {
            console.log("Login", e);
        }
    }

    async updateLogin(username, password) {
        try {
            await fetch(`${this.API_URL}/users/update`, {
                method: 'PUT',
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(response => response.json())
                .then(json => {
                    console.log("Succes updating ur user GL!");
                });
        } catch (e) {
            console.log("Login", e);
        }
    }

    loggedIn() {
        // TODO: Check if token is expired using 'jwt-decode'
        // TODO: Also, install using 'npm install jwt-decode'
        /*
        if (jwtDecode(token).exp < Date.now() / 1000) {
            // Do something to renew token
        }
         */
        return (this.getToken() !== null);
    }

    setToken(token, username) {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem("username", username);
    }

    setAdmin(admin) {
        localStorage.setItem("admin", admin);
    }

    getAdmin() {
        return localStorage.getItem("admin");
    }

    setUsername(username) {
        localStorage.setItem("username", username);
    }

    getUsername() {
        return localStorage.getItem("username");
    }

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem("username");
        localStorage.removeItem("admin");
    }

    fetch(url, options) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        });
    }
}

export default AuthService;
