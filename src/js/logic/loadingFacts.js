import randomArray from 'unique-random-array';
import axios from 'axios';

// Different types of facts (cat facts, quotes, maybe I'll add more later)
let arr = [
  {
    type: 'cat',
  },
  { type: 'quote' },
];

// Initialize a randomArray (so that we can pick element and it doesn't repeat unless necessary)
let types = randomArray(arr);

export const randomFact = async () => {
  // Get random element (cat/quote) from arr
  let obj = types();

  // Get quote/fact and return it
  let res = '';
  if (obj.type === 'quote') {
    let { data } = await axios.get(`https://api.quotable.io/random`);
    res = `${data.content} —${data.author}`;
  } else if (obj.type === 'cat') {
    res = await axios.get('https://catfact.ninja/fact');
  }
  return res;
};
