export const unique = (inputArray) => {
  // need to return an array of unique items
  let uniqueArray = inputArray.filter(
    (item, i, array) => array.indexOf(item) === i
  );
  return uniqueArray;
};
