import React, { Component } from 'react';
import logo from './logo.svg';
import Cards from './Cards';
import Search from './Search';
import './App.css';

class App extends Component {
    constructor(){
        super()
        this.state = {
            cats: [],
            searchKey: '',
        }
    }
    componentDidMount(){
        setTimeout(() => {
            fetch("https://jsonplaceholder.typicode.com/users")
                .then(response => response.json())
                .then(users => this.setState({cats: users}));
            }, 3000); //Loader demonstrate
    }
    searchfunc = (event) =>{ //ES6 syntax to handle ${this} attribute
        this.setState({ searchKey: event.target.value});
    }
    render() {
        var {cats, searchKey,} = this.state;
        var searchRes = cats.filter(cats => {
            return cats.name.toLowerCase().includes(this.state.searchKey.toLowerCase())
        });
        var content = (!cats.length) ?
                    (<div className="app-load-thecube">
                    	<div className="app-load-cube app-load-c1"></div>
                    	<div className="app-load-cube app-load-c2"></div>
                    	<div className="app-load-cube app-load-c4"></div>
                    	<div className="app-load-cube app-load-c3"></div>
                    </div>) :
                    (<div className="app-content">
                        <div className="search-container tc"><Search searchfunc={this.searchfunc}/></div>
                        <div className="card-container"><Cards cats={searchRes}/></div>
                    </div>);
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Cat friends</h1>
                </header>
                {content}
            </div>
        );
    }
}

export default App;
