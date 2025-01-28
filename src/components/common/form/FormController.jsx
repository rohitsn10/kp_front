import React from 'react';

function FormController({ formLabel, formLength, formTitle, formName, formValue, placeHolder, formType, formHandle }) {
  return (
    <div className={`p-1 m-1 ${formLength === 'half' ? 'col-span-1' : 'col-span-2'}`}>
      {formLabel && <label className="block mb-1 text-[#29346B] text-xl font-semibold">{formLabel}</label>}
      {formType === 'file' ? (
        <input
          type="file"
          className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2  border-b-yellow-400  outline:none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500 "
          name={formName}
          onChange={formHandle}
        />
      ) : (
        <input
          type={formType || 'text'}
          className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-2 border-b-yellow-400 "
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
