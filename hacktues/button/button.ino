
#define BUTTON_PIN 5
void setup() {
  Serial.begin(115200);
  // put your setup code here, to run once:
  pinMode(BUTTON_PIN,INPUT_PULLUP);
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println(digitalRead(BUTTON_PIN));
  delay(100);
}
