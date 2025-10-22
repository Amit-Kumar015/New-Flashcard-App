// import react, { useState } from "react"
// import { PracticeCard } from "./PracticeCard"
// import { Button } from "./ui/button"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// // add check for valid left and right cards

// export default function ReviewCard(cards) {
//     console.log(cards);
    
//     const [index, setIndex] = useState(0)
//     const count = cards.length || 0

//     const prev = () => {
//         setIndex((i) => i - 1)
//     }

//     const next = () => {
//         setIndex((i) => i + 1)
//     }

//     if (!cards || cards.length == 0) {
//         console.alert("no cards to review")
//         return
//     }

//     const onAnswer = async (flashcard, isCorrect) => {
//         const id = flashcard._id
//         const level = flashcard.level

//         try {
//             await axios.patch(`${url}/flashcard/${id}`, {
//                 newLevel: isCorrect ? level+1 : level-1
//             })
//             .then(() => {
//                 alert("level updated")
//                 console.log(res.data);
//             })
//         } catch (error) {
//             console.error("error while updating level", error);
//         }
//     }

//     return (
//         <div>
//             <div className="relative">
//                 <PracticeCard flashcard={cards[index]} onAnswer={onAnswer}/>

//                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         aria-label="Previous card"
//                         onClick={prev}
//                         className="pointer-events-auto"
//                     >
//                         <ChevronLeft className="h-5 w-5" />
//                     </Button>
//                 </div>

//                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
//                     <Button variant="ghost" size="icon" aria-label="Next card" onClick={next} className="pointer-events-auto">
//                         <ChevronRight className="h-5 w-5" />
//                     </Button>
//                 </div>
//             </div>

//             <div className="flex justify-end">
//                 <Button variant="secondary" onClick={() => onOpenChange(false)}>
//                     Close
//                 </Button>
//             </div>
//         </div>
//     )
// }



import React, { useState } from "react";
// Assuming PracticeCard is exported as a named export
import { PracticeCard } from "./PracticeCard";
import { Button } from "./ui/button"; // Assuming this is your custom button component
import { ChevronLeft, ChevronRight, X } from "lucide-react";
// Assuming you still need to use axios and url for the onAnswer logic
import axios from "axios"; 

// Destructure props correctly: { cards, onOpenChange }
// I assume you want a way to close the review session, so I'm adding `onOpenChange` here based on your existing code.
export default function ReviewAllCard({ cards, onOpenChange, refresh }) { 
    // The prop is an object { cards: [...] }, so we should destructure it, 
    // or access it via props.cards, but your component definition was (cards)
    // which receives { cards: [...] } if passed as <ReviewCard cards={cards} />
    // To fix the issue where `cards` was an object `{ cards: [...] }`, 
    // I've changed the function signature to `({ cards, onOpenChange })`
    // and assumed you pass an `onOpenChange` function to close the modal/view.
    
    // Safety check for empty or non-existent cards array
    const url = import.meta.env.VITE_API_URL
    const flashcards = cards || [];
    const count = flashcards.length;

    const [index, setIndex] = useState(0);

    const prev = () => {
        // Only allow moving back if the current index is greater than 0
        if (index > 0) {
            setIndex((i) => i - 1);
        }
    };

    const next = () => {
        // Only allow moving forward if the current index is less than the total count - 1
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
            // Placeholder for your actual URL/API logic
            await axios.patch(`${url}/flashcard/${id}`, {
                newLevel: isCorrect ? level + 1 : level - 1
            });
            
            alert("level updated"); // Removed for better UX, though your original code had it.
            
            // Move to the next card after answering.
            // Check if there's a next card, otherwise close/show completion.
            if (index < count - 1) {
                setIndex((i) => i + 1);
            } else {
                // Last card was answered, you might want to show a completion message or close.
                // For now, let's just stay on the last card until the user closes the session.
                console.log("Review session completed!");
                handleClose();
            }

        } catch (error) {
            console.error("error while updating level", error);
        }
    };

    const handleClose = async () => {
        await refresh();
        onOpenChange(false)
    }

    return (
        // Added an outer container to center the review UI on the screen
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
            <div className="w-full max-w-4xl relative">
                
                {/* Previous Button */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center -ml-16">
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Previous card"
                        onClick={prev}
                        disabled={index === 0} // Disable at the start
                        className={`pointer-events-auto transition-all duration-200 bg-white/70 hover:bg-white border-2 p-2 rounded-full shadow-lg ${
                            index === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                        }`}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                </div>
                
                {/* Flashcard Component */}
                <div className="mx-auto max-w-2xl">
                    <PracticeCard flashcard={flashcards[index]} onAnswer={onAnswer} isReviewMode={true} />
                </div>

                {/* Next Button */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center -mr-16">
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Next card"
                        onClick={next}
                        disabled={index === count - 1} // Disable at the end
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