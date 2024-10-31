import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../auth/firebaseAuth";
import { useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebaseAuth";
const ToDo = () => {
  getAuth();
  const [userId, setUserId] = useState("");
  const [userStatus, setUserStatus] = useState(false); //set user sign in status
  const [todos, setTodos] = useState([]); //set todo list from db
  const [inputValue, setInputValue] = useState("");
  const [idLoading, setIsLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserStatus(true);
        console.log("User is signed in:", user.email);
        setUserId(user.email);
        fetchData();
      } else {
        console.log("User is signed out");
        setUserStatus(false);
        setUserId("");
      }
    });
  }, [userStatus]);

  //test push data to db
  // const pushData = async () => {
  //   await setDoc(doc(collection(db, "todos"), userId), {
  //     listitem: false,
  //     listitem2: true,
  //   });
  //   console.log("added data");
  // };

  //fetch data from DB
  const fetchData = async () => {
    if (userId.length === 0) return;

    setIsLoading(true);
    try {
      const docRef = doc(db, "todos", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data(); //storing fetched data
        // console.log(data);
        const todoArray = Object.entries(data).map(([task, completed]) => ({
          //used Object.entries to get both keys and values
          task,
          completed,
        }));
        setTodos(todoArray); //setting object fetched from db to state variable todoArray
        // console.log(docSnap.data());
        console.log("data from db", todoArray);
      } else {
        console.log("nopes");
      }
    } catch (err) {
      console.log("Error fetching todos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (event) => {
    setInputValue(event.target.value);
  };

  //function to push data to firestore db
  const updateFirestore = async (updatedTodos, userId) => {
    try {
      // Convert todos array to firestore format
      const firestoreData = updatedTodos.reduce((acc, todo) => {
        acc[todo.task] = todo.completed;
        return acc;
      }, {});

      // Push to firestore
      await setDoc(doc(db, "todos", userId), firestoreData);
    } catch (err) {
      console.log("Error updating Firestore:", err);
      throw err; // Rethrow to handle in calling function if needed
    }
  };
  //function to add a new todo item
  const handleAddTask = async () => {
    if (inputValue.trim() !== "") {
      try {
        const updatedTodos = [...todos, { task: inputValue, completed: false }];
        setTodos(updatedTodos);
        await updateFirestore(updatedTodos, userId);
        setInputValue("");
      } catch (err) {
        console.log("Error adding task:", err);
      }
    }
    // setTodos([...todos, { task: inputValue, completed: false }]);
    // setInputValue("");
  };

  //function to delete an existing task
  const handleDeleteTask = async (index) => {
    try {
      const updatedTodos = todos.filter((_, i) => i !== index);
      setTodos(updatedTodos);
      await updateFirestore(updatedTodos, userId);
    } catch (err) {
      console.log("Error deleting task:", err);
    }
  };

  //function to mark task as completed
  const handleToggleComplete = async (index) => {
    try {
      const updatedTodos = todos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);
      await updateFirestore(updatedTodos, userId);
    } catch (err) {
      console.log("Error toggling task:", err);
    }
  };

  console.log(todos);
  // console.log(dbData);

  return (
    <>
      <h3>Your Tasks</h3>
      <p>{userStatus ? userId : <Link to="/LogIn">Log in to continue</Link>}</p>
      <input
        type="text"
        placeholder="Enter task"
        onChange={handleInput}
        value={inputValue}
      />
      <button onClick={handleAddTask}>add task</button>
      <div>
        {todos.length > 0 ? (
          <ul>
            {todos.map((todo, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(index)}
                />
                {/* {todo.task} : {todo.completed ? "Completed" : "Not Completed"} */}
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.task}
                  <button onClick={() => handleDeleteTask(index)}>
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          "Loading..."
        )}
      </div>
      {/* <button type="button" onClick={pushData}>
        add data
      </button> */}
      <button>
        <Link to="/">Home</Link>
      </button>
    </>
  );
};

export default ToDo;
