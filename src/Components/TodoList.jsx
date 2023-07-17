import React, { useContext} from "react";
import { styled } from "styled-components";
import { ThemeContext } from "../context/themeContext";
import { ReactSortable } from "react-sortablejs";
import Icon from "../icons/icons";
const Label = styled.div`
  opacity: 0.5;
`;
const Button = styled(Label)`
  padding: 2px 5px;
  cursor: pointer;
`;

export const InputField = styled.div`
  user-select: none;
  width: -webkit-fill-available;
  display: flex;
  align-items: center;
  padding: 5px 0 5px ${(props) => (props.toDoInstance ? "25px" : "0px")};
  transition: inherit;
  background-color: ${(props) =>
    props.theme === "dark" ? "var(--input-bg-dark)" : "var(--input-bg-light)"};
  border-radius: ${(props) => (props.toDoInstance ? "3px" : "0px")};
  margin-bottom: ${(props) => (props.toDoInstance ? "20px" : "0px")};
  border-top: ${(props) =>
    props.toDoInstance
      ? "none"
      : `1px solid var(--text-color-strike-${props.theme})`};
  border-bottom: ${(props) =>
    props.toDoInstance
      ? "none"
      : `1px solid var(--text-color-strike-${props.theme})`};
  & input[type="text"] {
    padding: 14px 5px 10px 5px;
    width: -webkit-fill-available;
    background-color: transparent;
    outline: none;
    border: none;
    color: inherit;
  }
  & input[type="text"].checked {
    text-decoration: line-through;
  }
  & .arrow-icon {
    display: block;
    transform: scale(0);
    width: 20px;
    height: 20px;
    padding: 10px;
    //margin-right: 5px;
    transition: 0.2s ease-in-out;
  }
  &:hover .arrow-icon {
    transform: scale(0.8);
    cursor: pointer;
  }
  .draggerTodo{
    width:30px;
    height:30px;
    fill: ${props=>`var(--text-color-${props.theme})`};
  }
`;

const InfoField = styled(InputField)`
  justify-content: ${($props) => ($props.center ? "center" : "space-between")};
  padding-right: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
`;

const TodoListContainer = styled.div`
  padding: 0;
  margin: 0;
  transition: 0.5s ease-in-out box-shadow;
  box-shadow: 0px 5px 10px ${(props) => `var(--bg-${props.theme})`};
  overflow: hidden;
  & div:first-of-type {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-top: none;
    border-bottom: none;
  }
  & div:nth-of-type(2n + 1) {
    border-top: none;
    border-bottom: none;
  }
  & div:last-of-type {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    border-bottom: none;
  }
`;

function TodoList({
  listTodo,
  todos,
  filter,
  onChangeTaskState,
  onChangeTaskTitle,
  onDeleteTask,
  onClearCompleteTask,
  setTodos
}) {
  const { themeState } = useContext(ThemeContext);
  return (
    <TodoListContainer theme={themeState}>
      <ReactSortable
        // here they are!
        group="todosList"
        animation={100}
        delayOnTouchStart={true}
        delay={2}
        list={todos}
        setList={(newState)=>setTodos({todos:[...new Set([...newState,...listTodo])]})}
        handle=".draggerTodo"
      >
      {todos.map((todo) => (
        <InputField theme={themeState} key={todo.id}>
          <Icon className='draggerTodo' name="dragIcon"/>
          <label class="ctn-check">
            <input
              type="checkbox"
              name="stateNewTodo"
              id="checkIdTask"
              checked={todo.isTaskDone}
              onChange={(e) => {
                onChangeTaskState(e, todo.id);
              }}
              />
            <span class="checkmark"></span>
          </label>
          <input
            className={`${todo.isTaskDone ? "checked" : "pending"}`}
            type="text"
            name="newTodo"
            placeholder="Create a new todo"
            value={todo.taskTile}
            onChange={(e) => {
              onChangeTaskTitle(e, todo.id);
            }}
          />
          <svg
            className="arrow-icon"
            onClick={(e) => {
              onDeleteTask(e, todo.id);
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#494C6B"
              fillRule="evenodd"
              d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
              />
          </svg>
        </InputField>
      ))}
      </ReactSortable>
      {listTodo.length !== 0 && todos.length === 0 && filter !== "all" && (
        <InfoField theme={themeState} center={true}>
          <Label>no {filter} task Left</Label>
        </InfoField>
      )}
      {todos.length > 0 && (
        <InfoField theme={themeState}>
          <Label>
            {filter !== "complete"
              ? todos.filter((todo) => {
                  return !todo.isTaskDone;
                }).length
              : todos.length}{" "}
            todo(s) {filter === "all" ? "left" : filter}
          </Label>
          {filter !== "active" && (
            <Button onClick={onClearCompleteTask}>Clear Completed</Button>
          )}
        </InfoField>
      )}
    </TodoListContainer>
  );
}

export default TodoList;
