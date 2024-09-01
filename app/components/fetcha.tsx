// Example from: https://testing-library.com/docs/react-testing-library/example-intro
import { useState, useReducer } from "react";

type State =
  | {
      error: null;
      greeting: string;
    }
  | {
      error: string;
      greeting: null;
    }
  | {
      error: null;
      greeting: null;
    };

const initialState: State = {
  error: null,
  greeting: null,
};

type Action =
  | {
      type: "SUCCESS";
      payload: string;
    }
  | {
      type: "ERROR";
      payload: string;
    };

function greetingReducer(state: State, action: Action) {
  switch (action.type) {
    case "SUCCESS": {
      return {
        error: null,
        greeting: action.payload,
      };
    }
    case "ERROR": {
      return {
        error: action.payload,
        greeting: null,
      };
    }
    default: {
      return state;
    }
  }
}

type FetchProps = {
  url: string;
};

export default function Fetch({ url }: FetchProps) {
  const [{ error, greeting }, dispatch] = useReducer(
    greetingReducer,
    initialState,
  );
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchGreeting = async (url: string) =>
    fetch(url)
      .then((response) => {
        return response.json() as Promise<{ greeting: string }>;
      })
      .then((data) => {
        const { greeting } = data;
        dispatch({ type: "SUCCESS", payload: greeting });
        setButtonClicked(true);
      })
      .catch((error) => {
        dispatch({ type: "ERROR", payload: error });
      });

  const buttonText = buttonClicked ? "Ok" : "Load Greeting";

  return (
    <div>
      <button onClick={() => fetchGreeting(url)} disabled={buttonClicked}>
        {buttonText}
      </button>
      {greeting && <h1>{greeting}</h1>}
      {error && <p role="alert">Oops, failed to fetch!</p>}
    </div>
  );
}
