import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin';
import Header from './components/Header/Header';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import LeftPane from './components/LeftPane/LeftPane';
import RightPane from './components/RightPane/RightPane';
import './App.css';

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
 apiKey: 'e58d1f6ee59945c4a4717976f7a3e8ed'
});
const modelMap = {'General': Clarifai.GENERAL_MODEL,
                'Food': Clarifai.FOOD_MODEL,
                'Color': Clarifai.COLOR_MODEL,
                'Face': Clarifai.FACE_DETECT_MODEL,
                'Travel': Clarifai.TRAVEL_MODEL,
                'Demographics': Clarifai.DEMOGRAPHICS_MODEL};
const particlesOptions = {
    "particles": {
      "number": {
        "value": 160,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 1,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 4,
          "size_min": 0.3,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 600
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "bubble"
        },
        "onclick": {
          "enable": false,
          "mode": "bubble"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 109.63042366068159,
          "size": 0,
          "duration": 2,
          "opacity": 0,
          "speed": 3
        },
        "repulse": {
          "distance": 400,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: 'https://i.ytimg.com/vi/mJuHASJwmsA/maxresdefault.jpg',
      imageUrl: 'https://i.ytimg.com/vi/mJuHASJwmsA/maxresdefault.jpg',
      box: {},
      route: 'home',
      isSignedIn: false,
      currmodel: 'Face',
      respData: [],
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  onModelSelect = (model) => {
      this.setState({currmodel: model.item});
      this.setState({imageUrl: this.state.input});
      console.log(this.state.currmodel);
      app.models
        .predict(
          modelMap[model.item],
          this.state.input)
        .then(response => { this.setState({respData: response}); })
        .catch(err => console.log(err));
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        modelMap[this.state.currmodel],
        this.state.input)
      .then(response => {
        // if (response) {
        //   fetch('http://localhost:3000/image', {
        //     method: 'put',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({
        //       id: this.state.user.id
        //     })
        //   })
        //     .then(response => response.json())
        //     .then(count => {
        //       this.setState(Object.assign(this.state.user, { entries: count}))
        //     })
        //
        // }
        this.setState({respData: response});
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box, currmodel, respData } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Header
            isSignedIn={isSignedIn}
            onRouteChange={this.onRouteChange}
        />
        { route === 'home'
            ? <div className="body-container">
                <LeftPane
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit}
                    onModelSelect={this.onModelSelect}
                    respData={respData}
                    currmodel={currmodel}
                    imageUrl={imageUrl}
                />
                <RightPane currmodel={currmodel} respData={respData}/>
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
