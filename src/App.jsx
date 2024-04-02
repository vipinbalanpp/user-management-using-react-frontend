import { useState } from "react";
import Parant from "./components/Parant";

function App() {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    {
      label: 'Fruits',
      options: [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Orange', value: 'orange' },
      ]
    },
    {
      label: 'Vegetables',
      options: [
        { label: 'Carrot', value: 'carrot' },
        { label: 'Broccoli', value: 'broccoli' },
        { label: 'Spinach', value: 'spinach' },
      ]
    }
  ];
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
    <select onChange={handleOptionChange}>
      <option value="">Select an option</option>
      {options.map((category, index) => (
        <optgroup label={category.label} key={index}>
          {category.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
    {selectedOption && (
      <p>You have selected: {selectedOption}</p>
    )}
    
  </div>
  );
}

export default App;




