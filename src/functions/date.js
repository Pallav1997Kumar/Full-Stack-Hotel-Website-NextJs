const getOnlyDate = (date) => {
    const onlyDate = date.getDate();
    return onlyDate;
}

const getOnlyMonth = (date) => {
    const month = date.getMonth();
    const monthNames = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const onlyMonth = monthNames[month];
    return onlyMonth;
}

const getOnlyYear = (date) => {
    const onlyYear = date.getFullYear();
    return onlyYear;
}

const getOnlyDay = (date) => {
    const day = date.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const onlyDay = dayNames[day];
    return onlyDay;
}

const nextDay = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
}

const getDateOrdinal = (onlyDate) => {
    let ordinal = 'th';
    if((onlyDate % 10 == 1) && ((onlyDate % 100 != 11))){
        ordinal = 'st';
    }
    else if((onlyDate % 10 == 2) && ((onlyDate % 100 != 12))){
        ordinal = 'nd';
    }
    else if((onlyDate % 10 == 3) && ((onlyDate % 100 != 13))){
        ordinal = 'rd';
    }
    return ordinal;
}

const getDateText = (fullDate) => {
    const onlyDate = getOnlyDate(fullDate);
    const onlyMonth = getOnlyMonth(fullDate);
    const onlyYear = getOnlyYear(fullDate);
    const onlyDay = getOnlyDay(fullDate);
    const dateOrdinal = getDateOrdinal(onlyDate);
    const dateText = `${onlyDate}${dateOrdinal} ${onlyMonth} ${onlyYear}, ${onlyDay}`;
    return dateText;
}

const getDateTextFromFullDate = (fullDate) => {
    const dateTextArray = fullDate.split('T');
    const date = new Date(dateTextArray[0]);
    const dateText = getDateText(date);
    return dateText;
}

const getDateTextFromOnlyDate = (fullDate) => {
    const date = new Date(fullDate);
    const dateText = getDateText(date);
    return dateText;
}

const getDatesInRange = (startDate, endDate) => {
    const date = new Date(startDate.getTime()); 
    const dates = [];
    while (date < endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
}

const getDatesInRangeInclusiveBothDate = (startDate, endDate) => {
    const date = new Date(startDate.getTime()); 
    const dates = [];
    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
}

const convertDateTextToDate = (dateText) =>{
    const localDate = dateText.toLocaleDateString('en-IN'); // "9/6/2024"
    const localDateArray = localDate.toString().split("/");
    const year = localDateArray[2];
    let month = localDateArray[1].toString();
    if(month.length == 1){
        month = "0".concat(month);
    }
    let date = localDateArray[0].toString();
    if(date.length == 1){
        date = "0".concat(date);
    }
    const finalDateString = year + "-" + month + "-" + date;
    return finalDateString;
}

const utcTimeToISTConvesion = (date) => {
    const utcDate = new Date(date);
    const options = {
        timeZone: 'Asia/Kolkata', // IST timezone
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24-hour format
      };
      const istDate = new Intl.DateTimeFormat('en-IN', options).format(utcDate);
      return istDate;
}

export { getOnlyDate, getOnlyMonth, getOnlyYear, getOnlyDay, utcTimeToISTConvesion };
export { nextDay, getDatesInRange, getDatesInRangeInclusiveBothDate, convertDateTextToDate };
export { getDateOrdinal, getDateText, getDateTextFromFullDate, getDateTextFromOnlyDate };