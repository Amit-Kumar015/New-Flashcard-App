import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { BookOpen, Zap, Database, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Deck from '@/components/Deck';
import { getDeckIcon } from '@/lib/deckIcons';
import { Bar } from 'react-chartjs-2';
import { options } from '@/lib/charts';
import { toast } from 'react-toastify';

const INITIAL_LEVEL_DATA = [
  { level: 1, pending: 0, mastered: 0 },
  { level: 2, pending: 0, mastered: 0 },
  { level: 3, pending: 0, mastered: 0 },
  { level: 4, pending: 0, mastered: 0 },
  { level: 5, pending: 0, mastered: 0 },
];

const dataset = (cards, initialLevelData) => {
  const now = Date.now();

  let pendingCards = 0;
  let totalCards = 0;

  const newLevelData = initialLevelData.map(d => ({ ...d }));

  cards.forEach((card) => {
    const reviewTimestamp = new Date(card.reviewDate).getTime();
    const levelIndex = card.level - 1;

    if (now < reviewTimestamp) {
      newLevelData[levelIndex].mastered += 1;
    }
    else {
      newLevelData[levelIndex].pending += 1;
      pendingCards += 1;
    }

    totalCards += 1;
  });

  const masteryCards = totalCards - pendingCards;
  const masteryPercentage = totalCards > 0 ? (masteryCards / totalCards) * 100 : 0;

  return {
    newDashboardStats: {
      pendingCards,
      totalCards,
      masteryPercentage: masteryPercentage.toFixed(1)
    },
    newLevelData
  };
};


export default function Home() {
  const url = import.meta.env.VITE_API_URL
  const [cards, setCards] = useState([])
  const [decks, setDecks] = useState([])
  const [dashboardStats, setDashboardStats] = useState({})
  const [levelData, setLevelData] = useState(INITIAL_LEVEL_DATA);
  const navigate = useNavigate();


  useEffect(() => {
    const loadData = async () => {
      await fetchCards()
      const deckSet = await fetchDecks()

      if (cards.length > 0) {
        const { newDashboardStats, newLevelData } = dataset(cards, INITIAL_LEVEL_DATA)

        const finalDashboardstat = {
          ...newDashboardStats,
          decks: deckSet.length
        }

        setDashboardStats(finalDashboardstat)
        if(finalDashboardstat.pendingCards > 0){
          toast.info(`You have ${finalDashboardstat.pendingCards} cards pending review today!`);
        }
        else{
          toast.success("All caught up! No pending cards.");
        }

        setLevelData(newLevelData)
      }
      else {
        setDashboardStats({
          pendingCards: 0,
          totalCards: 0,
          masteryPercentage: 0,
          decks: 0
        })
        setLevelData(INITIAL_LEVEL_DATA)
      }
    }

    loadData()
  }, [cards.length])

  const fetchDecks = async () => {
    try {
      const response = await axios.get(`${url}/flashcard/decks`)
      setDecks(response.data.allDecks)

      return response.data.allDecks
    } catch (error) {
      toast.error("Error in fetching decks")
      console.log('Error:', error.message);
    }
  }

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${url}/flashcard`)
      setCards(response?.data?.data)
    }
    catch (error) {
      toast.error(error.response?.data?.error || "Fetching cards failed")
      console.error("Fetching cards failed", error);
    }
  }

  const onDelete = async (deck) => {
    axios.delete(`${url}/flashcard/decks/${deck}`)
      .then((response) => {
        toast.success(`${deck} Deck deleted successfully`)
        fetchDecks()
      }).catch((err) => {
        toast.error("Error in deleting deck!")
        console.log("error deleting deck: ", err);
      })
  }

  const data = {
    labels: levelData.map(d => `Level ${d.level}`),
    datasets: [
      {
        label: 'Total Cards',
        data: levelData.map(d => d.pending + d.mastered),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Pending Cards',
        data: levelData.map(d => d.pending),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
              Welcome!
            </h1>
            <p className="text-lg text-gray-600">
              You have **{dashboardStats.pendingCards} cards** waiting for your attention today.
            </p>
          </div>

          <Button
            size="lg"
            className="mt-6 md:mt-0 bg-green-600 hover:bg-green-700 text-lg py-7 px-8 shadow-md transition-transform transform hover:scale-105"
            onClick={() => navigate('/pending-cards')} 
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Review Session ({dashboardStats.pendingCards})
          </Button>
        </div>
        <p className="text-right text-sm text-gray-600 mt-1">
          Overall Mastery: {dashboardStats.masteryPercentage}%
        </p>
      </Card>

      <div className='w-full flex justify-center'>
        <div className='w-10/12'>
          <Bar options={options} data={data} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalCards}</div>
            <p className="text-xs text-muted-foreground">in {dashboardStats.decks} decks</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-l-4 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Due Today</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingCards}</div>
            <p className="text-xs text-muted-foreground">Ready for spaced repetition</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Number of Decks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.decks}</div>
            <p className="text-xs text-muted-foreground">Start a new topic!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 shadow-lg lg:col-span-3"> 
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">All Decks ({decks.length})</CardTitle>
          </CardHeader>

          <CardContent>
            <div
              className="flex w-full overflow-x-auto pb-4 whitespace-nowrap" 
              style={{ scrollbarWidth: 'none' }}
            >

              {decks.length > 0 ? (
                decks.map((d, i) => (
                  <Deck
                    key={i}
                    title={d.deck}
                    icon={getDeckIcon(d.deck)}
                    total={d.totalCards}
                    onDelete={() => onDelete(d.deck)}
                    onClick={() => navigate(`/my-decks/${d.deck}`)}
                  />
                ))
              ) : (
                <p className="text-gray-500 p-2">No decks found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}