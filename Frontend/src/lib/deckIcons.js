import { 
    Book, Calculator, Globe, Code, History, Microscope, Brain, Speech,
    Palette, Music, FlaskConical, Atom, Binary, Scale, Gavel, Lightbulb,
    Leaf, Building, Puzzle, Rocket, LayoutDashboard, Telescope, Plane,
    GraduationCap, TrendingUp, Handshake, Shield, Sparkles, Zap
} from "lucide-react";

export const deckIconMap = {
    // General / Subjects
    "math": Calculator,
    "algebra": Calculator,
    "calculus": Calculator,
    "geometry": Calculator,
    "science": Microscope,
    "biology": FlaskConical, // Or Leaf, Atom
    "chemistry": Atom, // Or FlaskConical
    "physics": Rocket, // Or Atom
    "history": History,
    "geography": Globe,
    "world": Globe,
    "code": Code,
    "programming": Code,
    "computer": Binary,
    "language": Speech,
    "spanish": Speech,
    "french": Speech,
    "german": Speech,
    "english": Book,
    "literature": Book,
    "art": Palette,
    "music": Music,
    "psychology": Brain,
    "philosophy": Lightbulb,
    "law": Gavel,
    "politics": Building, // Or Handshake, Scale
    "economics": TrendingUp, // Or Scale
    "business": Handshake,
    "marketing": Sparkles,
    "medicine": Shield, // Or FlaskConical
    "health": Leaf,
    "astronomy": Telescope,
    "travel": Plane,
    "education": GraduationCap,

    // Specific terms that might appear in a deck title
    "react": Code,
    "javascript": Code,
    "css": Code,
    "data structures": Binary,
    "algorithms": Binary,
    "database": Binary,
    "api": Code,
    "frontend": LayoutDashboard,
    "backend": Code,
    "ancient": History,
    "modern": History,
    "vocabulary": Speech,
    "grammar": Speech,
    "cells": FlaskConical,
    "organic": FlaskConical,
    "elements": Atom,
    "rockets": Rocket,
    "planets": Telescope,
    "romans": History,
    "greeks": History,
    "renaissance": Palette,
    "jazz": Music,
    "pop": Music,
    "logic": Puzzle,
    "memory": Brain,
    "facts": Lightbulb,
    "quiz": Lightbulb,
    "study": Book,
    "general": LayoutDashboard,
    "fun": Sparkles,
    "basic": Lightbulb,
    "advanced": Zap,
    "new": Sparkles,
};

export const defaultDeckIcon = Book;

export function getDeckIcon(deckName){
    const lowerCaseDeckName  = deckName.toLowerCase()

    for(const keyword in deckIconMap){
        if(lowerCaseDeckName.includes(keyword)){
            return deckIconMap[keyword]
        }
    }

    return defaultDeckIcon
}