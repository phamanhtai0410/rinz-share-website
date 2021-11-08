$(document).ready(function() {
    var start_time = parseInt("<%= detail.start_time %>") * 1000;
    // console.log('start time =', start_time);
    var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();
        // console.log('now = ', now)
        // Find the distance between now and the count down date
        var distance = start_time - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("day").innerHTML = days;
        document.getElementById("hour").innerHTML = hours;
        document.getElementById("min").innerHTML = minutes;
        document.getElementById("sec").innerHTML = seconds;


        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("day").innerHTML = "--";
            document.getElementById("hour").innerHTML = "--";
            document.getElementById("min").innerHTML = "--";
            document.getElementById("sec").innerHTML = "--";
        }
    }, 1000);

    var date = new Date(start_time);
    var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth();
    var day = date.getDate() < 9 ? "0" + date.getDate() : date.getDate();
    var hour = date.getHours() < 9 ? "0" + date.getHours() : date.getHours();
    var min = date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes();
    document.getElementById("start-time-mobile").innerHTML = day + " THG " + month + " • " + hour + ":" + min;

});