import { DetailModal } from '@/components/DetailModal';
import EditModal from '@/components/EditModal';
import FilterModal from '@/components/FilterModal';
import Flashcard from '@/components/Flashcard'
import { PracticeCard } from '@/components/PracticeCard';
import ReviewCard from '@/components/ReviewCard';
import axios from 'axios'
import { SlidersHorizontal, RefreshCcwIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';


function DeckCards() {
	const url = import.meta.env.VITE_API_URL
	//   const token = localStorage.getItem('token')
	const [cards, setCards] = useState([])
	const [tag, settag] = useState([])
	//   const [deck, setDeck] = useState([])
	const [errorMessage, setErrorMessage] = useState('')
	const [filter, setFilter] = useState(false)
	const [edit, setEdit] = useState(false)
	const [detail, setDetail] = useState(false)
	const [selectedCard, setSelectedCard] = useState(null)
	const [filterLevel, setFilterLevel] = useState("")
	const [filterTag, setFilterTag] = useState("")
	const [filterDeck, setFilterDeck] = useState("")
	const [showCard, setShowCard] = useState(false)

	const { deck } = useParams()


	// dont need tags
	useEffect(() => {
		try {
			const getTag = async () => {
				const response = await axios.get(`${url}/flashcard/tag`)

				settag(response.data?.allTag)
			}
			getTag()
		} catch (error) {
			setErrorMessage(error.response?.data?.error || "Fetching tags failed")

			if (error.response) {
				console.log('Status:', error.response.status);
				console.log('Message:', error.response.data.error);
			}
			else if (error.request) {
				console.log('No response received:', error.request);
			}
			else {
				console.log('Error:', error.message);
			}
		}
	}, [])

	// dont need decks
	//   useEffect(() => {
	//     try {
	//       const getDecks = async () => {
	//         const response = await axios.get(`${url}/flashcard/decks`)

	//         setDeck(response.data?.allDecks)
	//       }
	//       getDecks()
	//     } catch (error) {
	//       setErrorMessage(error.response?.data?.error || "Fetching decks failed")

	//       if (error.response) {
	//         console.log('Status:', error.response.status);
	//         console.log('Message:', error.response.data.error);
	//       }
	//       else if (error.request) {
	//         console.log('No response received:', error.request);
	//       }
	//       else {
	//         console.log('Error:', error.message);
	//       }
	//     }
	//   }, [])

	useEffect(() => {
		fetchCards()
	}, [])

	const fetchCards = async () => {
		setErrorMessage('')
		try {
			const response = await axios.get(`${url}/flashcard/decks/${deck}`)

			console.log(response.data);
			//   console.log(response.data);

			//   if (response?.data.length == 0) {
			//     console.log('No cards found');
			//     alert("no cards found")
			//   }
			console.log("actual data: ", response.data?.cards);
			//   localStorage.setItem('Cards', JSON.stringify(response?.data?.data))
			setCards(response.data?.cards)

			alert('cards fetched successfully')
		}
		catch (error) {
			setErrorMessage(error.response?.data?.error || "Fetching cards failed")

			if (error.response) {
				console.log('Status:', error.response.status);
				console.log('Message:', error.response.data.error);
			}
			else if (error.request) {
				console.log('No response received:', error.request);
			}
			else {
				console.log('Error:', error.message);
			}
		}
	}


	// dont need filter
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
			setErrorMessage(error.response?.data?.error || "Fetching cards failed")

			if (error.response) {
				console.log('Status:', error.response.status);
				console.log('Message:', error.response.data.error);
			}
			else if (error.request) {
				console.log('No response received:', error.request);
			}
			else {
				console.log('Error:', error.message);
			}
		}
		setFilter(false)
	}

	// dont need this
	const handleReset = () => {
		setFilterLevel("")
		setFilterTag("")
		setFilterDeck("")
	}

	const onDelete = async (id) => {
		axios.delete(`${url}/flashcard/${id}`)
			.then((response) => {
				fetchCards()
				console.log("card deleted: ", response);
				alert("card deleted")
			}).catch((err) => {
				console.log("error deleting card: ", err);
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

			alert("card updated successfully")
			console.log("card updated successfully", response.data);
		} catch (error) {
			console.log("error while updating card: ", error);
		}
	}

	const handleRefresh = async () => {
		await fetchCards()
	}

	const onAnswer = async (flashcard, isCorrect) => {
		try {
			const id = flashcard._id
			const level = flashcard.level

			await axios.patch(`${url}/flashcard/${id}`, {
				newLevel: isCorrect ? level + 1 : level - 1
			})
				.then((res) => {
					alert("level updated")
					console.log(res.data);
				})
		} catch (error) {
			console.error("error while updating level", error);
		}
	}

	return (
		<div className='mx-auto max-w-7xl px-2 py-6'>
			<div className='h-16'>
				<div className="h-16 flex justify-between items-center px-2 gap-5">
					<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-2xl font-bold text-slate-900">Deck - {deck}</h1>
							<p className="text-sm text-slate-500">Total: {cards.length} Cards</p>
						</div>
					</div>

					<div className='flex justify-end items-center px-4 gap-5'>
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
					</div>
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
				/>
			}

			{showCard &&
				<ReviewCard 
					flashcard={selectedCard}
					onOpenChange={setShowCard}
					refresh={handleRefresh}
				/>
			}

		</div>
	)
}

export default DeckCards
