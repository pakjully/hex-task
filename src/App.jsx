import React from 'react';
import './App.scss';
import { RegisterPage } from './Pages/RegisterPage/RegisterPage';
import { LoginPage } from './Pages/LoginPage/LoginPage';
import { TablePage } from './Pages/TablePage/TablePage';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/auth"
          element={(
            <RegisterPage />
          )}
        />
        <Route
          path="/login"
          element={(
            <LoginPage />
          )}
        />
        <Route
          path="/statistics"
          element={(
            <TablePage />
          )}
        />
      </Routes>
    </div>
  );
}

export default App;
