import React from 'react';
import {Route, Routes} from 'react-router-dom';
import './App.css';

import MainPage from './pages/MainPage';
import ChatsPage from './pages/ChatsPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';

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
        <Route path='/settings' element={
          <SettingsPage />
        }/>
        <Route path='/regist' element={
          <AuthPage />
        }/>
      </Routes>
    </div>
  )
}