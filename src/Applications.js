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

const Applications = () => {
  const gridRef = useRef();
  const DeSelectAll = useCallback(() => {
    gridRef.current.api.deselectAll();
  });

  const ArchiveAll = useCallback(() => {
    alert("Are you sure you want to archive all?");
  }, []);

  let [applications, setApplications] = useState([]);
  let [organisationSetup, setOrganisationSetup] = useState([]);

  let [stages, setStages] = useState([]);
  let [statuses, setStatuses] = useState([]);
  //Columns Fields.
  let [applicationColumns, setApplicationColumns] = useState([
    {
      headerName: "#.",
      valueGetter: (p) => {
        return p.node.rowIndex + 1;
      },
      pinned: true,
      tooltipValueGetter: () => {
        return "Serial No.";
      },
      filter: false,
      minWidth: 10,
      maxWidth: 70,
    },
    {
      headerName: "Application ID",
      field: "id",
    },
    {
      headerName: "Name",
      field: "firstName",
    },
    {
      headerName: "City",
      field: "city",
    },
    {
      headerName: "Phone",
      field: "phone",
    },
    {
      headerName: "Mobile",
      field: "mobilePhone",
    },
    {
      headerName: "Birth Date",
      field: "dateOfBirth",
      filter: "agDateColumnFilter",
    },
    {
      headerName: "Apply Date",
      field: "appliedOn",
      filter: "agDateColumnFilter",
    },
    {
      headerName: "Applciation Status",
      field: "status",
    },
  ]);

  //Columns Defualt Settings
  const defaultColumnsDefs = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      flex: 1,
      filter: "agTextColumnFilter",
      floatingFilter: true,
    }),
    []
  );
  const data = useEffect(() => {
    const requestOptions = {
      method: "POST",
      // headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          // department: [],
          // position: [],
          // location: [],
          // stage: [],
          // status: [],
          // gender: [],
          // excludeArchieve: true,
          // onlyairlineEmployees: false,
          // displayMyActionItems: false,
          // aggrid: {
          startRow: 0,
          endRow: 100,
          rowGroupCols: [],
          valueCols: [],
          pivotCols: [],
          pivotMode: false,
          groupKeys: [],
          filterModel: {
            firstName: {
              filterType: "text",
              operator: "AND",
              condition1: {
                filterType: "text",
                type: "contains",
                filter: "Bob",
              },
              condition2: {
                filterType: "text",
                type: "contains",
                filter: "Alice",
              },
            },
          },
          sortModel: [
            {
              sort: "asc",
              colId: "appliedOn",
            },
          ],
        }
        //}
      ),
    };
    fetch(
      "https://afe84190-edab-473f-a319-4f69b87c9388.mock.pstmn.io/api/employees/GetApplications",
      requestOptions
    )
      .then((result) => result.json())
      .then((data) => setApplications(data));
    fetch(
      "https://afe84190-edab-473f-a319-4f69b87c9388.mock.pstmn.io/api/employees/GetPositions"
    )
      .then((result) => result.json())
      .then((data) => setOrganisationSetup(data));

    fetch(
      "https://afe84190-edab-473f-a319-4f69b87c9388.mock.pstmn.io/api/employees/GetStages"
    )
      .then((result) => result.json())
      .then((data) => setStages(data));

    fetch(
      "https://afe84190-edab-473f-a319-4f69b87c9388.mock.pstmn.io/api/employees/GetStatus"
    )
      .then((result) => result.json())
      .then((data) => setStatuses(data));
  }, []);
  const departmentsUnique = [
    ...new Set(organisationSetup.map((d) => d.department)),
  ];
  const positionsUnique = [
    ...new Set(organisationSetup.map((p) => p.position)),
  ];
  const locationsUnique = [
    ...new Set(organisationSetup.map((p) => p.location)),
  ];
  return (
    <>
      <div className="ag-theme-alpine" style={{ height: 1000 }}>
        <h2>Applications</h2>
        <button onClick={DeSelectAll}>Deselect All</button>
        <button onClick={ArchiveAll}>Archive All</button>
        <label htmlFor="departments">Department:</label>
        <select name="departments" id="departments">
          {departmentsUnique.map((m, i) => {
            return (
              <option key={i} value={m}>
                {m}
              </option>
            );
          })}
        </select>
        <label htmlFor="positions">Position:</label>
        <select name="positions" id="positions">
          {positionsUnique.map((p, i) => {
            return (
              <option key={i} value={p}>
                {p}
              </option>
            );
          })}
        </select>
        <label htmlFor="locations">Location:</label>
        <select name="locations" id="locations">
          {locationsUnique.map((l, i) => {
            return (
              <option key={i} value={l}>
                {l}
              </option>
            );
          })}
        </select>
        <label htmlFor="stages">Stage:</label>
        <select name="stages" id="stages">
          {stages.map((s, i) => {
            return (
              <option key={i} value={s}>
                {s}
              </option>
            );
          })}
        </select>
        <label htmlFor="statuses">Status:</label>
        <select name="statuses" id="statuses">
          {statuses.map((s, i) => {
            return (
              <option key={i} value={s}>
                {s}
              </option>
            );
          })}
        </select>
        <p></p>
        <AgGridReact
          ref={gridRef}
          rowData={applications}
          columnDefs={applicationColumns}
          defaultColDef={defaultColumnsDefs}
          animateRows={true}
          rowSelection={"multiple"}
        />
      </div>
    </>
  );
};
export default Applications;
