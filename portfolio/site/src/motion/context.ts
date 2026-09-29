import { createContext, useContext } from 'react';

/** Shared motion state for components outside the engine (e.g. the hover preview). */
export const MotionContext = createContext({ calm: false });

export const useMotion = () => useContext(MotionContext);
