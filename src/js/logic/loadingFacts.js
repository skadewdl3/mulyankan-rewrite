import randomArray from 'unique-random-array';
import axios from 'axios';

let arr = [
  {
    type: 'cat',
  },
  { type: 'quote', content: 'random' },
];

let types = randomArray(arr);

export const randomFact = async () => {
  let res = '';
  let obj = types();
  if (obj.type === 'quote') {
    let { data } = await axios.get(`https://api.quotable.io/random`);
    console.log(data);
    res = `${data.content} —${data.author}`;
  } else if (obj.type === 'cat') {
    res = await axios.get('https://catfact.ninja/fact');
  }
  return res;
};
