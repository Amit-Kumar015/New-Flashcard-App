import React from 'react';
import { X, Filter, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

function FilterModal({
  filterLevel,
  setFilterLevel,
  filterTag,
  setFilterTag,
  filterDeck,
  setFilterDeck,
  tag,
  deck,
  handleSubmit,
  handleReset,
  setFilter
}) {
  return (
    <div className="fixed inset-0 flex backdrop-blur-xs items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <span className="text-xl font-semibold">Filter Options</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFilter(false)}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="my-5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">

              {/* Level */}
              <div className="space-y-2">
                <label htmlFor="level" className="text-sm font-medium text-gray-700">
                  Level
                </label>
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                    <SelectItem value="5">Level 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tag */}
              <div className="space-y-2">
                <label htmlFor="tag" className="text-sm font-medium text-gray-700">
                  Tag
                </label>
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tag.map((item, index) => (
                      <SelectItem key={index} value={item.tag}>
                        {item.tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deck */}
              <div className="space-y-2">
                <label htmlFor="deck" className="text-sm font-medium text-gray-700">
                  Deck
                </label>
                <Select value={filterDeck} onValueChange={setFilterDeck}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a deck" />
                  </SelectTrigger>
                  <SelectContent>
                    {deck.map((item, index) => (
                      <SelectItem key={index} value={item.deck}>
                        {item.deck}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1 bg-transparent"
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFilter(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Check className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
