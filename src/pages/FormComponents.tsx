import { useEffect, useState } from 'react';
import InputField from '../components/Form/InputField';
import SelectField from '../components/Form/SelectField';
import RadioInput from '../components/Form/RadioInput';
import DateField from '../components/Form/DateFiled/CustomDatePicker';

const FormComponents = () => {
  const [test, setTest] = useState({
    inputText: '',
    selectTest: '',
    selectTestMultiple: [],
    radioInput: '',
    dateTest: null,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    console.log(name, value);

    setTest((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    console.log(test);
  }, [test]);
  return (
    <div>
      <InputField
        label="label test"
        value={test.inputText}
        name="inputText"
        onChange={handleChange}
        placeholder="testing text"
        type="text"
      />
      <SelectField
        name="selectTest"
        value={test.selectTest}
        onChange={handleChange}
        placeholder="select an option"
        options={[
          { value: 'textOne', label: 'text one' },
          { value: 'textTwo', label: 'text two' },
        ]}
      />
      <SelectField
        name="selectTestMultiple"
        multiple
        value={test.selectTestMultiple}
        onChange={handleChange}
        placeholder="select an option"
        options={[
          { value: 'textOne', label: 'text one' },
          { value: 'textTwo', label: 'text two' },
        ]}
      />
      <RadioInput
        label="radio label"
        value={test.radioInput}
        onChange={handleChange}
        name="radioInput"
        options={[
          { value: 'radio1', label: 'radio 1' },
          { value: 'radio2', label: 'radio 2' },
        ]}
      />
      <DateField name="dateTest" value={test.dateTest} onChange={handleChange} />
    </div>
  );
};

export default FormComponents;
