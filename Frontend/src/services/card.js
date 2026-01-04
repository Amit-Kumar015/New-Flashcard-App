// import axios from "axios";

// const url = import.meta.env.VITE_API_URL;

// const fetchCards = async () => {
//   try {
//     const response = await axios.get(`${url}/flashcard/pending`);
//     setCards(response.data?.data);
//   } catch (error) {
//     toast.error(error.response?.data?.error || "Fetching cards failed");
//   }
// };

// const onDelete = async (id) => {
//   axios
//     .delete(`${url}/flashcard/${id}`)
//     .then((response) => {
//       toast.success("Card deleted successfully");
//       fetchCards();
//     })
//     .catch((err) => {
//       toast.error("Error deleting card");
//     });
// };

// const onSave = async (id, updateCard) => {
//   try {
//     const response = await axios.patch(`${url}/flashcard/${id}`, {
//       newQuestion: updateCard.question,
//       newAnswer: updateCard.answer,
//       newTag: updateCard.tag,
//       newDeck: updateCard.deck,
//       newHint: updateCard.hint,
//     });
//     toast.success("card updated successfully");
//   } catch (error) {
//     toast.error("Error in updating card");
//   }
// };

// export {fetchCards, onDelete, onSave}
