import React from "react";
import { Outlet } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css";
import { Home, NotebookText, Repeat, Layers, Bug } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import axios from "axios";
import { cn } from "@/lib/utils";

function App() {
  const navItems = [
    {
      name: "Home",
      url: "/",
      icon: Home
    },
    {
      name: "All Cards",
      url: "/all-cards",
      icon: NotebookText
    },
    {
      name: "Pending Cards",
      url: "/pending-cards",
      icon: Repeat
    },
    {
      name: "My Decks",
      url: "/my-decks",
      icon: Layers
    }
  ];

  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem("userToken")
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`


  return (
    <div className="w-screen h-screen flex flex-col relative overflow-x-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-60 p-4 shrink-0">
          <nav className="sticky top-8 flex flex-col h-[calc(100vh-8rem)] p-2 justify-between">
            <div className="space-y-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.url)}

                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      "text-gray-600 hover:bg-gray-100",
                      isActive && "bg-green-600 text-white hover:bg-green-700"
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              <button
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  "text-white bg-red-600 hover:bg-red-500",
                )}
                onClick={() => window.open('https://github.com/Amit-Kumar015/New-Flashcard-App/issues', '_blank')}
              >
                <Bug className="h-4 w-4" />
                <span className="truncate">Report Bug</span>
              </button>
            </div>
          </nav>
        </aside>

        <div className="w-5/6 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default App;
