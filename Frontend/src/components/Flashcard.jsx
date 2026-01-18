import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Flashcard({ card, Click, onDetail, onEdit, onDelete }) {
  const MAX = 50

  return (
    <Card
      className="w-full h-48 relative hover:shadow-lg transition-shadow duration-200"
      onClick={Click}
    >
      <div className="absolute top-4 left-4 z-10 ">
        {card.tag && (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 hover:bg-green-200 ml-2"
          >
            {card.tag}
          </Badge>
        )}
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
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDetail();
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Detail
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="flex h-full p-6">
        <p className="w-full mt-4 text-center text-lg font-medium text-gray-800 leading-relaxed whitespace-normal overflow-hidden">
          {card.question.length > MAX
            ? `${card.question.slice(0, 50)}...`
            : card.question}
        </p>
      </CardContent>
    </Card>
  );
}
