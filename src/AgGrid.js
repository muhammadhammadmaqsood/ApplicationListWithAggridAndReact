import logo from "./logo.svg";
import "./App.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSSfunction
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Component,
  memo,
} from "react";
import { ColDef, Grid, GridOptions, GridReadyEvent } from "ag-grid-community";

const AgGrid = () => {
  // gridReference To use gridApi
  const gridRef = useRef();
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "#.",
      valueGetter: (param) => {
        return param.node.rowIndex + 1;
      },
      pinned: true,
      lockPinned: true,
      tooltipValueGetter: () => {
        return "Serial No.";
      },
      minWidth: 10,
      maxWidth: 50,
      filter: false,
    },
    {
      field: "date",
      tooltipField: "date",
      filter: "agDateColumnFilter",
    },
    { field: "temperatureC" },
    { field: "temperatureF" },
    { field: "summary" },
    {
      field: "MyColumnsGroups",
      marryChildren: true,
      children: [
        {
          headerName: "Sliver",
          // columnGroupShow: "open",
          field: "silver",
          cellRenderer: (p) => {
            return <>My Silver</>;
          },
        },
        {
          haederName: "Gold",
          //columnGroupShow: "open",
          field: "gold",
          cellRenderer: (p) => {
            return <>My Gold</>;
          },
        },
        {
          headerName: "Bronze",
          columnGroupShow: "open",
          field: "bronze",
          cellRenderer: (p) => {
            return <>My Bronze</>;
          },
        },
      ],
    },
  ]);

  // DefaultColDef sets props common to all Columns
  let defaultColDef = {
    sortable: true,
    filter: "agTextColumnFilter",
    resizable: true,
    floatingFilter: true,
  };

  const header = new Headers({ "Access-Control-Allow-Origin": "*" });
  // Example load data from sever
  useEffect(() => {
    const requestOptions = {};
    fetch("https://localhost:44340/WeatherForecast")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  const sizeToFit = useCallback(() => {
    gridRef.current.api.sizeColumnsToFit({ defaultMinWidth: 30 });
  }, []);
  return (
    <div>
      <h2> Learning Ag Grid</h2>
      <button onClick={sizeToFit}>Size to Fit</button>
      <div className="ag-theme-alpine" style={{ height: 1000 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          chil
        />
      </div>
    </div>
  );
};
export default AgGrid;
