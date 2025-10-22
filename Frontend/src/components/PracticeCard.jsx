import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, RotateCcw, CheckCircle, XCircle, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function PracticeCard({ flashcard, onAnswer }) {
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const handleAnswer = (isCorrect) => {
    if (onAnswer) {
      onAnswer(flashcard, isCorrect)
    }
    setShowHint(false)
    setShowAnswer(false)
  }

  const getLevelColor = (level) => {
    if (level == 1) {
      return "bg-red-100 text-red-800 hover:bg-red-200"
    } else if (level == 2 || level == 3) {
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    } else {
      return "bg-green-100 text-green-800 hover:bg-green-200"
    }
  }

  if (!flashcard) return null

  return (
    <div className="mx-auto z-30"> 
        <Card className="min-w-lg overflow-y-auto p-6"> 
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <Badge className={getLevelColor(flashcard.level)}>
                {flashcard.level}
            </Badge>
            {flashcard.deck && (
                <Badge variant="outline" className="text-xs">
                {flashcard.deck}
                </Badge>
            )}
            </div>
            {flashcard.tag && flashcard.tag.length > 0 && (
            <div className="flex gap-1">
                <Badge variant="secondary" className="text-xs">
                    {flashcard.tag}
                </Badge>
            </div>
            )}
        </div>

        <div className="relative h-[300px]">
            <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ rotateY: showAnswer ? 180 : 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
            <Card
                className="absolute inset-0 h-full overflow-hidden"
                style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
                }}
            >
                <CardHeader className="pb-4">
                <CardTitle className="text-center text-lg">Question</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center h-[200px]">
                <div className="text-center space-y-4">
                    <p className="text-xl leading-relaxed">{flashcard.question}</p>

                    {flashcard.hint && (
                    <AnimatePresence>
                        {showHint ? (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 overflow-hidden"
                        >
                            <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <p className="text-yellow-800 text-sm">{flashcard.hint}</p>
                            </div>
                        </motion.div>
                        ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowHint(true)}
                            className="flex items-center gap-2"
                        >
                            <Lightbulb className="w-4 h-4" />
                            Show Hint
                        </Button>
                        )}
                    </AnimatePresence>
                    )}
                </div>
                </CardContent>
            </Card>

            <Card
                className="absolute inset-0 h-full overflow-hidden"
                style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                }}
            >
                <CardHeader className="pb-4">
                <CardTitle className="text-center text-lg">Answer</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center h-[200px]">
                <div className="text-center">
                    <p className="text-xl leading-relaxed">{flashcard.answer}</p>
                </div>
                </CardContent>
            </Card>
            </motion.div>
        </div>

        <div className="flex flex-col gap-3">
            <AnimatePresence mode="wait">
            {!showAnswer ? (
                <motion.div
                key="show-answer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                >
                <Button
                    onClick={() => setShowAnswer(true)}
                    className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    size="lg"
                >
                    <Eye className="w-5 h-5" />
                    Show Answer
                </Button>
                </motion.div>
            ) : (
                <motion.div
                key="answer-buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
                className="space-y-3"
                >
                <div className="flex gap-3">
                    <Button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    size="lg"
                    >
                    <CheckCircle className="w-5 h-5" />
                    Got it Right
                    </Button>
                    <Button
                    onClick={() => handleAnswer(false)}
                    variant="destructive"
                    className="flex-1 flex items-center gap-2"
                    size="lg"
                    >
                    <XCircle className="w-5 h-5" />
                    Got it Wrong
                    </Button>
                </div>
                <Button
                    variant="outline"
                    onClick={() => {
                    setShowAnswer(false)
                    setShowHint(false)
                    }}
                    className="w-full flex items-center gap-2 bg-transparent"
                >
                    <RotateCcw className="w-4 h-4" />
                    Show Question Again
                </Button>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
        </Card>
    </div>
  )
}
