let inhaleTime, exhaleTime, cycleTime;
let currentInterval, totalCycleInterval;
let currentPhase = 'inhale'; // Can be 'inhale' or 'exhale'
let startTime;

document.getElementById('startButton').addEventListener('click', startBreathingCycle);
document.getElementById('pauseButton').addEventListener('click', pauseBreathingCycle);
document.getElementById('stopButton').addEventListener('click', stopBreathingCycle);

function startBreathingCycle() {
    inhaleTime = parseInt(document.getElementById('inhaleTime').value);
    exhaleTime = parseInt(document.getElementById('exhaleTime').value);
    cycleTime = parseInt(document.getElementById('cycleTime').value) * 60; // Convert minutes to seconds

    startTime = Date.now();
    startPhase('inhale');
    totalCycleInterval = setInterval(checkCycleCompletion, 1000);
    document.getElementById('cycleTimeDialog').style.display = 'block';
    updateRemainingCycleTime();
}

function startPhase(phase) {
    let countdownElement = document.getElementById('countdown');
    let currentPhaseElement = document.getElementById('currentPhase');
    let time = phase === 'inhale' ? inhaleTime : exhaleTime;

    currentPhaseElement.textContent = phase.charAt(0).toUpperCase() + phase.slice(1);
    document.getElementById('statusDialog').style.display = 'block';

    playSound(phase); // Play sound at the beginning of each phase

    clearInterval(currentInterval); // Clear previous interval if any

    // Initialize the countdown display
    countdownElement.textContent = time;

    currentInterval = setInterval(() => {
        time--; // Decrement time first
        if (time > 0) {
            countdownElement.textContent = time;
        } else {
            clearInterval(currentInterval);
            let nextPhase = phase === 'inhale' ? 'exhale' : 'inhale';
            playSound(nextPhase); // Play sound for the next phase
            startPhase(nextPhase);
        }
    }, 1000);
}



function checkCycleCompletion() {
    if (Date.now() - startTime >= cycleTime * 1000) {
        stopBreathingCycle();
    }
}

function pauseBreathingCycle() {
    clearInterval(currentInterval);
    clearInterval(totalCycleInterval);
}

function stopBreathingCycle() {
    clearInterval(currentInterval);
    clearInterval(totalCycleInterval);
    document.getElementById('statusDialog').style.display = 'none';
    currentPhase = 'inhale';
    console.log('Breathing cycle stopped');
}

function playSound(phase) {
    let soundFile = phase === 'inhale' ? 'bell.mp3' : 'woosh.mp3';
    let sound = new Audio('soundFile');
    sound.play();
}

function updateRemainingCycleTime() {
    let remainingCycleTimeElement = document.getElementById('remainingCycleTime');
    let interval = setInterval(() => {
        let elapsed = (Date.now() - startTime) / 1000;
        let remaining = cycleTime - elapsed;
        if (remaining >= 0) {
            remainingCycleTimeElement.textContent = formatTime(remaining);
        } else {
            clearInterval(interval);
            document.getElementById('cycleTimeDialog').style.display = 'none';
        }
    }, 1000);
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return minutes + ':' + (secs < 10 ? '0' : '') + secs;
}