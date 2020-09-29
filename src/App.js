import React from 'react';
//import logo from './logo.svg';

import { withAuthenticator, AmplifySignOut} from "@aws-amplify/ui-react";

import './App.css';
import Home from './Home';


function App() {
  return (
    <div className="App">            
      <AmplifySignOut/>
      <Home/>
    </div>
  );
}

export default withAuthenticator(App, true);
