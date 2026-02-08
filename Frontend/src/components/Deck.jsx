import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function Deck({
  title,
  icon: IconComponent,
  totalCards,
  onDelete,
  onClick,
}) {

  return (
    <Card
      className="relative border rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-[210px] mr-4 flex-shrink-0 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              {IconComponent && <IconComponent className="h-5 w-5" />}
            </span>
            <h3 className="text-2xl font-semibold leading-snug text-slate-900">
              {title}
            </h3>
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
                  onDelete();
                }}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="pl-2 mt-3 text-xs text-slate-600">
          <span className="font-medium">{totalCards} Cards</span>
        </div>
      </CardContent>
    </Card>
  );
}
