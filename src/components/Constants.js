// import moment from 'moment-timezone';

const Constants = {

    // base url
    // BASE_URL: 'https://prepswise.com:8443/breeze',
     BASE_URL: 'http://localhost:8081',

    MESSAGE_COLOR: '#be3144',
    SET_TIME_OUT_FOR_ERROR_MSG: 30000,
    SET_TIME_OUT_FOR_SUCCESS_MSG: 3000,

    // user types
    ADMIN: "ADMIN",
    EXPONENT: "EXPONENT",
    CANDIDATE: "CANDIDATE",

    // exponent types
    TRAINER: "TRAINER",
    INTERVIEW_SUPPORTER: "INTERVIEW SUPPORTER",
    JOB_SUPPORTER: "JOB SUPPORTER",

    // err status
    INVALID_REQUEST_FIELD: "INVALID_REQUEST_FIELD",
    EXISTING_USERNAME: "EXISTING_USERNAME",
    BREEZE_DATABASE_EXCEPTION: "BREEZE_DATABASE_EXCEPTION",
    ADDRESS_EXCEPTION: "ADDRESS_EXCEPTION",
    MESSAGING_EXCEPTION: "MESSAGING_EXCEPTION",
    ENTITY_NOT_FOUND: "ENTITY_NOT_FOUND",
    OTP_NOT_MATCHED: "OTP_NOT_MATCHED",
    OTP_NOT_MATCHED_FOR_MAIL: "OTP_NOT_MATCHED_FOR_MAIL",
    OTP_NOT_MATCHED_FOR_CONTACT: "OTP_NOT_MATCHED_FOR_CONTACT",
    PASSWORD_NOT_MATCHED: "PASSWORD_NOT_MATCHED",
    EXISTING_TECHNOLOGY: "EXISTING_TECHNOLOGY",
    EXISTING_COURSE: "EXISTING_COURSE",
    INACTIVE: "INACTIVE",
    FILES_NOT_UPLOADED: "FILES_NOT_UPLOADED",
    FILES_NOT_FOUND: "FILES_NOT_FOUND",
    EXISTING_MEETING_LINK: "EXISTING_MEETING_LINK",
    VERIFIED: "VERIFIED",
    EXISTING_INTERVIEW_SUPPORT: "EXISTING_INTERVIEW_SUPPORT",
    EXISTING_BOOKINGS: "EXISTING_BOOKINGS",
    EXISTING_JOB_SUPPORT: "EXISTING_JOB_SUPPORT",
    SLOTS_BLOCKED: "SLOTS_BLOCKED",
    SLOTS_BLOCKED_FOR_CANDIDATE: "SLOTS_BLOCKED_FOR_CANDIDATE",
    INVALID_PHONE_NUMBER: "INVALID_PHONE_NUMBER",
    OTP_NOT_SENT: "OTP_NOT_SENT",

    // admin status
    HOLD: "HOLD",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",

    // training candidates status
    ALREADY_ENROLLED_FOR_SELECTED_COURSE: "ALREADY_ENROLLED_FOR_SELECTED_COURSE",
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    WITHDRAW: "WITHDRAW",

    // session duration
    SESSION_DURATION: "90 minutes",

    // format time
    formatTime: (timeString) => {
        const date = new Date();
        const [hours, minutes, seconds] = timeString.split(':');
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        date.setSeconds(parseInt(seconds, 10));

        // Format the time in 12-hour format with AM/PM
        const formattedTime = date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            // second: 'numeric',
            hour12: true
        });

        return formattedTime;
    },

    // convert date and time based on user timezone
    convertUserTimezoneDateTime: (dateTime) => {
        const moment = require('moment-timezone');
        const istDateTimeString = dateTime; // Assuming this is in IST
        // Parse the datetime string in IST timezone
        const istDateTime = moment.tz(istDateTimeString, 'Asia/Kolkata');
        // Get the user's timezone using browser API
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Convert the datetime to the user's timezone
        const userDateTime = istDateTime.clone().tz(userTimezone);
        // Format the datetime for display
        const formattedDate = userDateTime.format('YYYY-MM-DD');
        const formattedTime = userDateTime.format('HH:mm:ss');
        return {
            date: formattedDate,
            time: formattedTime
        };

        // const moment = require('moment-timezone');
        // const utcDateTimeString  = dateTime; // Assuming this is in UTC
        // // Parse the datetime string in UTC timezone
        // const utcDateTime = moment.utc(utcDateTimeString);
        // // Get the user's timezone using browser API
        // const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // // Convert the datetime to the user's timezone
        // const userDateTime = utcDateTime.clone().tz(userTimezone);
        // // Format the datetime for display
        // const formattedDate = userDateTime.format('YYYY-MM-DD');
        // const formattedTime = userDateTime.format('HH:mm:ss');
        // return {
        //     date: formattedDate,
        //     time: formattedTime
        // };
    },

    convertUserTimezoneTime: (time) => {
        const moment = require('moment-timezone');
        // Assuming time is in IST, use a default date
        const defaultDate = '1970-01-01';
        const istDateTimeString = `${defaultDate}T${time}`;

        // Parse the datetime string in IST timezone
        const istDateTime = moment.tz(istDateTimeString, 'Asia/Kolkata');

        // Get the user's timezone using browser API
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Convert the datetime to the user's timezone
        const userDateTime = istDateTime.clone().tz(userTimezone);

        // Format the time for display
        const formattedTime = userDateTime.format('HH:mm:ss');

        return formattedTime;
    },

}

export default Constants;

