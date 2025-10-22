import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AllCards from './pages/AllCards.jsx'
import Home from './pages/Home.jsx'
import PendingCards from './pages/PendingCards.jsx'
import MyDecks from './pages/MyDecks.jsx'
import DeckCards from './pages/DeckCards'
import { ToastContainer } from 'react-toastify';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App/>}>
        <Route index element={<Home/>}/>
        <Route path='/all-cards' element={<AllCards/>}/>
        <Route path='/pending-cards' element={<PendingCards/>}/>
        <Route path='/my-decks' element={<MyDecks/>}/>
        <Route path='/my-decks/:deck' element={<DeckCards/>}/>
      </Route>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
    <ToastContainer 
      position="top-right"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </StrictMode>,
)
