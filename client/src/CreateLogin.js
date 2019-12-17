import React, {Component} from 'react'
import {navigate} from "@reach/router";

export default class CreateLogin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            admin: false
        }

        this.onChangedValue = this.onChangedValue.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput = event => {
        event.preventDefault();
        this.props.createLogin(this.state.username, this.state.password, this.state.admin)
        navigate("/Login")
    }

    onChangedValue = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    onClick = event => {
        this.setState({admin: event.target.checked});
    }

//TODO ADD CHECKBOX
    render() {
        return (
            <form>
                <h1>Create User</h1>
                <p>Indtast Username</p>
                <input
                    name="username"
                    type="text"
                    value={this.state.username}
                    onChange={this.onChangedValue}
                />
                <p>Indtast Password</p>
                <input
                    name="password"
                    type="text"
                    value={this.state.password}
                    onChange={this.onChangedValue}
                />
                <input
                    type="checkbox"
                    onClick={this.onClick}
                    value={!this.state.admin}>
                </input>
                <button
                    type="button"
                    onClick={this.handleInput}
                    disabled={!this.state.username || !this.state.password}
                >
                    Create Login
                </button>
            </form>
        )
    }
}