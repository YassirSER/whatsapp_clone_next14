const unique = (id1: string, id2: string) => {
  const lettered1 = id1.replace(/[^a-z]/gi, "");
  const lettered2 = id2.replace(/[^a-z]/gi, "");
  const sum = lettered1 + lettered2;
  return sum.split("").sort().join("");
};

export default unique;
