import React from 'react';

function FormController({ formLabel, formLength, formTitle, formName, formValue, placeHolder, formType, formHandle }) {
  return (
    <div className={`p-1 m-1 ${formLength === 'half' ? 'col-span-1' : 'col-span-2'}`}>
      {formLabel && <label className="block mb-1 text-gray-700">{formLabel}</label>}
      {formType === 'file' ? (
        <input
          type="file"
          className="cursor-pointer file:bg-pink-500 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          name={formName}
          onChange={formHandle}
        />
      ) : (
        <input
          type={formType || 'text'}
          className="border m-1 p-2 rounded-md w-full"
          name={formName}
          value={formValue}
          placeholder={placeHolder}
          onChange={formHandle}
        />
      )}
    </div>
  );
}

export default FormController;
