import React, { Component } from 'react';
import './Search.css';

class Search extends Component {
    render() {
        return (
            <input type="search"
                className="search-field hover-lightest-blue:focus pa2 ma3 bw1 shadow-5 w-30"
                onChange={this.props.searchfunc}>
            </input>
        );
    }
}

export default Search;
