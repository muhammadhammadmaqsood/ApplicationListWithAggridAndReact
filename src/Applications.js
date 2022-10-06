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
  let [applications, setApplications] = useState([]);
  let [organisationSetup, setOrganisationSetup] = useState([]);
  let filtersSettings=false;
  const DeSelectAll = useCallback(() => {
    gridRef.current.api.deselectAll();
  });
  const ArchiveAll = useCallback(() => {
    if(window.confirm("Are you sure you want to archive selected applications?")===true){
       window.alert("Archived!");
    }
    else{

    }
  }, []);
  const ClearFilter = useCallback(() => {
    filtersSettings=false;
  });



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

  const GetApplications = ()=>{
    let myHeader={ 
          'Content-Type': 'application/json',
        'Accept': 'appicatilon/json'
       };
       let myApplications =new Request("./api_response/GetApplications.json");
        fetch(myApplications,myHeader)
        .then((result) => result.json())
        .then((data) => setApplications(data));
  }
  const GetOrganizationSetup = ()=>{
    let myHeader={ 
          'Content-Type': 'application/json',
        'Accept': 'appicatilon/json'
       };
       let myOrganizationSetup =new Request("./api_response/GetPositions.json");
        fetch(myOrganizationSetup,myHeader)
        .then((result) => result.json())
        .then((data) => setOrganisationSetup(data));
  }
  const GetStages = ()=>{
    let myHeader={ 
          'Content-Type': 'application/json',
        'Accept': 'appicatilon/json'
       };
       let myStages =new Request("./api_response/GetStages.json");
        fetch(myStages,myHeader)
        .then((result) => result.json())
        .then((data) => setStages(data));
  }
  const GetStatuses = ()=>{
    let myHeader={ 
          'Content-Type': 'application/json',
        'Accept': 'appicatilon/json'
       };
       let myStatuses =new Request("./api_response/GetStatuses.json");
        fetch(myStatuses,myHeader)
        .then((result) => result.json())
        .then((data) => setStatuses(data));
  }
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
  
    GetApplications();
    GetOrganizationSetup();
    GetStages();
    GetStatuses();
    // fetch(
    //   "https://afe84190-edab-473f-a319-4f69b87c9388.mock.pstmn.io/api/employees/GetPositions"
    // )
    //   .then((result) => result.json())
    //   .then((data) => setOrganisationSetup(data));

    // fetch(
    //   "https://afe84190-edab-473f-a319-4f69b87c9388.mock.pstmn.io/api/employees/GetStages"
    // )
    //   .then((result) => result.json())
    //   .then((data) => setStages(data));

    // fetch(
    //   "https://afe84190-edab-473f-a319-4f69b87c9388.mock.pstmn.io/api/employees/GetStatus"
    // )
    //   .then((result) => result.json())
    //   .then((data) => setStatuses(data));
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
    <h2>Applications</h2>
    <div className="row">
      <div className="col-md-2">
        <div className="form-group">
        <label htmlFor="departments" className="control-label">Department:</label>
        <select name="departments" id="departments" className="form-control">
        <option  value="">
                All
              </option>
          {departmentsUnique.map((m, i) => {
            return (
              <option key={i} value={m}>
                {m}
              </option>
            );
          })}
        </select>
        </div>
      </div>
      <div className="col-md-2">
<div className="form-group">
<label htmlFor="positions">Position:</label>
        <select name="positions" id="positions" className="form-control">
        <option  value="">
                All
              </option>
          {positionsUnique.map((p, i) => {
            return (
              <option key={i} value={p}>
                {p}
              </option>
            );
          })}
        </select>
</div>
      </div>
      <div className="col-md-2">
        <div className="form-group">
        <label htmlFor="locations">Location:</label>
        <select name="locations" id="locations" className="form-control">
        <option  value="">
                All
              </option>
          {locationsUnique.map((l, i) => {
            return (
              <option key={i} value={l}>
                {l}
              </option>
            );
          })}
        </select>
        </div>
      </div>
        <div className="col-md-2">
        <div className="form-group">
        <label htmlFor="stages">Stage:</label>
        <select name="stages" id="stages" className="form-control">
          {stages.map((s, i) => {
            return (
              <option key={i} value={s}>
                {s}
              </option>
            );
          })}
        </select>
        </div>
        </div>
        <div className="col-md-2">
        <div className="form-group">
        <label htmlFor="statuses">Status:</label>
        <select name="statuses" id="statuses" className="form-control">
          {statuses.map((s, i) => {
            return (
              <option key={i} value={s}>
                {s}
              </option>
            );
          })}
        </select>
       
        </div>
      </div>
    </div>
    <p></p>
    <div className="row">
    <div className="col-md-2">
    <div className="form-group">
        <input type="button" className="btn btn-primary" value="Deselect All" onClick={DeSelectAll}/>
       </div>
       </div>

       <div className="col-md-2">
       <div className="form-group">
        <input type="button" className="btn btn-primary" value="Archive All" onClick={ArchiveAll}/>
       </div>
       </div>
       <div className="col-md-3">
       <div className="form-check">
        <input type="checkbox" className="form-check-input" id="cbDisplayMyActionItems" value="" />
        <label className="form-check-label" htmlFor="cbDisplayMyActionItems">Display my action items</label>
       </div>
       </div>
       <div className="col-md-3">
       <div className="form-check">
        <input type="checkbox" className="form-check-input" id="cbExcludeArchive" value="" />
        <label className="form-check-label" htmlFor="cbExcludeArchive">Excluded Archive</label>
       </div>
       </div>
    </div>
    
      <p></p>
      
      <div className="ag-theme-alpine" style={{ height: 1000 }}>

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
