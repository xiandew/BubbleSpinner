module.exports = function() {
        let today = new Date();
        let newYearsDate = new Date(today.getFullYear(), 0, 1);

        // start from Monday
        let offsetDays = 1;
        let newYearsDay = newYearsDate.getDay();
        if (newYearsDay != 0) {
                offsetDays += (7 - newYearsDay);
        }

        let firstMonday = new Date(today.getFullYear(), 0, 1 + offsetDays);
        let days = Math.ceil(
                (today.valueOf() - firstMonday.valueOf()) / 86400000
        );

        // count the first full week as 1
        return Math.ceil(days / 7) + 1;
};