import React, { KeyboardEventHandler } from "react";
import {
  GroupBase,
  MultiValueProps,
  MultiValueRemoveProps,
} from "react-select";

import CreatableSelect from "react-select/creatable";
import "./App.css";

const createOption = (label: string) => ({
  label,
  value: label,
});

const MultiValueRemove = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: MultiValueRemoveProps<Option, IsMulti, Group> & {
    removeProps?: { onClick: () => void };
  }
): JSX.Element => {
  return <button onClick={() => props.removeProps?.onClick()}>X</button>;
};

const Components = {
  DropdownIndicator: null,
  MultiValue: (props: MultiValueProps<Option, true, GroupBase<Option>>) => {
    const [val, setVal] = React.useState<string>();
    const [edit, setEdit] = React.useState<boolean>(false);
    const arrayOfValues = props.getValue();

    const indexOfVal = arrayOfValues.findIndex(
      (el) => el.value === props.data.value
    );

    const confirm = () => {
      props.setValue(
        [
          ...arrayOfValues.slice(0, indexOfVal),
          createOption(val || ""),
          ...arrayOfValues.slice(indexOfVal + 1),
        ],
        "deselect-option"
      );
      setEdit(false);
    };

    const handle: KeyboardEventHandler = (event) => {
      switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "Backspace":
          event.stopPropagation();
          break;
        case "Enter":
          event.stopPropagation();
          confirm();
      }
    };

    React.useEffect(() => {
      if (props.data.value) setVal(props.data.value);
    }, [props.data.value]);

    return (
      <div className="item">
        <div className="item-internal">
          {!edit ? (
            <>
              {val} <button onClick={() => setEdit(true)}>e</button>
              <props.components.Remove {...props} />
            </>
          ) : (
            <div>
              <input
                value={val}
                onChange={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setVal(e.target.value);
                }}
                onKeyDown={handle}
              />{" "}
              <button onClick={() => setEdit(false)}>X</button>
              <button
                onClick={() => {
                  confirm();
                }}
              >
                ok
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
  MultiValueRemove,
};

interface Option {
  readonly label: string;
  readonly value: string;
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [value, setValue] = React.useState<readonly Option[]>([]);

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue("");
        event.preventDefault();
    }
  };

  return (
    <div className="select-container">
      <CreatableSelect
        components={Components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={(newValue) => setValue(newValue)}
        onInputChange={(newValue) => setInputValue(newValue)}
        onKeyDown={handleKeyDown}
        placeholder="Type something and press enter..."
        value={value}
      />
    </div>
  );
};

export default App;
