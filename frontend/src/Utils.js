// Converts date strings from 'yyyy-mm-dd' to 'mm-dd-yyyy', i.e. the US format:
const convertDateFormat = (dateStr) => {
    try {
        // Check if the input matches the expected format 'yyyy-mm-dd':
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            throw new Error("Invalid date format");
        }

        // Split the input date string by the dash:
        const [year, month, day] = dateStr.split('-');

        // Check if month and day are valid numbers:
        if (parseInt(month) > 12 || parseInt(day) > 31) {
            throw new Error("Invalid date values");
        }

        // Return the date in the desired format:
        return `${month}-${day}-${year}`;
    } catch (error) {
        return 'N/A';
    }
}

export { convertDateFormat };
