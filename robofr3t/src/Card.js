import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
    render() {
        return (
            this.props.robots.map((item) => (
                <div className="card-container tc dib pa4 ma3 bw2 shadow-5 grow w-25">
                    <img alt="photos" src={`https://robohash.org/${item.id}?set=set4`}></img>
                    <h2 className="">{item.name}</h2>
                    <h4 className="">{item.email}</h4>
                </div>
            ))
        );
    }
}

export default Card;
