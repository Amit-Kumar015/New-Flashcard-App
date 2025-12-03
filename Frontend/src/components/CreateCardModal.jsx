import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from 'lucide-react'
import { toast } from 'react-toastify'

function CreateCardModal({ onOpenChange, onSubmit, handleRefresh }) {
	const [question, setQuestion] = useState("")
	const [answer, setAnswer] = useState("")
	const [tag, setTag] = useState("")
	const [deck, setDeck] = useState("")
	const [hint, setHint] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState({})

	const validate = () => {
		const newErrors = {}

		if (!question.trim()) {
			newErrors.question = "Question is required"
		}
		if (!answer.trim()) {
			newErrors.answer = "Answer is required"
		}
		if (!deck.trim()) {
			newErrors.deck = "Deck is required"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)

		if(!validate()){
			return 
		}

		try {
			await onSubmit(question, answer, tag, deck, hint)
			onOpenChange(false)
			handleRefresh()
		} catch (error) {
			toast.error("Submission failed")
			console.error("Submission failed:", error);
		} finally {
			setIsLoading(false)
		}
	}

	const handleReset = () => {
		setQuestion("")
		setAnswer("")
		setTag("")
		setDeck("")
		setHint("")
	}

	const handleCancel = () => {
		handleRefresh()
		onOpenChange(false)
	}


	return (
		<div className="fixed inset-0 flex backdrop-blur-xs items-center justify-center z-50">
			<Card className="w-full max-w-2xl max-h-[90vh] mx-auto">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-2xl">
						Create New Flashcard
					</CardTitle>
					<CardDescription>Fill in the details below to create a new flashcard</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="question" className="text-lg font-semibold">
								Question *
							</Label>
							<Textarea
								id="question"
								placeholder="Enter your question here..."
								value={question}
								onChange={(e) => {
									setQuestion(e.target.value)
									if (errors.question) {
										setErrors({ ...errors, question: "" })
									}
								}}
								className="h-1 overflow-y-auto text-lg resize-none"
							/>
							{errors.question && <p className="text-sm text-red-500">{errors.question}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="answer" className="text-lg font-semibold">
								Answer *
							</Label>
							<Textarea
								id="answer"
								placeholder="Enter the answer here..."
								value={answer}
								onChange={(e) => {
									setAnswer(e.target.value)
									if (errors.answer) {
										setErrors({ ...errors, answer: "" })
									}
								}}
								className="h-1 overflow-y-auto text-lg resize-none"
							/>
							{errors.answer && <p className="text-sm text-red-500">{errors.answer}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="hint" className="text-lg font-semibold">
								Hint (Optional)
							</Label>
							<Input
								id="hint"
								placeholder="Add a helpful hint for this card..."
								value={hint}
								onChange={(e) => setHint(e.target.value)}
							/>
							<p className="text-xs text-muted-foreground">This will be shown when studying</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="deck" className="text-lg font-semibold">
									Deck *
								</Label>
								<Input
									id="deck"
									placeholder="Default: General"
									value={deck}
									onChange={(e) => {
										setDeck(e.target.value)
										if (errors.deck) {
											setErrors({ ...errors, deck: "" })
										}
									}}
								/>
								{errors.deck && <p className="text-sm text-red-500">{errors.deck}</p>}
							</div>

							
						</div>

						<div className="space-y-2">
							<Label htmlFor="tag" className="text-lg font-semibold">
								Tag (Optional)
							</Label>
							<Input
								id="tag"
								placeholder="Enter tag (e.g., Biology, Cells, Science)"
								value={tag}
								onChange={(e) => setTag(e.target.value)}
							/>
						</div>

						{errors.submit && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{errors.submit}</div>
						)}

						<div className="flex gap-3 justify-end pt-4 border-t">
							<Button
								type="button"
								variant="outline"
								onClick={handleReset}
								disabled={isLoading}
								className="flex items-center gap-2 bg-transparent"
							>
								<X className="w-4 h-4" />
								Reset
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={isLoading}
								className="flex items-center gap-2 bg-transparent"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isLoading || !question.trim() || !answer.trim()}
								className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
							>
								<Plus className="w-4 h-4" />
								{isLoading ? "Creating..." : "Create Card"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default CreateCardModal
