const STORAGE_KEY = 'skeleton_progress_v1';

const emptyProgress = () => ({
  version: 2,
  completedTopics: [],
  completedUnits: [],
  readUnits: [],
  activeSession: null,
  questionStats: {},
  savedQuestionIds: [],
  doubtfulQuestionIds: [],
  currentTopicId: null,
  currentUnitId: null,
  answered: 0,
  correct: 0,
  incorrect: 0,
  lastMode: null,
  updatedAt: null
});

function normalize(progress = {}) {
  return {
    ...emptyProgress(),
    ...progress,
    version: 2,
    completedTopics: Array.isArray(progress.completedTopics) ? [...new Set(progress.completedTopics)] : [],
    completedUnits: Array.isArray(progress.completedUnits) ? [...new Set(progress.completedUnits)] : [],
    readUnits: Array.isArray(progress.readUnits) ? [...new Set(progress.readUnits)] : [],
    activeSession: progress.activeSession && typeof progress.activeSession === 'object' ? progress.activeSession : null,
    questionStats: progress.questionStats && typeof progress.questionStats === 'object' ? progress.questionStats : {},
    savedQuestionIds: Array.isArray(progress.savedQuestionIds) ? [...new Set(progress.savedQuestionIds)] : [],
    doubtfulQuestionIds: Array.isArray(progress.doubtfulQuestionIds) ? [...new Set(progress.doubtfulQuestionIds)] : []
  };
}

export const progressStore = {
  load() {
    try { return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); } catch { return emptyProgress(); }
  },
  save(progress) {
    const next = { ...normalize(progress), updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  },
  reset() { const next = emptyProgress(); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); return next; }
};
