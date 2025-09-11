import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Flashcard({
    question,
    level,
    Click,
    onDetail,
    onEdit,
    onDelete
}) {

    const getLevelColor = (level) => {
        if(level == 1){
            return "bg-red-100 text-red-800 hover:bg-red-200"
        }
        else if(level == 2 || level == 3){
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        }
        else{
            return "bg-green-100 text-green-800 hover:bg-green-200"
        }
    }
    
    return (
        <Card className="w-full h-48 relative hover:shadow-lg transition-shadow duration-200" onClick={Click}>
            <div className="absolute top-4 left-4 z-10">
                <Badge variant="secondary" className={getLevelColor(level)}>
                    {level}
                </Badge>
            </div>

            <div className="absolute top-4 right-4 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            onDetail()
                        }}>
                            <Eye className="mr-2 h-4 w-4" />
                            Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            onEdit()
                        }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete()
                            }} 
                            className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <CardContent className="flex items-center justify-center h-full p-6">
                <p className="text-center text-lg font-medium text-gray-800 leading-relaxed">{question}</p>
            </CardContent>
        </Card>
    )
}