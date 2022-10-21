export const unique = (inputArray) => {
  // need to return an array of unique items
  let uniqueArray = inputArray.filter(
    (item, i, array) => array.indexOf(item) === i
  );
  return uniqueArray;
};

// Calculate the score for a target passing in the shots array for a target
export const getTargetScore = (shotsArray) => {
  let targetScore = 0;
  shotsArray?.forEach((shot) => {
    targetScore += shot.scoreRing;
  });
  return targetScore;
};
