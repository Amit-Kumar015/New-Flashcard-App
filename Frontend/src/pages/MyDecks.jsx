import React, { useEffect, useState } from "react"
import Deck from "@/components/Deck"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { getDeckIcon } from "@/lib/deckIcons"
import { toast } from "react-toastify"

function MyDecks() {
  const url = import.meta.env.VITE_API_URL
  const [decks, setDecks] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    fetchDecks()
  }, [])

  const fetchDecks = async () => {
    try {
      const response = await axios.get(`${url}/flashcard/decks`)
      setDecks(response.data.allDecks)
    } catch (error) {
      toast.error("Error in fetching decks")
      console.error('Errorin fetching decks: ', error);
    }
  }

  const onDelete = async (deck) => {
    axios.delete(`${url}/flashcard/decks/${deck}`)
    .then((response) => {
      toast.success("deck deleted successfully")
      console.log("deck deleted: ", response);

      fetchDecks()
    }).catch((err) => {
      toast.error("Error deleting deck")
      console.error("error deleting deck: ", err);
    })
  }

  const handleClick = (deck) => {
    navigate(`/my-decks/${deck}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
        <div className="flex gap-6">

          <section className="flex-1">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Decks</h1>
                <p className="text-sm text-slate-500">Total: {decks.length} Decks</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {decks.map((d, i) => (
                <Deck
                  key={i}
                  title={d.deck}
                  icon={getDeckIcon(d.deck)}
                  total={d.totalCards}
                  onDelete={() => onDelete(d.deck)}
                  onClick={() => handleClick(d.deck)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default MyDecks

