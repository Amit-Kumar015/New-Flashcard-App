import { DetailModal } from '@/components/DetailModal';
import EditModal from '@/components/EditModal';
import FilterModal from '@/components/FilterModal';
import Flashcard from '@/components/Flashcard'
import ReviewAllCard from '@/components/ReviewAllCard';
import ReviewCard from '@/components/ReviewCard';

import axios from 'axios'
import { SlidersHorizontal, RefreshCcwIcon, Repeat } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';


function PendingCards() {
  const url = import.meta.env.VITE_API_URL
  const [cards, setCards] = useState([])
  const [tag, settag] = useState([])
  const [deck, setDeck] = useState([])
  const [filter, setFilter] = useState(false)
  const [edit, setEdit] = useState(false)
  const [detail, setDetail] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [filterLevel, setFilterLevel] = useState("")
  const [filterTag, setFilterTag] = useState("")
  const [filterDeck, setFilterDeck] = useState("")
  const [showCard, setShowCard] = useState(false)
  const [review, setReview] = useState(false)


  useEffect(() => {
    const getTag = async () => {
      try {
        const response = await axios.get(`${url}/flashcard/tag`)
        settag(response.data?.allTag)

      } catch (error) {
        toast.error(error.response?.data?.error || "Fetching tags failed")
        console.error("Fetching tags failed ", error);
      }
    }

    getTag()
  }, [])

  useEffect(() => {
    const getDecks = async () => {
    try {
        const response = await axios.get(`${url}/flashcard/decks`)
        setDeck(response.data?.allDecks)
      } catch (error) {
        toast.error(error.response?.data?.error || "Fetching decks failed")
        console.error("Fetching decks failed ", error);
      }
    }

    getDecks()
  }, [])

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${url}/flashcard/pending`)
      setCards(response?.data?.data)
    }
    catch (error) {
      toast.error(error.response?.data?.error || "Fetching cards failed")
      console.error("Fetching cards failed: ", error);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get(`${url}/flashcard/filter`, {
        params: {
          level: filterLevel.replace("Level ", ""),
          tag: filterTag,
          deck: filterDeck
        }
      })

      setCards(response.data?.cards)
    } catch (error) {
      toast.error(error.response?.data?.error || "failed to filter cards")
      console.error("failed to filter cards: ", error);
    }
    setFilter(false)
  }

  const handleReset = () => {
    setFilterLevel("")
    setFilterTag("")
    setFilterDeck("")
  }

  const onDelete = async (id) => {
    axios.delete(`${url}/flashcard/${id}`)
      .then((response) => {
        toast.success("Card deleted successfully")
        console.log("card deleted: ", response);

        fetchCards()
      }).catch((err) => {
        toast.error("Error deleting card")
        console.error("error deleting card: ", err);
      })
  }

  const onSave = async (id, updateCard) => {
    try {
      const response = await axios.patch(`${url}/flashcard/${id}`, {
        newQuestion: updateCard.question,
        newAnswer: updateCard.answer,
        newLevel: updateCard.level,
        newTag: updateCard.tag,
        newDeck: updateCard.deck,
        newHint: updateCard.hint
      })

      toast.success("card updated successfully")
      console.log("card updated successfully", response.data);
    } catch (error) {
      toast.error("Error in updating card")
      console.error("error while updating card: ", error); 
    }
  }

  const handleRefresh = async () => {
    await fetchCards()
  }

  return (
    <div className=''>
      <div className='h-16 mb-6'>
        <div className="h-16 flex justify-end items-center px-4 gap-5">
          <button onClick={handleRefresh}>
            <RefreshCcwIcon />
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg flex justify-center items-center hover:bg-gray-600 transition"
            onClick={() => setFilter(true)}
          >
            <SlidersHorizontal className='w-4 h-4 mr-2' />
            Filter
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex justify-center items-center hover:bg-green-600 transition"
            onClick={() => setReview(true)}
          >
            <Repeat className='w-4 h-4 mr-2' />
            Review
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.isArray(cards) && cards.map((card) => (
          <Flashcard
            key={card._id}
            card={card}
            Click={() => {
              setSelectedCard(card)
              setShowCard(true)
            }}
            onDetail={() => {
              setSelectedCard(card)
              setDetail(true)
            }}
            onEdit={() => {
              setSelectedCard(card)
              setEdit(true)
            }}
            onDelete={() => onDelete(card._id)}
          />
        ))}
      </div>

      {filter &&
        <FilterModal
          filterLevel={filterLevel}
          setFilterLevel={setFilterLevel}
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          filterDeck={filterDeck}
          setFilterDeck={setFilterDeck}
          tag={tag}
          deck={deck}
          setFilter={setFilter}
          handleReset={handleReset}
          handleSubmit={handleSubmit}
        />
      }

      {detail &&
        <DetailModal
          flashcard={selectedCard}
          open={detail}
          onOpenChange={setDetail}
        />
      }

      {edit &&
        <EditModal
          flashcard={selectedCard}
          open={edit}
          onOpenChange={setEdit}
          onSave={onSave}
          refresh={handleRefresh}
        />
      }

      {showCard &&
        <ReviewCard
          flashcard={selectedCard}
          onOpenChange={setShowCard}
          refresh={handleRefresh}
        />
      }

      {review &&
        <ReviewAllCard
          cards={cards}
          onOpenChange={setReview}
          refresh={handleRefresh}
        />
      }

    </div>
  )
}

export default PendingCards
