import React, { useState } from "react";
import { PracticeCard } from "./PracticeCard";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import axios from "axios"; 
import { toast } from "react-toastify";

export default function ReviewAllCard({ cards, onOpenChange, refresh }) {     
    const url = import.meta.env.VITE_API_URL
    const flashcards = cards || [];
    const count = flashcards.length;
    const [index, setIndex] = useState(0);

    const prev = () => {
        if (index > 0) {
            setIndex((i) => i - 1);
        }
    };

    const next = () => {
        if (index < count - 1) {
            setIndex((i) => i + 1);
        }
    };

    if (count === 0) {
        return (
            <div className="flex items-center justify-center p-8 border rounded-lg max-w-lg mx-auto mt-10 bg-white">
                <p className="text-lg text-gray-500">🎉 No cards left to review!</p>
            </div>
        );
    }

    const onAnswer = async (flashcard, isCorrect) => {
        const id = flashcard._id;
        const level = flashcard.level;

        try {
            await axios.patch(`${url}/flashcard/${id}`, {
                newLevel: isCorrect ? level + 1 : level - 1
            });
            
            alert("level updated"); 
            if (index < count - 1) {
                setIndex((i) => i + 1);
            } else {
                toast.success("Review session completed!")
                handleClose();
            }

        } catch (error) {
            toast.error("Error while updating level")
            console.error("error while updating level", error);
        }
    };

    const handleClose = async () => {
        await refresh();
        onOpenChange(false)
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
            <div className="w-full max-w-4xl relative">
                
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center -ml-16">
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Previous card"
                        onClick={prev}
                        disabled={index === 0}
                        className={`pointer-events-auto transition-all duration-200 bg-white/70 hover:bg-white border-2 p-2 rounded-full shadow-lg ${
                            index === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                        }`}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                </div>
                
                <div className="mx-auto max-w-2xl">
                    <PracticeCard flashcard={flashcards[index]} onAnswer={onAnswer} isReviewMode={true} />
                </div>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center -mr-16">
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Next card"
                        onClick={next}
                        disabled={index === count - 1} 
                        className={`pointer-events-auto transition-all duration-200 bg-white/70 hover:bg-white border-2 p-2 rounded-full shadow-lg ${
                            index === count - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                        }`}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>

                <div className="absolute top-4 right-4">
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleClose} 
                        aria-label="Close review session"
                        className="text-white hover:bg-white/20"
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
}