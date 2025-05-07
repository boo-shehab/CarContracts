import { useState } from "react";
import InputField from "../components/Form/InputField"
import SelectField from "../components/Form/SelectField";
import RadioInput from "../components/Form/RadioInput";

const FormComponents = () => {
    const [test, setTest] = useState({
        inputText: '',
        selectTest: '',
        radioInput: ''
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        console.log(name, value);
        
        setTest((prev) => ({ ...prev, [name]: value }));
    }
  return (
    <div>
      <InputField label="label test" value={test.inputText} name="inputText" onChange={handleChange} placeholder="testing text" type="text" />
      <SelectField name="selectTest" value={test.selectTest} onChange={handleChange} placeholder='select an option' options={[{value: 'textOne', label: 'text one'}, {value: 'textTwo', label: 'text two'}]} />
      <RadioInput label="radio label" value={test.radioInput} onChange={handleChange} name="radioInput" options={[{value: 'radio1', label: 'radio 1'},{value: 'radio2', label: 'radio 2'}]} />
    </div>
  )
}

export default FormComponents
