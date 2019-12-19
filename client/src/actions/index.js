import AuthService from "../AuthService";
import { navigate } from "@reach/router"

const API_URL = process.env.REACT_APP_API_URL;
const Auth = new AuthService(`${API_URL}/users/authenticate`);

/******************************************************
  Actions for Notifications
 ******************************************************/
export const showAlert = (title, text, level) => ({
    type: 'SHOW_ALERT',
    title: title,
    text: text,
    level: level
});

export const showAndHideAlert = (title, text, level, delay = 10000) => async function (dispatch) {
    console.log("Delay of " + delay);
    dispatch(showAlert(title, text, level));
    setTimeout(_ => dispatch(hideAlert()), delay);
};

export const hideAlert = (title, text) => ({
    type: 'HIDE_ALERT',
});


/******************************************************
  Actions for User credentials and Login / logout
 ******************************************************/
export const addUserCredentials = (username, admin) => ({
    type: 'ADD_USER_CRED',
    username: username,
    admin: admin
});

export const removeUserCredentials = (username) => ({
    type: 'REMOVE_USER_CRED'
});

export const login = (username, password) => async function (dispatch) {
    try {
        await Auth.login(username, password).then(json => {
            dispatch(addUserCredentials(username, json.admin));
        });
        navigate("/"); // Front page
    } catch(e) {
        dispatch(showAndHideAlert("Login Failed", e.message, "error"));
    }
};

export const logout = _ => async function (dispatch) {
    Auth.logout();
    dispatch(removeUserCredentials());
    navigate("/") // Front page
};

/******************************************************
  Actions for handling category and books.
 ******************************************************/
export const replaceCategory = category => ({
    type: 'UPDATE',
    category: category
});

export const loadCategory = _ => async function (dispatch) {
    try {
        const url = `${API_URL}/category`;
        const response = await Auth.fetch(url);
        const data = await response.json();

        dispatch(replaceCategory(data));
    } catch (e) {
        console.error(e);
        dispatch(showAndHideAlert("Error loading category", e.message, "error"));
    }
};

//Til at loade ved refresh af side
export const loadUser = _ => async function (dispatch) {
    try {
        console.log(Auth.getAdmin())
        if(Auth.getUsername() && Auth.getToken()) {
            dispatch(addUserCredentials(Auth.getUsername(), Auth.getAdmin() === 'true'));
        }
    } catch (e) {
        dispatch(showAndHideAlert("Error loading user", e.message, "error"));
    }
};

export const postCategory = text => async function(dispatch) {
    if (text === "") return;
    try {
        const newCategory = { text: text };
        const response = await Auth.fetch(`${API_URL}/category`, {
            method: "POST",
            body: JSON.stringify(newCategory)
        });
        if (response.status === 401) {
            let json = await response.json();
            dispatch(showAndHideAlert("Login", "You need to login to post a Category! " + json.msg !== undefined ? ("And:" + json.msg) : "", "alert"));
        } else if(response.status === 400) {
            let json = await response.json();
            dispatch(showAndHideAlert("Information", json.msg, "alert"));
        } else {
            await response.json();
            dispatch(showAndHideAlert("PostCategory", "You have posted a new category", "alert"));
            dispatch(loadCategory());
        }
    } catch (e) {
        dispatch(showAndHideAlert("Send category error", e.message, "error"));
        console.error(e);
    }
};

export const deleteCategory = id => async function(dispatch) {
    if (id === "") return;
    try {
        const response = await Auth.fetch(`${API_URL}/category/delete/`+id, {
            method: "DELETE",
        });
        if (response.status === 401) {
            let json = await response.json();
            dispatch(showAndHideAlert("Login", "You need to login to delete a Category! " + json.msg !== undefined ? ("And:" + json.msg) : "", "alert"));
        } else {
            await response.json();
            dispatch(showAndHideAlert("DeleteCategory", "You have deleted ur category", "alert"));
            dispatch(loadCategory());
        }
    } catch (e) {
        dispatch(showAndHideAlert("Delete category error", e.message, "error"));
        console.error(e);
    }
};

export const postBook = (category_id, title, author, category, price, name_seller, email_seller) => async function(dispatch) {
    if (title === "") return;
    try {
        const response = await Auth.fetch(`${API_URL}/category/books`, {
            method: "POST",
            body: JSON.stringify({
                id: category_id,
                title: title,
                author: author,
                category: category,
                price: price,
                name_seller: name_seller,
                email_seller: email_seller
            })
        });

        if (response.status === 401) {
            dispatch(showAndHideAlert("Login", "You need to login to post a book!", "alert"));
            await navigate("/login");
        } else if(response.status === 400) {
            let json = await response.json();
            dispatch(showAndHideAlert("Information", json.msg, "alert"));
        } else {
            await response.json();
            dispatch(showAndHideAlert("PostBook", "You have posted a new book", "alert"));
            dispatch(loadCategory());
            await navigate("/");
        }
    } catch (e) {
        dispatch(showAndHideAlert("Give book error", e.message, "error"));
        console.error(e);
    }
};

export const deleteBook = (id, book_id) => async function(dispatch) {
    if (id === "" || book_id === "") return;
    try {
        const response = await Auth.fetch(`${API_URL}/category/${id}/books`, {
            method: "DELETE",
            body: JSON.stringify({id: book_id})
        });

        if (response.status === 401) {
            let json = await response.json();
            dispatch(showAndHideAlert("Login", "You need to login to delete a Book! " + json.msg !== undefined ? ("And:" + json.msg) : "", "alert"));
            await navigate("/login");
        } else {
            await response.json();
            dispatch(showAndHideAlert("DeleteBook", "You have deleted a book", "alert"));
            dispatch(loadCategory());
        }
    } catch (e) {
        dispatch(showAndHideAlert("Give book error", e.message, "error"));
        console.error(e);
    }
};

export const createLogin = (username, password, admin) => async function(dispatch) {
    try {
        await Auth.createLogin(username, password, admin);
        dispatch(showAndHideAlert("Create", "Succes", "alert"));
        navigate("/"); // Front page
    } catch(e) {
        dispatch(showAndHideAlert("Login Failed", e.message, "error"));
    }
};

export const updateLogin = (username, password) => async function(dispatch) {
    try {
        await Auth.updateLogin(username, password);
        dispatch(showAndHideAlert("Create", "Succes", "alert"));
        navigate("/"); // Front page
    } catch(e) {
        dispatch(showAndHideAlert("Login Failed", e.message, "error"));
    }
};





