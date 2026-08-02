const STORAGE_KEY = 'skeleton_progress_v1';
let remoteSync = null;

const emptyProgress = () => ({
  version: 3,
  completedTopics: [],
  completedUnits: [],
  readUnits: [],
  readItems: [],
  activeSession: null,
  questionStats: {},
  savedQuestionIds: [],
  doubtfulQuestionIds: [],
  practicalDraft: '',
  practicalChecklist: [],
  practicalPromptIndex: 0,
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
    version: 3,
    completedTopics: Array.isArray(progress.completedTopics) ? [...new Set(progress.completedTopics)] : [],
    completedUnits: Array.isArray(progress.completedUnits) ? [...new Set(progress.completedUnits)] : [],
    readUnits: Array.isArray(progress.readUnits) ? [...new Set(progress.readUnits)] : [],
    readItems: Array.isArray(progress.readItems) ? [...new Set(progress.readItems)] : [],
    activeSession: progress.activeSession && typeof progress.activeSession === 'object' ? progress.activeSession : null,
    questionStats: progress.questionStats && typeof progress.questionStats === 'object' ? progress.questionStats : {},
    savedQuestionIds: Array.isArray(progress.savedQuestionIds) ? [...new Set(progress.savedQuestionIds)] : [],
    doubtfulQuestionIds: Array.isArray(progress.doubtfulQuestionIds) ? [...new Set(progress.doubtfulQuestionIds)] : [],
    practicalDraft: typeof progress.practicalDraft === 'string' ? progress.practicalDraft : '',
    practicalChecklist: Array.isArray(progress.practicalChecklist) ? [...new Set(progress.practicalChecklist.map(Number).filter(Number.isFinite))] : [],
    practicalPromptIndex: Number.isInteger(Number(progress.practicalPromptIndex)) ? Number(progress.practicalPromptIndex) : 0
  };
}

export const progressStore = {
  setRemoteSync(sync) {
    remoteSync = typeof sync === 'function' ? sync : null;
  },
  load() {
    try { return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); } catch { return emptyProgress(); }
  },
  save(progress) {
    const next = { ...normalize(progress), updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (remoteSync) {
      try { Promise.resolve(remoteSync(next)).catch(() => {}); } catch { /* local storage remains the fallback */ }
    }
    return next;
  },
  reset() {
    const next = emptyProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (remoteSync) {
      try { Promise.resolve(remoteSync(next)).catch(() => {}); } catch { /* local storage remains the fallback */ }
    }
    return next;
  }
};
