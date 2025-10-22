import React from "react";
import { Outlet } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import axios from "axios";

function App() {
  const navItems = [
    {
      name: "Home",
      url: "/"
    },
    {
      name: "All Cards",
      url: "/all-cards"
    },
    {
      name: "Pending Cards",
      url: "/pending-cards"
    },
    {
      name: "My Decks",
      url: "my-decks"
    }
  ]

  const navigate = useNavigate()
  const token = localStorage.getItem("userToken")
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`


  return (
    <div className="w-screen h-screen flex flex-col relative overflow-x-hidden">
    <Header />

    <div className="flex flex-1">
      <div className="w-1/6 bg-gray-100 border-r p-4 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.name} className="cursor-pointer text-lg hover:text-green-600" onClick={() => navigate(item.url)}>{item.name}</li>
        ))}
        </ul>
      </div>

      <div className="w-5/6 p-6 overflow-y-auto">
        <Outlet/>
      </div>
    </div>
  </div>
  )
}

export default App;
