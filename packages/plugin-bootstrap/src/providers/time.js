const timeProvider = {
    get: async (_runtime, _message, _state) => {
        const currentDate = new Date();
        // Get UTC time since bots will be communicating with users around the global
        const options = {
            timeZone: "UTC",
            dateStyle: "full",
            timeStyle: "long",
        };
        const humanReadable = new Intl.DateTimeFormat("en-US", options).format(currentDate);
        return `The current date and time is ${humanReadable}. Please use this as your reference for any time-based operations or responses.`;
    },
};
export { timeProvider };
//# sourceMappingURL=time.js.map