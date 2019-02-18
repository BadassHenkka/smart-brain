import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import 'tachyons';

const particlesOptions={
  particles: {
     number:{
        value:150,
        density: {
           enable:true,
           value_area:800
        }
     },
     shape: {
        type: "circle",
        stroke: {
           width: 0,
           color: "#000000"
        },
        polygon: {
           nb_sides: 5
        }
     },
     color: {
        value: "#ffffff"
     },
     opacity:{
        value: 1,
        random: false,
        anim: {
           enable: false,
           speed: 1,
           opacity_min: 1,
           sync: true
        }
     },
  },
  interactivity: {
     detect_on: "window",
     events: {
        onhover: {
           enable: true,
           mode: "repulse"
        },
        resize: true
     },
     modes: {
        repulse: {
           distance: 100,
           duration: 0.4
        }
      }
  }
};

const initialState = {
   input: '',  //state for input
   imageUrl: '',  //state for the imageUrl
   box: {},
   route: 'signin',   // route state keeps track of where we are on the page
   isSignedIn: false,
   user: {
      id: '',
      name: '',
      email: '',
      password: '',
      entries: 0,
      joined: ''
   }
}

class App extends Component {
  constructor() {
   super();
   this.state = initialState;
   }

loadUser = (data) => {
   this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: data.joined
   }})
}

calculateFaceLocation = (data) => { // This function calculates the face location based on the inputs from Clarifai
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;   // this bounding box is a % of the image
   const image = document.getElementById('inputimage'); // Gets the image element from FaceRecognition
   const width = Number(image.width);
   const height = Number(image.height);
   return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
   }  // We're returning an object that'll be used to fill the box state. The object figures out the corner dots that form the box.
}

   displayFacebox = (box) => {   // this grabs the object from calculateFaceLocation
      this.setState({box: box});
   }

  onInputChange = (event) => {  // Event listener for the input change. Event.target.value gives us the value from the input.
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input});  // This will have the imageUrl updated with whatever the input is.
      fetch('https://immense-gorge-98900.herokuapp.com/imageurl', {
         method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
         input: this.state.input
         })
      })
      .then(response => response.json())
      .then(response => {
         if (response) {
            fetch('https://immense-gorge-98900.herokuapp.com/image', {
               method: 'put',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({
               id: this.state.user.id
               })
            })
            .then(response => response.json())
            .then(count => {
               this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
         }
         this.displayFacebox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
   }

  onRouteChange = (route) => {
     if (route === 'signout') {
        this.setState(initialState) 
     } else if (route === 'home') {
        this.setState({isSignedIn: true})        
     }
     this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;  // destructure is used to clean up code so I don't need to use this.state all the time
    return (
      <div className="App">
         <Particles className='particles'
           params={particlesOptions} 
         />
         <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
         { route === 'home'
            ?  <div>
                  <Logo />
                  <Rank name={this.state.user.name} entries={this.state.user.entries} />
                  <ImageLinkForm 
                     onInputChange={this.onInputChange}  // onInputChange is passed on as a prop for the ImageLinkForm component.
                     onPictureSubmit={this.onPictureSubmit} 
                  />
                  <FaceRecognition box={box} imageUrl={imageUrl} />  {/* With these I can use box and imageUrl in FaceRecognition component. */}
               </div>
            : (
               route === 'signin'
               ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
               : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
               )
         }
      </div>
    );
  }
}

export default App;
