import React from 'react';
import {Route, Routes} from 'react-router-dom';
import './App.css';

import MainPage from './pages/MainPage';
import ChatsPage from './pages/ChatsPage';

export default function App() {
  return (
    <div>
      <Routes>
        <Route index element={
          <MainPage />
        }/>
        <Route path='/chats' element={
          <ChatsPage />
        }/>
      </Routes>
    </div>
  )
}