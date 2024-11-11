import Main from "../Components/Main";
import ConsoleBlock from "../Components/Console";
import { memo, useState } from "react";
import { FixedSizeList } from "react-window";

// These row heights are arbitrary.
// Yours should be based on the content of the row.

const Row = memo(({ index, style, data }) => {
	console.log("row", index);
	return <div style={style}>Row {data[index].id}</div>;
});

const Example = ({ data }) => {
	console.log("list");

	return (
		<FixedSizeList height={150} itemCount={data.length} itemSize={50} width={300} overscanCount={5} itemData={data}>
			{Row}
		</FixedSizeList>
	);
};
function Test() {
	const [data, setData] = useState([
		{
			id: 1,
			name: "test",
		},
		{
			id: 2,
			name: "test",
		},
		{
			id: 3,
			name: "test",
		},
		{
			id: 4,
			name: "test",
		},
		{
			id: 5,
			name: "test",
		},
		{
			id: 6,
			name: "test",
		},
		{
			id: 7,
			name: "test",
		},
		{
			id: 8,
			name: "test",
		},
		{
			id: 9,
			name: "test",
		},
		{
			id: 10,
			name: "test",
		},
		{
			id: 11,
			name: "test",
		},
		{
			id: 12,
			name: "test",
		},
		{
			id: 13,
			name: "test",
		},
		{
			id: 14,
			name: "test",
		},
		{
			id: 15,
			name: "test",
		},
		{
			id: 16,
			name: "test",
		},
		{
			id: 17,
			name: "test",
		},
		{
			id: 18,
			name: "test",
		},
		{
			id: 19,
			name: "test",
		},
		{
			id: 20,
			name: "test",
		},
	]);

	return (
		<>
			<button type="button" onClick={() => setData([...data, { id: data.length + 1, name: "test" }])}>
				add
			</button>

			<Example data={data} />
		</>
	);
}

export default function MainPage() {
	return (
		<>
			<Main />
			<ConsoleBlock />
			{/* <Test /> */}
		</>
	);
}
