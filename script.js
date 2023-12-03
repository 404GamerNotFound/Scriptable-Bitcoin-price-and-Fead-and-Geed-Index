// Funktion zum Abrufen des Bitcoin-Preises
async function fetchBitcoinPrice() {
    try {
        let request = new Request("https://api.coindesk.com/v1/bpi/currentprice/BTC.json");
        let response = await request.loadJSON();
        return {
          rate: response.bpi.USD.rate.replace(",", ""),
          description: response.bpi.USD.description,
          updatedTime: response.time.updated
        };
    } catch (error) {
        console.error("Fehler beim Abrufen des Bitcoin-Preises:", error);
        return { rate: "Nicht verfügbar", description: "", updatedTime: "" };
    }
}

// Funktion zum Abrufen des Fear and Greed Index
async function fetchFearAndGreedIndex() {
    try {
        let request = new Request("https://api.alternative.me/fng/");
        let response = await request.loadJSON();
        return {
          value: response.data[0].value,
          valueText: response.data[0].value_classification
        };
    } catch (error) {
        console.error("Fehler beim Abrufen des Fear and Greed Index:", error);
        return { value: "Nicht verfügbar", valueText: "" };
    }
}

function getColorForFearAndGreed(value) {
    if (value >= 75) { // Greed
        return "#34D399"; // Grün
    } else if (value <= 25) { // Fear
        return "#EF4444"; // Rot
    } else {
        return "white"; // Neutral
    }
}

// Funktion zum Erstellen von Textelementen mit Stil
function createStyledText(widget, text, size, weight = 'regular', color = 'white') {
    let textElement = widget.addText(text);
    textElement.textColor = new Color(color);
    textElement.font = new Font(weight, size);
    return textElement;
}

// Hauptfunktion
async function main() {
    const bitcoinData = await fetchBitcoinPrice();
    const fearAndGreedData = await fetchFearAndGreedIndex();

    let widget = new ListWidget();
    widget.backgroundColor = new Color("#1A1A1A");

    // Überschrift
    createStyledText(widget, 'Krypto Dashboard', 20, 'bold', '#EAB308');
    widget.addSpacer(5);

    // Bitcoin Preis
    createStyledText(widget, 'Bitcoin Preis:', 18, 'bold', '#0EA5E9');
    createStyledText(widget, `$${bitcoinData.rate}`, 16, 'bold', '#0EA5E9');
    createStyledText(widget, `${bitcoinData.description}`, 12, 'light', '#0EA5E9');
    createStyledText(widget, `Aktualisiert: ${bitcoinData.updatedTime}`, 12, 'light', '#0EA5E9');
    widget.addSpacer();

    // Fear and Greed Index
    const fearAndGreedColor = getColorForFearAndGreed(parseInt(fearAndGreedData.value));
    createStyledText(widget, 'Fear and Greed Index:', 18, 'bold', '#34D399');
    createStyledText(widget, `${fearAndGreedData.value} ${fearAndGreedData.valueText}`, 16, 'bold', '#34D399');
    widget.addSpacer();

    Script.setWidget(widget);
    Script.complete();
    widget.presentSmall();
}

main();
