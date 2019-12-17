import React, {Component} from 'react';
import {navigate} from "@reach/router";

export default class PostANewBook extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: "",
            author: "",
            category: "",
            price: "",
            name_seller: "",
            email_seller: "",
        };

        this.handleInput = this.handleInput.bind(this);
        this.onChangedValue = this.onChangedValue.bind(this);
        this.selectSubmit = this.selectSubmit.bind(this);
    }

    handleInput = event => {
        event.preventDefault();
        this.props.onPostAnswer(
            this.state.category,
            this.state.title,
            this.state.author,
            this.state.category,
            this.state.price,
            this.state.name_seller,
            this.state.email_seller
        );

        this.setState({
            //answer: "",
            title: "",
            author: "",
            category: "",
            price: "",
            name_seller: "",
            email_seller: "",
        });

        navigate("/")
    }

    onChangedValue = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    //Check if it works....
    selectSubmit = e => {
        const { value } = e.target;
        this.setState({category: value})
    };

    render() {
        return (
            <form>
                <h1>Create A New Book For Sale</h1>
                <p>Enter the title</p>
                <input
                    name="title"
                    type="text"
                    value={this.state.title}
                    onChange={this.onChangedValue}
                />
                <p>Enter the author</p>
                <input
                    name="author"
                    type="text"
                    value={this.state.author}
                    onChange={this.onChangedValue}
                />
                <p>Enter the category</p>
                <select onChange={this.selectSubmit}>
                    <option key={0} value={0}>Pick a Category</option>)}
                    {this.props.category.map(category =>
                    <option key={category._id} value={category._id}>{category.text}</option>)}
                </select>
                <p>Enter the price</p>
                <input
                    name="price"
                    type="text"
                    value={this.state.price}
                    onChange={this.onChangedValue}
                />
                <p>Enter the name of the seller</p>
                <input
                    name="name_seller"
                    type="text"
                    value={this.state.name_seller}
                    onChange={this.onChangedValue}
                />
                <p>Enter the email of the seller</p>
                <input
                    name="email_seller"
                    type="text"
                    value={this.state.email_seller}
                    onChange={this.onChangedValue}
                />

                <button
                    type="button"
                    onClick={this.handleInput}
                    disabled={
                        !this.state.title ||
                        !this.state.author ||
                        !this.state.category ||
                        !this.state.price ||
                        !this.state.name_seller ||
                        !this.state.email_seller
                    }
                >
                    Create new sale
                </button>
            </form>
        )
    };
}