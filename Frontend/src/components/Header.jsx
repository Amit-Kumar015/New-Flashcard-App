import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import axios from "axios";
import light_logo from "../assets/light_theme_logo.png";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { AddDeckContext } from "@/context/addDeckContext";

const Header = () => {
  const url = import.meta.env.VITE_API_URL;
  const [searchField, setSearchField] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const isLoggedIn = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {setIsAdded} = useContext(AddDeckContext)

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("userToken");
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/";
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchField(value);

    if (!value.length) {
      setSearchResults([]);
      return;
    }

    try {
      const { data } = await axios.get(`${url}/flashcard/decks/action/search`, {
        params: {
          search: value,
        },
      });

      setSearchResults(data?.data?.decks || []);
    } catch (error) {
      toast.error("error in getting search results");
      console.log(error);
    }
  };

  const handleAddDeck = async (id) => {
    if (!id) return;
    
    try {
      await axios.patch(`${url}/flashcard/decks/action/add/${id}`);
      toast.success("Added deck successfully");
      setIsAdded((prev) => !prev)
    } catch (error) {
      toast.error("error in adding searched decks");
      console.log("error in adding searched decks", error);
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-between px-6 py-4 shadow-md">
      <div
        className="flex items-center space-x-2 h-12"
        onClick={() => navigate("/")}
      >
        <img src={light_logo} alt="logo" className="w-32 object-contain" />
      </div>

      <div className="relative">
        <Input
          type="search"
          placeholder="Search Decks..."
          value={searchField}
          onChange={handleSearch}
          className="w-70"
        />
        {searchResults?.length > 0 && (
          <ul className="z-10 fixed mt-1 flex flex-col max-h-50 w-70 overflow-y-auto custom-scrollbar">
            {searchResults?.map((deck) => (
              <div className="w-full flex items-center gap-2">
                <li
                  key={deck._id}
                  className="w-full flex justify-between mt-1 py-2 px-2 bg-gray-100 rounded-md border truncate hover:bg-gray-200"
                >
                  {deck.name}
                  <span className="px-2 py-1 rounded-lg bg-amber-100 text-xs">
                    {deck.cards.length} Cards
                  </span>
                </li>
                <Button
                  variant="default"
                  onClick={() => handleAddDeck(deck._id)}
                  className="bg-purple-400 hover:bg-purple-300 cursor-pointer"
                >
                  Add
                </Button>
              </div>
            ))}
          </ul>
        )}
        {!searchResults?.length && searchField.length !== 0 && (
          <div>No decks found</div>
        )}
      </div>

      {isLoggedIn ? (
        <div className="text-gray-600 text-sm">
          <button
            type="button"
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
          >
            Signup
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
