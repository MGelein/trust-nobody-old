const ACTIVE_USER = 'trustNobodyActiveUser';
const ACTIVE_SCORE = 'trustNobodyActiveScore';
const COMPLETED_QUIZZES = "trustNobodyCompletedQuizzes";

export function getActiveUser() {
    return window.localStorage.getItem(ACTIVE_USER);
}

export function setActiveUser(value: string) {
    window.localStorage.setItem(ACTIVE_USER, `${value}`);
}

export function getActiveScore() {
    return window.localStorage.getItem(ACTIVE_SCORE);
}

export function setActiveScore(value: number) {
    window.localStorage.setItem(ACTIVE_SCORE, `${value}`);
}

export function getCompletedQuizzes() {
    const value = window.localStorage.getItem(COMPLETED_QUIZZES);
    return (value ?? '').split(',');
}

export function setCompletedQuizzes(names: string[]) {
    window.localStorage.setItem(COMPLETED_QUIZZES, names.join(','));
}