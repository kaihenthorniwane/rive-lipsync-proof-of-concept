const r = new rive.Rive({
    src: "./assets/riv/viseme_poc.riv",
    canvas: document.getElementById("canvas"),
    autoplay: true,
    stateMachines: "State Machine 1",
    onLoad: () => {

        //compile viseme data from the input fields
        function compileVisemeData() {
            const forms = $('.viseme-form').toArray();
            const visemeData = [];
        
            forms.forEach(formElement => {
                const formJQ = $(formElement);
                const selectedValue = formJQ.find(".visemes :selected").val();
                const inputValue = formJQ.find('.text-field').val();
                visemeData.push([selectedValue, inputValue]);
            });
        
            return visemeData;
        }
        
        // Compile Viseme Data
        const visemeArray = compileVisemeData();

        console.log(visemeArray);
        
        // Get the inputs via the name of the state machine
        const inputs = r.stateMachineInputs('State Machine 1');
        // Find the input you want to set a value for, or trigger
        let visemeProgressArray = [
            inputs.find(i => i.name === 'Viseme 1 Progress'),
            inputs.find(i => i.name === 'Viseme 2 Progress'),
            inputs.find(i => i.name === 'Viseme 3 Progress'),
            inputs.find(i => i.name === 'Viseme 4 Progress')
        ];


        //function to animate visemes
        function animateVisemes(visemeArray, visemeProgressArray){
            
            let startingTime = 0;

            //declare the index to be substracted from
            let negIndex = -1;

            //loop through every element in the viseme array
            visemeArray.forEach(visemeChoice => {
                console.log(visemeChoice);

                //determine which index in the array should be positively affected
                let posIndex = 0;
                switch(visemeChoice[0]){
                    case "viseme-1":
                        posIndex = 0;
                        break;

                    case "viseme-2":
                        posIndex = 1;
                        break;

                    case "viseme-3":
                        posIndex = 2;
                        break;

                    case "viseme-4":
                        posIndex = 3;
                        break;

                    default:
                }
                

                //duration is how long this run of the loop is
                const thisDuration = parseFloat(visemeChoice[1])*1000;

                //determine the step value for the positive part
                let stepValPos = 0;
                if(thisDuration>0){
                    stepValPos = (100/visemeChoice[1])/60;
                }else{
                    stepValPos = 100;

                }

                //determine the step value for the negative scalar
                let stepValNeg = 0;
                if(thisDuration>0){
                    stepValNeg = -(100/visemeChoice[1])/60;
                }else{
                    stepValNeg = -100;
                }

                //set a counter and play out the animate at a framerate of 60fps
                let counter = 0;
                //declare the index to subtratc from

                setTimeout(function(){

                    console.log("pos index is " + posIndex);
        
                    console.log("neg index is " + negIndex);

                    let looper = setInterval(function(){
                        counter++;

                        //apply the postTargetval to the visemeProgressArray based on posIndex, reduce the other using stepValNeg
                        visemeProgressArray[posIndex].value += stepValPos;
                        if(negIndex>-1){
                            visemeProgressArray[negIndex].value += stepValNeg;
                        }
                        
                        console.log([visemeProgressArray[0].value,visemeProgressArray[1].value,visemeProgressArray[2].value,visemeProgressArray[3].value]);

                        if (counter >= thisDuration*60/1000) //if we reached the end of the duration, then set stuff to the end state and terminate the loop
                        {
                            clearInterval(looper);
                            console.log(visemeChoice+ " terminated after " + thisDuration);

                            //find the current one that has value 100, if it doesn't, then reset it to 0
                            for(let i = 0; i<visemeProgressArray.length; i++){
                                if(visemeProgressArray[i].value>99){
                                    negIndex=i;
                                }else{
                                    visemeProgressArray[i].value=0;
                                }
                            }
                        }
                        
                    },thisDuration/60);
                }, startingTime);
                startingTime+=thisDuration;
            });
        }

        // Assume visemeProgressArray is defined and consists of input elements for each viseme
        $(".play-button").on("click",function(){
            animateVisemes(visemeArray, visemeProgressArray);
        });
        


        r.resizeDrawingSurfaceToCanvas();
    },
  });
