document.getElementById('btn_test')
    .addEventListener('click', function () {

        console.log("TEST test 1");
        var testCollection = [];
        pkmCollection.forEach(elem => {
            testCollection.push(elem);
        })
        console.log("TEST test 1 complete");
    }
);