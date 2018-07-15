import React, { Component, PureComponent } from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import styles from './component.less';

class Core extends PureComponent {
  render () {
    const { components } = this.props
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter history={this.props.history}>
          <div className="window">
            <div className="window-content">
              <div className="pane-group">
                <div className="pane-sm sidebar"><components.Menu /></div>
                <div className="pane padded">
                  <AppRouter components={components} />
                </div>
              </div>
            </div>
            <components.Footer />
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

const AppRouter = (props) => {
  const { components } = props
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/example" component={components.Example} />
    </Switch>
  );
}

const Home = () => {
  return (
    <div>
      <h1>Hello, Electron!</h1>
      <p>I hope you enjoy using enhanced-electron-react-boilerplate to start your dev off right!</p>
      <div className='padded'>
        <div className={`box padded ${styles.box}`}>
          This has a different background color, but uses the same 'box' className. However, thanks to CSS modules the names dont collide. Here we are setting a background color, and overriding the shadow.
        </div>
      </div>
    </div>
  );
}

export default Core;
