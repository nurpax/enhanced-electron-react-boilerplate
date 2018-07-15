import electron from 'electron';

import { createHashHistory } from 'history';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger'

// This grabs all 'component.js' files in subdirectories under /components/
const allComponents = require.context('./', true, /component\.js$/);

// Grab the redux reducer function from the components's 'component' file, as well as the component itself
let reducers = {};
let components = {};
allComponents.keys().forEach( ( path ) => {
  let name = path.split('/')[1];
  let thisComponent = allComponents( path );
  if ( !thisComponent.component ) {
    console.warn(`Component "${name}" is in an invalid format, ignoring. Found at: "${path}"`);
  }
  components[ name ] = thisComponent.component;
  if ( thisComponent.reducer ) {
    reducers[ name ] = thisComponent.reducer;
  }
} );

// Compile reducers
reducers = combineReducers( reducers );

// Start history
const makeHistory = () => createHashHistory({
  // Here we override prompt to use the native electron dialog module, this lets us override the message box title
  getUserConfirmation: (message, callback) => {
    electron.remote.dialog.showMessageBox(
      {
        title: 'Confirm Navigation',
        type: 'question',
        buttons: ['Yes', 'No'],
        message
      },
      (clickedIdx) => {
        if ( clickedIdx === 0 ) {
          callback( true );
        } else {
          callback( false );
        }
      }
    )
  }
});

// Generate store
const makeStore = (history) => {
  // Merge middlewares
  let middlewares = [
    routerMiddleware(history)
  ];

  // Development adds logging, must be last
  if ( process.env.NODE_ENV !== "production") {
    middlewares.push(createLogger({
      // Change this configuration to your liking
      duration: true, collapsed: true
    }));
  }

  return createStore(
    connectRouter(history)(reducers),
    applyMiddleware(...middlewares)
  );
}

const makeReduxComponents = () => {
  const history = makeHistory()
  const store = makeStore(history)
  return { components, history, store }
}

// Export all the separate modules
export {
  makeReduxComponents
};
