const calculateLevel = (eggsConsumed: number): number => {
  // 100 eggs = level 1
  return Math.floor(Math.log2(eggsConsumed / 100 + 1)) + 1;
};

const eggsForNextLevel = (currentLevel: number): number => {
  return Math.ceil((Math.pow(2, currentLevel) - 1) * 100);
};

const progressToNextLevel = (
  eggsConsumed: number,
  currentLevel: number
): number => {
  const eggsForCurrent = eggsForNextLevel(currentLevel - 1);
  const eggsForNext = eggsForNextLevel(currentLevel);
  return (eggsConsumed - eggsForCurrent) / (eggsForNext - eggsForCurrent);
};

export { calculateLevel, eggsForNextLevel, progressToNextLevel };
