// Return an array of unique elements given any input array
export const unique = (inputArray) => {
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

// Given the complete array of targets by date (showTargets), the following code returns an array of unique target elements
export const uniqueTargets = (targetsArray) => {
  return unique(
    targetsArray.map(({ target }) => {
      return target;
    })
  );
};
