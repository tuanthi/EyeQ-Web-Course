import React, { Component } from 'react';
import logo from './logo.svg';
import {robots} from './robots';
import Cards from './Cards';
import Search from './Search';
import './App.css';

class App extends Component {
    constructor(){
        super()
        this.state = {
            cats: robots,
            searchRes: robots,
            searchKey: '',
        }
    }
    searchfunc = (event) =>{ //ES6 syntax to handle ${this} attribute
        this.setState({ searchKey: event.target.value,
                        searchRes: this.state.cats.filter(cats => {
                            return cats.name.toLowerCase().includes(this.state.searchKey.toLowerCase())
                        }),
                    })
        console.log(this.state.searchKey)
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Cat friends</h1>
                </header>
                <div className="search-container tc"><Search searchfunc={this.searchfunc}/></div>
                <div className="card-container"><Cards cats={this.state.searchRes}/></div>
            </div>
        );
    }
}

export default App;
