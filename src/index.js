// Modules
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

// Global CSS
import "./assets/css/globals.css";
import './vendor/photon/css/photon.css';

// Grab all components dynamically
import { makeReduxComponents } from './components/components.js';

const { history, store, components } = makeReduxComponents()

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

const render = (Component, props = {}) => {
  ReactDOM.render(
    <AppContainer>
      <Component {...props}/>
    </AppContainer>,
    root
  );
}

// Now we can render our application into it. Main entry point is always the 'Core' component
render(components.Core, { store, history, components }, document.getElementById('root'));

// Hot Module Replacement API
if (module.hot) {
  // If an update is in one of the React components we've included, we can attempt an HMR
  // Note: we are using the only-hot so the app will NOT forcefully reload if it fails
  module.hot.accept( './components/components.js', () => {
    render(components.Core, { store, history, components }, document.getElementById('root'));
  });
}
