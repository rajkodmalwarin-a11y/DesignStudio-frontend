import { proxy } from 'valtio';

export const historyState = proxy({
  past: [],
  present: null,
  future: [],
  maxHistory: 20
});

export const historyActions = {
  pushState(state) {
    if (historyState.present) {
      historyState.past.push(JSON.parse(JSON.stringify(historyState.present)));
      
      // Limit history size
      if (historyState.past.length > historyState.maxHistory) {
        historyState.past.shift();
      }
    }
    
    historyState.present = JSON.parse(JSON.stringify(state));
    historyState.future = [];
  },

  undo() {
    if (historyState.past.length === 0) return null;
    
    const previous = historyState.past.pop();
    historyState.future.unshift(JSON.parse(JSON.stringify(historyState.present)));
    historyState.present = previous;
    
    return previous;
  },

  redo() {
    if (historyState.future.length === 0) return null;
    
    const next = historyState.future.shift();
    historyState.past.push(JSON.parse(JSON.stringify(historyState.present)));
    historyState.present = next;
    
    return next;
  },

  canUndo() {
    return historyState.past.length > 0;
  },

  canRedo() {
    return historyState.future.length > 0;
  }
};