import React from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route} from 'react-router-dom';


import NavBar from './navbar/nav-bar';
import  { EventsList, CreateEvent, EventDetails, CreateSession } from './event';
import Error404 from './errors/error404';
import { ContextAuthProvider } from './shared/context-auth';
import { ContextEventsProvider } from './shared/contex-events';

import 'ngf-bootstrap/dist/bootstrap.min.css';

const Login = React.lazy(() => import('./user/login'));
const Profile = React.lazy(() => import('./user/profile'));

const App = () => {
  
  return (
    <>
    <ContextEventsProvider> 
    <ContextAuthProvider> 
    {/* <Suspense fallback={<div>Loading...</div>}>   */}
    <Router>
      <NavBar></NavBar>
      <Switch>
        <Redirect exact from="/" to="/events"/>
        <Route exact path="/events"  component={EventsList} />
        <Route exact path="/events/new" component={CreateEvent} />
        <Route exact path="/events/:id"  component={EventDetails} />
        <Route exact path="/session/new"  component={CreateSession} />
        <Route exact path="/login"  component={Login} />
        <Route exact path="/profile"  component={Profile} />
        <Route exact path="/error"  component={Error404} />
        <Route component={Error404} />     
      </Switch>
    </Router>
    {/* </Suspense> */}
    </ContextAuthProvider>
    </ContextEventsProvider>
   </>
  );
}

export default App;
