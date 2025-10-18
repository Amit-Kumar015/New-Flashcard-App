import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

export default function Deck({title, icon: IconComponent, total, onDelete, onClick }) {


  return (
    <Card className="relative border rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-[210px] mr-4 flex-shrink-0" onClick={onClick}>
      <CardContent className="p-4">
        {/* Top row: icon + menu */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
              {IconComponent && <IconComponent className="h-5 w-5"/>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete()
              }} 
              className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        

        {/* Title */}
        <h3 className="mt-2 text-2xl font-semibold leading-snug text-slate-900 line-clamp-2">{title}</h3>
        {/* Subtitle */}

        {/* Progress / status */}
        <div className="mt-3 text-xs text-slate-600">
          <span className="font-medium">{total} Cards</span>
        </div>
        

        
      </CardContent>
    </Card>
  )
}
