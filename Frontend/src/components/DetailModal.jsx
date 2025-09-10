import { X, Calendar, BookOpen, Tag, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export function DetailModal({ flashcard, open, onOpenChange }) {
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
  if (!flashcard || !open) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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

  return (
    <div className="fixed inset-0 flex backdrop-blur-xs items-center justify-center z-30">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Flashcard Details</h2>
            <p className="text-sm text-muted-foreground">
              Complete information about this flashcard
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Card Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">QUESTION</h4>
              <p className="text-lg">{flashcard.question}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">ANSWER</h4>
              <p className="text-lg">{flashcard.answer}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <Badge className={getLevelColor(flashcard.level)}>{flashcard.level}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Tag className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tag</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {flashcard.tag}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deck</p>
                  <p className="font-medium">{flashcard.deck}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(flashcard.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Next Review:</span>
          <span className="font-medium">{formatDate(flashcard.reviewDate)}</span>
        </div>
      </div>
    </div>
  )
}

