import logo from "./logo.svg";
import "./App.css";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';// Optional theme CSSfunction
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Component,
  memo,
} from "react";
import {LicenseManager} from "ag-grid-enterprise";
//import "ag-grid-enterprise";
LicenseManager.setLicenseKey("CompanyName=Zapways Inc.,LicensedApplication=Zapways,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=2,LicensedProductionInstancesCount=1,AssetReference=AG-032998,SupportServicesEnd=16_September_2023_[v2]_MTY5NDgxODgwMDAwMA==9e022f7e559e700b159e59f21effa4a7");

function ServerSideDatasource(server) {
  return {
    getRows: function(params) {
      console.log('[Datasource] - rows requested by grid: ', params.request);
      var response = server.getData(params.request);
      setTimeout(function() {
        if (response.success) {
          params.successCallback(response.rows, response.lastRow);
        } else {
          params.failCallback();
        }
      }, 200);
    },
  };
}

function FakeServer(allData) {
  // alasql.options.cache = false;
 
   return {
     getData: function(request) {
       //var results = executeQuery(request);
       return {
         success: true,
         rows: allData,
         lastRow: allData.length,
       };
     }
   };
 }
const Applications = () => {
  const gridRef = useRef();
  let [department, setDepartment] = useState("");
  let [applications, setApplications] = useState([]);
  let [organisationSetup, setOrganisationSetup] = useState([]);
  let filtersSettings=false;
  const DeSelectAll = useCallback(() => {
    gridRef.current.api.deselectAll();
  });
  const ArchiveAll = useCallback(() => {
    if(window.confirm("Are you sure you want to archive selected applications?")===true){
       window.alert("Archived!");
       gridRef.current.api.deselectAll();
    }
    else{

    }
  }, []);
  const ClearFilter = useCallback(() => {
    filtersSettings=false;
  });


 const onGridReady = params => {
    let myHeader={ 
      'Content-Type': 'application/json',
    'Accept': 'appicatilon/json'
   };
   let myApplications =new Request("./api_response/GetApplications.json");
    
  //console.log(myData);
    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      var idSequence = 1;
      data.forEach(function(item) {
        item.id = idSequence++;
      });
    
      var fakeServer = new FakeServer(data);
       var datasource = new ServerSideDatasource(fakeServer);
       params.api.setServerSideDatasource(datasource);
    }

    httpRequest.open(
      'GET',
      'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
      //let myData=fetch(myApplications,myHeader).then(result=>result.json()).then(data=>  updateData(data));
  }
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
let columnsDefs= [
  {
    field: 'id',
    maxWidth: 75,
  },
  {
    field: 'athlete',
    minWidth: 190,
  },
  { field: 'age' },
  { field: 'year' },
  { field: 'gold' },
  { field: 'silver' },
  { field: 'bronze' },
];
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

  // const GetApplications = ()=>{
  //   let myHeader={ 
  //         'Content-Type': 'application/json',
  //       'Accept': 'appicatilon/json'
  //      };
  //      let myApplications =new Request("./api_response/GetApplications.json");
  //       fetch(myApplications,myHeader)
  //       .then((result) => result.json())
  //       .then((data) => setApplications(data));
  // }
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
  
    //GetApplications();
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
  });
  let options = null;
  
  const departmentsUnique = [
    ...new Set(organisationSetup.map((d) => d.department)),
  ];
  let positionsUnique = [
    ...new Set(organisationSetup.map((p) => p.position)),
  ];
  const locationsUnique = [
    ...new Set(organisationSetup.map((p) => p.location)),
  ];
  const onDepartmentChange = (params)=>{
    setDepartment(params);
}
if(department!="")
{
   positionsUnique= [...new Set(organisationSetup.filter(o=>o.department==department).map(d=>d.position))];
}

  options=positionsUnique.map((p,i)=> <option key={i} value={p}>{p}</option>);
  return (
    <>
    <h2>Applications</h2>
    <div className="row">
      <div className="col-md-2">
        <div className="form-group">
        <label htmlFor="departments" className="control-label">Department:</label>
        <select name="departments" id="departments" className="form-control" onChange={e=>onDepartmentChange(e.target.value)}>
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
          {
          options
          // positionsUnique.map((p, i) => {
          //   return (
          //     <option key={i} value={p}>
          //       {p}
          //     </option>
          //   );
          // })
          }
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
        //  rowData={applications}
          columnDefs={columnsDefs}
          defaultColDef={defaultColumnsDefs}
          animateRows={true}
         rowSelection={"multiple"}
        sideBar={true}
         rowModelType= {'serverSide'}
         pagination={true}
         paginationPageSize={10}
         cacheBlockSize={10}
         onGridReady={onGridReady}
        />
      </div>
    </>
  );
};
export default Applications;
