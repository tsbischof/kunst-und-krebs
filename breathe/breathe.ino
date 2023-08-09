#include "breath.h"

const uint8_t wave0[] = BREATH;
const uint8_t led0 = 10;
const uint8_t wave1[] = BREATH;
const uint8_t led1 = 11;
const size_t signal_length = min(sizeof(wave0)/sizeof(uint8_t), sizeof(wave1)/sizeof(uint8_t));
const unsigned int duration_ms = 8000;
const unsigned int delay_between_leds_ms = 0;
const unsigned int delay_ms = (duration_ms) / signal_length;

void setup() {
  pinMode(led0, OUTPUT);
  analogWrite(led0, 0);
  pinMode(led1, OUTPUT);
  analogWrite(led1, 0);
  Serial.begin(9600);
  Serial.print("signal_length=");
  Serial.println(signal_length);
  Serial.print("duration_ms=");
  Serial.println(duration_ms);
  Serial.print("delay_ms=");
  Serial.println(delay_ms);
  Serial.print("delay_between_leds_ms=");
  Serial.println(delay_between_leds_ms);
}

void loop() {
  for (size_t i = 0; i < signal_length; i++) {
    analogWrite(led0, wave0[i]);
    delay(delay_ms);
  }
  delay(delay_between_leds_ms);
  for (size_t i = 0; i < signal_length; i++) {
    analogWrite(led1, wave1[i]);
    delay(delay_ms);
  }
  delay(delay_between_leds_ms);
}
