import react, { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import Deck from "@/components/Deck"
import { Atom, Landmark, Languages, BookOpen, FlaskConical, Cpu, Waves, Palette, Globe } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { getDeckIcon } from "@/lib/deckIcons"

function MyDecks() {
  const url = import.meta.env.VITE_API_URL
  const [decks, setDecks] = useState([])
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    fetchDecks()
  }, [])

  const fetchDecks = async () => {
    setLoading(true)

    try {
      const response = await axios.get(`${url}/flashcard/decks`)
      console.log(response.data);
      
      console.log(response.data.allDecks);
      
      setDecks(response.data.allDecks)
    } catch (error) {
      console.log('Error:', error.message);
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (deck) => {
    axios.delete(`${url}/flashcard/decks/${deck}`)
    .then((response) => {
      fetchDecks()
      console.log("deck deleted: ", response);
      alert("card deleted")
    }).catch((err) => {
      console.log("error deleting deck: ", err);
    })
  }

  const handleClick = (deck) => {
    navigate(`/my-decks/${deck}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
        <div className="flex gap-6">
          {/* Sidebar */}

          {/* Content */}
          <section className="flex-1">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Decks</h1>
                <p className="text-sm text-slate-500">Total: {decks.length} Decks</p>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {decks.map((d, i) => (
                <Deck
                  key={i}
                  title={d.deck}
                  icon={getDeckIcon(d.deck)}
                  total={d.totalCards}
                  onDelete={onDelete}
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

