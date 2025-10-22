import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Save, X } from "lucide-react"
import { toast } from "react-toastify"

export default function EditModal({flashcard, open, onOpenChange, onSave, refresh}){
    const [newQuestion, setNewQuestion] = useState("")
    const [newAnswer, setNewAnswer] = useState("")
    const [newLevel, setNewLevel] = useState(null)
    const [newTag, setNewTag] = useState("")
    const [newDeck, setNewDeck] = useState("")
    const [newHint, setNewHint] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (open) {
        document.body.style.overflow = "hidden"
        } else {
        document.body.style.overflow = ""
        }

        return () => {
        document.body.style.overflow = ""
        }
    }, [open])

    useEffect(() => {
        if(flashcard){
            setNewQuestion(flashcard.question || "")
            setNewAnswer(flashcard.answer || "")
            setNewLevel(flashcard.level || null)
            setNewTag(flashcard.tag || "")
            setNewDeck(flashcard.deck || "")
            setNewHint(flashcard.hint || "")
        }
    }, [flashcard])

    const handleSave = async () => {
        if(!newQuestion.trim() || !newAnswer.trim()){
            toast.warn("question and answer are required")
            return
        }

        setIsLoading(true)

        const updateCard = {
            ...flashcard,
            question: newQuestion.trim(),
            answer: newAnswer.trim(),
            level: Number(newLevel),
            tag: newTag.trim(),
            deck: newDeck.trim(),
            hint: newHint.trim()
        }

        try {
            if(onSave){
                await onSave(flashcard._id, updateCard)
            }
            refresh()
            onOpenChange(false)
        } catch (error) {
            toast.error("Error saving flashcard")
            console.error("Error saving flashcard:", error)
        } finally{
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        if (flashcard) {
            setNewQuestion(flashcard.question || "")
            setNewAnswer(flashcard.answer || "")
            setNewLevel(flashcard.level || null)
            setNewTag(flashcard.tags || "")
            setNewDeck(flashcard.deck || "")
            setNewHint(flashcard.hint || "")
        }
        onOpenChange(false)
    }

    if(!flashcard) return null

    return (
        <div className="fixed inset-0 flex backdrop-blur-xs items-center justify-center z-40">
            <Card className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                    <Edit className="w-7 h-7" />
                    Edit Flashcard
                </CardTitle>
                <CardDescription className="text-lg">
                    Update the flashcard information below
                </CardDescription>
                </CardHeader>

                <div className="space-y-8">
                <Card>
                    <CardHeader>
                    <CardTitle className="text-xl">Card Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                    <div className="space-y-3">
                        <Label htmlFor="question" className="text-base">Question *</Label>
                        <Textarea
                        id="question"
                        placeholder="Enter the question..."
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="w-96 min-h-[20px] text-lg"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="answer" className="text-base">Answer *</Label>
                        <Textarea
                        id="answer"
                        placeholder="Enter the answer..."
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        className="w-96 min-h-[20px] text-lg"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="hint" className="text-base">Hint (Optional)</Label>
                        <Input
                        id="hint"
                        placeholder="Enter a helpful hint..."
                        value={newHint}
                        onChange={(e) => setNewHint(e.target.value)}
                        className="text-lg"
                        />
                    </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                    <CardTitle className="text-xl">Card Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-3">
                        <Label htmlFor="level" className="text-base">Level</Label>
                        <Select value={String(newLevel)} onValueChange={(val) => setNewLevel(Number(val))}>
                            <SelectTrigger className="text-lg">
                            <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>

                        <div className="space-y-3">
                        <Label htmlFor="deck" className="text-base">Deck</Label>
                        <Input
                            id="deck"
                            placeholder="Enter deck name..."
                            value={newDeck}
                            onChange={(e) => setNewDeck(e.target.value)}
                            className="text-lg"
                        />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="tags" className="text-base">Tags</Label>
                        <Input
                        id="tags"
                        placeholder="Enter tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="text-lg"
                        />
                    </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-transparent text-lg"
                    >
                    <X className="w-5 h-5" />
                    Cancel
                    </Button>
                    <Button
                    onClick={handleSave}
                    disabled={isLoading || !newQuestion.trim() || !newAnswer.trim()}
                    className="flex items-center gap-2 text-lg cursor-pointer"
                    >
                    <Save className="w-5 h-5" />
                    {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
                </div>
            </Card>
        </div>
    )
}
