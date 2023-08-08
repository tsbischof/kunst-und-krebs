#include "breath.h"

const uint8_t signal0[] = BREATH;
const uint8_t led_0 = 11;
const uint8_t signal1[] = BREATH;
const uint8_t led_1 = 12;
const size_t signal_length = min(sizeof(signal0)/sizeof(uint8_t), sizeof(signal1)/sizeof(uint8_t));
const uint16_t duration_ms = 5000;
const uint16_t delay_us = duration_ms / signal_length;

void setup() {
  pinMode(led_0, OUTPUT);
  pinMode(led_1, OUTPUT);
}

void loop() {
  for (size_t i = 0; i < signal_length; i++) {
    analogWrite(led_0, signal0[i]);
    analogWrite(led_1, signal1[i]);
    delayMicroseconds(delay_us);
  }
}
