import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router-dom
import { Button } from "@/components/ui/button"; // Assuming shadcn button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming shadcn cards
import { BookOpen, Zap, Database, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Deck from '@/components/Deck';
import { getDeckIcon } from '@/lib/deckIcons';
import { Bar } from 'react-chartjs-2';
import { options } from '@/lib/charts';

// const dashboardStats = {
//   pendingCards: 42,
//   totalCards: 350,
//   decks: 8,
//   masteryPercentage: 65,
// };

// const recentDecks = [
//   { name: "React Hooks", pending: 5, total: 30, url: "/decks/react-hooks" },
//   { name: "CSS Flexbox", pending: 0, total: 20, url: "/decks/css-flexbox" },
//   { name: "MongoDB Queries", pending: 12, total: 50, url: "/decks/mongodb-queries" },
// ];

// const levelData = [
//   { level: 1, pending: 15, mastered: 5 },
//   { level: 2, pending: 10, mastered: 15 },
//   { level: 3, pending: 5, mastered: 30 },
//   { level: 4, pending: 2, mastered: 55 },
//   { level: 5, pending: 0, mastered: 150 },
// ];
// // --- End Placeholder Data ---


// // Helper component for the Mastery/Progress Bar
// const ProgressBar = ({ percentage }) => (
//   <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
//     <div
//       className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
//       style={{ width: `${percentage}%` }}
//       aria-valuenow={percentage}
//       aria-valuemin="0"
//       aria-valuemax="100"
//     ></div>
//   </div>
// );

// // Helper component for the Bar Chart (simplistic Tailwind implementation)
// const CardLevelChart = () => (
//   <Card className="col-span-1 md:col-span-2 shadow-lg">
//     <CardHeader className="flex flex-row items-center justify-between">
//       <CardTitle className="text-xl">Progress By Level</CardTitle>
//       <Database className="h-5 w-5 text-gray-400" />
//     </CardHeader>
//     <CardContent>
//       <div className="h-60 flex items-end justify-between space-x-2">
//         {levelData.map((d, index) => (
//           <div key={d.level} className="flex flex-col items-center flex-1">
//             {/* Bars */}
//             <div className="flex flex-row items-end h-full w-full space-x-1">
//               {/* Pending Bar */}
//               <div
//                 className="w-1/2 bg-yellow-400 rounded-t-sm transition-all duration-500"
//                 style={{ height: `${(d.pending / 20) * 100}%` }} // Max height based on largest 'pending' (15)
//                 title={`Level ${d.level} Pending: ${d.pending}`}
//               ></div>
//               {/* Mastered Bar */}
//               <div
//                 className="w-1/2 bg-green-500 rounded-t-sm transition-all duration-500"
//                 style={{ height: `${(d.mastered / 150) * 100}%` }} // Max height based on largest 'mastered' (150)
//                 title={`Level ${d.level} Mastered: ${d.mastered}`}
//               ></div>
//             </div>
//             {/* Label */}
//             <span className="text-xs font-semibold mt-1">L{d.level}</span>
//           </div>
//         ))}
//       </div>
//       <div className="flex justify-center text-sm mt-3 space-x-4">
//         <span className="flex items-center"><div className="w-3 h-3 bg-yellow-400 mr-1 rounded-sm"></div>Pending</span>
//         <span className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>Mastered</span>
//       </div>
//     </CardContent>
//   </Card>
// );
const INITIAL_LEVEL_DATA = [
  { level: 1, pending: 0, mastered: 0 },
  { level: 2, pending: 0, mastered: 0 },
  { level: 3, pending: 0, mastered: 0 },
  { level: 4, pending: 0, mastered: 0 },
  { level: 5, pending: 0, mastered: 0 },
];

const dataset = (cards, initialLevelData) => {
  const now = Date.now();

  // 2. Use 'let' for counters
  let pendingCards = 0;
  let totalCards = 0;

  // 3. Create a clean copy of levelData to mutate locally
  const newLevelData = initialLevelData.map(d => ({ ...d }));

  // 4. Use forEach for iteration
  cards.forEach((card) => {
    const reviewTimestamp = new Date(card.reviewDate).getTime();
    const levelIndex = card.level - 1;

    // Safety check for valid level
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

  // 5. Return both the stats and the new level data
  return {
    newDashboardStats: {
      pendingCards,
      totalCards,
      masteryPercentage
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
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const labels = ['1', '2', '3', '4', '5']

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
        console.log("dashboard stats ", finalDashboardstat);

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
    console.log("dashboardStats", dashboardStats);
  }, [cards.length])

  const fetchDecks = async () => {
    setLoading(true)

    try {
      const response = await axios.get(`${url}/flashcard/decks`)
      console.log(response.data);

      console.log(response.data.allDecks);

      setDecks(response.data.allDecks)
      return response.data.allDecks
    } catch (error) {
      console.log('Error:', error.message);
    } finally {
      setLoading(false)
    }
  }

  const fetchCards = async () => {
    setErrorMessage('')
    try {
      const response = await axios.get(`${url}/flashcard`)

      console.log(response);
      console.log(response.data);

      if (response?.data.length == 0) {
        console.log('No cards found');
        alert("no cards found")
      }
      console.log("actual data: ", response?.data?.data);
      localStorage.setItem('Cards', JSON.stringify(response?.data?.data))
      setCards(response?.data?.data)

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