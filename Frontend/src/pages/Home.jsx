import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Zap, Database } from "lucide-react";
import axios from "axios";
import Deck from "@/components/Deck";
import { getDeckIcon } from "@/lib/deckIcons";
import { Bar } from "react-chartjs-2";
import { options } from "@/lib/charts";
import { toast } from "react-toastify";


export default function Home() {
  const url = import.meta.env.VITE_API_URL;
  const [cards, setCards] = useState([]);
  const [decks, setDecks] = useState([]);
  const [pendingCards, setPendingCards] = useState([]);
  const [chartData, setChartData] = useState([
    { days: 0, cards: 0 },
    { days: 7, cards: 0 },
    { days: 15, cards: 0 },
    { days: 30, cards: 0 },
    { days: 60, cards: 0 },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCards();
    fetchDecks();
    fetchPendingCards();
  }, []);

  useEffect(() => {
    if (cards?.length) {
      setChartDataFromCards();
    }
  }, [cards]);

  const fetchDecks = async () => {
    try {
      const { data } = await axios.get(`${url}/flashcard/decks`);

      setDecks(data?.data[0]?.decks);
    } catch (error) {
      toast.error("Error in fetching decks");
      console.log("Error:", error.message);
    }
  };

  const fetchCards = async () => {
    try {
      const { data } = await axios.get(`${url}/flashcard`);

      setCards(data.data);
    } catch (error) {
      const msg = error.response?.data?.error || "Fetching cards failed";
      toast.error(msg);
      console.error("Fetching cards failed", error);
    }
  };

  const fetchPendingCards = async () => {
    try {
      const { data } = await axios.get(`${url}/flashcard/pending`);
      setPendingCards(data?.data);
    } catch (error) {
      const msg =
        error.response?.data?.error || "Fetching pending cards failed";
      toast.error(msg);
    }
  };

  const setChartDataFromCards = () => {
    const today = new Date();
    const MS_IN_DAY = 1000 * 60 * 60 * 24;

    const updated = chartData.map((d) => ({ ...d, cards: 0 }));

    cards.forEach((card) => {
      const diffInDays = Math.ceil(
        (new Date(card.reviewDate) - today) / MS_IN_DAY,
      );      

      if (diffInDays > 7) updated[1].cards++;
      else if (diffInDays > 15) updated[2].cards++;
      else if (diffInDays > 30) updated[3].cards++;
      else if (diffInDays > 60) updated[4].cards++;
      else updated[0].cards++;
    });

    setChartData(updated);
  };

  const onDelete = async (id) => {
    axios
      .delete(`${url}/flashcard/decks/${id}`)
      .then((response) => {
        toast.success(`Deck deleted successfully`);
        fetchDecks();
      })
      .catch((err) => {
        toast.error("Error in deleting deck!");
        console.log("error deleting deck: ", err);
      });
  };

  const data = {
    labels: chartData.map((d, i) => (i > 0 ? `>${d.days} Days` : `Today`)),
    datasets: [
      {
        label: "Next Review Date",
        data: chartData.map((d) => d.cards),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
              Welcome!
            </h1>
            <p className="text-lg text-gray-600">
              You have **{pendingCards.length} cards** waiting for your
              attention today.
            </p>
          </div>

          <Button
            size="lg"
            className="mt-6 md:mt-0 bg-green-600 hover:bg-green-700 text-lg py-7 px-8 shadow-md transition-transform transform hover:scale-105"
            onClick={() => navigate("/pending-cards")}
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Review Session ({pendingCards.length})
          </Button>
        </div>
      </Card>

      <div className="w-full flex justify-center">
        <div className="w-10/12">
          <Bar options={options} data={data} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cards.length}</div>
            <p className="text-xs text-muted-foreground">in all decks</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-l-4 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cards Due Today
            </CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCards.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready for spaced repetition
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Number of Decks
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{decks.length}</div>
            <p className="text-xs text-muted-foreground">Start a new topic!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 shadow-lg lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">
              All Decks ({decks.length})
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div
              className="flex w-full overflow-x-auto pb-4 whitespace-nowrap cursor-pointer"
              style={{ scrollbarWidth: "none" }}
            >
              {decks.length > 0 ? (
                decks.map((d) => (
                  <Deck
                    key={d._id}
                    title={d.name}
                    icon={getDeckIcon(d.name)}
                    totalCards={d.cardCount}
                    onDelete={() => onDelete(d._id)}
                    onClick={() => navigate(`/my-decks/${d._id}`)}
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
