export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Get month abbreviation
  const monthAbbreviation = date.toLocaleString('default', { month: 'short' });

  // Get day of the month
  const day = date.getDate();

  // Get hour (12-hour format)
  let hour = date.getHours();
  const ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12 || 12; // Convert 0 to 12

  // Get minutes
  const minutes = date.getMinutes();

  // Format the string
  const formattedDate = `${monthAbbreviation} ${day} ${date.getFullYear()} @${hour}:${minutes < 10 ? '0' : ''}${minutes}${ampm}`;

  return formattedDate;
}