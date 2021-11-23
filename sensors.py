import random

# This shows two examples of simulated sensors which can be used to test
# the TATU protocol on SOFT-IoT or with a standalone MQTT broker
#
# There are samples of real sensors implementations in the src/sensorsExamples
# folder. You can adapt those examples to your needs.


# The name of sensors functions should be exactly the same as in config.json


import multiprocessing

from time import sleep

procs = []

class atualiza_sensores(multiprocessing.Process):
	def __init__(self):
		multiprocessing.Process.__init__(self)
		self.manager = multiprocessing.Manager()
	
		self.humiditySensor = self.manager.list()
		self.humiditySensor.append(random.randint(60, 70))
		self.humiditySensor.append(random.randint(60, 70))
		self.humiditySensor.append(random.randint(60, 70))
		self.humiditySensor.append(random.randint(60, 70))
		
		self.temperatureSensor = self.manager.list()
		self.temperatureSensor.append(random.randint(25, 38))
		self.temperatureSensor.append(random.randint(25, 38))
		self.temperatureSensor.append(random.randint(25, 38))
		self.temperatureSensor.append(random.randint(25, 38))

		self.irrigation = self.manager.list()
		self.irrigation.append(False)
		self.irrigation.append(False)
		self.irrigation.append(False)
		self.irrigation.append(False)

		self.rain = self.manager.list()
		self.rain.append(False)

	def get_humiditySensor_id(self,id):
		return self.humiditySensor[id - 1]

	def get_temperatureSensor_id(self,id):
		return self.temperatureSensor[id - 1]


	def decrease_humidity(self, temperature, humidity):
		temperature_chance = random.randint(0, 100) * 1.5 <= temperature and humidity >= 10
		if not temperature_chance:
			return False

		#humidity_chance = random.randint(0,100) < humidity
		return True

	def decrease_temperature(self, humidity, temperature):
		humidity_chance = random.randint(0,100) * 2.0 < humidity 
		return (random.choice([True, False]) or humidity_chance) and temperature >= 25

	def increase_temperature(self, humidity, temperature):
		humidity_chance = random.randint(0,100) * 0.5 >= humidity 
		return (random.choice([True, False]) or humidity_chance) and temperature <= 38

	def run(self):
		while(True):
			for i in range(4):
				if not self.irrigation[i] and not self.rain[0] and self.decrease_humidity(self.temperatureSensor[i], self.humiditySensor[i]):
					self.humiditySensor[i] -= 1

				
				dec_t = self.decrease_temperature(self.humiditySensor[i],self.temperatureSensor[i]) or (self.rain[0] and random.choice([True,False]))
				inc_t = self.increase_temperature(self.humiditySensor[i],self.temperatureSensor[i])
				if inc_t and not dec_t:
					self.temperatureSensor[i] += 1
				elif dec_t and not inc_t:
					self.temperatureSensor[i] -= 1

				if self.humiditySensor[i] <= 30:
					self.irrigation[i] = True
				if self.humiditySensor[i] >= 60:
					self.irrigation[i] = False
				if self.rain[0]:
					self.rain[0] = random.choice([True,True,True,False])
				if not self.rain[0]:
					self.rain[0] = random.randint(0,20) >= 18
			sleep(1)







def humiditySensor():
    return procs[0].get_humiditySensor_id(1)
    	
def humiditySensor_2():
    return procs[0].get_humiditySensor_id(2)

def humiditySensor_3():
    return procs[0].get_humiditySensor_id(3)

def humiditySensor_4():
    return procs[0].get_humiditySensor_id(4)


def temperatureSensor():
    return procs[0].get_temperatureSensor_id(1)

def temperatureSensor_2():
    return procs[0].get_temperatureSensor_id(2)

def temperatureSensor_3():
    return procs[0].get_temperatureSensor_id(3)

def temperatureSensor_4():
    return procs[0].get_temperatureSensor_id(4)




def soilmoistureSensor():
    return random.randint(0,1023)
	
def solarradiationSensor():
    return random.randint(300, 3000)

def ledActuator(s = None):
	if s==None:
		return bool(random.randint(0, 1))
	else:
		if s:
			print("1")
		else:
			print("0")
		return s


proc = atualiza_sensores()
procs.append(proc)
proc.start()
