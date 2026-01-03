import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/User.model.js";
import { Card } from "../models/Card.model.js";
import { Deck } from "../models/deck.model.js";
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js";
import catchAsync from "../utils/catchAsync.js";

const decks = catchAsync(async (req, res, next) => {
  // take user id
  // autheticate user - middleware
  // fetch all decks of the user

  if (!req.user || !req.user._id) {
    return next(new AppError("Unauthorized - User ID missing", 401));
  }
  const id = req.user._id;

  const decks = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: "decks",
        localField: "_id",
        foreignField: "user",
        as: "deckInfo",
      },
    },
    {
      $unwind: "$deckInfo",
    },
    {
      $sort: { "deckInfo.updatedAt": -1 },
    },
    {
      $group: {
        _id: null,
        decks: {
          $push: {
            _id: "$deckInfo._id",
            name: "$deckInfo.name",
            visible: "$deckInfo.visible",
            cardCount: { $size: "$deckInfo.cards" },
            updatedAt: "$deckInfo.updatedAt",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalDecks: { $size: "$decks" },
        decks: 1,
      },
    },
  ]);

  return sendResponse(res, 200, "all decks fetched successfully", decks);
});

const deckCards = catchAsync(async (req, res, next) => {
  // this is used for both search deck and user deck
  // take deck id from params
  // fetch cards of that deck

  const { deckId } = req.params;

  if (!deckId || !isValidObjectId(deckId)) {
    return next(new AppError("provide valid deck id", 400));
  }

  const cards = await Deck.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(deckId) } },
    {
      $lookup: {
        from: "cards",
        let: { cardsId: "$cards" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$cardsId"] },
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $project: {
              _id: 1,
              question: 1,
              answer: 1,
              tag: 1,
              hint: 1,
              reviewDate: 1,
              user: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        as: "cardsInfo",
      },
    },
    {
      $project: {
        _id: 0,
        deckId: "$_id",
        deck: "$name",
        totalCards: { $size: "$cardsInfo" },
        cards: "$cardsInfo",
      },
    },
  ]);

  return sendResponse(res, 200, "deck cards fetched successfully", cards);
});

const deleteDeck = catchAsync(async (req, res, next) => {
  // deck name from params
  // authenticate - middleware
  // check if deck is empty
  // delete cards first
  // delete deck

  const { deckId } = req.params;
  if (!deckId || !isValidObjectId(deckId)) {
    return next(new AppError("provide valid deck id", 400));
  }

  if (!req.user || !req.user._id) {
    return next(new AppError("Unauthorized - User ID missing", 401));
  }
  const id = req.user._id;

  const deck = await Deck.findById(deckId);
  if (!deck) {
    return next(new AppError("Deck not found", 404));
  }

  if (id.toString() !== deck.user.toString()) {
    return next(new AppError("Not allowed to delete this card", 403));
  }

  await Card.deleteMany({ deck: deckId });

  await Deck.findByIdAndDelete(deckId);

  await User.findByIdAndUpdate(id, {
    $pull: { decks: deckId },
  });

  return sendResponse(res, 200, "Deck and all its cards deleted successfully");
});

const searchDeck = catchAsync(async (req, res, next) => {
  // validate search parameter
  // Convert search text to case-insensitive regex
  // query on deck
  // sort by recently updated

  const query = req.query.search;

  if (!query || query.trim().length === 0) {
    return next(new AppError("Search query missing", 404));
  }

  const regex = new RegExp(query, "i");

  const decks = await Deck.find({
    visible: true,
    user: { $ne: req.user._id },
    name: { $regex: regex },
  })
    .sort({ updatedAt: -1 })
    .select("_id name visible user createdAt updatedAt");

  return sendResponse(res, 200, "Fetched decks successfully", {
    total: decks.length,
    decks,
  });
});

const addPublicDeckToUser = catchAsync(async (req, res, next) => {
  // take deckid and userid
  // validate data
  // fetch that deck and its all cards
  // create new deck and duplicate every cards
  // add deck reference to user deck

  const { deckId } = req.params;

  if (!deckId || !isValidObjectId(deckId)) {
    return next(new AppError("provide valid deck id", 400));
  }

  if (!req.user || !req.user._id) {
    return next(new AppError("Unauthorized - User ID missing", 401));
  }
  const id = req.user._id;

  const originalDeck = await Deck.findById(deckId).populate("cards");

  if (!originalDeck) {
    return next(new AppError("Deck not found", 404));
  }

  if (!originalDeck.visible) {
    return next(new AppError("This deck is not publicly visible", 403));
  }

  const newDeck = await Deck.create({
    name: originalDeck.name + " (copy)",
    visible: true,
    user: id,
    cards: [],
  });

  const newCardIds = [];

  for (const card of originalDeck.cards) {
    const newCard = await Card.create({
      question: card.question,
      answer: card.answer,
      tag: card.tag,
      hint: card.hint,
      easeFactor: 2.5,
      repetitions: 0,
      reviewDate: Date.now(),
      user: id,
      deck: newDeck._id,
    });

    newCardIds.push(newCard._id);
  }

  newDeck.cards = newCardIds;
  await newDeck.save();

  await User.findByIdAndUpdate(id, {
    $push: { decks: newDeck._id },
  });

  return sendResponse(res, 200, "Deck added to your list", {
    deckId: newDeck._id,
    totalCards: newCardIds.length,
  });
});

export { decks, deckCards, deleteDeck, searchDeck, addPublicDeckToUser };
