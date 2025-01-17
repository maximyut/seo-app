import { useCallback, useEffect, useRef, useState } from "react";
import { DataGrid, GridActionsCellItem, GridRowEditStopReasons, ruRU } from "@mui/x-data-grid";

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from "@mui/material";

const editEl = (el, oldArray) => {
	const newArray = oldArray.map((obj) => {
		if (obj.id === el.id) {
			return el;
		}
		return obj;
	});

	return newArray;
};

const deleteEl = (el, oldArray) => {
	const newArray = oldArray.filter((row) => row.id !== el.id);
	return newArray;
};

const useMutation = () => {
	return useCallback(
		(newArray, pageName) =>
			new Promise((resolve, reject) => {
				try {
					window.electron.store.set(`pages.${pageName}`, newArray);

					resolve(newArray);
				} catch (error) {
					console.error(error);
					reject();
				}
			}),
		[],
	);
};

// eslint-disable-next-line react/prop-types
function BasicTable({ catalog, pageName, rowSelectionModel, setRowSelectionModel }) {
	const updateCatalog = useMutation();

	const [rows, setRows] = useState(catalog);
	const [snackbar, setSnackbar] = useState(null);
	const noButtonRef = useRef(null);
	const [promiseArguments, setPromiseArguments] = useState(null);

	const newArr = catalog.map((el) => {
		return Object.keys(el);
	});

	const keys = Array.from(new Set(newArr.flat()));

	const computeMutation = useCallback(
		(newRow, oldRow) => {
			// eslint-disable-next-line no-restricted-syntax
			for (const key of keys) {
				if (newRow[key] !== oldRow[key]) {
					return `${key} из '${oldRow[key]}' в '${newRow[key]}'`;
				}
			}

			return null;
		},
		[keys],
	);

	const handleDeleteClick = useCallback(
		(el) =>
			new Promise((resolve, reject) => {
				const newArray = deleteEl(el, rows);

				// Save the arguments to resolve or reject the promise later
				setPromiseArguments({ resolve, reject, oldRow: el, newArray, type: "delete" });
			}),
		[rows],
	);

	const handleRowEditStop = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const processRowUpdate = useCallback(
		(newRow, oldRow) =>
			new Promise((resolve, reject) => {
				const mutation = computeMutation(newRow, oldRow);
				const newArray = editEl(newRow, rows);
				if (mutation) {
					// Save the arguments to resolve or reject the promise later
					setPromiseArguments({ resolve, reject, newRow, oldRow, newArray, type: "edit" });
				} else {
					resolve(oldRow); // Nothing was changed
				}
			}),
		[computeMutation, rows],
	);

	const handleCloseSnackbar = () => setSnackbar(null);

	const handleNo = () => {
		const { oldRow, resolve } = promiseArguments;
		resolve(oldRow); // Resolve with the old row to not update the internal state
		setPromiseArguments(null);
	};

	const handleYes = async () => {
		const { oldRow, reject, resolve, newArray } = promiseArguments;

		try {
			// Make the HTTP request to save in the backend
			const response = await updateCatalog(newArray, pageName);
			setRows(response);
			setSnackbar({ children: "Каталог успешно сохранен", severity: "success" });
			resolve(response);
			setPromiseArguments(null);
		} catch (error) {
			console.error(error);
			setSnackbar({ children: error, severity: "error" });
			reject(oldRow);
			setPromiseArguments(null);
		}
	};

	const handleEntered = () => {
		// The `autoFocus` is not used because, if used, the same Enter that saves
		// the cell triggers "No". Instead, we manually focus the "No" button once
		// the dialog is fully open.
		// noButtonRef.current?.focus();
	};

	useEffect(() => {
		setRows(catalog);
	}, [catalog]);

	const renderConfirmDialog = () => {
		if (!promiseArguments) {
			return null;
		}

		const { oldRow, type } = promiseArguments;
		let text = "";
		switch (type) {
			case "edit": {
				text = `Нажимая "Да", вы измените ${computeMutation(promiseArguments.newRow, oldRow)}.`;
				break;
			}
			case "delete":
				text = `Нажимая "Да", вы удалите строку c ID ${oldRow.id}.`;
				break;
			default:
				break;
		}
		return (
			<Dialog maxWidth="xs" TransitionProps={{ onEntered: handleEntered }} open={!!promiseArguments}>
				<DialogTitle>Вы уверены?</DialogTitle>

				<DialogContent dividers>{text}</DialogContent>
				<DialogActions>
					<Button ref={noButtonRef} onClick={handleNo}>
						Нет
					</Button>
					<Button onClick={handleYes}>Да</Button>
				</DialogActions>
			</Dialog>
		);
	};

	const columns = [
		...keys.map((key) => {
			if (key === "id") {
				return { field: key, headerName: key, width: 200, editable: false };
			}
			return { field: key, headerName: key, width: 200, editable: true };
		}),
		{ field: "text_1", headerName: "Пользовательский текст 1", width: 200, editable: true },
		{ field: "text_2", headerName: "Пользовательский текст 2", width: 200, editable: true },

		{
			field: "actions",
			type: "actions",
			headerName: "Actions",
			width: 100,
			cellClassName: "actions",
			getActions: (el) => {
				return [
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label="Delete"
						onClick={() => {
							handleDeleteClick(el);
						}}
						color="inherit"
					/>,
				];
			},
		},
	];
	console.log(catalog);
	return (
		<div style={{ width: "100%", height: "calc(100vh - 250px)" }}>
			{renderConfirmDialog()}
			<DataGrid
				editMode="cell"
				rows={rows}
				columns={columns}
				getRowHeight={() => 200}
				getRowId={(row) => row.id}
				// getEstimatedRowHeight={() => 100}
				initialState={{
					pagination: {
						paginationModel: { page: 0, pageSize: 25 },
					},
				}}
				pageSizeOptions={[10, 25, 50, 100]}
				localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
				onRowEditStop={handleRowEditStop}
				processRowUpdate={processRowUpdate}
				onProcessRowUpdateError={(err) => console.error(err)}
				slotProps={{
					toolbar: { setRows },
				}}
				checkboxSelection={pageName === "KeysSo"}
				disableRowSelectionOnClick
				onRowSelectionModelChange={(newRowSelectionModel) => {
					setRowSelectionModel(newRowSelectionModel);
				}}
				rowSelectionModel={rowSelectionModel}
			/>
			{!!snackbar && (
				<Snackbar open onClose={handleCloseSnackbar} autoHideDuration={4000}>
					<Alert {...snackbar} onClose={handleCloseSnackbar} variant="filled" />
				</Snackbar>
			)}
		</div>
	);
}

export default BasicTable;
