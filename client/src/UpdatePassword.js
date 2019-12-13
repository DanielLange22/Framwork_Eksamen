import React, {Component} from 'react'
import {navigate} from "@reach/router";

export default class UpdatePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }
        this.onChangedValue = this.onChangedValue.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput = event => {
        event.preventDefault();
        this.props.updatepassword(this.state.username, this.state.password)
        navigate("/")
    }

    onChangedValue = event => {
        this.setState({[event.target.name]: event.target.value});
    };

//TODO ADD CHECKBOX
    render() {
        return (
            <form>
                <h1>Update af Password</h1>
                <p>Indtast Username</p>
                <input
                    name="username"
                    type="text"
                    value={this.state.username}
                    onChange={this.onChangedValue}
                />
                <p>Indtast nye Password</p>
                <input
                    name="password"
                    type="text"
                    value={this.state.password}
                    onChange={this.onChangedValue}
                />
                <button
                    type="button"
                    onClick={this.handleInput}
                    disabled={!this.state.username || !this.state.password}
                >
                    Update
                </button>
            </form>
        )
    }
}