

function FormatDateAndTime(isoString) {
  const date = new Date(isoString);

  // Options for formatting the date
  const dateOptions = { 
    year: 'numeric', 
    month: 'long', // or 'short', 'numeric'
    day: 'numeric',
  };

  // Options for formatting the time
  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true // Use 12-hour format (true) or 24-hour format (false)
  };


  const formattedDate = date.toLocaleDateString(undefined, dateOptions);
  const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

  return `${formattedDate} ${formattedTime}`; // Combine date and time
}
export default FormatDateAndTime

