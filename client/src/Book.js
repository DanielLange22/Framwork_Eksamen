import React, {Component} from 'react';

export default class Book extends Component {

    render() {
        //console.log(this.props.id)

        ///category:/id_cat/books/:id_book

        const Book = this.props.getBook(this.props.id_cat, this.props.id_book);
        console.log(this.props.id_cat)
        console.log(this.props.id_book)
        console.log(Book)

        let bookContent = <p>Loading....</p>
        if(Book) {
            bookContent =
                <div>
                    <p>Book info</p>
                    <p>Title</p>
                    <label>{Book.title}</label>
                    <p>Author</p>
                    <label>{Book.author}</label>
                    <p>Category</p>
                    <label>{Book.category}</label>
                    <p>Price</p>
                    <label>{Book.price}</label>
                    <p>name of the seller</p>
                    <label>{Book.name_seller}</label>
                    <p>Email of the seller</p>
                    <label>{Book.email_seller}</label>
                </div>
        }

        return (
            <section className="section has-background-white-bis">
                {bookContent}
            </section>
        )
    };
}