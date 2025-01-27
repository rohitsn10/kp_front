import React, { useState } from 'react';
import FormController from '../../common/form/FormController';

function AddProject() {
  const [formData, setFormData] = useState([
    {
      formLabel: 'Company Label',
      formLength: 'full',
      formTitle: '',
      placeHolder: 'Select Company Name',
      formName: 'compName',
      formValue: '',
      formType: 'text'
    },
    {
      formLabel: 'Project Name',
      formLength: 'half',
      formTitle: '',
      placeHolder: 'Enter Project Name',
      formName: 'projectName',
      formValue: '',
      formType: 'text'
    },
    {
      formLabel: 'End Date',
      formLength: 'half',
      formTitle: '',
      placeHolder: 'Select End Date',
      formName: 'endDate',
      formValue: '',
      formType: 'date'
    },
    {
      formLabel: 'Upload Document',
      formLength: 'full',
      formTitle: '',
      placeHolder: '',
      formName: 'document',
      formValue: null,
      formType: 'file'
    }
  ]);

  // Handle input changes dynamically, including file uploads
  const formInputHandle = (e) => {
    const { name, value, files } = e.target; // Get the input's name, value, and files (if file input)
    
    setFormData((prevFormData) =>
      prevFormData.map((item) =>
        item.formName === name
          ? { ...item, formValue: files ? files[0] : value } // Handle files for 'file' type
          : item
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formValues = new FormData();
    formData.forEach((item) => {
      if (item.formType === 'file') {
        formValues.append(item.formName, item.formValue); // Add file to FormData
      } else {
        formValues.append(item.formName, item.formValue); // Add other fields
      }
    });

    console.log([...formValues.entries()]); // Debugging: Log form values
    // You can now send `formValues` to the backend using fetch or axios
  };

  return (
    <div className="w-full h-screen p-2 flex justify-center items-start">
      <form
        className="bg-white grid grid-cols-2 w-[50%] rounded-md my-8"
        onSubmit={handleSubmit}
      >
        {formData?.map((item, index) => (
          <FormController
            key={index} // Unique key for each form field
            formLabel={item?.formLabel}
            formLength={item?.formLength}
            formTitle={item?.formTitle}
            formName={item?.formName}
            formValue={item?.formValue}
            placeHolder={item?.placeHolder}
            formType={item?.formType}
            formHandle={formInputHandle} // Pass the input handler
          />
        ))}
        <div className="col-span-2 flex justify-end p-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProject;
