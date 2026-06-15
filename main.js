const ROUTES = [
    {
        id: "yamanote",
        name: "山手線",
        path: "M535 300 C535 231 479 175 410 175 C341 175 285 231 285 300 C285 369 341 425 410 425 C479 425 535 369 535 300",
        stationNames: ["東京", "秋葉原", "上野", "池袋", "新宿", "渋谷", "品川"]
    },
    {
        id: "chuo",
        name: "中央線",
        path: "M285 300 L245 300 L200 300 L155 300 L110 300 L70 300 L35 300",
        stationNames: ["新宿", "中野", "吉祥寺", "国分寺", "立川", "八王子", "高尾"]
    },
    {
        id: "sobu",
        name: "総武線各停",
        path: "M785 300 L720 285 L655 275 L595 288 L535 300 L410 300 L285 300",
        stationNames: ["千葉", "船橋", "市川", "錦糸町", "秋葉原", "四ツ谷", "新宿"]
    },
    {
        id: "yokosuka",
        name: "横須賀線",
        path: "M515 367 L460 415 L540 465 L480 510 L390 550 L280 575 L170 590",
        stationNames: ["東京", "品川", "川崎", "横浜", "大船", "逗子", "久里浜"]
    }
];

const STATIONS = [
    { name: "東京", x: 515, y: 367, labelDx: 16, labelDy: 0, lines: ["山手線", "横須賀線"] },
    { name: "秋葉原", x: 535, y: 300, labelDx: -50, labelDy: -12, lines: ["山手線", "総武線各停"] },
    { name: "上野", x: 460, y: 185, labelDx: 10, labelDy: -12, lines: ["山手線"] },
    { name: "池袋", x: 335, y: 200, labelDx: -10, labelDy: -16, labelAnchor: "end", lines: ["山手線"] },
    { name: "新宿", x: 285, y: 300, labelDx: 18, labelDy: -12, lines: ["山手線", "中央線", "総武線各停"] },
    { name: "渋谷", x: 335, y: 400, labelDx: -10, labelDy: 20, labelAnchor: "end", lines: ["山手線"] },
    { name: "品川", x: 460, y: 415, labelDx: -14, labelDy: 30, lines: ["山手線", "横須賀線"] },
    { name: "中野", x: 245, y: 300, labelDx: 0, labelDy: 26, labelAnchor: "middle", lines: ["中央線"] },
    { name: "吉祥寺", x: 200, y: 300, labelDx: 0, labelDy: -16, labelAnchor: "middle", lines: ["中央線"] },
    { name: "国分寺", x: 155, y: 300, labelDx: 0, labelDy: 26, labelAnchor: "middle", lines: ["中央線"] },
    { name: "立川", x: 110, y: 300, labelDx: 0, labelDy: -16, labelAnchor: "middle", lines: ["中央線"] },
    { name: "八王子", x: 70, y: 300, labelDx: 0, labelDy: 26, labelAnchor: "middle", lines: ["中央線"] },
    { name: "高尾", x: 35, y: 300, labelDx: 0, labelDy: -16, labelAnchor: "middle", lines: ["中央線"] },
    { name: "千葉", x: 785, y: 300, labelDx: -12, labelDy: 25, lines: ["総武線各停"] },
    { name: "船橋", x: 720, y: 285, labelDx: -12, labelDy: -18, lines: ["総武線各停"] },
    { name: "市川", x: 655, y: 275, labelDx: -12, labelDy: 22, lines: ["総武線各停"] },
    { name: "錦糸町", x: 595, y: 288, labelDx: -18, labelDy: -18, lines: ["総武線各停"] },
    { name: "四ツ谷", x: 410, y: 300, labelDx: 8, labelDy: 22, lines: ["総武線各停"] },
    { name: "川崎", x: 540, y: 465, labelDx: 12, labelDy: -6, lines: ["横須賀線"] },
    { name: "横浜", x: 480, y: 510, labelDx: 12, labelDy: 20, lines: ["横須賀線"] },
    { name: "大船", x: 390, y: 550, labelDx: 2, labelDy: -16, lines: ["横須賀線"] },
    { name: "逗子", x: 280, y: 575, labelDx: 2, labelDy: 20, lines: ["横須賀線"] },
    { name: "久里浜", x: 170, y: 590, labelDx: 2, labelDy: -16, lines: ["横須賀線"] }
];

const state = {
    selectedStation: null,
    selectedHour: 0,
    weatherData: null
};

const elements = {
    routeLines: $("#route-lines"),
    stationLayer: $("#station-layer"),
    timeRange: $("#time-range"),
    timeLabel: $("#time-label"),
    timeDateTime: $("#time-datetime"),
    emptyState: $("#empty-state"),
    weatherCard: $("#weather-card"),
    selectedStation: $("#selected-station"),
    selectedLines: $("#selected-lines"),
    selectedDateTime: $("#selected-datetime"),
    weatherSummary: $("#weather-summary"),
    temperature: $("#temperature"),
    precipitation: $("#precipitation"),
    outfitRecommendation: $("#outfit-recommendation")
};

function createSvgElement(tagName, attributes = {}) {
    return $(document.createElementNS("http://www.w3.org/2000/svg", tagName)).attr(attributes);
}

function drawRoutes() {
    ROUTES.forEach((route) => {
        const $path = createSvgElement("path", {
            d: route.path,
            class: `route-line ${route.id}`,
            "aria-label": route.name
        });

        elements.routeLines.append($path);
    });
}

function drawStations() {
    STATIONS.forEach((station) => {
        const $group = createSvgElement("g", {
            class: `station-button${station.lines.length > 1 ? " transfer" : ""}`,
            role: "button",
            tabindex: "0",
            "aria-label": `${station.name}駅`
        });

        $group.data("station-name", station.name);

        const $dot = createSvgElement("circle", {
            class: "station-dot",
            cx: station.x,
            cy: station.y,
            r: station.lines.length > 1 ? 8 : 6
        });

        const $label = createSvgElement("text", {
            class: "station-label",
            x: station.x + (station.labelDx ?? 11),
            y: station.y + (station.labelDy ?? -9),
            "text-anchor": station.labelAnchor ?? "start"
        }).text(station.name);

        $group
            .append($dot, $label)
            .on("click", () => selectStation(station.name))
            .on("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectStation(station.name);
                }
            });

        elements.stationLayer.append($group);
    });
}

function selectStation(stationName) {
    state.selectedStation = STATIONS.find((station) => station.name === stationName);
    state.weatherData = null;

    $(".station-button").each(function () {
        $(this).toggleClass(
            "is-selected",
            $(this).data("station-name") === stationName
        );
    });

    renderWeatherCard();
}

function getSelectedDate() {
    const date = new Date();
    date.setMinutes(0, 0, 0);
    date.setHours(date.getHours() + state.selectedHour);
    return date;
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

function formatHourLabel(hours) {
    if (hours === 0) {
        return "現在";
    }

    return `${hours}時間後`;
}

function renderTime() {
    const selectedDate = getSelectedDate();
    elements.timeLabel.text(formatHourLabel(state.selectedHour));
    elements.timeDateTime.text(formatDateTime(selectedDate));

    if (state.selectedStation) {
        renderWeatherCard();
    }
}

function renderWeatherCard() {
    const selectedDate = getSelectedDate();

    elements.emptyState.prop("hidden", Boolean(state.selectedStation));
    elements.weatherCard.prop("hidden", !state.selectedStation);

    if (!state.selectedStation) {
        return;
    }

    elements.selectedStation.text(state.selectedStation.name);
    elements.selectedLines.empty().append(
        ...state.selectedStation.lines.map((line) => {
            return $("<span>").text(line);
        })
    );
    elements.selectedDateTime.text(formatDateTime(selectedDate));

    if (!state.weatherData) {
        elements.weatherSummary.text("未取得");
        elements.temperature.text("--℃");
        elements.precipitation.text("--%");
        elements.outfitRecommendation.text("未取得");
        return;
    }

    elements.weatherSummary.text(state.weatherData.summary ?? "未取得");
    elements.temperature.text(formatValue(state.weatherData.temperature, "℃"));
    elements.precipitation.text(formatValue(state.weatherData.precipitationProbability, "%"));
    elements.outfitRecommendation.text(state.weatherData.outfit ?? "未取得");
}

function formatValue(value, unit) {
    if (value === null || value === undefined || value === "") {
        return `--${unit}`;
    }

    return `${value}${unit}`;
}

function setWeatherData(weatherData) {
    state.weatherData = weatherData;
    renderWeatherCard();
}

function getAppState() {
    return {
        station: state.selectedStation,
        hourOffset: state.selectedHour,
        dateTime: getSelectedDate()
    };
}

elements.timeRange.on("input", function () {
    state.selectedHour = Number($(this).val());
    state.weatherData = null;
    renderTime();
});

drawRoutes();
drawStations();
renderTime();

window.StationWeatherApp = {
    getState: getAppState,
    setWeatherData
};
