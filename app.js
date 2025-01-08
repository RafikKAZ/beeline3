document.addEventListener('DOMContentLoaded', function() {
    const citySelect = document.getElementById('city');
    const addressInput = document.getElementById('address');
    const submitButton = document.getElementById('submit');
    
    ymaps.ready(init);
    let map, placemark;

    function init() {
        map = new ymaps.Map("map", {
            center: [51.169392, 71.449074], // Координаты по умолчанию для Астаны
            zoom: 10
        });

        map.events.add('click', function (e) {
            const coords = e.get('coords');
            if (placemark) {
                placemark.geometry.setCoordinates(coords);
            } else {
                placemark = createPlacemark(coords);
                map.geoObjects.add(placemark);
            }
            getAddress(coords);
        });
    }

    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: true
        });
    }

    function getAddress(coords) {
        placemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            const firstGeoObject = res.geoObjects.get(0);
            addressInput.value = firstGeoObject.getAddressLine();
            placemark.properties.set({
                iconCaption: firstGeoObject.getAddressLine(),
                balloonContent: firstGeoObject.getAddressLine()
            });
        });
    }

    citySelect.addEventListener('change', function () {
        const city = citySelect.value;
        if (city === 'Астана') {
            map.setCenter([51.169392, 71.449074]);
        }
        // Добавить координаты для других городов
    });

    submitButton.addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        const data = {
            name,
            phone,
            address,
            coordinates: placemark.geometry.getCoordinates(),
            date: new Date().toLocaleString()
        };

        // Отправка данных в Google таблицу
        fetch('https://script.google.com/macros/s/AKfycby5XcOLQOrRkeoXy3trSotkLhHQvu4VLmS5RTkJA0R7g7F-Ym3gH7rtKVRKHgaOwqC_1w/exec', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(result => {
            alert('Заявка отправлена успешно!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте снова.');
        });
    });
});