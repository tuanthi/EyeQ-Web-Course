import React, { Component } from 'react';
import './Cards.css';

class Cards extends Component {
    render() {
        return (
            this.props.cats.map((item) => (
                <div key={item.id} className="card tc dib pa4 ma3 bw2 shadow-5 grow">
                    <img className="card-photo" alt="photos" src={`https://robohash.org/${item.id}?set=set4`}></img>
                    <h2 className="card-name">{item.name}</h2>
                    <h4 className="card-email">{item.email}</h4>
                </div>
            ))
        );
    }
}

export default Cards;
