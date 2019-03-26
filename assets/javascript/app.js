$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCDfzZ-b-Vcw2GLUyPB5_CcWlC3w6YbqGI",
        authDomain: "bstx-2f830.firebaseapp.com",
        databaseURL: "https://bstx-2f830.firebaseio.com",
        projectId: "bstx-2f830",
        storageBucket: "bstx-2f830.appspot.com",
        messagingSenderId: "47653060445"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    

    $("#trainBtn").on("click", (event) => {
        event.preventDefault();

        var trainName = $("#trainName").val();
        var destination = $("#destination").val();
        var trainTime = $("#time").val();
        var frequency = $("#frequency").val();

        var TCon = timeConverter(trainTime, frequency);
       
        var trainArrival = TCon.nextTrain;
        var minutesAway = TCon.minutesAway;

        database.ref("/Schedule").push({
            trainName,
            destination,
            frequency,
            trainArrival,
            minutesAway
        });
    });


    function timeConverter(trainTimeConv, frequencyConv) {

        var hoursMinutes = moment(trainTimeConv, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(hoursMinutes), "minutes");
        var timeApart = diffTime % frequencyConv;
        var minutesAway = frequencyConv - timeApart;
        var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm");

        return {
            nextTrain,
            minutesAway
        }

    }


    database.ref("/Schedule").on("child_added", function (snapshot) {

        var sv = snapshot.val();

        addRow(sv.trainName, sv.destination, sv.frequency, sv.trainArrival, sv.minutesAway);
    });
    


    function addRow(timeR, destinationR, frequencyR, nextArrivalR, minutesAwayR) {

        var tableRow = $("<tr>");
        tableRow
            .append(` <td> ${timeR}</td>`)
            .append(` <td> ${destinationR}</td>`)
            .append(` <td> ${frequencyR}</td>`)
            .append(` <td> ${nextArrivalR}</td>`)
            .append(` <td> ${minutesAwayR}</td>`);

        $("tbody").append(tableRow);

    }


});