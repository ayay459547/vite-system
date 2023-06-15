const reverse = (data) => {
  if (data.length === 0) return []
  const temp = data.shift()
  return [...reverse(data), temp]
}

console.log(reverse([1, 2, 3]))