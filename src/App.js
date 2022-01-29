import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import {useRef, useEffect ,useState } from "react";
import { nanoid } from "nanoid";
import usePrevious from "./utilities/usePrevious";

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);


function App(props) {

  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");

  let tasksNoun = tasks.length !== 1 ? "tasks" : "task";
  const headingText = `${tasks.length} ${tasksNoun} remaining`

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  function addTask(name){
    const newTask = {
      id : "todo-"+nanoid(), name : name, completed : false, 
    }
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id){
    const upadatedTasks = tasks.filter(task => task.id !== id);
    setTasks(upadatedTasks);
  }

  function toggleTaskCompleted(id){
    const updatedTasks = tasks.map(task =>{
      if(id === task.id){
       
        return {...task, completed : !task.completed};
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function editTask(id, newName){
    const updatedTasks = tasks.map(task =>{
      if(id === task.id){
     
        return {...task, name : newName};
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  const taskList = tasks.filter(FILTER_MAP[filter]).map(task => (
    <Todo 
    id = {task.id} 
    name = {task.name} 
    completed = {task.completed}
    key = {task.id}
    toggleTaskCompleted = {toggleTaskCompleted}
    deleteTask ={deleteTask}
    editTask = {editTask}
    />
    
    )
  );

  const filterList = FILTER_NAMES.map(filterName => (
    <FilterButton 
    key = {filterName} 
    name = {filterName}
    isPressed = {filterName === filter}
    setFilter = {setFilter}
    />
  ));

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask = {addTask}/>
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref = {listHeadingRef}>
        {headingText}
      </h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;