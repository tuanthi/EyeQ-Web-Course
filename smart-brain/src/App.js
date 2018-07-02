import React, { Component } from 'react';
import {app, initialState, modelEyeQ, modelClarifai, modelAffex, particlesOptions} from './constants.js';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin';
import Header from './components/Header/Header';
import Register from './components/Register/Register';
import LeftPane from './components/LeftPane/LeftPane';
import RightPane from './components/RightPane/RightPane';
import Loader from './components/Loader/Loader';
import affdex from './affdex';
import './App.css';

const affdetector = new affdex.PhotoDetector();
var camdetector, sendImage;

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    // Initiate Affectiva
    let self = this;
    self.state.onLoad = true;
    affdetector.detectAllEmotions();
    affdetector.detectAllExpressions();
    affdetector.detectAllAppearance();
    affdetector.addEventListener("onInitializeSuccess", () => {
        this.setState({onLoad: false});
    });
    affdetector.addEventListener("onInitializeFailure", () => {
        alert('fail affdex');
    });
    affdetector.addEventListener("onImageResultsSuccess", (faces, image, timestamp) => {
        this.setState(Object.assign(this.state.respData.outputs[0].data, {demograph: faces}));
        this.setState({onLoad: false});
    });
    affdetector.addEventListener("onImageResultsFailure", (image, timestamp, error) => {
        alert('image fail');
        this.setState({onLoad: false});
    });
    affdetector.start();
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.publicid,
      name: data.name,
      email: data.email,
      lastlogin: data.lastlogin,
      joined: data.joined,
      token: data.token
    }})
  }

  processCamera = (on) => {
      if (!on) {
          camdetector.removeEventListener();
          camdetector.stop();
          clearInterval(sendImage);
          this.setState({respData: [], usingwcam: false});
          return;
      }
      const model = this.state.currmodel;
      const updatebbox = (div, minY='', maxY='', minX='', maxX='') => {
          if (!div) return;
          div.style.top = minY;
          div.style.bottom = maxY;
          div.style.left = minX;
          div.style.right = maxX;
      };
      const compareImage = () => {
          let imgdata = document.getElementById('face_video_canvas').toDataURL('image/jpeg');
          fetch(modelEyeQ[model].url, {
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({imagebase64: [imgdata.substring(`data:image/jpeg;base64,`.length)],
                                  type: modelEyeQ[model].type})
          })
          .then(response => response.json())
          .then(response => {
              if (this.state.usingwcam) this.setState({respData: response, errmess: ''});
          })
          .catch(err => {
              console.log(err);
              this.setState({onLoad: false});
              this.setState({errmess: 'No face detected'})
          });
      };
      this.setState({usingwcam: true, respData: []}, ()=>{
          let divRoot = document.getElementById('inputcamera');
          let firstSend = false;
          camdetector = new affdex.CameraDetector(divRoot, 460, 390, affdex.FaceDetectorMode.LARGE_FACES);
          camdetector.addEventListener("onWebcamConnectSuccess", () => {
              document.getElementById('face_video').style.display = "none";
          });
          camdetector.addEventListener("onInitializeSuccess", () => {
              document.getElementById('face_video').style.display = "block";
              document.getElementById('face_video').style.width = "460px";
              this.setState({onLoad: false});
          });
          camdetector.addEventListener("onImageResultsSuccess", (faces, image, timestamp) => {
              let box = document.getElementById('bounding-box');
              if (!faces[0]) {
                  updatebbox(box);
                  return;
              }
              let minX = 99999, minY = 99999,
                  maxX = -1, maxY = -1;
              for (const [id, pt] of Object.entries(faces[0].featurePoints)){
                  if (pt.x > maxX) maxX = pt.x;
                  if (pt.x < minX) minX = pt.x;
                  if (pt.y > maxY) maxY = pt.y;
                  if (pt.y < minY) minY = pt.y;
              };
              updatebbox(box,`${minY/image.height*100}%`,
                             `${100 - maxY/image.height*100}%`,
                             `${minX/image.width*100}%`,
                             `${100 - maxX/image.width*100}%`);
              if (!firstSend){
                  compareImage();
                  firstSend = true;
                  sendImage = setInterval(compareImage, 4000);
              }
          });
          this.setState({onLoad: true});
          camdetector.start();
      });
  }

  processImage = (model) => {
      if (!model) return;
      this.setState({onLoad: true});
      const {input, imageFile, imageUrl, user, margin} = this.state;
      let inpDetect = input['detect'],
          inpCompare = input['compare'],
          fileDetect = imageFile['detect'],
          fileCompare = imageFile['compare'];
      //----------------------------Affex model
      const runAffex = () => { // This is put in the callback function after calling backend server due to async issue
          if (modelAffex[model]){
              let image = new Image(), self = this;
              image.crossOrigin = "Anonymous";
              image.onload = function(){
                  let contxt = document.createElement('canvas').getContext('2d'),
                      w = this.naturalWidth,
                      h = this.naturalHeight;
                  contxt.canvas.width = w;
                  contxt.canvas.height = h;
                  contxt.drawImage(image, 0, 0, w, h);
                  self.setState({onLoad: true});
                  affdetector.process(contxt.getImageData(0, 0, w, h), 0);
              };
              image.src = imageUrl['detect'];
          }
      }
      //----------------------------EyeQ model
      if (modelEyeQ[model]){
          //Checking
          let imgparam = [];
          if (modelEyeQ[model].inpdisplay==='double' && (!inpDetect || !inpCompare) && (!fileDetect || !fileCompare)){
              this.setState({errmess: 'You need to input both images for this model', onLoad: false});
              return;
          }

          //Processing
          if (inpDetect) {
              imgparam = {
                  image_url: [inpDetect],
                  type: modelEyeQ[model].type,
                  margin: margin/100
              };
              if (inpCompare) imgparam.image_url.push(inpCompare);
          }
          else {
              if (fileDetect) imgparam = {
                                                imagebase64: [imageUrl['detect'].substring(`data:${fileDetect.type};base64,`.length)],
                                                type: modelEyeQ[model].type,
                                                margin: margin/100
                                            }
              if (fileCompare)
                  imgparam.imagebase64.push(imageUrl['compare'].substring(`data:${fileCompare.type};base64,`.length))
          }
          fetch(modelEyeQ[model].url, {
            method: 'post',
            headers: {'x-access-token': user.token, 'Content-Type': 'application/json'},
            body: JSON.stringify(imgparam)
          })
          .then(response => response.json())
          .then(response => {
              console.log(response);
              this.setState({respData: response, errmess: ''});
              runAffex();
              if (!modelAffex[model]) this.setState({onLoad: false});
          })
          .catch(err => {
              console.log(err);
              this.setState({onLoad: false});
              this.setState({errmess: 'Fail to load model, or no face detected'})
          });
      }
      //----------------------------Clarifai model
      else if (modelClarifai[model]){
          let image = (inpDetect) ? inpDetect
                : {base64: imageUrl['detect'].substring(`data:${fileDetect.type};base64,`.length)};
          app.models
            .predict(
              modelClarifai[model],
              image)
            .then(response => {this.setState({respData: response, onLoad: false, errmess: ''}); })
            .catch(err => {
                console.log(err);
                this.setState({errmess: 'Fail to load model...', onLoad: false})
            });
      }
  }

  onModelSelect = (model) => {
      this.setState({currmodel: model.item, respData: ''});
      let inpDetect = this.state.input['detect'];
      let inpCompare = this.state.input['compare'];
      let fileDetect = this.state.imageFile['detect'];
      let fileCompare = this.state.imageFile['compare'];
      //Clear webcam (if running)
      if (this.state.usingwcam) {
          camdetector.removeEventListener();
          camdetector.stop();
          clearInterval(sendImage);
          this.setState({respData: [], usingwcam: false});
          return;
      }
      if (inpDetect || inpCompare){
          let imageUrl = {...this.state.imageUrl};
          imageUrl['detect'] = (inpDetect) ? inpDetect : '';
          imageUrl['compare'] = (inpCompare) ? inpCompare : '';
          this.setState({imageUrl, respData: ''},
                        () => {
                            if (this.state.currmodel) this.processImage(model.item);
                        });
      }
      else if (fileDetect || fileCompare) this.processImage(model.item);
  }

  onButtonSubmit = () => {
      let inpDetect = this.state.input['detect'];
      let inpCompare = this.state.input['compare'];
      let fileDetect = this.state.imageFile['detect'];
      let fileCompare = this.state.imageFile['compare'];
      //Clear webcam (if running)
      if (this.state.usingwcam) {
          camdetector.removeEventListener();
          camdetector.stop();
          clearInterval(sendImage);
          this.setState({respData: [], usingwcam: false});
          return;
      }
      if (inpDetect || inpCompare){
          let imageUrl = {...this.state.imageUrl};
          imageUrl['detect'] = (inpDetect) ? inpDetect : ((fileDetect) ? fileDetect : '');
          imageUrl['compare'] = (inpCompare) ? inpCompare : ((fileCompare) ? fileCompare : '');
          this.setState({imageUrl, respData: ''},
                      () => {
                          if (this.state.currmodel) this.processImage(this.state.currmodel);
                      });
      }
      else if (fileDetect || fileCompare) this.processImage(this.state.currmodel);
  }

  onSliderChange = (e) => {
      this.setState({margin: e.target.value});
  }

  onInputChange = (e, type) => {
    this.setState({imageFile: {'detect': '', 'compare': ''}})
    if (type==='detect')
        this.setState(Object.assign(this.state.input, {detect: e.target.value}));
    else if (type==='compare')
        this.setState(Object.assign(this.state.input, {compare: e.target.value}));
  }

  onFileChange = (e, type) => {
      let file = e.target.files[0];
      console.log(file);
      if (!file) return;
      let reader = new FileReader();
      let imageUrl = {...this.state.imageUrl};
      let imageFile = {...this.state.imageFile};
      reader.readAsDataURL(file);
      reader.onloadend = () => {
          // console.log(reader.result);
          if (type==='detect'){
              imageFile['detect'] = file;
              imageUrl['detect'] = reader.result;
          }
          else if (type==='compare'){
              imageFile['compare'] = file;
              imageUrl['compare'] = reader.result;
          }
          this.setState({
              input: {'detect': '', 'compare': ''},
              imageFile,
              imageUrl,
              respData: ''
          });
      }
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
        this.setState({onLoad: true});
        fetch('http://210.211.119.152:2808/back/signout',{
            method: 'get',
            headers: {'x-access-token': this.state.user.token},
        })
        this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  onLoadChange = (isActive) => {
      this.setState({onLoad: isActive});
  }

  render() {
    const { isSignedIn, imageUrl, route, currmodel, respData, user, onLoad, errmess, usingwcam } = this.state;
    let inpdisplay = 'single';
    if (modelEyeQ[currmodel]) inpdisplay = modelEyeQ[currmodel].inpdisplay;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Header
            isSignedIn={isSignedIn}
            onRouteChange={this.onRouteChange}
            onLoadChange={this.onLoadChange}
            userinfo={user}
        />
        <Loader isActive = {onLoad}/>
        { route === 'home'
            ? <div id="body-container">
                <LeftPane
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit}
                    onModelSelect={this.onModelSelect}
                    onFileChange={this.onFileChange}
                    onSliderChange={this.onSliderChange}
                    onLoadChange={this.onLoadChange}
                    processCamera={this.processCamera}
                    usingwcam={usingwcam}
                    respData={respData}
                    currmodel={currmodel}
                    imageUrl={imageUrl}
                    inpdisplay={inpdisplay}
                />
                <RightPane
                    currmodel={currmodel}
                    respData={respData}
                    errmess={errmess}
                />
            </div>
          : (
             route === 'signin' || route === 'signout'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} onLoadChange={this.onLoadChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} onLoadChange={this.onLoadChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
