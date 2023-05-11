import { getActiveScore, getActiveTime, getActiveUser } from "./storage";

const SUFFIX = 1;

const QUIZ_URL = `https://raw.githubusercontent.com/MGelein/trust-nobody-old/master/data/quizzes${SUFFIX}.txt`;
const USER_URL = `https://raw.githubusercontent.com/MGelein/trust-nobody-old/master/data/users${SUFFIX}.txt`;
const SCORE_URL = "https://interwing.nl/trust-nobody/api/score.php?method=";

export type User = {
  name: string;
  pass: string;
  isMol: boolean;
};

export type Answer = {
  text: string;
  correct: boolean;
};

export type Question = {
  text: string;
  answers: Answer[];
};

export type Quiz = {
  name: string;
  questions: Question[];
};

export type Score = {
  name: string;
  score: number;
  time: number;
  molCorrect: number;
};

function clean(line: string, symbol: string) {
  return line.replace(symbol, "").trim();
}

function transformQuizData(data: string) {
  const quizzes: Quiz[] = [];
  const lines = data.split("\n");

  lines.forEach((line) => {
    if (line.startsWith("#")) {
      quizzes.push({ name: clean(line, "#"), questions: [] });
      return;
    }

    const activeQuiz = quizzes[quizzes.length - 1];
    if (!activeQuiz) return;

    if (line.startsWith("?")) {
      activeQuiz.questions.push({ text: clean(line, "?"), answers: [] });
    }

    const activeQuestion =
      activeQuiz.questions[activeQuiz.questions.length - 1];
    if (!activeQuestion) return;

    if (line.startsWith("-") || line.startsWith(">")) {
      const text = clean(clean(line, ">"), "-");
      activeQuestion.answers.push({ text, correct: line.startsWith(">") });
    }
  });

  return quizzes;
}

function transformUserData(data: string) {
  const users: User[] = [];
  const lines = data.split("\n");

  lines.forEach((line) => {
    const [nameString, pass] = line.split(",").map((part) => part.trim());
    users.push({
      name: nameString.replace(">", "").trim(),
      pass,
      isMol: nameString.includes(">"),
    });
  });

  return users;
}

function getRandomSalt() {
  return `?t=${Date.now()}`;
}

export async function getQuizData() {
  const data = await (await fetch(QUIZ_URL + getRandomSalt())).text();
  return transformQuizData(data);
}

export async function getUserData() {
  const data = await (await fetch(USER_URL + getRandomSalt())).text();
  return transformUserData(data);
}

export async function registerUserScore(molCorrect: number) {
  const user = encodeURI(getActiveUser());
  const score = getActiveScore();
  const time = getActiveTime();
  return updateUserScore(user, score, time, molCorrect);
}

export async function updateUserScore(
  user: string,
  score: number,
  time: number,
  molCorrect: number
) {
  const parameters = `register&user=${user}&score=${score}&time=${time}&mol=${molCorrect}`;
  const response = await (await fetch(SCORE_URL + parameters)).text();
  return response;
}

export async function getUserScores() {
  const data = await (await fetch(SCORE_URL + "read")).text();
  const scores: Score[] = data.split("\n").map((line) => {
    const [name, scoreText, timeText, molCorrectText] = line.split(",");
    return {
      name,
      score: parseInt(scoreText, 10),
      time: parseInt(timeText, 10),
      molCorrect: parseInt(molCorrectText, 10),
    };
  });
  return scores.filter((score) => score.name.length > 0);
}

export async function resetUserScores() {
  const response = await (await fetch(SCORE_URL + "reset")).text();
  return response;
}
