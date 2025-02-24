$(document).ready(function () {
  // variabel för alla lag och deras pris vilket kommer att användas för att räkna ut totalpriset och rabatterna osv...
  const teams = {
    real: {
      name: "Real Madrid",
      basePrice: 1199
    },
    barcelona: {
      name: "Barcelona",
      basePrice: 1199
    },
    city: {
      name: "Manchester City",
      basePrice: 1199
    },
    malmo: {
      name: "Malmö FF",
      basePrice: 1199
    },
    bayern: {
      name: "Bayern München",
      basePrice: 1199
    },
    liverpool: {
      name: "Liverpool",
      basePrice: 1199
    },
    milan: {
      name: "AC Milan",
      basePrice: 1199
    }
  };


  let currentView = 'fram';


  // lägg till en uppdatering av bilden när sidan laddas, annars kommer man inte kunna byta lag innan man trycker på något vilket tog mig lite tid att lista ut....
  updateJerseyImage();

  // funktion för att hantera bildvisningen (fram) och ändra bilden beroende på vilken knapp man trycker på 
  $('#viewFront').on('click', function () {
    $(this).addClass('active');
    $('#viewBack').removeClass('active');
    currentView = 'fram';
    updateJerseyImage();
  });

  // funktion för att hantera bildvisningen (bak) och ändra bilden beroende på vilken knapp man trycker på 
  $('#viewBack').on('click', function () {
    $(this).addClass('active');
    $('#viewFront').removeClass('active');
    currentView = 'bak';
    updateJerseyImage();
  });

  // hantera namn och nummer inputs
  document.getElementById('namePrint').addEventListener('change', function () {
    document.getElementById('nameText').disabled = !this.checked;
    calculateTotal();
  });

  document.getElementById('numberPrint').addEventListener('change', function () {
    document.getElementById('numberText').disabled = !this.checked;
    calculateTotal();
  });

  // lyssna på alla ändringar
  $('select, input[type="checkbox"], input[type="number"], input[type="text"]')
    .on('change keyup', calculateTotal);

  // funktion för att uppdatera bilden beroende på vilket lag och vilken bild man vill ha
  function updateJerseyImage() {
    const team = document.getElementById('teamSelect').value;
    const imagePath = "bilder/" + team + "-" + currentView + ".jpg";
    document.getElementById('jerseyImage').src = imagePath;

    // uppdatera baspriset
    BASE_PRICE = teams[team].basePrice;
    document.getElementById('basePrice').textContent = BASE_PRICE + ' kr';
    calculateTotal();
  }

  // Lyssna på lagval
  document.getElementById('teamSelect').addEventListener('change', updateJerseyImage);

  // funktion för att räkna ut totalpriset och rabatterna
  function calculateTotal() {
    let addons = 0;
    let discount = 0;


    if (document.getElementById('namePrint').checked) addons += 149;
    if (document.getElementById('numberPrint').checked) addons += 119;
    if (document.getElementById('leaguePatch').checked) addons += 69;

    // räkna ut antalet, || är för att om man inte har valt något så kommer det att vara 1
    const quantity = parseInt($('#quantity').val()) || 1;

    const subtotal = (BASE_PRICE + addons) * quantity;

    // vilka val man har gjort
    const hasName = document.getElementById('namePrint').checked;
    const hasNumber = document.getElementById('numberPrint').checked;
    const hasPatch = document.getElementById('leaguePatch').checked;

    // rabatter
    if (quantity >= 2) {
      discount += subtotal * 0.1;
    }
    if (hasName && hasNumber) {
      discount += 50;
    }
    if (hasName && hasNumber && hasPatch) {
      discount += 100;
    }

    // uppdatera priser med Math.round() för att avrunda till heltal annars fick jag massa decimaler och det blev väldigt konstigt
    document.getElementById('addonsPrice').textContent = Math.round(addons) + ' kr';
    document.getElementById('discountAmount').textContent = '-' + Math.round(discount) + ' kr';
    document.getElementById('totalPrice').textContent = Math.round(subtotal - discount) + ' kr';
  }

  // hantera köpknapp
  document.getElementById('addToCart').addEventListener('click', function () {
    const button = this;
    button.disabled = true;
    button.textContent = 'Tillagd i varukorgen!';
    button.style.backgroundColor = 'green';

    // ändra tillbaka knappen efter 2 sekunder för jag har ingen varukorg den åker till 
    setTimeout(() => {
      button.disabled = false;
      button.textContent = 'Lägg i varukorg';
      button.style.backgroundColor = 'blue';
    }, 2000);
  });
});


/* jag borde ha tänkt på strukturen för att göra det mer effektivt och lättare att förstå och bygga vidare på senare, gruppera
min kod mer. Efter att ha kollat tillbaka på min kod efter någon dag så har kommentarerna hjälpt mig att se vad varje del gör
annars hade det varit jobbigt. */