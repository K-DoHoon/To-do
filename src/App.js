import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import CloseButton from "react-bootstrap/CloseButton";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";

function App() {
  const [todo, setTodo] = useState("");
  const [priority, setPriority] = useState("1");
  const [todos, setTodos] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    const storedCompleted = localStorage.getItem("completed");
    const storedProgress = localStorage.getItem("progress");

    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
    if (storedCompleted) {
      setCompleted(JSON.parse(storedCompleted));
    }
    if (storedProgress) {
      setProgress(Number(storedProgress));
    } else {
      setProgress(0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("completed", JSON.stringify(completed));
    localStorage.setItem("progress", progress.toString());
  }, [todos, completed, progress]);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    setCurrentDate(`${year}년 ${month}월 ${day}일`);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (todo === "") {
      return;
    }
    const newTodo = {
      text: todo,
      priority: priority,
    };
    setTodos((currentArray) => [newTodo, ...currentArray]);
    setTodo("");
    setPriority("1");
  };

  const onChangeTodo = (e) => {
    setTodo(e.target.value);
  };

  const onChangePriority = (e) => {
    setPriority(e.target.value);
  };

  const onDeleteTodo = (index) => {
    setTodos((currentArray) => currentArray.filter((_, i) => i !== index));
    setCompleted((currentArray) => currentArray.filter((_, i) => i !== index));
    setProgress((prevProgress) => {
      const completedCount = todos.filter(
        (_, i) => i !== index && completed[i]
      ).length;
      const totalCount = todos.length - 1;

      const percentage =
        totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0;

      return percentage;
    });
  };

  const onToggleCompletion = (index) => {
    setCompleted((currentArray) => {
      const newArray = [...currentArray];
      newArray[index] = !newArray[index];

      const completedCount = newArray.filter((completed) => completed).length;
      const totalCount = newArray.length;

      const percentage =
        totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0;

      setProgress(percentage);

      return newArray;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "700px",
          height: "1000px",
          border: "2px solid gray",
          padding: "60px",
        }}
      >
        <h1>Todo-list</h1>
        <h2>{currentDate}</h2>
        <ProgressBar now={progress} label={`${progress}%`} />
        <Form onSubmit={onSubmit} style={{ marginTop: "20px" }}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="입력하세요"
              value={todo}
              onChange={onChangeTodo}
              style={{ marginBottom: "20px" }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Select
              value={priority}
              onChange={onChangePriority}
              style={{ marginBottom: "20px" }}
            >
              <option>우선순위</option>
              <option value="High">High</option>
              <option value="Middle">Middle</option>
              <option value="Low">Low</option>
            </Form.Select>
          </Form.Group>
          <Button variant="info" type="submit" style={{ marginBottom: "20px" }}>
            +
          </Button>
        </Form>
        <ListGroup>
          {todos.map((item, index) => (
            <ListGroup.Item
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Check
                  type="checkbox"
                  checked={completed[index]}
                  onChange={() => onToggleCompletion(index)}
                  style={{ marginRight: "20px" }}
                />
                <p style={{ marginRight: "20px" }}>{item.priority}</p>

                <p>{item.text}</p>
              </div>
              <CloseButton onClick={() => onDeleteTodo(index)} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
}

export default App;
