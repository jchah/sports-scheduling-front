// src/eventBus.js
import { reactive } from 'vue';

const listeners = reactive({});

function $emit(event, ...args) {
    if (listeners[event]) {
        listeners[event].forEach(cb => cb(...args));
    }
}

function $on(event, callback) {
    if (!listeners[event]) {
        listeners[event] = new Set(); // Using Set for uniqueness
    }
    listeners[event].add(callback);
}

function $off(event, callback) {
    if (listeners[event]) {
        listeners[event].delete(callback);
        if (listeners[event].size === 0) {
            delete listeners[event];
        }
    }
}

export const EventBus = { $emit, $on, $off };
