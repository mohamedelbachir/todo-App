import React, { Component } from "react";
import { styled } from "styled-components";
import { ThemeContext } from "../context/themeContext";
import TodoList, { InputField } from "./TodoList";

const Container = styled.div`
  max-width: var(--max-contain-size);
  margin: auto;
  position: relative;
  top: -120px;
  & input {
    width: fit-content;
  }
  @media screen and (max-width: 500px) {
    --max-contain-size: 95%;
  }
`;

const FilterField = styled(InputField)`
  margin-top: 10px;
  border: none;
  border-radius: 3px;
  padding: 15px 0;
  & > ul {
    width: 100%;
    display: flex;
    padding: 0;
    margin: 0;
    justify-content: center;
    gap: 20px;
    text-decoration: none;
    list-style: none;
  }
  a {
    text-decoration: none;
    color: inherit;
    transition: 0.1s ease-in-out;
  }
  a.active {
    color: var(--link-color-active);
  }

  a.active:hover {
    color: var(--link-color-active);
  }

  a:hover {
    color: var(--link-hover);
  }
`;
async function saveToLocalStorage(dataName, data) {
  await window.setTimeout(() => {
    localStorage.setItem(dataName, JSON.stringify(data));
  });
}
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];
    const obj1Props = Object.getOwnPropertyNames(obj1);
    const obj2Props = Object.getOwnPropertyNames(obj2);
    if (obj1Props.length !== obj2Props.length) {
      return false;
    }
    for (let j = 0; j < obj1Props.length; j++) {
      const propName = obj1Props[j];
      if (obj1[propName] !== obj2[propName]) {
        return false;
      }
    }
  }
  return true;
}

function findTaskById(id,todos) {
  const [...ListTodo] = todos;
  const index = ListTodo.findIndex((todo) => {
    return todo.id === id;
  });
  return [ListTodo, index];
}

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerId: 0,
      filter: "all",
      newTodo: "",
      stateNewTodo: false,
      todos: [],
    };
    this.input = React.createRef();
    this.filterLinks = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.changeTask = this.handleChange.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.createTask = this.createTask.bind(this);
    this.clearCompleteTodos = this.clearCompleteTodos.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.changeTaskTitle=this.changeTaskTitle.bind(this)
  }
  componentDidMount() {
    this.setState({
      todos: JSON.parse(localStorage.getItem("todos")) || [],
    });
    this.setState({
      timerId: setInterval(() => {
        if (
          !arraysEqual(
            JSON.parse(localStorage.getItem("todos")),
            this.state.todos
          )
        ) {
          saveToLocalStorage("todos", this.state.todos);
        }
      }, 100),
    });
    //saveToLocalStorage("todos",this.state.todos)
  }
  componentWillUnmount() {
    clearInterval(this.state.timerId);
  }

  handleFilter(e) {
    e.preventDefault();
    const links = this.filterLinks.current?.querySelectorAll("a");
    const hash = decodeURIComponent(e.target.getAttribute("href").slice(1));
    links?.forEach((link) => {
      link.classList.remove("active");
      if (link === e.target) {
        link.classList.add("active");
      }
    });
    this.setState({
      filter: hash,
    });
  }

  createTask(e, isTaskDone = false) {
    if (e.key === "Enter") {
      if (this.input.current.value === "") {
        return;
      }
      const [...ListTodo] = this.state.todos;
      if (ListTodo.length < 1) {
        ListTodo.push({
          id: 0,
          isTaskDone: isTaskDone,
          taskTile: this.input.current.value,
        });
      } else {
        let maxId = 0;
        ListTodo.forEach((todo) => {
          if (todo.id > maxId) {
            maxId = todo.id;
          }
        });
        ListTodo.unshift({
          id: maxId + 1,
          isTaskDone: isTaskDone,
          taskTile: this.input.current.value,
        });
      }
      this.setState((state) => {
        return {
          todos: ListTodo,
        };
      });
      this.setState({
        newTodo: "",
        stateNewTodo: false,
      });
      if (this.state.filter !== "all") {
        this.setState({
          filter: this.state.stateNewTodo ? "complete" : "active",
        });
      }
      saveToLocalStorage("todos", this.state.todos);
    }
  }


  changeTaskTitle(e, id) {
    const [ListTodo, index] = findTaskById(id,this.state.todos);
    ListTodo[index] = {
      ...ListTodo[index],
      taskTile: e.target.value,
    };
    this.setState((state) => {
      return {
        todos: ListTodo,
      };
    });
    if (e.target.value === "") {
      this.deleteTask(e, id);
    }
    saveToLocalStorage("todos", this.state.todos);
  }

  clearCompleteTodos() {
    this.setState((state) => {
      return {
        todos: state.todos.filter((todo) => {
          return !todo.isTaskDone;
        }),
      };
    });
    saveToLocalStorage("todos", this.state.todos);
  }

  changeTaskState(e, id) {
    console.log(id,e.target.checked)
    const [ListTodo, index] = findTaskById(id,this.state.todos);
    
    ListTodo[index] = {
      ...ListTodo[index],
      isTaskDone: e.target.checked,
    };
    this.setState((state) => {
      return {
        todos: ListTodo,
      };
    });
    saveToLocalStorage("todos", this.state.todos);
  }

  deleteTask(e, id) {
    const [ListTodo, index] = findTaskById(id,this.state.todos);
    this.setState((state) => {
      return {
        todos: ListTodo.filter((todo) => {
          return todo !== ListTodo[index];
        }),
      };
    });
    saveToLocalStorage("todos", this.state.todos);
  }
  handleChange(e) {
    const name = e.target.name;
    const type = e.target.type;
    let value;
    switch (type) {
      case "checkbox":
        value = e.target.checked;
        break;
      default:
        value = e.target.value;
        break;
    }

    this.setState({
      [name]: value,
    });
  }

  render() {
    let { todos, filter, stateNewTodo, newTodo } = this.state;
    switch (filter) {
      case "all":
        break;
      case "active":
        todos = todos.filter((todo) => {
          return !todo.isTaskDone;
        });
        break;
      case "complete":
        todos = todos.filter((todo) => {
          return todo.isTaskDone;
        });
        break;
      default:
        break;
    }
    const { themeState } = this.context;
    return (
      <Container>
        <InputField theme={themeState} toDoInstance>
          <label class="ctn-check">
            <input
              type="checkbox"
              name="stateNewTodo"
              id="checkIdTask"
              checked={stateNewTodo}
              onChange={this.handleChange}
            />
            <span class="checkmark"></span>
          </label>
          <input
            type="text"
            name="newTodo"
            placeholder="Create a new todo"
            value={newTodo}
            onChange={this.handleChange}
            onKeyUp={(e) => {
              this.createTask(e, stateNewTodo);
            }}
            ref={this.input}
          />
        </InputField>
        <TodoList listTodo={this.state.todos} filter={filter} todos={todos} onChangeTaskState={this.changeTaskState.bind(this)} onChangeTaskTitle={this.changeTaskTitle.bind(this)} onDeleteTask={this.deleteTask.bind(this)} onClearCompleteTask={this.clearCompleteTodos} setTodos={this.setState.bind(this)}/>
        {this.state.todos.length > 0 && (
          <FilterField theme={themeState}>
            <ul className="filter-link" ref={this.filterLinks}>
              <li>
                <a
                  className={`${filter === "all" && "active"}`}
                  href="#all"
                  onClick={this.handleFilter}
                >
                  All
                </a>
              </li>
              <li>
                <a
                  className={`${filter === "active" && "active"}`}
                  href="#active"
                  onClick={this.handleFilter}
                >
                  Active
                </a>
              </li>
              <li>
                <a
                  className={`${filter === "complete" && "active"}`}
                  href="#complete"
                  onClick={this.handleFilter}
                >
                  Complete
                </a>
              </li>
            </ul>
          </FilterField>
        )}
      </Container>
    );
  }
}

export default Todo;
Todo.contextType = ThemeContext;
