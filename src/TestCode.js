
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Component,
  memo,
} from "react";
  var render = true;
const TestCode = () => {
  /** "selected" here is state variable which will hold the
   * value of currently selected dropdown.
   */
  const [selected, setSelected] = useState();
  //const selected;
  console.log("It is called.");
  console.log(render);
  /** Function that will set different values to state variable
   * based on which dropdown is selected
   */
let [testArray,setArray]= useState([]);
//let ddlLocation=document.getElementById('ddlLocation');

//console.log(ddlLocation.options[ddlLocation.selectedIndex].value);
  /** Different arrays for different dropdowns */
  const algorithm = [
    "Searching Algorithm",
    "Sorting Algorithm",
    "Graph Algorithm",
  ];
  const language = ["C++", "Java", "Python", "C#"];
  const dataStructure = ["Arrays", "LinkedList", "Stack", "Queue"];
  let [applications, setApplications]= React.useState();
  useEffect(() => {
    fetch('./api_response/GetApplications.json'
  ,{
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }
  }
  )
   .then(result => result.json())
   .then(data=> {
    setApplications(data);
    })
}, []);
//setSelected("Language");
// if(render)
// {
//   setSelected("Language");
//   render=false;
// }

  /** Type variable to store different array for different dropdown */
  let type = [];
  type = algorithm;
  /** This will be used to create set of options that user will see */
  let options = null;
  
  /** Setting Type variable according to dropdown */
  // if (selected === "Algorithm") {
  //   type = algorithm;
  // } else if (selected === "Language") {
  //   type = language;
  // } else if (selected === "Data Structure") {
  //   type = dataStructure;
  // }
  //type = algorithm;
  /** If "Type" is null or undefined then options will be null,
   * otherwise it will create a options iterable based on our array
   */
  //console.log(type.length);
  if (type.length>0) {
    options = type.map((el) => <option key={el}>{el}</option>);
    //console.log("TestCode Options:",options);
  }
  const changeSelectOptionHandler = (event) => {
    //console.log("I am hitting");
     setSelected(event.target.value);
    
    if(event.target.value=='Choose...'){
      console.log("Here");
      setArray(current=>current.filter(obj => {
        return obj !== 'Algorithm';
      }) );
    }
    if(!testArray.includes(event.target.value))
    {
      setArray(current=>[...current,event.target.value]);
    }
   };
   const changeDDl = (event) => {
    console.log("Called second ddl.");
   
  };
  console.log(testArray);
  return (
    <div
      style={{
        padding: "16px",
        margin: "16px",
      }}
    >
      <form>
        <div>
          {/** Bind changeSelectOptionHandler to onChange method of select.
           * This method will trigger every time different
           * option is selected.
           */}
          <select onChange={changeSelectOptionHandler}>
            <option>Choose...</option>
            <option>Algorithm</option>
            <option>Language</option>
            <option>Data Structure</option>
          </select>
        </div>
        <div>
          <select onChange={changeDDl}>
            {
              /** This is where we have used our options variable */
              options
            }
          </select>
        </div>
      </form>
    </div>
  );
};
  
export default TestCode;