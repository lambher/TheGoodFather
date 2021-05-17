import './App.css';
import Home from './components/pages/Home';
import Code from './components/pages/Code';
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/code" component={Code} />
      </Switch>
    </BrowserRouter>
  );
}


export default App;
