#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>
#ifndef PSTR
 #define PSTR // Make Arduino Due happy
#endif

#define PIN 6

Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(5, 8, PIN,
  NEO_MATRIX_TOP     + NEO_MATRIX_RIGHT +
  NEO_MATRIX_COLUMNS + NEO_MATRIX_PROGRESSIVE,
  NEO_GRB            + NEO_KHZ800);

int insertops[]= { 0, 0, 0, 0, 0 };
int updateops[]= { 0, 0, 0, 0, 0 };
int deleteops[]= { 0, 0, 0, 0, 0 };

bool newdata=true;

void setup() {
  matrix.begin();
  matrix.setBrightness(64);
  Serial.begin(9600);
}

void loop() {
  if(newdata) {
      drawVals();
      newdata=false;
  }
  
  if(Serial.available() >0) {
    int newiop=Serial.parseInt();
    int newmop=Serial.parseInt();
    int newrop=Serial.parseInt();
    
    if(Serial.read() == '\n') {
        int t=0;
        for(t=matrix.width()-1;t>0;t--) {
        	insertops[t]=insertops[t-1];
        	updateops[t]=updateops[t-1];
        	deleteops[t]=deleteops[t-1];
        }
        insertops[t]=newiop;
        updateops[t]=newmop;
        deleteops[t]=newrop;
        newdata=true;
    }
  }
  
  delay(500);
}



void drawVals() {
    matrix.fillScreen(0);

    int high=0;
    
    for(int i=0;i<5;i++) {
        high=max(high,max(insertops[i],max(updateops[i],deleteops[i])));
    }

    high=int(((high+5)*10)/10);
        
    drawCol(4,insertops[0],high,0,1,0);
    drawCol(3,updateops[0],high,0,0,1); 
    drawCol(2,deleteops[0],high,1,0,0);
  
    matrix.drawPixel(0,0,matrix.Color(255,255,255));
    for(int j=0;j<map(high,0,100,0,8);j++) {
       matrix.drawPixel(0,j,matrix.Color(255,255,255));
    }
    matrix.show();
}


void drawCol(int column, int val, int scale, int basered, int basegreen, int baseblue)
{
  double scaledled=scale/matrix.height();
  double scaledval=val/scaledled;
  int t;
  
  for(t=0; t<int(scaledval); t++)
  {    
    matrix.drawPixel(column,t,matrix.Color(basered*255,basegreen*255,baseblue*255));
  }
  
  if(scaledval!=float(int(scaledval))) {
    matrix.drawPixel(column,t,matrix.Color(basered*64,basegreen*64,baseblue*64));
  }
  
}
