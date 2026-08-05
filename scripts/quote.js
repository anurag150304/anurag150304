/**
 * Returns a developer quote selected randomly or from funfacts data.
 * @param {Array} quotes 
 * @returns {object} { quote, author }
 */
export function getRandomQuote(quotes = []) {
  const defaultQuotes = [
    {
      quote: "First, solve the problem. Then, write the code.",
      author: "John Johnson"
    },
    {
      quote: "Simplicity is prerequisite for reliability.",
      author: "Edsger W. Dijkstra"
    },
    {
      quote: "Make it work, make it right, make it fast.",
      author: "Kent Beck"
    },
    {
      quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      author: "Martin Fowler"
    }
  ];

  const pool = Array.isArray(quotes) && quotes.length > 0 ? quotes : defaultQuotes;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
