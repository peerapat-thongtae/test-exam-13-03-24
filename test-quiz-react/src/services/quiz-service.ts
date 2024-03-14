
import axios from 'axios';
const quizAPI = axios.create({
  baseURL: 'https://the-trivia-api.com/',
});

export default quizAPI;
