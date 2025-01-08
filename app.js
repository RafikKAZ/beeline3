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
    .then(response => response.json())
    .then(result => {
        alert('Заявка отправлена успешно!');
    })
    .catch(error => {
        console.error('Error:', error);
    });
});