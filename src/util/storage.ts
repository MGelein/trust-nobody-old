const ACTIVE_USER = 'trustNobodyActiveUser';
const ACTIVE_SCORE = 'trustNobodyActiveScore';
const ACTIVE_TIME = 'trustNobodyActiveTime';
const COMPLETED_QUIZZES = "trustNobodyCompletedQuizzes";

export function getActiveUser() {
    return window.localStorage.getItem(ACTIVE_USER);
}

export function setActiveUser(value: string) {
    window.localStorage.setItem(ACTIVE_USER, `${value}`);
}

export function getActiveScore() {
    return parseInt(window.localStorage.getItem(ACTIVE_SCORE) ?? '0', 10);
}

export function setActiveScore(value: number) {
    window.localStorage.setItem(ACTIVE_SCORE, `${value}`);
}

export function getCompletedQuizzes() {
    const value = window.localStorage.getItem(COMPLETED_QUIZZES);
    return value ? value.split(',') : [];
}

export function setCompletedQuizzes(names: string[]) {
    window.localStorage.setItem(COMPLETED_QUIZZES, names.join(','));
}

export function getActiveTime() {
    const timeString = window.localStorage.getItem(ACTIVE_TIME);
    return timeString ? parseInt(timeString, 10) : 0;
}

export function setActiveTime(time: number) {
    window.localStorage.setItem(ACTIVE_TIME, `${time}`);
}