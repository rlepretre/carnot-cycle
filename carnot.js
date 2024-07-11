let T_H = 500; // High temperature in Kelvin
let T_C = 300; // Low temperature in Kelvin
let V_1 = 0.1; // Initial volume in m^3
let V_2 = 0.2; // Volume after isothermal expansion in m^3
let V_3, V_4;
let n = 1.0; // Amount of gas in moles
let R = 8.314; // Universal gas constant in J/(mol K)
let gamma = 1.4; // Ratio of heat capacities
let t_f = 10; // Total time for the process in seconds

let currentTime = 0; // Current time in the simulation
let currentStep = 0; // Current step in the Carnot cycle

const STEPS = {
    step1: 0,
    step2: 1,
    step3: 2,
    step4: 3,
};
let step = STEPS.step1;

function setup() {
    createCanvas(400, 400); // Set up the canvas
    noStroke(); // No outline for the rectangle
}

function draw() {
    background(255);

    // Update current time
    currentTime += deltaTime / 1000; // Convert milliseconds to seconds

    // Calculate current step and adjust time
    let stepDuration = t_f / 4;
    if (currentTime > stepDuration) {
        currentTime = 0;
        currentStep = (currentStep + 1) % 4;
    }

    let currentVolume;
    let currentTemperature;

    switch (currentStep) {
        case STEPS.step1:
            // Step 1: Isothermal expansion at T_H
            currentVolume = volumeOverTime(V_1, V_2, stepDuration, currentTime);
            currentTemperature = T_H;
            break;
        case STEPS.step2:
            // Step 2: Adiabatic expansion from T_H to T_C
            V_3 = V_2 * Math.pow(T_H / T_C, 1 / (gamma - 1));
            currentVolume = adiabaticVolume(
                V_2,
                V_3,
                stepDuration,
                currentTime
            );
            currentTemperature = T_C * Math.pow(V_3 / currentVolume, gamma - 1);
            break;
        case STEPS.step3:
            // Step 3: Isothermal compression at T_C
            V_4 = V_1 * Math.pow(T_H / T_C, 1 / (gamma - 1));
            currentVolume = volumeOverTime(V_3, V_4, stepDuration, currentTime);
            currentTemperature = T_C;
            break;
        case STEPS.step4:
            // Step 4: Adiabatic compression from T_C to T_H
            currentVolume = adiabaticVolume(
                V_4,
                V_1,
                stepDuration,
                currentTime
            );
            currentTemperature = T_C * Math.pow(V_4 / currentVolume, gamma - 1);
            console.log(currentVolume, currentTemperature);
            break;
        default:
            break;
    }

    // Map the volume to rectangle size
    let rectWidth = map(currentVolume, 0, 2, 100, 400);

    // Map the temperature to color
    let colorValue = map(currentTemperature, 300, 501, 0, 255);
    let rectColor = color(colorValue, 0, 255 - colorValue);

    // Draw the rectangle
    fill(rectColor);
    rect(width / 2, height / 2, 50, -rectWidth);
    text(`Step ${currentStep + 1}`, width / 2, height / 2 + 50);
    text(`V = ${currentVolume}`, width / 2 + 60, height / 4);
    text(`T = ${currentTemperature}`, width / 2 + 60, height / 4 + 10);
}

function volumeOverTime(V_start, V_end, duration, time) {
    return V_start + (V_end - V_start) * (time / duration);
}

// Function to compute volume over time for adiabatic processes
function adiabaticVolume(V_start, V_end, duration, time) {
    let fraction = time / duration;
    return V_start * Math.pow(V_end / V_start, fraction);
}

// Function to start or reset the animation when the mouse is pressed
function mousePressed() {
    currentTime = 0;
    currentStep = 0;
}
