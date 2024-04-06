const elements = {
    button: document.querySelector('button'),
    textOut: document.querySelector('#out'),
    textIn: document.querySelector('input'),
    container: document.querySelector('.container'),
    selectedRec: () => {if(document.querySelector('#selRec')) return document.querySelector('#selRec')},
    litterals: [],
    litteralsTemp: [],
    transElLink: '',
    moveLitteral: '',
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    selRegWidth: 0,
    selRegHeight: 0,
};

const printText = (data) => {

    elements.textOut.innerHTML = '';

    for(const el of data) {

        elements.textOut.innerHTML += `<p id=${el.id}>${el.value}</p>`;

        let currentElement = document.querySelector(`#${el.id}`);

        let searchElement = elements.litterals.find(element => element.id === el.id);

        searchElement.onePointX = currentElement.offsetLeft;
        searchElement.onePointY = currentElement.offsetTop;
        searchElement.twoPointX = searchElement.onePointX + currentElement.offsetWidth;
        searchElement.twoPointY = searchElement.onePointY + currentElement.offsetHeight;
 
    };

};

const createId = (data, position) => {

    if(data !== ' ') {
        return `${data}${position}`;
    } else {
        return `space${position}`;
    };

};

elements.button.addEventListener('click', (evt) =>{

    evt.preventDefault();
 
    // make litterals object array
    elements.litterals = elements.textIn.value.split('').map((element, index) => {
        
        return {value: element, id: createId(element, index), status: false, onePointX: 0, onePointY: 0, twoPointX: 0, twoPointY: 0};

    });
   
    // print litterals on click button
    printText(elements.litterals);

    elements.textIn.value = '';

});

const litteralsStyle = () => {
    
    for(const element of elements.litterals) {

        if(element.status) {
            // litteral set
            document.querySelector(`#${element.id}`).style.backgroundColor = 'blue';
            document.querySelector(`#${element.id}`).style.color = 'red';
        }else {
            // litteral reset
            document.querySelector(`#${element.id}`).style.backgroundColor = 'white';
            document.querySelector(`#${element.id}`).style.color = 'gray';
        };
        
    }

};

const selectedField = (evt) => {

    elements.currentX = evt.clientX;
    elements.currentY = evt.clientY;

    elements.selRegWidth = Math.abs(elements.startX - elements.currentX);
    elements.selRegHeight = Math.abs(elements.startY - elements.currentY);

    elements.selectedRec().style.width = `${elements.selRegWidth - 5}px`;
    elements.selectedRec().style.height = `${elements.selRegHeight - 5}px`;

    // slid to right-down
    if(elements.currentX >= elements.startX && elements.currentY >= elements.startY) {

        elements.selectedRec().style.left = `${elements.startX}px`;
        elements.selectedRec().style.top = `${elements.startY}px`;

    };

    // slid to left-down
    if(elements.currentX <= elements.startX && elements.currentY >= elements.startY) {
   
        elements.selectedRec().style.left = `${elements.startX - (elements.startX - elements.currentX)}px`;
        elements.selectedRec().style.top = `${elements.startY}px`;

    };

    // slid to left-up
    if(elements.currentX <= elements.startX && elements.currentY <= elements.startY) {
   
        elements.selectedRec().style.left = `${elements.startX - (elements.startX - elements.currentX)}px`;
        elements.selectedRec().style.top = `${elements.startY - (elements.startY - elements.currentY)}px`;

    };

    // slid to right-up
    if(elements.currentX >= elements.startX && elements.currentY <= elements.startY) {
   
        elements.selectedRec().style.left = `${elements.startX}px`;
        elements.selectedRec().style.top = `${elements.startY - (elements.startY - elements.currentY)}px`;

    };

    // selected litterals using the cursor slid rectangle
    // .onePointY of litteral *---  
    //                        |   |
    //                        |   |
    //                         ---* .twoPointX of litteral
    for(const lit of  elements.litterals) {
        
        if(elements.currentY < lit.onePointY && elements.startY > lit.twoPointY && elements.currentX > lit.twoPointX && elements.startX < lit.onePointX) {
           lit.status = true;  
        } else {
           lit.status = false;  
        };
        
    }; 

    litteralsStyle();

};

const transLitteral = (evt) => {

    const transEl = document.querySelector(`#${elements.moveLitteral}`);

    if(!elements.litteralsTemp.find(element => element.id === transEl.id)) {

        elements.litteralsTemp.push(elements.litterals.find(element => element.id === elements.moveLitteral));
        elements.litterals = elements.litterals.filter(element => element.id !== elements.moveLitteral);
        transEl.remove();

        let freeLitteral = elements.litteralsTemp.find(element => element.id === elements.moveLitteral);
        elements.container.insertAdjacentHTML('beforeEnd', `<p id=${freeLitteral.id}>${freeLitteral.value}</p>`);
        
        const newtransEl = document.querySelector(`#${elements.moveLitteral}`);

        elements.transElLink = newtransEl;

        newtransEl.style.position = 'absolute';
        newtransEl.style.color = 'gray';
        newtransEl.style.fontSize = '25px';
    };

    
    elements.transElLink.style.left = `${evt.clientX}px`;
    elements.transElLink.style.top = `${evt.clientY}px`;

};

const isTrueCounter = () => {

    let trueCounter = 0;

    elements.litterals.forEach(element => {

        if(element.status) trueCounter += 1;

    });

    return trueCounter;
};

elements.textOut.addEventListener('click', (evt) =>{

    if(evt.target.id !== 'out') {

        let selected = elements.litterals.find(element => element.id === evt.target.id);

        if(selected.status === true || isTrueCounter() < 1) {

            // click litteral
            
            selected.status = !selected.status;

            litteralsStyle();

        } else {

            // with 'Ctrl' press
            if(evt.ctrlKey) {

                selected.status = !selected.status;

                litteralsStyle();

            }

        };

    } 
  
});

elements.textOut.addEventListener('mousedown', (evt) => {

    // on litterals
    if(evt.target.id !== 'out') {
        elements.moveLitteral = evt.target.id;
        elements.container.addEventListener('mousemove', transLitteral);

    }else {
        //for slide and select
        elements.startX = evt.clientX;  
        elements.startY = evt.clientY;
    
        elements.container.insertAdjacentHTML('beforeEnd', '<div id=selRec width=0 height=0></div>' );
    
        elements.selectedRec().style.border =  '1px dashed blue';
        elements.selectedRec().style.position = 'absolute';
    
        elements.textOut.addEventListener('mousemove', selectedField);

    };

});

elements.container.addEventListener('mouseup', () =>{

    elements.startX = 0;  
    elements.startY = 0;

    elements.currentX = 0;  
    elements.currentY = 0;

    elements.textOut.removeEventListener('mousemove', selectedField);
    elements.container.removeEventListener('mousemove', transLitteral);

    if(elements.selectedRec()) elements.selectedRec().remove();

    for(const l of elements.litterals) {
        
       if((elements.transElLink.offsetLeft < l.twoPointX && elements.transElLink.offsetLeft > l.onePointX) ||
       (elements.transElLink.offsetLeft + elements.transElLink.offsetWidth < l.twoPointX && elements.transElLink.offsetLeft + elements.transElLink.offsetWidth > l.onePointX)) {
        elements.transElLink.remove();
       };
       
    };
    
});