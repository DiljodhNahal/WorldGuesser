window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 72,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    let countries = '';
    let selected = [];
    let score = 0;
    let map;
    let interval;

    function prependZero(num) {
            let numberString = num.toString();
            if (numberString.length === 1)
                return "0" + numberString;
            return numberString;
        }

    function getCountryData() {
        $.getJSON("assets/countries.json", function (json) {
            countries = json;
        });
    }

    function updateScore() {
        score++;
        $('#currentScore').html(score);
    }

    getCountryData();

    function inCountries(word) {
        let text = null;
        Object.keys(countries).forEach((key) => {
            if (countries[key].toUpperCase() == word.toUpperCase()) {
                text = key;
            }
        });
        return text;
    }

    $(document).ready(function() {
        map = $('#vmap').vectorMap({
            map: 'world_en',
            backgroundColor: "#1abc9c",
            borderColor: "#fff",
            color: '#555',
            hoverOpacity: 0.7,
            selectedColor: "#2c3e50",

            enableDrag: true,
            enableZoom: true,
            zoomOnScroll: true,

            onLabelShow: function (event, label, code) {
                code = code.toUpperCase();
                let country_name = countries[code];
                if (selected.includes(code)) {
                    label.html('<strong>' + country_name + '</strong>');
                    return;
                }
                event.preventDefault();
            },

            onRegionClick: function (event, code) {
                event.preventDefault();
            }
        });

        $('#countryInput').on('input', function () {
            let code = inCountries($(this).val());
            if (code != null) {
                code = code.toUpperCase();
                if (!selected.includes(code)) {
                    selected.push(code);
                    map.select(code);
                    $('#countryInput').val("");
                    updateScore();
                }
            }
        });

    })

    $('#startBtn').on('click', function (e) {

        // Setup Timer
        $('#startBtn').hide();
        $('#timer').show();
        $('#countryInput').val("");
        $('#countryInput').show();
        $('#score').show();
        $('#giveUp').show();
        $('#currentScore').html(score);
        $('#maxScore').html(Object.keys(countries).length);

        // Set timer to 15 minute's from start
        let start = new Date(new Date().getTime() + 15*60000);

        // Repeat Once Per Second
        interval = setInterval(function() {

            // Get Current Time
            let now = new Date().getTime();

            // Time Between Now And Timer End
            let distance = start - now;

            // Calculate Time Left
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display Time Left
            $('#timer').html(prependZero(minutes) + ":" + prependZero(seconds));

            // Check If Timer Is Finished
            if (distance < 0) {
                endGame();
            }

        }, 1000);

    });

    $('#closeModal').on('click', function (e) {
        location.reload();
    });

    $('#giveUp').on('click', function (e) {
        endGame();
    });

    function endGame() {
        clearInterval(interval);
        $('#timer').html("Game Over");
        $('#countryInput').hide();
        $('#giveUp').hide();
        $('#finalScore').html($('#score').html());

        let i = 0;

        Object.keys(countries).forEach((key) => {
            let tableNumber = 2;
            if (i % 2 == 0) {
                tableNumber = 1;
            }

            let tableBodyName = '#tableBody' + tableNumber;
            let trName = "<tr>";

            if (selected.includes(key)) {
                trName = "<tr class='table-primary' >";
            }

            $(tableBodyName).append(
                trName + '<th style="width: 10%;">' + key + '</th><th>' + countries[key] + '</th></tr>'
            );
            i++;
        });
        $('#gameModal').modal('show');
    }

});

