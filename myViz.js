//Visualization Settings

let width = 1200
let height = 800
let gridSide = 10
let ballR = 10
let stepsPerSecond = 240 //int; physics updates per second
let visualSamplingRatio = 4 //int; update visuals every N physics updates

//AI Settings (0=simpleReflex,1=patientReflex,2=modelReflex)

let pOneAI = 0
let pTwoAI = 1
let namesAI = ["Simple Reflex Agent","Patient Reflex Agent","Model Reflex Agent"]

//Create SVG

let svg = d3.select('#viz').append('svg').attr("width",width).attr("height",height+100)

//Create Visualization Elements

//Court

let playerGoal = svg.append("rect").attr("width",width/20)
                .attr("height",height)
                .attr("x", 0)
                .attr("y",0)
                .attr("stroke","None")
                .attr("fill","rgb(200,50,50)")

let pongCourt =  svg.append("rect").attr("width",18*width/20)
                .attr("height",height)
                .attr("x", width/20)
                .attr("y",0)
                .attr("stroke","None")
                .attr("fill","rgb(50,100,50)")                

let aiGoal = svg.append("rect").attr("width",width/20)
            .attr("height",height)
            .attr("x", 19*width/20)
            .attr("y",0)
            .attr("stroke","None")
            .attr("fill","rgb(200,50,50)")

let middleCourt = svg.append("rect").attr("width",18*width/20)
            .attr("height",10)
            .attr("x", width/20)
            .attr("y",height/2-5)
            .attr("stroke","None")
            .attr("fill","rgb(100,150,100)")

let halfCourt = svg.append("line")
            .attr("x1", width/2)
            .attr("x2", width/2)
            .attr("y1",0)
            .attr("y2",height)
            .attr("stroke","rgb(100,150,100)")
            .attr("stroke-width", 4)
            .attr("stroke-dasharray", "5 5")
            .attr("stroke-dashoffset", "2.5")




//Info

let gPlayPause = svg.append("g").attr("opacity",.5)



let paused = gPlayPause.append("text").text("PAUSED")
                            .attr("y",height/2-50)
                            .attr("x",width/2)
                            .attr("fill","rgb(255,255,255)")
                            .attr("text-anchor","middle")
                            .attr("font-size",100)
                            .attr("dominant-baseline","middle")

let pausedMsg = gPlayPause.append("text").text("(Click Field to Play/Pause)")
                            .attr("y",height/2+40)
                            .attr("x",width/2)
                            .attr("fill","rgb(255,255,255)")
                            .attr("text-anchor","middle")
                            .attr("font-size",30)
                            .attr("dominant-baseline","middle")

let resetButton = svg.append("rect")
                            .attr("y",height+20)
                            .attr("x",width/2-75)
                            .attr("rx",5)
                            .attr("height",30)
                            .attr("width",150)
                            .attr("fill","rgba(200,200,200,1)")
                            .attr("stroke","rgba(50,50,50,1)")                            
                             
let resetText = svg.append("text").text("Reset")
                            .attr("y",height+36)
                            .attr("x",width/2)
                            .attr("fill","rgb(0,0,0)")
                            .attr("text-anchor","middle")
                            .attr("font-size",22)
                            .attr("dominant-baseline","middle")
                          

let simpleAgentMsg = svg.append("text").text("(agent tracks ball position)")
                            .attr("y",height+83)
                            .attr("x",width/2)
                            .attr("fill","rgb(0,0,0)")
                            .attr("opacity",0)
                            .attr("text-anchor","middle")
                            .attr("font-size",30)
                            .attr("dominant-baseline","middle")

let patientAgentMsg = svg.append("text").text("(agent tracks ball position when ball is close)")
                            .attr("y",height+83)
                            .attr("x",width/2)
                            .attr("fill","rgb(0,0,0)")
                            .attr("opacity",0)
                            .attr("text-anchor","middle")
                            .attr("font-size",30)
                            .attr("dominant-baseline","middle")

let modelAgentMsg = svg.append("text").text("(agent predicts ball position when ball is inbound)")
                            .attr("y",height+83)
                            .attr("x",width/2)
                            .attr("fill","rgb(0,0,0)")
                            .attr("opacity",0)
                            .attr("text-anchor","middle")
                            .attr("font-size",30)
                            .attr("dominant-baseline","middle")

agentTips = [simpleAgentMsg,patientAgentMsg,modelAgentMsg]

function showTip(target){
    console.log("tip")
    for(let i = 0;i<agentTips.length;i++){
        if(i==target){
            agentTips[i]
            agentTips[i].transition(500).attr("opacity",.75)
        }else{
            agentTips[i].transition(500).attr("opacity",0)
        } 
    }   
}
function hideTip(){
    console.log("notip")
    for(let i = 0;i<agentTips.length;i++){        
        agentTips[i].transition(500).attr("opacity",0) 
    }   
}

//Scores

let pOneScore = svg.append("text").text("0")
                            .attr("y",height+40)
                            .attr("x",width/8)
                            .attr("text-anchor","middle")
                            .attr("font-size",50)
                            .attr("dominant-baseline","middle")

let pTwoScore = svg.append("text").text("0")
                            .attr("y",height+40)
                            .attr("x",7*width/8)
                            .attr("text-anchor","middle")
                            .attr("font-size",50)
                            .attr("dominant-baseline","middle")


let pOneID = svg.append("text").text("P1")
                            .attr("y",height+40)
                            .attr("x",width/40)
                            .attr("text-anchor","middle")
                            .attr("font-size",50)
                            .attr("dominant-baseline","middle")
       
let pOneButtonAI = svg.append("rect")
                            .attr("y",height+65)
                            .attr("x",1)
                            .attr("rx",5)
                            .attr("height",30)
                            .attr("width",205)
                            .attr("fill","rgba(200,200,200,1)")
                            .attr("stroke","rgba(50,50,50,1)")                            
                                           

let pOneAIID = svg.append("text").text(namesAI[pOneAI])
                            .attr("y",height+71)
                            .attr("x",195)
                            .attr("text-anchor","end")
                            .attr("font-size",22)                                                       
                            .attr("dominant-baseline","hanging")
                         

let pTwoID = svg.append("text").text("P2")
                            .attr("y",height+40)
                            .attr("x",39*width/40)
                            .attr("text-anchor","middle")
                            .attr("font-size",50)
                            .attr("dominant-baseline","middle")

let pTwoButtonAI = svg.append("rect")
                            .attr("y",height+65)
                            .attr("x",width-206)
                            .attr("rx",5)
                            .attr("height",30)
                            .attr("width",205)
                            .attr("fill","rgba(200,200,200,1)")
                            .attr("stroke","rgba(50,50,50,1)")                            
                            .on("click",incrementOne)
                            .style("cursor", "pointer")    

let pTwoAIID = svg.append("text").text(namesAI[pTwoAI])
                            .attr("y",height+70)
                            .attr("x",width-11)
                            .attr("text-anchor","end")
                            .attr("font-size",22)
                            .attr("dominant-baseline","hanging")




//Moving parts

   

let ball = svg.append("circle").attr("cx",width/2)
                            .attr("cy",height/2)
                            .attr("r",ballR)
                            .attr("fill","rgb(200,200,0)")

let pOnePaddle = svg.append("rect").attr("width",10)
                  .attr("height",height/8)
                  .attr("x", width/20)
                  .attr("y",0)
                  .attr("stroke","None")
                  .attr("fill","rgb(50,50,100)")

let pTwoPaddle = svg.append("rect").attr("width",10)
                  .attr("height",height/8)
                  .attr("x", 19*width/20-10)
                  .attr("y",0)
                  .attr("stroke","None")
                  .attr("fill","rgb(50,50,100)")

//Clickables

let pongCourtClick =  svg.append("rect").attr("width",width)
                            .attr("height",height)
                            .attr("x", 0)
                            .attr("y",0)
                            .attr("stroke","None")
                            .attr("fill","rgba(0,0,0,0)")
                            .on("click",pause)
                            .style("cursor", "pointer")  

let pOneClickAI = svg.append("rect")
                  .attr("y",height+65)
                  .attr("x",0)
                  .attr("rx",5)
                  .attr("height",30)
                  .attr("width",205)
                  .attr("fill","rgba(0,0,0,0)")
                  .on("click",incrementOne)
                  .style("cursor", "pointer")
                  .on("mouseover",function(){showTip(pOneAI)})
                  .on("mouseout",hideTip)

let pTwoClickAI = svg.append("rect")
                            .attr("y",height+70)
                            .attr("x",width-205)
                            .attr("height",22)
                            .attr("width",200)
                            .attr("fill","rgba(0,0,0,0)")
                            .on("click",incrementTwo)
                            .style("cursor", "pointer")
                            .on("mouseover",function(){showTip(pTwoAI)})
                            .on("mouseout",hideTip)

let resetButtonClick = svg.append("rect")
                            .attr("y",height+25)
                            .attr("x",width/2-75)
                            .attr("rx",5)
                            .attr("height",30)
                            .attr("width",150)
                            .attr("fill","rgba(0,0,0,0)")
                            .on("click",reset)
                            .style("cursor", "pointer")
                            
//Initialize Game




let ballPos = [width/2,height/2]
let ballVec = [Math.random()-.5,Math.random()-.5]
ballVec[0] += .5*Math.sign(ballVec[0])

let scores = [0,0]
let pOnePos = 0
let pTwoPos = 0
let missed = false
let ballSpeed = 4

function reset(){
    ballPos = [width/2,height/2]
    ballVec = [Math.random()-.5,Math.random()-.5]
    ballVec[0] += .5*Math.sign(ballVec[0])

    scores = [0,0]
    pOnePos = 0
    pTwoPos = 0
    missed = false
    ballSpeed = 4

    ball.attr("cx", ballPos[0]).attr("cy", ballPos[1])
    pOnePaddle.attr("y",pOnePos)
    pTwoPaddle.attr("y",pTwoPos)
    //if(play = 1){pause()}
}

function normalizeVec(vec,c=1){
    let sumSqr = 0
    for(let i = 0;i<vec.length;i++){
        sumSqr += vec[i]**2
    }
    let norm = Math.sqrt(sumSqr)
    for(let i = 0;i<vec.length;i++){
        vec[i] = c*vec[i]/norm
    }    
    return vec
}

function incrementOne(){
    pOneAI +=1
    pOneAI = pOneAI%namesAI.length
    pOneAIID.text(namesAI[pOneAI])
    scores = [0,0]
    pOneScore.text(scores[0])
    pTwoScore.text(scores[1])
    showTip(pOneAI)
}
function incrementTwo(){
    pTwoAI +=1
    pTwoAI = pTwoAI%namesAI.length
    pTwoAIID.text(namesAI[pTwoAI])
    scores = [0,0]
    pOneScore.text(scores[0])
    pTwoScore.text(scores[1])
    showTip(pTwoAI)
}



function simpleReflex(ballPos,ballVec,playerPos,playerID,deadZone=5){

    //Condition-Action Rules:
    //If ball higher than paddle, move up. 
    //If ball lower than paddle, move down.
    //Else, do not move.

    let offset = 0

    if(ballPos[1]>playerPos+height/16+deadZone){ //if ball higher than paddle        
        offset = 6 //raise paddle
    }
    if(ballPos[1]<playerPos+height/16-deadZone){ //if ball lower than paddle
        offset = -6 //lower paddle
    }

    return offset
}

function patientReflex(ballPos,ballVec,playerPos,playerID,deadZone=5){

    //Condition-Action Rules:
    //If ball on your side of the court and higher than paddle, move up. 
    //If ball on your side of the court and lower than paddle, move down.
    //Else, do not move.

    let offset = 0
    let pSide = true
    
    if(playerID==1){
        pSide = ballPos[0]/width<.5
    }else{
        pSide = ballPos[0]/width>.5
    }

    if(pSide){//if ball on player's side of court
        if(ballPos[1]>playerPos+height/16+deadZone){ //if ball higher than paddle         
            offset = 6 //raise paddle            
        }
        if(ballPos[1]<playerPos+height/16-deadZone){ //if ball lower than paddle
            offset = -6 //lower paddle
        }
    }

    return offset
}

function modelReflex(ballPos,ballVec,playerPos,playerID,deadZone=5){

    //Condition-Action Rules:
    //If ball incoming and model-predicted final position higher than paddle, move up. 
    //If ball incoming and model-predicted final position lower than paddle, move down.
    //Else, do not move. 

    let offset = 0    

    //Create deep copy of ball state to use as simulated ball state
    let modelBallPos = JSON.parse(JSON.stringify(ballPos)) 
    let modelBallVec = JSON.parse(JSON.stringify(ballVec)) 

    let incoming = true
    
    if(playerID==1){
        incoming = modelBallVec[0]<0
    }else{
        incoming = modelBallVec[0]>0
    }

    if(incoming){//if ball incoming

        //Simulate forward path of ball

        let inPlay = true
           

        while(inPlay){ //While Simulated Ball In Play   

            modelBallPos = [modelBallPos[0]+modelBallVec[0],modelBallPos[1]+modelBallVec[1]]

            //Ball Boundaries

            if(modelBallPos[1]<=ballR){
                modelBallPos[1]=ballR
                modelBallVec[1]=modelBallVec[1]*-1
            }   
            if(modelBallPos[1]>=height-ballR){
                modelBallPos[1]=height-ballR
                modelBallVec[1]=modelBallVec[1]*-1}

            if(modelBallPos[0]>=width-ballR){
                modelBallPos[0]=width-ballR
            }
            if(modelBallPos[0]<=ballR){
                modelBallPos[0]=ballR
            }
            
            if(playerID==1){
                inPlay = modelBallPos[0]>width/20+10+ballR
            }else{
                inPlay = modelBallPos[0]<width-(width/20+10+ballR)
            }
        }



    if(modelBallPos[1]>playerPos+height/16+deadZone){
        offset = 4 
    }
    if(modelBallPos[1]<playerPos+height/16-deadZone){
        offset = -4 
    }
    }
    return offset
}

let AIfunctions = [simpleReflex,patientReflex,modelReflex]

let frameNum = 0


function playFrame(){

    //Move Ball

    ballVec = normalizeVec(ballVec,ballSpeed)

    ballPos = [ballPos[0]+ballVec[0],ballPos[1]+ballVec[1]]

    //Ball Boundaries

    if(ballPos[1]<=ballR){
        ballPos[1]=ballR
        ballVec[1]=ballVec[1]*-1
    }   
    if(ballPos[1]>=height-ballR){
            ballPos[1]=height-ballR
            ballVec[1]=ballVec[1]*-1}

    if(ballPos[0]>=width-ballR){
        ballPos[0]=width-ballR
    }
    if(ballPos[0]<=ballR){
        ballPos[0]=ballR
    } 

    //Move paddle     

    pOnePos += AIfunctions[pOneAI](ballPos,ballVec,pOnePos,1)
    pTwoPos += AIfunctions[pTwoAI](ballPos,ballVec,pTwoPos,2)
   
    //Paddle Boundaries

    if(pOnePos>7*height/8){pOnePos=7*height/8}
    if(pOnePos<0){pOnePos=0}

    if(pTwoPos>7*height/8){pTwoPos=7*height/8}
    if(pTwoPos<0){pTwoPos=0}

    //Bounce Off Paddles
    if(!missed){
        
        if(ballPos[0]>=width-(width/20+10+ballR)){
            if(ballPos[1]>pTwoPos && ballPos[1]<pTwoPos+height/8){
                ballPos[0]=width-(width/20+10+ballR)
                ballVec[0]=ballVec[0]*-1

                if(Math.abs(ballVec[1])/2<Math.abs(ballVec[0])){ //Prevent Up/Down Sharp Bounces
                    if(ballPos[1]>pTwoPos+height/16){                    
                            ballVec[1] += 2                       
                    }else{                    
                            ballVec[1] -= 2                    
                    }
                }

                ballSpeed *= 1.05

            }else{
                missed = true
            }
        } 
        if(ballPos[0]<=width/20+10+ballR){
            if(ballPos[1]>pOnePos && ballPos[1]<pOnePos+height/8){ //Prevent Up/Down Sharp Bounces
                ballPos[0]=width/20+10+ballR
                ballVec[0]=ballVec[0]*-1     

                if(Math.abs(ballVec[1])/2<Math.abs(ballVec[0])){
                    if(ballPos[1]>pOnePos+height/16){
                        ballVec[1] += 2
                    }else{
                        ballVec[1] -= 2
                    }
                }

                ballSpeed *= 1.05

            }else{
                missed = true
            }
        }
        

    }
    
    //Update Objects

    frameNum = frameNum%visualSamplingRatio 
    if(frameNum==0){        
        ball.attr("cx", ballPos[0]).attr("cy", ballPos[1])
        pOnePaddle.attr("y",pOnePos)
        pTwoPaddle.attr("y",pTwoPos)
    }


    //Score and Start New Round
    if(ballPos[0]<=ballR){
        scores[1]++
        missed = false
        ballPos = [width/2,height/2]
        ballVec = [Math.random()-.5,Math.random()-.5]
        ballVec[0] += .5*Math.sign(ballVec[0])
        ballSpeed = 4
        console.log(scores)
    }
    if(ballPos[0]>=width-ballR){
        scores[0]++
        missed = false
        ballPos = [width/2,height/2]
        ballVec = [Math.random()-.5,Math.random()-.5]
        ballVec[0] += .5*Math.sign(ballVec[0])
        ballSpeed = 4
        console.log(scores)
    }

    pOneScore.text(scores[0])
    pTwoScore.text(scores[1])
    frameNum++

}

 //start animation and set frame time.
 
 animation = setInterval(playFrame, 1000/stepsPerSecond)
 
 let play = 1
 function pause(){if(play==1){play=0;clearInterval(animation);gPlayPause.attr("opacity",.5)} 
             else{play=1; animation = setInterval(playFrame, 1000/stepsPerSecond);gPlayPause.attr("opacity",0)}} 

pause()

