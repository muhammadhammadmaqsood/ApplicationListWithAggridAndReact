import logo from "./logo.svg";
import "./App.css";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Component,
  memo,
} from "react";

const FunctionComp = (param) => {
  let clickedFunctionComponent = useCallback(() => {
    alert("I am clicked from function component");
  });
  return (
    <>
      <button onClick={clickedFunctionComponent}>Function Component</button>{" "}
      {param.value}
    </>
  );
};

class ClassComp extends Component {
  render() {
    let clickedClassComponent = () => {
      alert("I am clicked from class component");
    };
    return (
      <>
        <button onClick={clickedClassComponent}>Class Comp</button>{" "}
        {this.props.value}
      </>
    );
  }
}

let MyCellRenderer = (p) => {
  const useRenderCount = useRef(1);
  return (
    <p>
      {useRenderCount.current++} This text from cellRenderer <b>{p.value}</b>{" "}
      Parameter passed{" "}
      <b>
        {p.buttonText} {p.customParameter}
      </b>
    </p>
  );
};

function App() {
  const gridRef = useRef();

  let cellListener = useCallback((e) => {
    alert(e.value);
  });
  const deselectAll = useCallback(() => {
    gridRef.current.api.deselectAll();
  });
  let [columns, setColumns] = useState([
    {
      headerName: "#.",
      cellRenderer: null,
      valueGetter: (p) => {
        let nodeTest = p.node;
        console.log(nodeTest.rowIndex);
        return nodeTest.rowIndex + 1;
      },
      pinned: "left",
      flex: 1,
      lockPosition: true,
      tooltipValueGetter: (p) => {
        return "Serial No.";
      },
    },
    {
      field: "make",
      cellRenderer: (p) => (
        <>
          <b>Make of car: </b>
          {p.value}
        </>
      ),
      tooltipField: "this is field tooltip.",
    },
    {
      field: "model",
      tooltipField: "this is field tooltip.",
      cellRenderer: null,
    },
    {
      field: "price",
      cellRendererSelector: (p) => {
        if (p.value > 35000) {
          return { component: ClassComp };
        } else if (p.value <= 35000) {
          return { component: memo(FunctionComp) };
        }
      },
    },
    {
      headerName: "My Custom Column",
      editable: true,
      valueGetter: (param) => {
        console.log(param.data.price);
        return param.data.price / 2;
      },
      valueFormatter: (p) => {
        console.log(p);
        return `[${p.value}]`; //this will usefull when cellRenderer is not exists in coldefs or null.
      },
      tooltipValueGetter: () => {
        return "This value is half of price column";
      },
      //cellRenderer: null,
    },
  ]);
  // let columnsDefaultSettings = useMemo(()=>({
  //   resizable: true,
  //   sortable: true,
  //   filter: true,
  // }),[]);
  let columnsDefaultSettings = useMemo(() => ({
    resizable: true,
    sortable: false,
    filter: "agTextColumnFilter",
    //cellRenderer: memo(MyCellRenderer),
    cellRendererParams: {
      buttonText: "=",
      customParameter: "#",
    },
    flex: 1,
    lockPinned: true,
    headerTooltip: "AG grid Header Tool Tip",
    //tooltipField: "Field",
  }));
  let [rowsUseState, setRows] = useState([]);
  useEffect(() => {
    let response = fetch("https://www.ag-grid.com/example-assets/row-data.json")
      .then((result) => result.json())
      .then((data) => setRows(data));
    //console.log("Here I am");
  });

  return (
    <div className="ag-theme-alpine" style={{ height: 1000, width: 2200 }}>
      <p></p>
      <input type={"button"} value={"Deselect Rows"} onClick={deselectAll} />
      <p></p>
      <AgGridReact
        rowData={rowsUseState}
        columnDefs={columns}
        defaultColDef={columnsDefaultSettings}
        ref={gridRef}
        animateRows={true}
        rowSelection={"multiple"}
        suppressColumnMoveAnimation={true}
        //onCellClicked={cellListener}
      />
    </div>
  );
}

export default App;
