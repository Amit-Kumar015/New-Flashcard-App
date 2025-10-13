import React from 'react'
import { Button } from './ui/button';
import { PracticeCard } from './PracticeCard';
import { X } from 'lucide-react';
import axios from 'axios';

function ReviewCard({flashcard, onOpenChange, refresh}) {
    const url = import.meta.env.VITE_API_URL
    
    const onAnswer = async (flashcard, isCorrect) => {
        const id = flashcard._id
        const level = flashcard.level

        try {
            // update
            await axios.patch(`${url}/flashcard/${id}`, {
                newLevel: isCorrect ? level+1 : level-1
            })
            // refresh
            refresh()
            // close modal
            onOpenChange(false)
            alert("reviewed card")

        } catch (error) {
            console.error("error while updating level", error);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
            <div className="w-full max-w-4xl relative">
                <div className="mx-auto max-w-2xl">
                    <PracticeCard flashcard={flashcard} onAnswer={onAnswer} isReviewMode={true} />
                </div>
                <div className="absolute top-1 right-8 cursor-pointer">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenChange(false)}
                        aria-label="Close review session"
                        className="text-white hover:bg-white/20"
                    >
                        <X className="h-8 w-8" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ReviewCard
