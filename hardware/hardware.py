#!/usr/bin/env python3
import mraa
import requests

hospitalId = '3'

pins = [23, 27, 29, 31, 33]
values = {}
sensors = {}

# setup pins
for pin in pins:
    sensors[pin] = mraa.Gpio(pin)
    values[pin] = False
    sensors[pin].dir(mraa.DIR_IN)


def sendValue(val):
    headers = {'charset': 'utf-8'}
    url = 'https://us-central1-urban-hacks-2018.cloudfunctions.net/updateBed?hospitalId={}&occupied={}'
    url = url.format(hospitalId, val)
    requests.post(url, headers=headers)


# application loop
while True:
    for pin in pins:
        sensor = sensors[pin]
        touchButton = int(sensor.read())
        if bool(touchButton) != values[pin]:
            sendValue(touchButton)
            print("{}: {}".format(pin, touchButton))
            values[pin] = bool(touchButton)
