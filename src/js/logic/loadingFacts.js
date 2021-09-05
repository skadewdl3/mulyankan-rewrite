import randomArray from 'unique-random-array';
import axios from 'axios';

// Different types of facts tokeep users engaged during loading/downloading screens
let arr = ['cat', 'quote', 'dog', 'math'];

// Initialize a randomArray (so that we can pick element and it doesn't repeat unless necessary)
let types = randomArray(arr);

// CORS Reverse Porxy URL to avoid CORS errors
let corsProxy = 'https://thingproxy.freeboard.io/fetch/';

export const randomFact = async () => {
  // Get random element (cat/quote) from arr
  let type = types();

  // Get quote/fact and return it
  let res = '';
  if (type === 'quote') {
    let { data } = await axios.get(`https://api.quotable.io/random`);
    res = `${data.content} —${data.author}`;
  } else if (type === 'cat') {
    res = await axios.get('https://catfact.ninja/fact');
  } else if (type === 'dog') {
    let { data } = await axios.get(
      `${corsProxy}https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?number=1`
    );
    res = data[0].fact;
  } else if (type === 'math') {
    res = await axios('http://numbersapi.com/random/math');
  }
  return res;
};
