const keys = ["key1", "key2", "key3"];
const text = ["text1", "text2", "text3"];

const newArr = keys
	.map((key) => {
		const arr = [];
		text.forEach((el) => arr.push(`${key} ${el}`));
		return arr;
	})
	.flat();

console.log(newArr);
