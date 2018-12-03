module.exports = function() {
        let today = new Date();
        let newYearsDay = new Date(today.getFullYear(), 0, 1);
        let days = Math.round(
                (today.valueOf() - newYearsDay.valueOf()) / 86400000
        );

        return Math.ceil(
                (days + newYearsDay.getDay()) / 7
        );
};