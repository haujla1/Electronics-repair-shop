import { useState } from 'react'
import Login from './components/login'
import SignUp from './components/signup'
import Home from './components/home'


import { Route, Link, Routes} from 'react-router-dom';
import { AuthProvider } from './context/authContext';


import './App.css'
import PrivateRoute from './components/privateRoute';

function App() {

  return (
    <AuthProvider>
      <div className='App'>
        <header className='App-header'>
          <h1>Header</h1>
        </header>
        <br />
        <br />
          <Routes>
            <Route path='/login' element ={<Login/>}/>
            <Route path='/signup' element ={<SignUp/>}/>
            <Route path='/' element={<PrivateRoute />}> //this is a private route for home
              <Route path='/' element={<Home />} />
            </Route>
          </Routes>
      </div>
    </AuthProvider>
  );

}

export default App
