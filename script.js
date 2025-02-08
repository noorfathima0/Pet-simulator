class VirtualPet {
    constructor() {
        this.hunger = 100;
        this.happiness = 100;
        this.energy = 100;
        this.isAsleep = false;
        this.isDay = true;
        this.petElement = document.getElementById('pet');
        this.zzzElement = document.querySelector('.zzz');
        this.sunMoonElement = document.getElementById('sun-moon');
        this.dayNightCycleElement = document.querySelector('.day-night-cycle');
        this.currentState = 'normal';
        
        // Sound effects
        this.feedSound = document.getElementById('feed-sound');
        this.playSound = document.getElementById('play-sound');
        this.sleepSound = document.getElementById('sleep-sound');
        this.errorSound = document.getElementById('error-sound');
        
        this.init();
    }

    init() {
        this.setPetState('normal');
        this.setupEventListeners();
        this.startAttributeDecay();
        this.startDayNightCycle();
    }

    setPetState(state) {
        this.petElement.classList.remove(
            'happy', 'hungry', 'tired', 'sleeping', 'eating', 'playing'
        );
        this.zzzElement.style.opacity = '0';

        switch(state) {
            case 'happy':
                this.petElement.classList.add('happy');
                break;
            case 'hungry':
                this.petElement.classList.add('hungry');
                break;
            case 'tired':
                this.petElement.classList.add('tired');
                break;
            case 'sleeping':
                this.petElement.classList.add('sleeping');
                this.zzzElement.style.opacity = '1';
                break;
            case 'eating':
                this.petElement.classList.add('eating');
                break;
            case 'playing':
                this.petElement.classList.add('playing');
                break;
            default:
                this.petElement.classList.add('normal');
        }
        this.currentState = state;
    }

    setupEventListeners() {
        document.getElementById('feed').addEventListener('click', () => this.feed());
        document.getElementById('play').addEventListener('click', () => this.play());
        document.getElementById('sleep').addEventListener('click', () => this.toggleSleep());
    }

    startAttributeDecay() {
        setInterval(() => {
            if (!this.isAsleep) {
                this.hunger = Math.max(0, this.hunger - 3);
                this.happiness = Math.max(0, this.happiness - 2);
                this.energy = Math.max(0, this.energy - 1);
                this.updateDisplay();
            }
        }, 2000);
    }

    feed() {
        if (!this.isAsleep) {
            this.hunger = Math.min(100, this.hunger + 20);
            this.energy = Math.min(100, this.energy + 5);
            this.updateDisplay();
            this.feedSound.play();
            this.createParticles('feed-particle', 10);
            this.setPetState('eating');
            setTimeout(() => this.setPetState('normal'), 2000); // Stop eating after 2 seconds
        } else {
            this.errorSound.play();
        }
    }

    play() {
        if (!this.isAsleep && this.energy > 20) {
            this.happiness = Math.min(100, this.happiness + 15);
            this.energy = Math.max(0, this.energy - 10);
            this.updateDisplay();
            this.playSound.play();
            this.createParticles('play-particle', 15);
            this.setPetState('playing');
            setTimeout(() => this.setPetState('normal'), 2000); // Stop playing after 2 seconds
        } else {
            this.errorSound.play();
        }
    }

    toggleSleep() {
        this.isAsleep = !this.isAsleep;
        if (this.isAsleep) {
            this.energy = 100;
            this.setPetState('sleeping');
            this.sleepSound.play();
            this.createParticles('sleep-particle', 5);
        } else {
            this.setPetState('normal');
        }
    }

    updateDisplay() {
        // Update progress bars
        document.querySelector('.hunger').style.width = `${this.hunger}%`;
        document.querySelector('.happiness').style.width = `${this.happiness}%`;
        document.querySelector('.energy').style.width = `${this.energy}%`;

        // Update pet state
        if (this.isAsleep) {
            this.setPetState('sleeping');
        } else if (this.hunger <= 30) {
            this.setPetState('hungry');
        } else if (this.happiness >= 80) {
            this.setPetState('happy');
        } else if (this.energy <= 30) {
            this.setPetState('tired');
        } else {
            this.setPetState('normal');
        }
    }

    createParticles(className, count) {
        const petRect = this.petElement.getBoundingClientRect();
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle', className);
            particle.style.left = `${petRect.left + petRect.width / 2}px`;
            particle.style.top = `${petRect.bottom}px`;
            document.body.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
}

// Initialize the pet when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const pet = new VirtualPet();
});