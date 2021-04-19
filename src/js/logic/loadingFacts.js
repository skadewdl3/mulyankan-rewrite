import randomArray from 'unique-random-array';
import axios from 'axios';

let arr = [
  { type: 'category', content: 'trivia' },
  { type: 'category', content: 'math' },
  { type: 'category', content: 'year' },
  { type: 'category', content: 'date' },
  {
    type: 'fact',
    content: 'Copy and Paste was invented in the 1960s by Larry Tesler.',
  },
  {
    type: 'fact',
    content:
      "An apple didn't actully fall on Newton's head, it fell in front of him.",
  },
  {
    type: 'fact',
    content:
      'The best number is 73. Why? 73 is the 21st prime number. Its mirror, 37, is the 12th and its mirror, 21, is the product of multiplying 7 and 3 and in binary 73 is a palindrome, 1001001, which backwards is 1001001.',
  },
  {
    type: 'fact',
    content:
      'The mathematician Ramanujan once proved that: 1 + 2 + 3 + ... upto infinity is equal to -1/12.',
  },
  {
    type: 'url',
    content: 'https://catfact.ninja/fact',
  },
];

let types = randomArray(arr);

export const randomFact = async () => {
  let res = '';
  let obj = types();
  if (obj.type === 'category') {
    res = await axios.get(`http://numbersapi.com/random/${obj.content}`);
  } else if (obj.type === 'url') {
    res = await axios.get(obj.content);
  } else if (obj.type === 'fact') {
    res = obj.content;
  }
  return res;
};
